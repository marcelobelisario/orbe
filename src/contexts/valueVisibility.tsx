import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type ValueVisibility = { valuesVisible: boolean; toggleValues: () => void };
const ValueVisibilityContext = createContext<ValueVisibility | null>(null);

// Dashboard e extrato compartilham a mesma opção durante a sessão.
export function ValueVisibilityProvider({ children }: PropsWithChildren) {
  const [valuesVisible, setValuesVisible] = useState(true);
  return (
    <ValueVisibilityContext.Provider
      value={{
        valuesVisible,
        toggleValues: () => setValuesVisible((visible) => !visible),
      }}
    >
      {children}
    </ValueVisibilityContext.Provider>
  );
}

export function useValueVisibility() {
  const context = useContext(ValueVisibilityContext);
  if (!context)
    throw new Error(
      "Use ValueVisibilityProvider ao redor das telas financeiras.",
    );
  return context;
}
