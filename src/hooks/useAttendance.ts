import { useEffect, useState } from "react";
import * as attendanceService from "../services/attendance";
import type { Attendance, AttendanceStats } from "../types";

interface UseAttendanceState {
  attendance: Attendance[];
  stats: AttendanceStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useAttendance() {
  const [state, setState] = useState<UseAttendanceState>({
    attendance: [],
    stats: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [attendanceRes, statsRes] = await Promise.all([
        attendanceService.getAttendance(),
        attendanceService.getAttendanceStats(),
      ]);

      if (attendanceRes.error || statsRes.error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: attendanceRes.error || statsRes.error || "Error fetching attendance",
        }));
      } else if (attendanceRes.data && statsRes.data) {
        setState({
          attendance: attendanceRes.data,
          stats: statsRes.data,
          isLoading: false,
          error: null,
        });
      }
    };

    fetchAttendance();
  }, []);

  return state;
}
