import { useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Music, 
  Calendar, 
  FileText, 
  Download, 
  Clock, 
  MapPin, 
  LogOut,
  Bell,
  CheckCircle
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export function Coristas(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user || user.userType !== "corista") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nextRehearsals = [
    {
      date: "2026-02-20",
      time: "19:00 - 21:30",
      location: "Sala de Ensayos Armentum",
      repertoire: "Réquiem de Mozart - Movimientos 1-3",
      notes: "Traer partitura marcada"
    },
    {
      date: "2026-02-24",
      time: "19:00 - 21:30",
      location: "Sala de Ensayos Armentum",
      repertoire: "Réquiem de Mozart - Movimientos 4-6",
      notes: "Ensayo sectorial primeros 30 minutos"
    },
    {
      date: "2026-02-27",
      time: "19:00 - 21:30",
      location: "Sala de Ensayos Armentum",
      repertoire: "Obra completa con orquesta",
      notes: "IMPORTANTE: Ensayo conjunto con orquesta"
    }
  ];

  const scores = [
    { id: 1, title: "Réquiem - Mozart (Soprano)", format: "PDF", size: "2.3 MB" },
    { id: 2, title: "Réquiem - Mozart (Alto)", format: "PDF", size: "2.1 MB" },
    { id: 3, title: "Réquiem - Mozart (Tenor)", format: "PDF", size: "2.2 MB" },
    { id: 4, title: "Réquiem - Mozart (Bajo)", format: "PDF", size: "2.0 MB" },
    { id: 5, title: "Ave Verum Corpus - Mozart", format: "PDF", size: "450 KB" },
    { id: 6, title: "Lux Aeterna - Whitacre", format: "PDF", size: "890 KB" }
  ];

  const announcements = [
    {
      id: 1,
      title: "Cambio de Horario - Ensayo del 24 de Febrero",
      date: "2026-02-15",
      message: "El ensayo sectorial empezará 30 minutos antes. Por favor lleguen a las 18:30.",
      priority: "high"
    },
    {
      id: 2,
      title: "Confirmación de Asistencia - Concierto 22 de Marzo",
      date: "2026-02-12",
      message: "Por favor confirmen su asistencia al concierto antes del 20 de febrero.",
      priority: "medium"
    },
    {
      id: 3,
      title: "Nueva Partitura Disponible",
      date: "2026-02-10",
      message: "Ya está disponible la partitura de 'Lux Aeterna' de Whitacre en la sección de partituras.",
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500 bg-red-50";
      case "medium": return "border-orange-500 bg-orange-50";
      case "low": return "border-blue-500 bg-blue-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Portal de Coristas</h1>
              <p className="text-gray-600">Bienvenido/a, {user?.nombre || user?.email?.split("@")[0] || "Corista"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximo Ensayo</p>
                <p className="text-2xl text-gray-900">Feb 20</p>
              </div>
              <Calendar className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partituras</p>
                <p className="text-2xl text-gray-900">6</p>
              </div>
              <Music className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Asistencia</p>
                <p className="text-2xl text-gray-900">95%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avisos</p>
                <p className="text-2xl text-gray-900">3</p>
              </div>
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-red-600" />
                  Avisos Importantes
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`border-l-4 p-4 rounded ${getPriorityColor(announcement.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{announcement.title}</h3>
                      <span className="text-xs text-gray-600">
                        {new Date(announcement.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{announcement.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900 flex items-center gap-2">
                  <Music className="w-6 h-6 text-red-600" />
                  Partituras Disponibles
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {scores.map((score) => (
                    <div
                      key={score.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-gray-900">{score.title}</p>
                          <p className="text-sm text-gray-600">
                            {score.format} • {score.size}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-red-600" />
                  Próximos Ensayos
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {nextRehearsals.map((rehearsal, index) => (
                  <div key={index} className="border-l-4 border-red-600 pl-4 py-2">
                    <p className="text-gray-900 mb-2">
                      {new Date(rehearsal.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{rehearsal.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{rehearsal.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        <span>{rehearsal.repertoire}</span>
                      </div>
                    </div>
                    {rehearsal.notes && (
                      <p className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                        {rehearsal.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg mb-4 text-gray-900">Enlaces Rápidos</h3>
              <div className="space-y-2">
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                  Mi Perfil
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                  Historial de Asistencia
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                  Grabaciones de Ensayos
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                  Contactar al Director
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
