import { useState, useEffect } from "react";
import { apiGet } from "../services/api";
import type { Rehearsal } from "../types";

interface AttendanceStats {
  total: number;
  presentes: number;
  ausentes: number;
  porcentaje: number;
}

interface UseCoristaDashboardReturn {
  nextRehearsal: Rehearsal | null;
  upcomingRehearsals: Rehearsal[];
  attendanceStats: AttendanceStats | null;
  loading: boolean;
  error: string | null;
}

export function useCoristaDashboard(): UseCoristaDashboardReturn {
  const [nextRehearsal, setNextRehearsal] = useState<Rehearsal | null>(null);
  const [upcomingRehearsals, setUpcomingRehearsals] = useState<Rehearsal[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch rehearsals
        const rehearsalsResponse = await apiGet<Rehearsal[]>("/rehearsals?limit=5");
        if (rehearsalsResponse.data) {
          setUpcomingRehearsals(rehearsalsResponse.data);
          setNextRehearsal(rehearsalsResponse.data[0] || null);
        }

        // Fetch attendance stats
        const statsResponse = await apiGet<AttendanceStats>("/attendance/me/stats");
        if (statsResponse.data) {
          setAttendanceStats(statsResponse.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    nextRehearsal,
    upcomingRehearsals,
    attendanceStats,
    loading,
    error,
  };
}
