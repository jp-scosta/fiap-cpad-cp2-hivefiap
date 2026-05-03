import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import FiapBackground from "../components/FiapBackground";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "@HiveFiap:maker_lab";
const materiaisIniciais = [
  { id: 1, nome: "Arduino", quantidade: 5 },
  { id: 2, nome: "Sensor de Temperatura", quantidade: 8 },
  { id: 3, nome: "LEDs", quantidade: 50 },
  { id: 4, nome: "Jumpers", quantidade: 100 },
  { id: 5, nome: "Protoboard", quantidade: 12 },
  { id: 6, nome: "Motor Servo", quantidade: 6 },
];

export default function LabMaker() {
  const [materiais, setMateriais] = useState([]);
  const [reservas, setReservas] = useState({});
  const [quantidades, setQuantidades] = useState({});
  const [busca, setBusca] = useState("");
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const { loading, signed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !signed) {
      router.replace("/login");
    }
  }, [loading, signed]);

  useEffect(() => {
    if (signed) {
      carregarDados();
    }
  }, [signed]);

  const carregarDados = async () => {
    try {
      setCarregandoDados(true);
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        setMateriais(data.materiais || materiaisIniciais);
        setReservas(data.reservas || {});
      } else {
        setMateriais(materiaisIniciais);
      }
    } catch (e) {
      showFeedback("Erro ao carregar o estoque.", "error");
    } finally {
      setCarregandoDados(false);
    }
  };

  const persistirDados = async (novosMateriais, novasReservas) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ materiais: novosMateriais, reservas: novasReservas })
    );
  };

  const showFeedback = (msg, type) => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
  };

  const getQuantidadeEscolhida = (itemId) => quantidades[itemId] || 1;

  const alterarQuantidadeEscolhida = (item, delta) => {
    setQuantidades((prev) => {
      const atual = prev[item.id] || 1;
      const proxima = Math.max(1, Math.min(item.quantidade, atual + delta));
      return { ...prev, [item.id]: proxima };
    });
  };

  const getQuantidadeReservada = (itemId) => {
    if (reservas[itemId] === true) return 1;
    return reservas[itemId] || 0;
  };

  const reservarMaterial = async (item) => {
    const quantidadeEscolhida = getQuantidadeEscolhida(item.id);

    if (item.quantidade === 0) {
      showFeedback(`Nao ha ${item.nome} disponivel.`, "error");
      return;
    }

    if (quantidadeEscolhida > item.quantidade) {
      showFeedback(`Estoque insuficiente para ${quantidadeEscolhida} unidades.`, "error");
      return;
    }

    const novosMateriais = materiais.map((m) =>
      m.id === item.id ? { ...m, quantidade: m.quantidade - quantidadeEscolhida } : m
    );
    const novasReservas = { ...reservas, [item.id]: quantidadeEscolhida };

    try {
      setMateriais(novosMateriais);
      setReservas(novasReservas);
      await persistirDados(novosMateriais, novasReservas);
      showFeedback(`${quantidadeEscolhida} unidade(s) de ${item.nome} reservada(s).`, "success");
    } catch (e) {
      showFeedback("Erro ao salvar reserva.", "error");
    }
  };

  const desreservarMaterial = async (item) => {
    const quantidadeReservada = getQuantidadeReservada(item.id);
    const novosMateriais = materiais.map((m) =>
      m.id === item.id ? { ...m, quantidade: m.quantidade + quantidadeReservada } : m
    );
    const novasReservas = { ...reservas };
    delete novasReservas[item.id];

    try {
      setMateriais(novosMateriais);
      setReservas(novasReservas);
      await persistirDados(novosMateriais, novasReservas);
      showFeedback(`Reserva de ${item.nome} cancelada.`, "success");
    } catch (e) {
      showFeedback("Erro ao cancelar reserva.", "error");
    }
  };

  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return materiais;
    return materiais.filter((item) => item.nome.toLowerCase().includes(termo));
  }, [busca, materiais]);

  if (loading || carregandoDados || !signed) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#ED145B" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FiapBackground />
      <View style={styles.header}>
        <Text style={styles.logo}>FIAP</Text>
        <Text style={styles.title}>MAKER LAB</Text>
        <Text style={styles.subtitle}>Estoque persistido com busca em tempo real</Text>
      </View>

      <Text style={styles.label}>BUSCAR MATERIAL</Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={setBusca}
        placeholder="Ex: Arduino, LED, sensor..."
        placeholderTextColor="#64737a"
        style={styles.searchInput}
        value={busca}
      />

      {feedback.msg !== "" && (
        <View style={StyleSheet.flatten([styles.feedback, feedback.type === "error" ? styles.bgError : styles.bgSuccess])}>
          <Text style={styles.feedbackText}>{feedback.msg}</Text>
        </View>
      )}

      <FlatList
        contentContainerStyle={styles.list}
        data={materiaisFiltrados}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum material encontrado</Text>
            <Text style={styles.emptyText}>Tente buscar por outro nome ou limpe o campo de busca.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const quantidadeReservada = getQuantidadeReservada(item.id);
          const reservado = quantidadeReservada > 0;
          const quantidadeEscolhida = Math.min(getQuantidadeEscolhida(item.id), Math.max(item.quantidade, 1));
          return (
            <View style={StyleSheet.flatten([styles.card, reservado && styles.reservedCard])}>
              <View style={styles.itemInfo}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.quantidade}>Disponivel: {item.quantidade}</Text>
                {reservado ? <Text style={styles.reservedText}>Reservado por voce: {quantidadeReservada}</Text> : null}
              </View>
              <View style={styles.actionArea}>
                {!reservado && (
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={quantidadeEscolhida <= 1}
                      onPress={() => alterarQuantidadeEscolhida(item, -1)}
                      style={StyleSheet.flatten([styles.stepButton, quantidadeEscolhida <= 1 && styles.stepDisabled])}
                    >
                      <Text style={styles.stepText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepValue}>{quantidadeEscolhida}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={quantidadeEscolhida >= item.quantidade}
                      onPress={() => alterarQuantidadeEscolhida(item, 1)}
                      style={StyleSheet.flatten([styles.stepButton, quantidadeEscolhida >= item.quantidade && styles.stepDisabled])}
                    >
                      <Text style={styles.stepText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={!reservado && item.quantidade === 0}
                  style={StyleSheet.flatten([
                    styles.botao,
                    reservado && styles.botaoCancelado,
                    !reservado && item.quantidade === 0 && styles.botaoDesabilitado,
                  ])}
                  onPress={() => (reservado ? desreservarMaterial(item) : reservarMaterial(item))}
                >
                  <Text style={StyleSheet.flatten([styles.textoBotao, reservado && styles.textoCancelado])}>
                    {reservado ? "CANCELAR" : "RESERVAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050606",
    padding: 28,
  },
  center: {
    flex: 1,
    backgroundColor: "#050606",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 24,
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
  label: {
    color: "#cbd5da",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  searchInput: {
    width: "100%",
    maxWidth: 660,
    height: 48,
    borderWidth: 1,
    borderColor: "#46545a",
    color: "#e8f4f8",
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#090b0c",
    marginBottom: 14,
  },
  feedback: {
    width: "100%",
    maxWidth: 660,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  bgSuccess: {
    borderColor: "#4dff88",
    backgroundColor: "#0d1d14",
  },
  bgError: {
    borderColor: "#ff4d6d",
    backgroundColor: "#210b12",
  },
  feedbackText: {
    color: "#eef5f7",
    fontWeight: "800",
  },
  list: {
    gap: 14,
    paddingBottom: 24,
  },
  card: {
    width: "100%",
    maxWidth: 660,
    minHeight: 104,
    padding: 18,
    backgroundColor: "#101314",
    borderWidth: 1,
    borderColor: "#2e3a3f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reservedCard: {
    borderColor: "#ED145B",
    backgroundColor: "#1b0910",
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: "900",
    color: "#eef5f7",
  },
  quantidade: {
    marginTop: 8,
    color: "#9baab0",
  },
  reservedText: {
    marginTop: 6,
    color: "#ED145B",
    fontSize: 13,
    fontWeight: "800",
  },
  actionArea: {
    alignItems: "flex-end",
    gap: 10,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2e3a3f",
  },
  stepButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDisabled: {
    opacity: 0.35,
  },
  stepText: {
    color: "#ED145B",
    fontSize: 18,
    fontWeight: "900",
  },
  stepValue: {
    color: "#eef5f7",
    minWidth: 32,
    textAlign: "center",
    fontWeight: "900",
  },
  botao: {
    borderWidth: 1,
    borderColor: "#ED145B",
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 112,
    alignItems: "center",
  },
  botaoCancelado: {
    borderColor: "#7a898f",
  },
  botaoDesabilitado: {
    opacity: 0.4,
  },
  textoBotao: {
    color: "#ED145B",
    fontWeight: "900",
    fontSize: 12,
  },
  textoCancelado: {
    color: "#a8b7bd",
  },
  emptyState: {
    width: "100%",
    maxWidth: 660,
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
