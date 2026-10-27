import {useState} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {Btn, FormInput, ThemeToggle} from "@/components";
import {OrbeLogo} from "@/components/OrbeLogo";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import {LoginForm} from "./LoginForm";
import {RegisterForm} from "./RegisterForm";
import {isValidEmail} from "./validation";

export default function IdentityScreen() {
  const {colors} = useTheme();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState("");

  function openDashboard() {
    router.replace("/dashboard");
  }

  function openRecovery() {
    setRecoveryEmail("");
    setRecoveryError("");
    setRecoveryNotice("");
    setForgotModalVisible(true);
  }

  function handleRecovery() {
    if (!isValidEmail(recoveryEmail)) {
      setRecoveryError("Informe um e-mail válido");
      return;
    }
    setRecoveryError("");
    setRecoveryNotice("Esta é uma demonstração. Nenhum e-mail foi enviado.");
  }

  return (
    <SafeAreaView style={[styles.screen, {backgroundColor: colors.background}]}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <ThemeToggle />
            <View style={styles.logo}>
              <OrbeLogo />
            </View>
            <View
              style={[styles.tabs, {backgroundColor: colors.elevated, borderColor: colors.border}]}
              accessibilityRole="tablist"
            >
              {(
                [
                  {value: "login", label: "Entrar"},
                  {value: "register", label: "Criar Conta"},
                ] as const
              ).map((tab) => (
                <Pressable
                  key={tab.value}
                  accessibilityRole="tab"
                  accessibilityState={{selected: activeTab === tab.value}}
                  aria-selected={activeTab === tab.value}
                  onPress={() => setActiveTab(tab.value)}
                  style={[
                    styles.tab,
                    {backgroundColor: activeTab === tab.value ? colors.surface : "transparent"},
                  ]}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      {color: activeTab === tab.value ? colors.text : colors.muted},
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View
              style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
            >
              {activeTab === "login" ? (
                <LoginForm
                  onSuccess={openDashboard}
                  onForgotPassword={openRecovery}
                  onExploreDemo={openDashboard}
                />
              ) : (
                <RegisterForm onSuccess={openDashboard} />
              )}
            </View>
            <Text style={[styles.footer, {color: colors.muted}]}>
              Orbe © 2026 • Todos os direitos reservados
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.card,
                styles.modal,
                {backgroundColor: colors.surface, borderColor: colors.border},
              ]}
              accessibilityViewIsModal
            >
              <Text accessibilityRole="header" style={[styles.modalTitle, {color: colors.text}]}>
                Recuperar senha
              </Text>
              <Text style={[styles.body, {color: colors.muted}]}>
                Informe o e-mail cadastrado para solicitar a recuperação.
              </Text>
              <FormInput
                label="E-mail cadastrado"
                placeholder="exemplo@orbe.com"
                value={recoveryEmail}
                onChangeText={(value) => {
                  setRecoveryEmail(value);
                  setRecoveryError("");
                  setRecoveryNotice("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                error={recoveryError}
                returnKeyType="send"
                onSubmitEditing={handleRecovery}
              />
              {recoveryNotice ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={[styles.body, {color: colors.primary}]}
                >
                  {recoveryNotice}
                </Text>
              ) : null}
              <Btn label="Enviar link de recuperação" onPress={handleRecovery} />
              <Btn
                label="Voltar ao login"
                variant="secondary"
                onPress={() => setForgotModalVisible(false)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  scroll: {flexGrow: 1, padding: 20, alignItems: "center"},
  content: {width: "100%", maxWidth: 420, gap: 20},
  logo: {paddingVertical: 8},
  tabs: {flexDirection: "row", borderRadius: radii.card, borderWidth: 1, padding: 4},
  tab: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.control,
  },
  tabLabel: {fontFamily: fonts.semibold, fontSize: 14},
  card: {borderRadius: radii.card, borderWidth: 1, padding: 20, gap: 16},
  footer: {fontFamily: fonts.regular, fontSize: 12, textAlign: "center", lineHeight: 18},
  overlay: {flex: 1, backgroundColor: "rgba(0,0,0,0.4)"},
  modalScroll: {flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20},
  modal: {width: "100%", maxWidth: 420},
  modalTitle: {fontFamily: fonts.heading, fontSize: 22, lineHeight: 30},
  body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 20},
});
