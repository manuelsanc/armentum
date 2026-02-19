import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, FileText, Music, File } from "lucide-react";

// Mock data - Será reemplazado por datos del backend en futuro milestone
const mockDownloads = [
  {
    id: "1",
    nombre: "Partitura - Aleluya",
    descripcion: "Partitura completa para soprano",
    tipo: "partitura",
    tamaño: "2.3 MB",
    fechaActualizacion: "2026-02-15",
  },
  {
    id: "2",
    nombre: "Guía de Ensayo - Febrero 2026",
    descripcion: "Guía de preparación para el mes de febrero",
    tipo: "documento",
    tamaño: "1.5 MB",
    fechaActualizacion: "2026-02-01",
  },
  {
    id: "3",
    nombre: "Grabación de Referencia",
    descripcion: "Grabación de audio para referencia",
    tipo: "audio",
    tamaño: "18.7 MB",
    fechaActualizacion: "2026-01-20",
  },
  {
    id: "4",
    nombre: "Manual del Corista",
    descripcion: "Normativas y procedimientos del coro",
    tipo: "documento",
    tamaño: "5.2 MB",
    fechaActualizacion: "2026-01-15",
  },
  {
    id: "5",
    nombre: "Partitura - Ave Maria",
    descripcion: "Arreglo especial para concierto",
    tipo: "partitura",
    tamaño: "3.1 MB",
    fechaActualizacion: "2026-01-10",
  },
];

const getFileIcon = (tipo: string) => {
  switch (tipo) {
    case "partitura":
      return <Music className="w-6 h-6 text-blue-600" />;
    case "documento":
      return <FileText className="w-6 h-6 text-red-600" />;
    case "audio":
      return <Music className="w-6 h-6 text-green-600" />;
    default:
      return <File className="w-6 h-6 text-gray-600" />;
  }
};

const getTypeLabel = (tipo: string) => {
  switch (tipo) {
    case "partitura":
      return "Partitura";
    case "documento":
      return "Documento";
    case "audio":
      return "Audio";
    default:
      return "Archivo";
  }
};

export function Descargas() {
  const handleDownload = (id: string) => {
    // TODO: Implementar descarga cuando esté disponible el endpoint del backend
    console.log(`Descargando archivo ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Download className="w-8 h-8 text-red-600" />
            Centro de Descargas
          </h1>
          <p className="text-gray-600">
            Accede a partituras, guías, grabaciones y documentos útiles
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">Partituras</p>
              <p className="text-sm text-gray-600">2 archivos</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 text-red-600 mb-2" />
              <p className="font-semibold text-gray-900">Documentos</p>
              <p className="text-sm text-gray-600">2 archivos</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-green-600 mb-2" />
              <p className="font-semibold text-gray-900">Audio</p>
              <p className="text-sm text-gray-600">1 archivo</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 border-gray-300 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <File className="w-8 h-8 text-gray-600 mb-2" />
              <p className="font-semibold text-gray-900">Total</p>
              <p className="text-sm text-gray-600">{mockDownloads.length} archivos</p>
            </CardContent>
          </Card>
        </div>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Archivos Disponibles</CardTitle>
            <CardDescription>Haz clic en descargar para obtener el archivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDownloads.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">{getFileIcon(file.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{file.nombre}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{file.descripcion}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-white rounded border border-gray-200">
                          {getTypeLabel(file.tipo)}
                        </span>
                        <span>{file.tamaño}</span>
                        <span>
                          Actualizado:{" "}
                          {new Date(file.fechaActualizacion).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Button
                      onClick={() => handleDownload(file.id)}
                      variant="outline"
                      className="group-hover:bg-red-50 group-hover:border-red-600 group-hover:text-red-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">ℹ️ Información</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <p className="mb-2">
              <strong>Centro de Descargas:</strong> Aquí encontrarás todos los recursos necesarios
              para tu participación en el coro.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Partituras en diferentes tonalidades</li>
              <li>Guías de ensayo y preparación</li>
              <li>Grabaciones de referencia</li>
              <li>Documentos informativos y normativos</li>
            </ul>
            <p className="mt-3 text-sm">
              Si necesitas algún archivo que no encuentres, contacta con el coordinador del coro.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
