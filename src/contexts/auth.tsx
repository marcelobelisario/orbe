import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { Usuario, LoginDTO } from "@/types";
import { usuarioService } from "@/services/usuarioService";
import { api } from "@/services/api";

type AuthContextValue = {
  user: Usuario | null;
  token: string | null;
  isDemo: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginDTO) => Promise<void>;
  signUp: (data: { nome_completo: string; email: string; senha: string }) => Promise<void>;
  signInDemo: () => void;
  signOut: () => void;
};

const DEMO_USER: Usuario = {
  id: 0,
  nome_completo: "Demonstração",
  email: "demo@orbe.app",
  criado_em: "2026-01-01T00:00:00.000Z",
};

const AuthContext = createContext<AuthContextValue | null>(null);

let memoryToken: string | null = null;
let memoryUser: Usuario | null = null;
let memoryIsDemo = false;

const authStorage = {
  getToken: (): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem("@orbe:token");
      }
    } catch {}
    return memoryToken;
  },
  setToken: (token: string | null) => {
    memoryToken = token;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        if (token) window.localStorage.setItem("@orbe:token", token);
        else window.localStorage.removeItem("@orbe:token");
      }
    } catch {}
  },
  getUser: (): Usuario | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem("@orbe:user");
        if (raw) return JSON.parse(raw);
      }
    } catch {}
    return memoryUser;
  },
  setUser: (user: Usuario | null) => {
    memoryUser = user;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        if (user) window.localStorage.setItem("@orbe:user", JSON.stringify(user));
        else window.localStorage.removeItem("@orbe:user");
      }
    } catch {}
  },
  getIsDemo: (): boolean => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem("@orbe:isDemo") === "true";
      }
    } catch {}
    return memoryIsDemo;
  },
  setIsDemo: (isDemo: boolean) => {
    memoryIsDemo = isDemo;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("@orbe:isDemo", isDemo ? "true" : "false");
      }
    } catch {}
  },
  clear: () => {
    memoryToken = null;
    memoryUser = null;
    memoryIsDemo = false;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("@orbe:token");
        window.localStorage.removeItem("@orbe:user");
        window.localStorage.removeItem("@orbe:isDemo");
      }
    } catch {}
  },
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Usuario | null>(() => authStorage.getUser());
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [isDemo, setIsDemo] = useState<boolean>(() => authStorage.getIsDemo());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = authStorage.getToken();
    if (savedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  const signIn = useCallback(async (credentials: LoginDTO) => {
    setIsLoading(true);
    try {
      const response = await usuarioService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      setIsDemo(false);

      authStorage.setUser(response.user);
      authStorage.setToken(response.token);
      authStorage.setIsDemo(false);

      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: { nome_completo: string; email: string; senha: string }) => {
    setIsLoading(true);
    try {
      await usuarioService.create(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInDemo = useCallback(() => {
    setUser(DEMO_USER);
    setToken(null);
    setIsDemo(true);

    authStorage.setUser(DEMO_USER);
    authStorage.setToken(null);
    authStorage.setIsDemo(true);

    delete api.defaults.headers.common["Authorization"];
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsDemo(false);

    authStorage.clear();
    delete api.defaults.headers.common["Authorization"];
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isDemo,
        isLoading,
        signIn,
        signUp,
        signInDemo,
        signOut,
      }}
    >
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
