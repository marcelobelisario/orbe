import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { AuthResponse, CreateUsuarioDTO, LoginDTO, Usuario } from "@/types";
import { usuarioService } from "@/services/usuarioService";
import { setApiSessionToken } from "@/services/api";

type Session = ({ kind: "account" } & AuthResponse) | { kind: "demo" } | null;

type AuthContextValue = {
  user: Usuario | null;
  token: string | null;
  isDemo: boolean;
  signIn: (credentials: LoginDTO) => Promise<void>;
  signUp: (data: CreateUsuarioDTO) => Promise<void>;
  signInDemo: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const sessionKey = "@orbe:session";
const legacyKeys = { token: "@orbe:token", user: "@orbe:user", demo: "@orbe:isDemo" };

function readSession(): Session {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const storage = window.localStorage;
    const raw = storage.getItem(sessionKey);
    const saved = raw === null
      ? {
          kind: storage.getItem(legacyKeys.demo) === "true" ? "demo" : "account",
          user: JSON.parse(storage.getItem(legacyKeys.user) ?? "null"),
          token: storage.getItem(legacyKeys.token),
        }
      : JSON.parse(raw);

    if (saved?.kind === "demo") return { kind: "demo" };
    if (saved?.kind === "account" && typeof saved.token === "string" && saved.token.trim() &&
      Number.isSafeInteger(saved.user?.id) && saved.user.id > 0 && typeof saved.user.nome_completo === "string") {
      return { kind: "account", user: saved.user, token: saved.token };
    }
  } catch {
    // Native and restricted browsers can use the in-memory React session.
  }
  return null;
}

function storeSession(session: Session) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const storage = window.localStorage;
    for (const key of Object.values(legacyKeys)) storage.removeItem(key);
    if (session) storage.setItem(sessionKey, JSON.stringify(session));
    else storage.removeItem(sessionKey);
  } catch {
    // The current tab can keep using its in-memory session.
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState(readSession);
  const user = session?.kind === "account" ? session.user : null;
  const token = session?.kind === "account" ? session.token : null;
  const isDemo = session?.kind === "demo";

  useLayoutEffect(() => {
    setApiSessionToken(token);
    storeSession(session);
  }, [session, token]);

  const changeSession = useCallback((nextSession: Session) => {
    // Invalidate requests immediately, before the next React render.
    setApiSessionToken(nextSession?.kind === "account" ? nextSession.token : null);
    setSession(nextSession);
  }, []);

  const signIn = useCallback(async (credentials: LoginDTO) => {
    const account = await usuarioService.login(credentials);
    changeSession({ ...account, kind: "account" });
  }, [changeSession]);

  async function signUp(data: CreateUsuarioDTO) {
    await usuarioService.create(data);
  }

  const signOut = useCallback(() => changeSession(null), [changeSession]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isDemo,
      signIn,
      signUp,
      signInDemo: () => changeSession({ kind: "demo" }),
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
