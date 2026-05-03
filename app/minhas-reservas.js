import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import FiapBackground from "../components/FiapBackground";
import { useAuth } from "../context/AuthContext";

const andares = [1, 2, 3, 4, 5, 6, 7];

export default function MinhasReservas() {
  const [reservasSalas, setReservasSalas] = useState([]);
  const [reservasMateriais, setReservasMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { loading, signed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !signed) {
      router.replace("/login");
    }
  }, [loading, signed]);

  useEffect(() => {
    if (signed) {
      carregarReservas();
    }
  }, [signed]);

  const carregarReservas = async () => {
    try {
      setCarregando(true);

      const salasPorAndar = await Promise.all(
        andares.map(async (andar) => {
          const raw = await AsyncStorage.getItem(`@HiveFiap:salas_andar_${andar}`);
          const salas = raw ? JSON.parse(raw) : [];
          return salas
            .filter((sala) => sala.reservadaPorMim)
            .map((sala) => ({ ...sala, andar }));
        })
      );

      const makerRaw = await AsyncStorage.getItem("@HiveFiap:maker_lab");
      const makerData = makerRaw ? JSON.parse(makerRaw) : { materiais: [], reservas: {} };
      const materiais = makerData.materiais || [];
      const reservas = makerData.reservas || {};
      const materiaisReservados = materiais
        .map((material) => {
          const quantidade = reservas[material.id] === true ? 1 : reservas[material.id] || 0;
          return { ...material, quantidadeReservada: quantidade };
        })
        .filter((material) => material.quantidadeReservada > 0);

      setReservasSalas(salasPorAndar.flat());
      setReservasMateriais(materiaisReservados);
    } finally {
      setCarregando(false);
    }
  };

  if (loading || carregando || !signed) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#ED145B" size="large" />
      </View>
    );
  }

  const totalReservas = reservasSalas.length + reservasMateriais.length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <FiapBackground />
      <View style={styles.header}>
        <Text style={styles.logo}>FIAP</Text>
        <Text style={styles.title}>MINHAS RESERVAS</Text>
        <Text style={styles.subtitle}>{totalReservas} reserva(s) ativa(s)</Text>
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.refreshButton} onPress={carregarReservas}>
        <Text style={styles.refreshText}>ATUALIZAR</Text>
      </TouchableOpacity>

      {totalReservas === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhuma reserva ativa</Text>
          <Text style={styles.emptyText}>
            Reserve uma sala ou material para acompanhar tudo por aqui.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Salas</Text>
          {reservasSalas.length === 0 ? (
            <Text style={styles.sectionEmpty}>Voce ainda nao reservou salas.</Text>
          ) : (
            <View style={styles.list}>
              {reservasSalas.map((sala) => (
                <View key={`${sala.andar}-${sala.id}`} style={styles.card}>
                  <Text style={styles.cardTitle}>{sala.nome}</Text>
                  <Text style={styles.cardMeta}>Andar {sala.andar}</Text>
                  <Text style={styles.cardMeta}>
                    {sala.reserva?.data || "Data nao informada"} | {sala.reserva?.inicio || "--:--"}-{sala.reserva?.fim || "--:--"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Materiais</Text>
          {reservasMateriais.length === 0 ? (
            <Text style={styles.sectionEmpty}>Voce ainda nao reservou materiais.</Text>
          ) : (
            <View style={styles.list}>
              {reservasMateriais.map((material) => (
                <View key={material.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{material.nome}</Text>
                  <Text style={styles.cardMeta}>Quantidade reservada: {material.quantidadeReservada}</Text>
                  <Text style={styles.cardMeta}>Estoque restante: {material.quantidade}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050606",
  },
  content: {
    minHeight: "100%",
    padding: 28,
  },
  center: {
    flex: 1,
    backgroundColor: "#050606",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 18,
  },
  logo: {
    color: "#ED145B",
    fontSize: 40,
    fontWeight: "200",
  },
  title: {
    color: "#eef5f7",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 12,
  },
  subtitle: {
    color: "#9baab0",
    fontSize: 15,
    marginTop: 6,
  },
  refreshButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ED145B",
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  refreshText: {
    color: "#ED145B",
    fontWeight: "900",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#ED145B",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionEmpty: {
    color: "#9baab0",
    marginBottom: 18,
  },
  list: {
    gap: 12,
    marginBottom: 22,
  },
  card: {
    width: "100%",
    maxWidth: 680,
    borderWidth: 1,
    borderColor: "#2e3a3f",
    backgroundColor: "#101314",
    padding: 18,
  },
  cardTitle: {
    color: "#eef5f7",
    fontSize: 18,
    fontWeight: "900",
  },
  cardMeta: {
    color: "#9baab0",
    marginTop: 6,
  },
  emptyState: {
    width: "100%",
    maxWidth: 680,
    borderWidth: 1,
    borderColor: "#2e3a3f",
    backgroundColor: "#101314",
    padding: 22,
  },
  emptyTitle: {
    color: "#eef5f7",
    fontSize: 18,
    fontWeight: "900",
  },
  emptyText: {
    color: "#9baab0",
    marginTop: 8,
  },
});
