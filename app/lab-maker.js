import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";

export default function LabMaker() {
  const [materiais, setMateriais] = useState([]);
  const [reservas, setReservas] = useState({});

  useEffect(() => {
    setMateriais([
      { id: 1, nome: "Arduino", quantidade: 5 },
      { id: 2, nome: "Sensor de Temperatura", quantidade: 8 },
      { id: 3, nome: "LEDs", quantidade: 50 },
      { id: 4, nome: "Jumpers", quantidade: 100 },
    ]);
  }, []);

  const reservarMaterial = (item) => {
    if (item.quantidade === 0) {
      Alert.alert("Sem estoque!", `Não há ${item.nome} disponível.`);
      return;
    }
    setMateriais(prev =>
      prev.map(m => m.id === item.id ? { ...m, quantidade: m.quantidade - 1 } : m)
    );
    setReservas(prev => ({ ...prev, [item.id]: true }));
    Alert.alert("Material reservado!", `${item.nome} reservado com sucesso.`);
  };

  const desreservarMaterial = (item) => {
    Alert.alert(
      "Cancelar Reserva",
      `Deseja cancelar a reserva de ${item.nome}?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => {
            setMateriais(prev =>
              prev.map(m => m.id === item.id ? { ...m, quantidade: m.quantidade + 1 } : m)
            );
            setReservas(prev => {
              const novasReservas = { ...prev };
              delete novasReservas[item.id];
              return novasReservas;
            });
            Alert.alert("Reserva Cancelada", `A reserva de ${item.nome} foi cancelada.`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lab Maker Interativo</Text>
      <FlatList
        data={materiais}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.quantidade}>Disponível: {item.quantidade}</Text>
            <TouchableOpacity
              style={[styles.botao, reservas[item.id] && styles.botaoCancelado]}
              onPress={() => reservas[item.id] ? desreservarMaterial(item) : reservarMaterial(item)}
            >
              <Text style={styles.textoBotao}>
                {reservas[item.id] ? "Reservado ✅" : "Reservar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 50, alignItems: "center" },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  card: { width: 300, padding: 15, marginVertical: 8, borderRadius: 10, backgroundColor: "#1E1E1E", alignItems: "center" },
  nome: { fontSize: 16, fontWeight: "bold", color: "#ED145B" },
  quantidade: { marginTop: 5, color: "#fff", marginBottom: 10 },
  botao: { backgroundColor: "#ED145B", padding: 10, borderRadius: 8 },
  botaoCancelado: { backgroundColor: "#555" },
  textoBotao: { color: "#000", fontWeight: "bold" },
});