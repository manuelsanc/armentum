import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { apiPost } from "../../services/api";

interface JoinChoirModalProps {
  buttonLabel?: string;
  buttonClassName?: string;
}

interface ChoirInterestPayload {
  nombre_completo: string;
  edad: string;
  experiencia_musical: string;
  quien_soy: string;
  correo: string;
  telefono: string;
}

const INITIAL_FORM: ChoirInterestPayload = {
  nombre_completo: "",
  edad: "",
  experiencia_musical: "",
  quien_soy: "",
  correo: "",
  telefono: "",
};

export function JoinChoirModal({
  buttonLabel = "Déjenos sus datos",
  buttonClassName,
}: JoinChoirModalProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ChoirInterestPayload>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (key: keyof ChoirInterestPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const parsedAge = Number(form.edad);
    if (!parsedAge || parsedAge < 1) {
      setErrorMessage("Por favor ingresa una edad válida.");
      setLoading(false);
      return;
    }

    const response = await apiPost<{ message: string }>("/choir-interest", {
      ...form,
      edad: parsedAge,
    });

    if (response.error) {
      setErrorMessage(response.error || "No se pudo enviar el formulario.");
      setLoading(false);
      return;
    }

    setSuccessMessage("¡Gracias! Hemos recibido tus datos.");
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
            "inline-block px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          }
          type="button"
        >
          {buttonLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Déjenos sus datos</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Completa el formulario y nos pondremos en contacto contigo.
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
            Edad
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              type="number"
              min={1}
              max={120}
              value={form.edad}
              onChange={(event) => handleChange("edad", event.target.value)}
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
          <label className="md:col-span-2 text-sm text-gray-700">
            Experiencia Musical/Coral
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              value={form.experiencia_musical}
              onChange={(event) => handleChange("experiencia_musical", event.target.value)}
              required
            />
          </label>
          <label className="md:col-span-2 text-sm text-gray-700">
            Quién soy
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              value={form.quien_soy}
              onChange={(event) => handleChange("quien_soy", event.target.value)}
              required
            />
          </label>

          {errorMessage && <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>}
          {successMessage && (
            <p className="md:col-span-2 text-xs text-green-700">
              Tu información fue enviada correctamente.
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
