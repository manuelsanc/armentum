import { useState, useEffect } from "react";
import { apiGet } from "../services/api";

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  upcomingEvents: number;
  upcomingRehearsals: number;
  finance: {
    totalIngresos: number;
    totalPendiente: number;
    totalVencido: number;
  };
}

interface UseAdminDashboardReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminDashboard(): UseAdminDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet<DashboardStats>("/admin/dashboard/stats");
      if (response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.error || "Error al cargar estadísticas");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
