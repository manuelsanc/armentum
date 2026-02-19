import { useEffect } from "react";
import { useAdminAttendance } from "../../../hooks/useAdminAttendance";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function AdminAttendance(): JSX.Element {
  const {
    attendances,
    rehearsals,
    selectedRehearsal,
    isLoading,
    fetchRehearsals,
    fetchAttendance,
    markPresent,
    markAbsent,
  } = useAdminAttendance();

  useEffect(() => {
    fetchRehearsals();
  }, []);

  const handleRehearsalChange = (rehearsalId: string) => {
    fetchAttendance(rehearsalId);
  };

  const handleMarkPresent = async (attendanceId: string) => {
    if (selectedRehearsal) {
      try {
        await markPresent(selectedRehearsal.id, attendanceId);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const handleMarkAbsent = async (attendanceId: string, justificacion: string) => {
    if (selectedRehearsal) {
      try {
        await markAbsent(selectedRehearsal.id, attendanceId, justificacion || undefined);
      } catch {
        // Error already handled by hook
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Asistencias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rehearsal-select">Seleccionar Ensayo</Label>
            <Select value={selectedRehearsal?.id || ""} onValueChange={handleRehearsalChange}>
              <SelectTrigger>
                <SelectValue placeholder="Elige un ensayo" />
              </SelectTrigger>
              <SelectContent>
                {rehearsals.map((rehearsal) => (
                  <SelectItem key={rehearsal.id} value={rehearsal.id}>
                    {rehearsal.titulo} - {new Date(rehearsal.fecha).toLocaleDateString("es-ES")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRehearsal && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>{selectedRehearsal.titulo}</strong> •{" "}
                {new Date(selectedRehearsal.fecha).toLocaleDateString("es-ES")} •{" "}
                {selectedRehearsal.horaInicio}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedRehearsal
                ? "No hay miembros para este ensayo"
                : "Selecciona un ensayo para ver asistencias"}
            </div>
          ) : (
            <div className="space-y-3">
              {attendances.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {attendance.userId || "Miembro desconocido"}
                    </p>
                    {attendance.justificacion && (
                      <p className="text-sm text-gray-600">
                        Justificación: {attendance.justificacion}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {attendance.presente ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600">Presente</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-red-600">Ausente</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={attendance.presente ? "default" : "outline"}
                      onClick={() => handleMarkPresent(attendance.id)}
                    >
                      Presente
                    </Button>
                    <Button
                      size="sm"
                      variant={!attendance.presente ? "default" : "outline"}
                      onClick={() => handleMarkAbsent(attendance.id, "")}
                    >
                      Ausente
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
