import { useEffect, useState } from "react";
import * as financeService from "../services/finance";
import type { Cuota, FinanceHistory, FinanceSummary } from "../types";

interface UseFinanceState {
  cuotas: Cuota[];
  history: FinanceHistory[];
  summary: FinanceSummary | null;
  isLoading: boolean;
  error: string | null;
}

export function useFinance() {
  const [state, setState] = useState<UseFinanceState>({
    cuotas: [],
    history: [],
    summary: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFinance = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [cuotasRes, historyRes, summaryRes] = await Promise.all([
        financeService.getCuotas(),
        financeService.getFinanceHistory(),
        financeService.getFinanceSummary(),
      ]);

      if (cuotasRes.error || historyRes.error || summaryRes.error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            cuotasRes.error || historyRes.error || summaryRes.error || "Error fetching finance",
        }));
      } else if (cuotasRes.data && historyRes.data && summaryRes.data) {
        setState({
          cuotas: cuotasRes.data,
          history: historyRes.data,
          summary: summaryRes.data,
          isLoading: false,
          error: null,
        });
      }
    };

    fetchFinance();
  }, []);

  return state;
}
