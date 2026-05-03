import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalasDefault() {
  const { andar } = useLocalSearchParams();
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ msg: "", type: "" }); // Para mensagens de sucesso/erro na tela

  // Chave única por andar para não misturar as reservas no Storage
  const STORAGE_KEY = @HiveFiap:salas_andar_${andar};

  useEffect(() => {
    loadSalas();
  }, [andar]);

  const loadSalas = async () => {
    try {
      setLoading(true);
      const savedSalas = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (savedSalas) {
        setSalas(JSON.parse(savedSalas));
      } else {
        // Se não houver dados, gera a lista inicial de 12 salas
        const inicial = Array.from({ length: 12 }, (_, i) => {
          const num = i + 1;
          const salaNome = Sala ${andar}${num < 10 ? "0" + num : num};
          return { id: i, nome: salaNome, ocupada: false, reservadaPorMim: false };
        });
        setSalas(inicial);
      }
    } catch (e) {
      showFeedback("Erro ao carregar salas", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (msg, type) => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
  };

  const toggleReserva = async (salaSelecionada) => {
    // Lógica: Se a sala tá ocupada por outra pessoa (simulação), não faz nada
    // Se está livre, eu reservo. Se eu reservei, eu posso cancelar.
    
    const novasSalas = salas.map((sala) => {
      if (sala.id === salaSelecionada.id) {
        return { 
          ...sala, 
          ocupada: !sala.ocupada, 
          reservadaPorMim: !sala.reservadaPorMim 
        };
      }
      return sala;
    });

    try {
      setSalas(novasSalas);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novasSalas));
      
      const acao = salaSelecionada.ocupada ? "Reserva cancelada!" : "Reserva confirmada!";
      showFeedback(acao, "success");
    } catch (e) {
      showFeedback("Erro ao salvar alteração", "error");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ED145B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Andar {andar}</Text>
      
      {/* Feedback Visual (Requisito UX) */}
      {feedback.msg !== "" && (
        <View style={[styles.feedbackBadge, feedback.type === "error" ? styles.bgError : styles.bgSuccess]}>
          <Text style={styles.feedbackText}>{feedback.msg}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {salas.map((sala) => (
          <TouchableOpacity
            key={sala.id}
            style={[
              styles.card,
              sala.ocupada ? (sala.reservadaPorMim ? styles.minhaReserva : styles.ocupada) : styles.livre
            ]}
            onPress={() => toggleReserva(sala)}
          >
            <Text style={styles.salaNome}>{sala.nome}</Text>
            <Text style={styles.statusText}>
              {sala.ocupada ? (sala.reservadaPorMim ? "Sua Reserva" : "Ocupada") : "Livre"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 20, alignItems: "center" },
  center: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  titulo: { color: "#fff", fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  
  grid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  
  card: { 
    width: '45%', 
    padding: 20, 
    marginBottom: 15, 
    borderRadius: 12, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  
  salaNome: { fontSize: 16, fontWeight: "bold", color: "#000" },
  statusText: { fontSize: 12, color: "#000", marginTop: 5 },
  
  livre: { backgroundColor: "#4dff88" }, // Verde
  ocupada: { backgroundColor: "#ff4d4d" }, // Vermelho
  minhaReserva: { backgroundColor: "#ED145B", borderWidth: 2, borderColor: "#fff" }, // Rosa FIAP

  feedbackBadge: { 
    padding: 10, 
    borderRadius: 8, 
    width: '100%', 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  bgSuccess: { backgroundColor: '#2e7d32' },
  bgError: { backgroundColor: '#c62828' },
  feedbackText: { color: '#fff', fontWeight: 'bold' }
});