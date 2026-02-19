import { useEffect, useState } from "react";
import * as membersService from "../services/members";
import type { MemberProfile } from "../types";

interface UseProfileState {
  profile: MemberProfile | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfile() {
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setState({ profile: null, isLoading: true, error: null });
      const response = await membersService.getProfile();

      if (response.error) {
        setState({ profile: null, isLoading: false, error: response.error });
      } else if (response.data) {
        setState({ profile: response.data, isLoading: false, error: null });
      }
    };

    fetchProfile();
  }, []);

  return state;
}
