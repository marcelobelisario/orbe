export const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateLogin(email: string, password: string) {
  const errors: {email?: string; password?: string} = {};
  if (!isValidEmail(email)) errors.email = "Informe um e-mail válido";
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use ao menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  return errors;
}

export type Registration = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

export type RegistrationErrors = Partial<Record<keyof Registration, string>>;

export function validateRegistration(values: Registration): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (values.fullName.trim().split(/\s+/).length < 2) {
    errors.fullName = "Digite seu nome e sobrenome";
  }
  if (!isValidEmail(values.email)) errors.email = "Informe um e-mail válido";
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use ao menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  if (!values.confirmPassword || values.confirmPassword !== values.password) {
    errors.confirmPassword = "As senhas não coincidem";
  }
  if (!values.termsAccepted) errors.termsAccepted = "Aceite os termos para continuar";
  return errors;
}

// A composição é uma orientação visual; o cadastro exige no mínimo oito caracteres.
export function getPasswordStrength(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) return 0;
  return 1 + Number(/\d/.test(password)) + Number(/[^a-zA-Z0-9\s]/.test(password));
}
