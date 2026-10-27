import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { OrbeLogo } from "../../components/OrbeLogo";
import { colors } from "../../theme/colors";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type TabMode = "login" | "register";

export default function IdentityScreen() {
  const [activeTab, setActiveTab] = useState<TabMode>("login");
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

  const handleLoginSuccess = (_email: string) => {
    Alert.alert("Login realizado", "Autenticação efetuada com sucesso!");
  };

  const handleRegisterSuccess = (userData: { name: string; email: string }) => {
    Alert.alert(
      "Conta criada com sucesso!",
      `Bem-vindo(a), ${userData.name}! Sua conta foi cadastrada.`
    );
  };

  const handleSendRecovery = () => {
    if (!recoveryEmail || !recoveryEmail.includes("@")) {
      Alert.alert("Atenção", "Por favor, digite um e-mail válido.");
      return;
    }
    setRecoverySent(true);
    setTimeout(() => {
      setRecoverySent(false);
      setForgotModalVisible(false);
      setRecoveryEmail("");
      Alert.alert(
        "Instruções enviadas",
        "Enviamos um link seguro para redefinição de senha para o seu e-mail."
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Elementos decorativos de ambientação luminosa no fundo */}
      <View style={styles.bgGlowTopRight} />
      <View style={styles.bgGlowBottomLeft} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Topo: Logo e Marca Orbe */}
          <View style={styles.header}>
            <OrbeLogo size="md" />
          </View>

          {/* Segmented Control / Seletor de Aba: Entrar vs Criar Conta */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "login" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("login")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "login" && styles.tabButtonTextActive,
                ]}
              >
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "register" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("register")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "register" && styles.tabButtonTextActive,
                ]}
              >
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card Principal de Formulário */}
          <View style={styles.cardContainer}>
            {activeTab === "login" ? (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onForgotPassword={() => setForgotModalVisible(true)}
                onExploreDemo={() => { }}
              />
            ) : (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onExploreDemo={() => { }}
              />
            )}
          </View>

          {/* Rodapé institucional */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Orbe © 2026 • Todos os direitos reservados
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Recuperação de Senha */}
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Ionicons name="key-outline" size={24} color={colors.primary} />
              </View>
              <TouchableOpacity
                onPress={() => setForgotModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Recuperar senha</Text>
            <Text style={styles.modalDescription}>
              Digite o e-mail cadastrado na sua conta para receber as orientações de redefinição.
            </Text>

            <Input
              label="E-MAIL CADASTRADO"
              placeholder="exemplo@orbe.com"
              value={recoveryEmail}
              onChangeText={setRecoveryEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="mail-outline"
            />

            <Button
              title={recoverySent ? "Enviando..." : "Enviar link de recuperação"}
              onPress={handleSendRecovery}
              isLoading={recoverySent}
              iconName="paper-plane-outline"
            />

            <TouchableOpacity
              onPress={() => setForgotModalVisible(false)}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>Voltar ao login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: "center",
  },
  bgGlowTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primary,
    opacity: 0.08,
  },
  bgGlowBottomLeft: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#0284C7",
    opacity: 0.05,
  },
  header: {
    marginTop: 10,
    marginBottom: 26,
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardSecondary,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
    width: "100%",
    maxWidth: 420,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: colors.text,
    fontWeight: "700",
  },
  cardContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  // Modal de Recuperação
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.badgeSuccessBg,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalCancelButton: {
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
