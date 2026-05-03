import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons"; // icone do pix

export default function LabMaker() {
  const [materiais, setMateriais] = useState([]);
  const [reservas, setReservas] = useState({});
  

  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [itemSendoPago, setItemSendoPago] = useState(null);

  useEffect(() => {
    setMateriais([
      { id: 1, nome: "Arduino", quantidade: 5, preco: 15.00 },
      { id: 2, nome: "Sensor de Temperatura", quantidade: 8, preco: 5.00 },
      { id: 3, nome: "LEDs", quantidade: 50, preco: 2.00 },
      { id: 4, nome: "Jumpers", quantidade: 100, preco: 1.00 },
    ]);
  }, []);

  const iniciarPagamento = (item) => {
    if (item.quantidade === 0) {
      Alert.alert("Sem estoque!", `Não há ${item.nome} disponível.`);
      return;
    }
    setItemSendoPago(item);
    setPixModalVisible(true);
  };

  const confirmarPagamentoPix = () => {
    const item = itemSendoPago;
    
    setMateriais(prev =>
      prev.map(m => m.id === item.id ? { ...m, quantidade: m.quantidade - 1 } : m)
    );
    setReservas(prev => ({ ...prev, [item.id]: true }));
    
    setPixModalVisible(false);
    setItemSendoPago(null);
    Alert.alert("Sucesso!", `Pagamento confirmado. O ${item.nome} está reservado para você.`);
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
            Alert.alert("Reserva Cancelada", `A reserva de ${item.nome} foi liberada.`);
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
            
            {}
            <TouchableOpacity
              style={[styles.botao, reservas[item.id] && styles.botaoCancelado]}
              onPress={() => reservas[item.id] ? desreservarMaterial(item) : iniciarPagamento(item)}
            >
              <Text style={styles.textoBotao}>
                {reservas[item.id] ? "Reservado ✅" : `Pagar Reserva (R$ ${item.preco.toFixed(2)})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {}
      <Modal visible={pixModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="qr-code-outline" size={40} color="#ED145B" />
            <Text style={styles.modalTitle}>Pagamento via Pix</Text>
            <Text style={styles.modalSub}>Reserva de: {itemSendoPago?.nome}</Text>
            
            <View style={styles.qrBox}>
              {}
              <Ionicons name="qr-code" size={150} color="#fff" />
            </View>

            <TouchableOpacity style={styles.confirmarPix} onPress={confirmarPagamentoPix}>
              <Text style={styles.textoBotao}>Confirmar Pagamento</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPixModalVisible(false)}>
              <Text style={{color: "#aaa", marginTop: 15}}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 50, alignItems: "center" },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  card: { width: 300, padding: 15, marginVertical: 8, borderRadius: 10, backgroundColor: "#1E1E1E", alignItems: "center" },
  nome: { fontSize: 16, fontWeight: "bold", color: "#ED145B" },
  quantidade: { marginTop: 5, color: "#fff", marginBottom: 10 },
  botao: { backgroundColor: "#ED145B", padding: 10, borderRadius: 8, minWidth: 150, alignItems: 'center' },
  botaoCancelado: { backgroundColor: "#333" },
  textoBotao: { color: "#000", fontWeight: "bold" },
  

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: 320,
    backgroundColor: "#1E1E1E",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ED145B"
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginTop: 10 },
  modalSub: { color: "#ED145B", marginBottom: 20 },
  qrBox: {
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333"
  },
  confirmarPix: {
    backgroundColor: "#ED145B",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  }
});