import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function SalasDefault() {
  const { andar } = useLocalSearchParams();
  const andarNum = Number(andar);
  const quantidadeSalas = 12;
  const router = useRouter();
  const [salas, setSalas] = useState([]);
  const [reservaFeita, setReservaFeita] = useState(false);
  const [salaReservada, setSalaReservada] = useState(null);

  useEffect(() => {
    const lista = Array.from({ length: quantidadeSalas }, (_, i) => {
      const numero = i + 1;
      const numeroSala = numero < 10 ? `0${numero}` : `${numero}`;
      const nomeSala =
        andarNum === 6 && numero === 5
          ? "Maker Lab - Sala 605"
          : `Sala ${andar}${numeroSala}`;
      return { id: i, nome: nomeSala, ocupada: false };
    });
    setSalas(lista);
  }, []);

  const reservarSala = (sala) => {
    if (reservaFeita) {
      Alert.alert("Você já reservou uma sala!", `Sala reservada: ${salaReservada}`);
      return;
    }
    setSalas((prev) =>
      prev.map((s) => (s.id === sala.id ? { ...s, ocupada: true } : s))
    );
    setReservaFeita(true);
    setSalaReservada(sala.nome);
    Alert.alert("Reserva Confirmada!", `Você reservou: ${sala.nome}`);
  };

  const desreservarSala = (sala) => {
    Alert.alert(
      "Cancelar Reserva",
      `Deseja cancelar a reserva de ${sala.nome}?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => {
            setSalas((prev) =>
              prev.map((s) => (s.id === sala.id ? { ...s, ocupada: false } : s))
            );
            setReservaFeita(false);
            setSalaReservada(null);
            Alert.alert("Reserva Cancelada", `A reserva de ${sala.nome} foi cancelada.`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingTop: 50 }}
    >
      <Text style={styles.titulo}>Andar {andar}</Text>
      {reservaFeita && <Text style={styles.subtitulo}>Sua reserva: {salaReservada}</Text>}
      {salas.map((sala) => (
        <TouchableOpacity
          key={sala.id}
          style={StyleSheet.flatten([
            styles.card,
            sala.ocupada ? styles.ocupada : styles.livre,
          ])}
          onPress={() => {
            if (sala.ocupada && sala.nome === salaReservada) {
              desreservarSala(sala);
            } else {
              reservarSala(sala);
            }
          }}
        >
          <Text style={styles.nome}>{sala.nome}</Text>
          <Text style={styles.status}>{sala.ocupada ? "Ocupada" : "Livre"}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  titulo: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitulo: { color: "#fff", fontSize: 18, marginBottom: 20 },
  card: { width: 250, padding: 15, margin: 10, borderRadius: 10 },
  nome: { color: "#000", fontSize: 16, fontWeight: "bold" },
  status: { marginTop: 5, color: "#000" },
  ocupada: { backgroundColor: "#ff4d4d" },
  livre: { backgroundColor: "#4dff88" },
});