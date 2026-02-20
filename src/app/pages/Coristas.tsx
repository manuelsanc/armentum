import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Music,
  Calendar,
  FileText,
  Download,
  Clock,
  MapPin,
  LogOut,
  Bell,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useAuthStore } from "../../stores/authStore";
import { useCoristaDashboard } from "../../hooks/useCoristaDashboard";

export function Coristas(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { nextRehearsal, upcomingRehearsals, attendanceStats, loading } = useCoristaDashboard();

  useEffect(() => {
    if (!user || user.userType !== "corista") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "EEEE, d 'de' MMMM", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d 'de' MMMM", { locale: es });
    } catch {
      return dateStr;
    }
  };

  // Placeholder data for scores and announcements (these would need separate endpoints)
  const scores = [
    { id: 1, title: "Réquiem - Mozart (Soprano)", format: "PDF", size: "2.3 MB" },
    { id: 2, title: "Réquiem - Mozart (Alto)", format: "PDF", size: "2.1 MB" },
    { id: 3, title: "Réquiem - Mozart (Tenor)", format: "PDF", size: "2.2 MB" },
    { id: 4, title: "Réquiem - Mozart (Bajo)", format: "PDF", size: "2.0 MB" },
  ];

  const announcements = [
    {
      id: 1,
      title: "Bienvenido al Portal de Coristas",
      date: new Date().toISOString().slice(0, 10),
      message: "Aquí encontrarás información sobre tus próximos ensayos, asistencias y finanzas.",
      priority: "medium",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50";
      case "medium":
        return "border-orange-500 bg-orange-50";
      case "low":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-red-600" />
          <p className="text-gray-600">Cargando portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Portal de Coristas</h1>
              <p className="text-gray-600">
                Bienvenido/a, {user?.nombre || user?.email?.split("@")[0] || "Corista"}
              </p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximo Ensayo</p>
                <p className="text-2xl text-gray-900">
                  {nextRehearsal ? formatShortDate(nextRehearsal.fecha) : "Sin ensayos"}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partituras</p>
                <p className="text-2xl text-gray-900">{scores.length}</p>
              </div>
              <Music className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Asistencia</p>
                <p className="text-2xl text-gray-900">
                  {attendanceStats ? `${attendanceStats.porcentaje.toFixed(0)}%` : "0%"}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avisos</p>
                <p className="text-2xl text-gray-900">{announcements.length}</p>
              </div>
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Announcements */}
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
                        {format(parseISO(announcement.date), "d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{announcement.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scores */}
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

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Rehearsals */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-red-600" />
                  Próximos Ensayos
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {upcomingRehearsals.length > 0 ? (
                  upcomingRehearsals.map((rehearsal) => (
                    <div key={rehearsal.id} className="border-l-4 border-red-600 pl-4 py-2">
                      <p className="text-gray-900 font-medium mb-2">
                        {rehearsal.titulo || rehearsal.nombre}
                      </p>
                      <p className="text-gray-700 mb-2">{formatDate(rehearsal.fecha)}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{rehearsal.horaInicio || rehearsal.hora}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{rehearsal.lugar}</span>
                        </div>
                        {rehearsal.tipo && (
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            <span className="capitalize">{rehearsal.tipo}</span>
                          </div>
                        )}
                      </div>
                      {rehearsal.descripcion && (
                        <p className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                          {rehearsal.descripcion}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay ensayos programados</p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg mb-4 text-gray-900">Enlaces Rápidos</h3>
              <div className="space-y-2">
                <Link
                  to="/calendario"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <span>Calendario de Ensayos</span>
                  <Calendar className="w-4 h-4 text-red-600" />
                </Link>
                <Link
                  to="/mis-asistencias"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <span>Mis Asistencias</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </Link>
                <Link
                  to="/finanzas"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <span>Mis Finanzas</span>
                  <FileText className="w-4 h-4 text-orange-600" />
                </Link>
                <Link
                  to="/descargas"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <span>Centro de Descargas</span>
                  <Download className="w-4 h-4 text-blue-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
