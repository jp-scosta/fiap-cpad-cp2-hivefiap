import { useEffect } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link, useRouter } from "expo-router";
import FiapBackground from "../components/FiapBackground";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const andares = [1, 2, 3, 4, 5, 6, 7];
  const { user, loading, signed, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !signed) {
      router.replace("/login");
    }
  }, [loading, signed]);

  if (loading || !signed) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#ED145B" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <FiapBackground />

      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <Image source={require("../assets/Fiap.png")} style={styles.brandIcon} />
            <View>
              <Text style={styles.logo}>FIAP</Text>
              <Text style={styles.kicker}>HIVEFIAP</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={logout} style={styles.logout}>
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>ESPAÇOS ACADÊMICOS</Text>
        <Text style={styles.subtitle}>
          Ola, {user?.nome || "aluno"}. Escolha um ambiente para reservar.
        </Text>
      </View>

      <View style={styles.grid}>
        {andares.map((andar) => (
          <Link key={andar} href={`/salas-default?andar=${andar}`} asChild>
            <TouchableOpacity activeOpacity={0.85} style={styles.card}>
              <Text style={styles.cardNumber}>0{andar}</Text>
              <Text style={styles.cardTitle}>Andar {andar}</Text>
              <Text style={styles.cardMeta}>Salas disponiveis</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}

        <Link href="/lab-maker" asChild>
          <TouchableOpacity activeOpacity={0.85} style={StyleSheet.flatten([styles.card, styles.makerCard])}>
            <Text style={styles.cardNumber}>LAB</Text>
            <Text style={styles.cardTitle}>Maker Lab</Text>
            <Text style={styles.cardMeta}>Materiais e componentes</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/minhas-reservas" asChild>
          <TouchableOpacity activeOpacity={0.85} style={StyleSheet.flatten([styles.card, styles.reservasCard])}>
            <Text style={styles.cardNumber}>OK</Text>
            <Text style={styles.cardTitle}>Minhas reservas</Text>
            <Text style={styles.cardMeta}>Salas e materiais</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Resumo</Text>
            </View>
          </TouchableOpacity>
        </Link>
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
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 54,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  logo: {
    color: "#ED145B",
    fontSize: 42,
    fontWeight: "200",
  },
  kicker: {
    color: "#7a898f",
    fontSize: 12,
    fontWeight: "800",
  },
  logout: {
    borderWidth: 1,
    borderColor: "#ED145B",
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  logoutText: {
    color: "#ED145B",
    fontWeight: "900",
    fontSize: 12,
  },
  hero: {
    maxWidth: 720,
    marginBottom: 28,
  },
  title: {
    color: "#ED145B",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 10,
  },
  subtitle: {
    color: "#c4cfd4",
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: 190,
    minHeight: 160,
    backgroundColor: "#101314",
    borderWidth: 1,
    borderColor: "#2e3a3f",
    padding: 18,
    justifyContent: "space-between",
  },
  makerCard: {
    borderColor: "#ED145B",
  },
  reservasCard: {
    borderColor: "#4dff88",
  },
  cardNumber: {
    color: "#ED145B",
    fontSize: 34,
    fontWeight: "200",
  },
  cardTitle: {
    color: "#eef5f7",
    fontSize: 18,
    fontWeight: "900",
  },
  cardMeta: {
    color: "#8c9aa0",
    fontSize: 13,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4dff88",
  },
  statusText: {
    color: "#a8b7bd",
    fontSize: 12,
  },
});
