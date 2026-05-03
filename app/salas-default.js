import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import FiapBackground from "../components/FiapBackground";
import { useAuth } from "../context/AuthContext";

const hojeISO = () => new Date().toISOString().slice(0, 10);

export default function SalasDefault() {
  const { andar } = useLocalSearchParams();
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const [dataReserva, setDataReserva] = useState(hojeISO());
  const [horaInicio, setHoraInicio] = useState("14:00");
  const [horaFim, setHoraFim] = useState("16:00");
  const { loading: authLoading, signed, user } = useAuth();
  const router = useRouter();
  const storageKey = `@HiveFiap:salas_andar_${andar}`;

  useEffect(() => {
    if (!authLoading && !signed) {
      router.replace("/login");
    }
  }, [authLoading, signed]);

  useEffect(() => {
    if (signed) {
      loadSalas();
    }
  }, [andar, signed]);

  const errosFormulario = useMemo(() => {
    const erros = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataReserva)) {
      erros.data = "Use o formato AAAA-MM-DD.";
    }
    if (!/^\d{2}:\d{2}$/.test(horaInicio)) {
      erros.inicio = "Use o formato HH:MM.";
    }
    if (!/^\d{2}:\d{2}$/.test(horaFim)) {
      erros.fim = "Use o formato HH:MM.";
    }
    if (/^\d{2}:\d{2}$/.test(horaInicio) && /^\d{2}:\d{2}$/.test(horaFim) && horaInicio >= horaFim) {
      erros.fim = "O fim deve ser depois do inicio.";
    }
    return erros;
  }, [dataReserva, horaInicio, horaFim]);

  const formularioValido = Object.keys(errosFormulario).length === 0;

  const loadSalas = async () => {
    try {
      setLoading(true);
      const savedSalas = await AsyncStorage.getItem(storageKey);

      if (savedSalas) {
        setSalas(JSON.parse(savedSalas));
      } else {
        const inicial = Array.from({ length: 12 }, (_, i) => {
          const num = i + 1;
          const salaNome = `Sala ${andar}${num < 10 ? "0" + num : num}`;
          return { id: i, nome: salaNome, ocupada: false, reservadaPorMim: false, reserva: null };
        });
        setSalas(inicial);
      }
    } catch (e) {
      showFeedback("Erro ao carregar salas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg, type) => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
  };

  const toggleReserva = async (salaSelecionada) => {
    if (!salaSelecionada.ocupada && !formularioValido) {
      showFeedback("Corrija data e horario antes de reservar.", "error");
      return;
    }

    const novasSalas = salas.map((sala) => {
      if (sala.id !== salaSelecionada.id) return sala;

      if (sala.ocupada && sala.reservadaPorMim) {
        return { ...sala, ocupada: false, reservadaPorMim: false, reserva: null };
      }

      return {
        ...sala,
        ocupada: true,
        reservadaPorMim: true,
        reserva: {
          data: dataReserva,
          inicio: horaInicio,
          fim: horaFim,
          usuario: user?.email || user?.usuario || "usuario",
        },
      };
    });

    try {
      setSalas(novasSalas);
      await AsyncStorage.setItem(storageKey, JSON.stringify(novasSalas));

      const acao = salaSelecionada.ocupada
        ? "Reserva cancelada."
        : `Reserva confirmada para ${dataReserva}, das ${horaInicio} as ${horaFim}.`;
      showFeedback(acao, "success");
    } catch (e) {
      showFeedback("Erro ao salvar alteracao.", "error");
    }
  };

  if (authLoading || loading || !signed) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ED145B" />
      </View>
    );
  }

  const livres = salas.filter((sala) => !sala.ocupada).length;
  const minhas = salas.filter((sala) => sala.reservadaPorMim).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <FiapBackground />
      <View style={styles.header}>
        <Text style={styles.logo}>FIAP</Text>
        <Text style={styles.title}>ANDAR {andar}</Text>
        <Text style={styles.subtitle}>{livres} salas livres | {minhas} reservas suas</Text>
      </View>

      <View style={styles.scheduler}>
        <Text style={styles.sectionTitle}>Dados da reserva</Text>
        <View style={styles.formGrid}>
          <View style={styles.field}>
            <Text style={styles.label}>DATA</Text>
            <TextInput
              onChangeText={setDataReserva}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#64737a"
              style={styles.input}
              value={dataReserva}
            />
            {errosFormulario.data ? <Text style={styles.errorText}>{errosFormulario.data}</Text> : null}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>INICIO</Text>
            <TextInput
              onChangeText={setHoraInicio}
              placeholder="HH:MM"
              placeholderTextColor="#64737a"
              style={styles.input}
              value={horaInicio}
            />
            {errosFormulario.inicio ? <Text style={styles.errorText}>{errosFormulario.inicio}</Text> : null}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>FIM</Text>
            <TextInput
              onChangeText={setHoraFim}
              placeholder="HH:MM"
              placeholderTextColor="#64737a"
              style={styles.input}
              value={horaFim}
            />
            {errosFormulario.fim ? <Text style={styles.errorText}>{errosFormulario.fim}</Text> : null}
          </View>
        </View>
      </View>

      {feedback.msg !== "" && (
        <View style={StyleSheet.flatten([styles.feedbackBadge, feedback.type === "error" ? styles.bgError : styles.bgSuccess])}>
          <Text style={styles.feedbackText}>{feedback.msg}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {salas.map((sala) => {
          const minhaReserva = sala.ocupada && sala.reservadaPorMim;
          const ocupada = sala.ocupada && !sala.reservadaPorMim;

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              key={sala.id}
              style={StyleSheet.flatten([
                styles.card,
                minhaReserva && styles.minhaReserva,
                ocupada && styles.ocupada,
              ])}
              onPress={() => toggleReserva(sala)}
            >
              <View style={StyleSheet.flatten([styles.statusDot, !sala.ocupada && styles.dotLivre, minhaReserva && styles.dotMinha])} />
              <Text style={styles.salaNome}>{sala.nome}</Text>
              <Text style={styles.statusText}>
                {sala.ocupada ? (sala.reservadaPorMim ? "Sua reserva" : "Ocupada") : "Livre"}
              </Text>
              {sala.reserva ? (
                <Text style={styles.timeText}>
                  {sala.reserva.data} | {sala.reserva.inicio}-{sala.reserva.fim}
                </Text>
              ) : (
                <Text style={styles.timeText}>Toque para reservar</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 22,
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
  scheduler: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#2e3a3f",
    backgroundColor: "#101314",
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#eef5f7",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  field: {
    minWidth: 160,
    flex: 1,
  },
  label: {
    color: "#cbd5da",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#46545a",
    color: "#e8f4f8",
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#090b0c",
  },
  errorText: {
    color: "#ff7f9d",
    fontSize: 12,
    marginTop: 5,
  },
  feedbackBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    width: "100%",
    marginBottom: 18,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: 190,
    minHeight: 150,
    backgroundColor: "#101314",
    borderWidth: 1,
    borderColor: "#2e3a3f",
    padding: 16,
    justifyContent: "space-between",
  },
  ocupada: {
    borderColor: "#5b2d35",
    backgroundColor: "#171012",
    opacity: 0.7,
  },
  minhaReserva: {
    borderColor: "#ED145B",
    backgroundColor: "#1b0910",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff4d6d",
    alignSelf: "flex-end",
  },
  dotLivre: {
    backgroundColor: "#4dff88",
  },
  dotMinha: {
    backgroundColor: "#ED145B",
  },
  salaNome: {
    fontSize: 18,
    fontWeight: "900",
    color: "#eef5f7",
  },
  statusText: {
    fontSize: 13,
    color: "#9baab0",
  },
  timeText: {
    fontSize: 12,
    color: "#cbd5da",
    marginTop: 8,
  },
});
