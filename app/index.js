import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  const andares = [1, 2, 3, 4, 5, 6, 7];

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 20, color: "#fff", fontWeight: "bold" }}>
        Bem-vindo ao HiveFiap!
      </Text>
      <Text style={styles.titulo}>Escolha um andar</Text>

      {andares.map((andar) => (
        <Link key={andar} href={`/salas-default?andar=${andar}`} asChild>
          <TouchableOpacity style={styles.botaoAndar}>
            <Text style={styles.textoBotao}>Andar {andar}</Text>
            {}
            <View style={styles.statusBadge} />
          </TouchableOpacity>
        </Link>
      ))}

      <Link href="/lab-maker" asChild>
        <TouchableOpacity style={styles.botaoAndar}>
          <Text style={styles.textoBotao}>Lab Maker</Text>
          {}
          <View style={styles.statusBadge} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 30 },
  botaoAndar: { 
    width: 200, 
    padding: 15, 
    marginVertical: 8, 
    borderRadius: 10, 
    backgroundColor: "#ED145B", 
    alignItems: "center",
    shadowColor: "#ED145B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: "#ED145B",
    position: "relative" 
  },
  textoBotao: { fontSize: 16, fontWeight: "bold", color: "#000" },

  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green"
  }
});
