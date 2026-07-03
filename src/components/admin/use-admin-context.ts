import { checkAdminAuth, switchAdminPerson } from "@/lib/api/leads.functions";
import { TEAM_LABELS, type TeamMember } from "@/lib/execution/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAdminContext() {
  const [activePerson, setActivePerson] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { activePerson: person } = await checkAdminAuth();
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
      const result = await switchAdminPerson({ data: { person, pin } });
      setActivePerson(result.activePerson);
      toast.success(`Perfil: ${TEAM_LABELS[result.activePerson]}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao trocar perfil.");
      throw err;
    }
  };

  return { activePerson, loading, reload: load, switchPerson };
}
