import { useEffect, useState } from "react";
import { useAdminAttendance } from "../../../hooks/useAdminAttendance";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const VOICE_OPTIONS = [
  { value: "soprano1", label: "Soprano 1" },
  { value: "soprano2", label: "Soprano 2" },
  { value: "contralto1", label: "Contralto 1" },
  { value: "contralto2", label: "Contralto 2" },
  { value: "tenor1", label: "Tenor 1" },
  { value: "tenor2", label: "Tenor 2" },
  { value: "bajo1", label: "Bajo 1" },
  { value: "bajo2", label: "Bajo 2" },
];

const getVoiceLabel = (voz?: string): string => {
  if (!voz) return "-";
  const match = VOICE_OPTIONS.find((option) => option.value === voz.toLowerCase());
  return match ? match.label : voz;
};

export function AdminAttendance(): JSX.Element {
  const {
    attendances,
    rehearsals,
    selectedRehearsal,
    isLoading,
    voiceFilter,
    fetchRehearsals,
    fetchAttendance,
    markPresent,
    markAbsent,
    filterByVoice,
  } = useAdminAttendance();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const [justificacion, setJustificacion] = useState("");

  useEffect(() => {
    fetchRehearsals();
  }, []);

  const handleRehearsalChange = (rehearsalId: string) => {
    fetchAttendance(rehearsalId, voiceFilter || undefined);
  };

  const handleVoiceFilterChange = (voz: string) => {
    filterByVoice(voz === "all" ? "" : voz);
  };

  const handleMarkPresent = async (miembroId: string) => {
    if (selectedRehearsal) {
      try {
        await markPresent(selectedRehearsal.id, miembroId);
      } catch {
        // Error already handled by hook
      }
    }
  };

  const handleMarkAbsentClick = (miembroId: string) => {
    setSelectedAttendanceId(miembroId);
    setJustificacion("");
    setIsDialogOpen(true);
  };

  const handleConfirmAbsent = async () => {
    if (selectedRehearsal && selectedAttendanceId) {
      try {
        await markAbsent(selectedRehearsal.id, selectedAttendanceId, justificacion || undefined);
        setIsDialogOpen(false);
        setSelectedAttendanceId(null);
        setJustificacion("");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="voice-filter">Filtrar por Voz</Label>
              <Select value={voiceFilter || "all"} onValueChange={handleVoiceFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las voces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las voces</SelectItem>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-gray-900">
                        {attendance.nombre || attendance.userId || "Miembro desconocido"}
                      </p>
                      {attendance.voz && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          {getVoiceLabel(attendance.voz)}
                        </span>
                      )}
                    </div>
                    {attendance.justificacion && (
                      <p className="text-sm text-gray-600 mt-1">
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
                      onClick={() => handleMarkPresent(attendance.miembro_id || attendance.id)}
                      className={attendance.presente ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Presente
                    </Button>
                    <Button
                      size="sm"
                      variant={!attendance.presente ? "destructive" : "outline"}
                      onClick={() => handleMarkAbsentClick(attendance.miembro_id || attendance.id)}
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

      {/* Dialog para justificación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Ausente</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de marcar este miembro como ausente? Puedes agregar una justificación
              opcional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="justificacion">Justificación (opcional)</Label>
              <Textarea
                id="justificacion"
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                placeholder="Ej: Enfermedad, viaje de trabajo, etc."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmAbsent}>
              Confirmar Ausencia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
