import { useEffect, useState } from "react";
import * as rehearsalsService from "../services/rehearsals";
import type { Rehearsal } from "../types";

interface UseRehearsalsState {
  rehearsals: Rehearsal[];
  isLoading: boolean;
  error: string | null;
}

export function useRehearsals() {
  const [state, setState] = useState<UseRehearsalsState>({
    rehearsals: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRehearsals = async () => {
      setState({ rehearsals: [], isLoading: true, error: null });
      const response = await rehearsalsService.getRehearsals();

      if (response.error) {
        setState({ rehearsals: [], isLoading: false, error: response.error });
      } else if (response.data) {
        setState({ rehearsals: response.data, isLoading: false, error: null });
      }
    };

    fetchRehearsals();
  }, []);

  return state;
}

export function useUpcomingRehearsals() {
  const [state, setState] = useState<UseRehearsalsState>({
    rehearsals: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRehearsals = async () => {
      setState({ rehearsals: [], isLoading: true, error: null });
      const response = await rehearsalsService.getUpcomingRehearsals();

      if (response.error) {
        setState({ rehearsals: [], isLoading: false, error: response.error });
      } else if (response.data) {
        setState({ rehearsals: response.data, isLoading: false, error: null });
      }
    };

    fetchRehearsals();
  }, []);

  return state;
}
