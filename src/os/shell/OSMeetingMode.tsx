import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type OSMeetingModeContextValue = {
  meetingMode: boolean;
  setMeetingMode: (active: boolean) => void;
};

const OSMeetingModeContext = createContext<OSMeetingModeContextValue | null>(null);

export function OSMeetingModeProvider({ children }: { children: ReactNode }) {
  const [meetingMode, setMeetingModeState] = useState(false);
  const setMeetingMode = useCallback((active: boolean) => {
    setMeetingModeState(active);
  }, []);

  const value = useMemo(
    () => ({ meetingMode, setMeetingMode }),
    [meetingMode, setMeetingMode],
  );

  return (
    <OSMeetingModeContext.Provider value={value}>{children}</OSMeetingModeContext.Provider>
  );
}

export function useOSMeetingMode() {
  const ctx = useContext(OSMeetingModeContext);
  if (!ctx) {
    return {
      meetingMode: false,
      setMeetingMode: (_active: boolean) => undefined,
    };
  }
  return ctx;
}
