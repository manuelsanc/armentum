import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { apiPost } from "../../services/api";

interface ServiceQuoteModalProps {
  buttonLabel?: string;
  buttonClassName?: string;
}

interface ServiceQuotePayload {
  nombre_completo: string;
  correo: string;
  telefono: string;
  tipo_evento: string;
  fecha_evento: string;
  ubicacion_evento: string;
  musica_deseada?: string;
  duracion_evento: string;
  presupuesto?: string;
  mensaje_adicional: string;
}

const INITIAL_FORM: ServiceQuotePayload = {
  nombre_completo: "",
  correo: "",
  telefono: "",
  tipo_evento: "",
  fecha_evento: "",
  ubicacion_evento: "",
  musica_deseada: "",
  duracion_evento: "",
  presupuesto: "",
  mensaje_adicional: "",
};

export function ServiceQuoteModal({
  buttonLabel = "Quiero música en mi evento",
  buttonClassName,
}: ServiceQuoteModalProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ServiceQuotePayload>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleChange = (key: keyof ServiceQuotePayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const response = await apiPost<{ message: string }>("/service-quote", {
      ...form,
      musica_deseada: form.musica_deseada || undefined,
      presupuesto: form.presupuesto || undefined,
    });

    if (response.error) {
      setErrorMessage(response.error || "No se pudo enviar el formulario.");
      setLoading(false);
      return;
    }

    setSuccessMessage("¡Gracias! Hemos recibido tu solicitud.");
    setForm(INITIAL_FORM);
    setLoading(false);
    setTimeout(() => {
      setOpen(false);
    }, 2500);
  };

  const resetState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetState();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className={
            buttonClassName ||
            "inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          }
          type="button"
        >
          {buttonLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Cotización</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Completa el formulario y te contactaremos con una propuesta musical.
        </p>

        {successMessage && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-gray-700">
            Nombre completo
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={form.nombre_completo}
              onChange={(event) => handleChange("nombre_completo", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Correo electrónico
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              type="email"
              value={form.correo}
              onChange={(event) => handleChange("correo", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Número de teléfono
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              type="tel"
              minLength={8}
              pattern="\d{8,}"
              title="Ingresa al menos 8 dígitos"
              value={form.telefono}
              onChange={(event) => handleChange("telefono", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Tipo de evento
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={form.tipo_evento}
              onChange={(event) => handleChange("tipo_evento", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Fecha del evento
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              type="date"
              value={form.fecha_evento}
              onChange={(event) => handleChange("fecha_evento", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Ubicación del evento
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={form.ubicacion_evento}
              onChange={(event) => handleChange("ubicacion_evento", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Tipo de música deseada (opcional)
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={form.musica_deseada}
              onChange={(event) => handleChange("musica_deseada", event.target.value)}
            />
          </label>
          <label className="text-sm text-gray-700">
            Duración aproximada del evento
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={form.duracion_evento}
              onChange={(event) => handleChange("duracion_evento", event.target.value)}
              required
            />
          </label>
          <label className="text-sm text-gray-700">
            Presupuesto estimado (opcional)
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={form.presupuesto}
              onChange={(event) => handleChange("presupuesto", event.target.value)}
            />
          </label>
          <label className="md:col-span-2 text-sm text-gray-700">
            Mensaje adicional
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              value={form.mensaje_adicional}
              onChange={(event) => handleChange("mensaje_adicional", event.target.value)}
              required
            />
          </label>

          {errorMessage && <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>}
          {successMessage && (
            <p className="md:col-span-2 text-xs text-green-700">
              Tu solicitud fue enviada correctamente.
            </p>
          )}

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
