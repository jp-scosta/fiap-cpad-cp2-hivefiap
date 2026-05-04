import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import FiapBackground from "../components/FiapBackground";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { login, loading, signed } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 760;

  useEffect(() => {
    if (!loading && signed) {
      router.replace("/");
    }
  }, [loading, signed]);

  const validar = () => {
    const novosErros = {};
    const emailKey = email.trim().toLowerCase();
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailKey) {
      novosErros.email = "O e-mail é obrigatorio.";
    } else if (!emailRegex.test(emailKey)) {
      novosErros.email = "Informe um e-mail valido.";
    }

    if (!senha) {
      novosErros.senha = "A senha é obrigatoria.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    return novosErros;
  };

  const errosAtuais = validar();
  const formularioValido = Object.keys(errosAtuais).length === 0;

  const entrar = async () => {
    setTentouEnviar(true);
    setErros(errosAtuais);
    if (!formularioValido) return;

    setEnviando(true);
    const result = await login(email, senha);
    setEnviando(false);

    if (!result.success) {
      setErros({ credenciais: result.message });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#ED145B" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={StyleSheet.flatten([styles.screen, compact && styles.screenCompact])}
    >
      <FiapBackground />
      <View style={StyleSheet.flatten([styles.leftPane, compact && styles.leftPaneCompact])}>
        <Text style={styles.callout}>
          CONECTE-SE COM{"\n"}SUA <Text style={styles.strong}>JORNADA</Text>{"\n"}
          <Text style={styles.strong}>ACADEMÍCA</Text>
        </Text>
      </View>

      <View style={StyleSheet.flatten([styles.formPane, compact && styles.formPaneCompact])}>
        <Text style={styles.logo}>FIAP</Text>

        <Text style={styles.label}>E-MAIL*</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={(value) => {
            setEmail(value);
            if (tentouEnviar) setErros(validar());
          }}
          placeholder="usuario@dominio.com"
          placeholderTextColor="#64737a"
          style={styles.input}
          value={email}
        />
        {(tentouEnviar || email.length > 0) && errosAtuais.email ? <Text style={styles.error}>{errosAtuais.email}</Text> : null}

        <Text style={styles.label}>SENHA*</Text>
        <TextInput
          onChangeText={(value) => {
            setSenha(value);
            if (tentouEnviar) setErros(validar());
          }}
          placeholder="Digite sua senha"
          placeholderTextColor="#64737a"
          secureTextEntry
          style={styles.input}
          value={senha}
        />
        {(tentouEnviar || senha.length > 0) && errosAtuais.senha ? <Text style={styles.error}>{errosAtuais.senha}</Text> : null}

        {erros.credenciais ? <Text style={styles.error}>{erros.credenciais}</Text> : null}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={enviando || !formularioValido}
          onPress={entrar}
          style={StyleSheet.flatten([styles.loginButton, (enviando || !formularioValido) && styles.disabled])}
        >
          <Text style={styles.loginText}>{enviando ? "ENTRANDO..." : "LOGAR"}</Text>
        </TouchableOpacity>

        <Link href="/cadastro" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Criar minha conta</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.footer}>
        HiveFiap | Reservas academicas e Maker Lab
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050606",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  screenCompact: {
    flexDirection: "column",
    paddingHorizontal: 24,
    alignItems: "stretch",
  },
  center: {
    flex: 1,
    backgroundColor: "#050606",
    alignItems: "center",
    justifyContent: "center",
  },
  leftPane: {
    flex: 1,
    maxWidth: 520,
    minWidth: 280,
    paddingLeft: 64,
  },
  leftPaneCompact: {
    flex: 0,
    minWidth: 0,
    paddingLeft: 0,
    marginBottom: 28,
  },
  callout: {
    color: "#ED145B",
    fontSize: 28,
    lineHeight: 38,
    fontWeight: "300",
  },
  strong: {
    fontWeight: "900",
  },
  formPane: {
    flex: 1,
    maxWidth: 360,
    minWidth: 300,
    marginLeft: 72,
  },
  formPaneCompact: {
    flex: 0,
    maxWidth: "100%",
    minWidth: 0,
    marginLeft: 0,
  },
  logo: {
    color: "#ED145B",
    fontSize: 56,
    fontWeight: "200",
    marginBottom: 32,
  },
  label: {
    color: "#cbd5da",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 9,
    marginTop: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#46545a",
    color: "#e8f4f8",
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#090b0c",
  },
  error: {
    color: "#ff7f9d",
    marginTop: 14,
    fontSize: 13,
  },
  loginButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ED145B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.65,
  },
  loginText: {
    color: "#ED145B",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    alignSelf: "flex-start",
    marginTop: 22,
  },
  secondaryText: {
    color: "#9aa8ad",
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 22,
    color: "#53636a",
    fontSize: 13,
    textAlign: "center",
  },
});
