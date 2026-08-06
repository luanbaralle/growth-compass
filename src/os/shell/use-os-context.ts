import { checkOSAuth, osLogout, switchOSPerson } from "@/lib/api/auth.functions";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useOSContext() {
  const [activePerson, setActivePerson] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { activePerson: person } = await checkOSAuth();
      setActivePerson(person);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const switchPerson = async (person: TeamMember, pin?: string) => {
    try {
      const result = await switchOSPerson({ data: { person, pin } });
      setActivePerson(result.activePerson);
      toast.success(`Perfil: ${TEAM_LABELS[result.activePerson]}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao trocar perfil.");
      throw err;
    }
  };

  const logout = async () => {
    await osLogout();
    setActivePerson(null);
  };

  return { activePerson, loading, reload: load, switchPerson, logout };
}
