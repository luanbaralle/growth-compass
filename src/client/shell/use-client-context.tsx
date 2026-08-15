import { createContext, useContext, type ReactNode } from "react";
import type { ClientSessionUser } from "@/domains/client-portal/types";
import { checkClientAuth, clientLogout } from "@/client/auth.functions";

type ClientContextValue = {
  user: ClientSessionUser;
  logout: () => Promise<void>;
};

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({
  user,
  children,
}: {
  user: ClientSessionUser;
  children: ReactNode;
}) {
  const logout = async () => {
    await clientLogout();
  };

  return <ClientContext.Provider value={{ user, logout }}>{children}</ClientContext.Provider>;
}

export function useClientContext(): ClientContextValue {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClientContext must be used within ClientProvider");
  return ctx;
}

export async function loadClientAuth() {
  return checkClientAuth();
}
