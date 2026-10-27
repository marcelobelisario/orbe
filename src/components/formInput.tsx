import {useState, type ComponentRef, type Ref} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import Icon from "./icon";

export type FormInputProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export default function FormInput({
  label,
  error,
  hint,
  containerStyle,
  style,
  onFocus,
  onBlur,
  editable = true,
  multiline = false,
  isPassword = false,
  secureTextEntry,
  accessibilityLabel,
  accessibilityHint,
  ref,
  ...props
}: FormInputProps) {
  const {colors, theme} = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const message = error || hint;
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, {color: colors.muted}]}>{label}</Text>
      <View>
        <TextInput
          keyboardAppearance={theme}
          {...props}
          ref={ref}
          editable={editable}
          multiline={multiline}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={
            error
              ? `${accessibilityHint ? `${accessibilityHint}. ` : ""}Erro: ${error}`
              : (accessibilityHint ?? hint)
          }
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            {
              color: editable ? colors.text : colors.disabledText,
              backgroundColor: editable ? colors.surface : colors.elevated,
              borderColor: error ? colors.expense : focused ? colors.primary : colors.border,
            },
            multiline && styles.multiline,
            isPassword && styles.passwordInput,
            style,
          ]}
        />
        {isPassword && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            accessibilityState={{disabled: !editable}}
            disabled={!editable}
            onPress={() => setShowPassword((visible) => !visible)}
            style={styles.passwordToggle}
          >
            <Icon
              name={showPassword ? "eyeOff" : "eye"}
              color={editable ? colors.muted : colors.disabledText}
            />
          </Pressable>
        )}
      </View>
      {message ? (
        <Text
          accessibilityLiveRegion={error ? "polite" : "none"}
          style={[styles.message, {color: error ? colors.expense : colors.muted}]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {gap: 8},
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  input: {
    minHeight: 46,
    borderRadius: radii.control,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  multiline: {minHeight: 66, textAlignVertical: "top"},
  passwordInput: {paddingRight: 56},
  passwordToggle: {
    position: "absolute",
    right: 4,
    top: 0,
    bottom: 0,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 16},
});
