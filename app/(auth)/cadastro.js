import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import FiapBackground from "../../components/FiapBackground";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erros, setErros] = useState({});
  const router = useRouter();

  const validarCampos = () => {
    const tempErros = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const usuarioKey = usuario.trim().toLowerCase();
    const emailKey = email.trim().toLowerCase();

    if (!nome.trim()) tempErros.nome = "Nome e obrigatorio.";
    if (!usuarioKey) tempErros.usuario = "Usuario ou RM e obrigatorio.";
    if (!emailRegex.test(emailKey)) tempErros.email = "E-mail invalido.";
    if (senha.length < 6) tempErros.senha = "Minimo 6 caracteres.";
    if (senha !== confirmaSenha) tempErros.confirma = "As senhas nao coincidem.";

    return tempErros;
  };

  const errosAtuais = validarCampos();
  const formularioValido = Object.keys(errosAtuais).length === 0;

  const validar = async () => {
    const tempErros = validarCampos();
    setErros(tempErros);

    if (Object.keys(tempErros).length === 0) {
      const userData = { nome: nome.trim(), usuario: usuarioKey, email: emailKey, senha };
      await AsyncStorage.setItem(`@HiveFiap:account_${usuarioKey}`, JSON.stringify(userData));
      await AsyncStorage.setItem(`@HiveFiap:account_${emailKey}`, JSON.stringify(userData));
      router.replace("/login");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <FiapBackground />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.logo}>FIAP</Text>
          <Text style={styles.title}>CRIAR CONTA</Text>

          <Text style={styles.label}>NOME COMPLETO*</Text>
          <TextInput
            onChangeText={setNome}
            placeholder="Nome completo"
            placeholderTextColor="#64737a"
            style={styles.input}
            value={nome}
          />
          {(erros.nome || nome.length > 0) && errosAtuais.nome && <Text style={styles.errorText}>{errosAtuais.nome}</Text>}

          <Text style={styles.label}>USUARIO OU RM*</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setUsuario}
            placeholder="Ex: 566386"
            placeholderTextColor="#64737a"
            style={styles.input}
            value={usuario}
          />
          {(erros.usuario || usuario.length > 0) && errosAtuais.usuario && <Text style={styles.errorText}>{errosAtuais.usuario}</Text>}

          <Text style={styles.label}>E-MAIL*</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="usuario@dominio.com"
            placeholderTextColor="#64737a"
            style={styles.input}
            value={email}
          />
          {(erros.email || email.length > 0) && errosAtuais.email && <Text style={styles.errorText}>{errosAtuais.email}</Text>}

          <Text style={styles.label}>SENHA*</Text>
          <TextInput
            onChangeText={setSenha}
            placeholder="Minimo 6 caracteres"
            placeholderTextColor="#64737a"
            secureTextEntry
            style={styles.input}
            value={senha}
          />
          {(erros.senha || senha.length > 0) && errosAtuais.senha && <Text style={styles.errorText}>{errosAtuais.senha}</Text>}

          <Text style={styles.label}>CONFIRME A SENHA*</Text>
          <TextInput
            onChangeText={setConfirmaSenha}
            placeholder="Repita a senha"
            placeholderTextColor="#64737a"
            secureTextEntry
            style={styles.input}
            value={confirmaSenha}
          />
          {(erros.confirma || confirmaSenha.length > 0) && errosAtuais.confirma && <Text style={styles.errorText}>{errosAtuais.confirma}</Text>}

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!formularioValido}
            style={StyleSheet.flatten([styles.button, !formularioValido && styles.disabled])}
            onPress={validar}
          >
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>Voltar para login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050606",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  form: {
    width: "100%",
    maxWidth: 430,
    borderLeftWidth: 1,
    borderColor: "#3b464b",
    paddingLeft: 36,
  },
  logo: {
    color: "#ED145B",
    fontSize: 52,
    fontWeight: "200",
    marginBottom: 12,
  },
  title: {
    color: "#e7eef1",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 18,
  },
  label: {
    color: "#cbd5da",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#46545a",
    color: "#e8f4f8",
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#090b0c",
    marginTop: 8,
  },
  errorText: {
    color: "#ff7f9d",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ED145B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  buttonText: {
    color: "#ED145B",
    fontWeight: "900",
  },
  disabled: {
    opacity: 0.45,
  },
  linkButton: {
    alignSelf: "flex-start",
    marginTop: 18,
  },
  linkText: {
    color: "#9aa8ad",
    textDecorationLine: "underline",
  },
});
