import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  Users, 
  Calendar, 
  FileText, 
  LogOut,
  Plus,
  Edit,
  TrendingUp,
  Music,
  Bell
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export function Admin(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "events" | "content">("overview");

  useEffect(() => {
    if (!user || user.userType !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const stats = {
    totalMembers: 52,
    activeMembers: 48,
    upcomingEvents: 8,
    pendingTasks: 5
  };

  const recentMembers = [
    { id: 1, name: "María García", voice: "Soprano", joined: "2026-02-01", status: "active" },
    { id: 2, name: "Juan Martínez", voice: "Tenor", joined: "2026-02-01", status: "active" },
    { id: 3, name: "Carmen López", voice: "Alto", joined: "2026-01-15", status: "active" },
    { id: 4, name: "Pedro Sánchez", voice: "Bajo", joined: "2026-01-15", status: "pending" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Ensayo General", date: "2026-02-20", attendees: 48, status: "confirmed" },
    { id: 2, title: "Concierto Cuaresma", date: "2026-03-15", attendees: 45, status: "pending" },
    { id: 3, title: "Réquiem Mozart", date: "2026-03-22", attendees: 52, status: "confirmed" }
  ];

  const pendingTasks = [
    { id: 1, task: "Confirmar reserva sala ensayo - Marzo", priority: "high" },
    { id: 2, task: "Enviar partituras nuevas a sopranos", priority: "high" },
    { id: 3, task: "Revisar solicitudes nuevos miembros", priority: "medium" },
    { id: 4, task: "Actualizar calendario web", priority: "medium" },
    { id: 5, task: "Preparar boletín mensual", priority: "low" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Bienvenido/a, {user?.nombre || user?.email?.split("@")[0] || "Admin"}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
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
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "members"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Miembros
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "events"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "content"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Contenido
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Miembros</p>
                <p className="text-3xl text-gray-900">{stats.totalMembers}</p>
                <p className="text-xs text-green-600 mt-2">+4 este mes</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Miembros Activos</p>
                <p className="text-3xl text-gray-900">{stats.activeMembers}</p>
                <p className="text-xs text-gray-600 mt-2">92% del total</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Próximos Eventos</p>
                <p className="text-3xl text-gray-900">{stats.upcomingEvents}</p>
                <p className="text-xs text-gray-600 mt-2">3 meses</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Tareas Pendientes</p>
                <p className="text-3xl text-gray-900">{stats.pendingTasks}</p>
                <p className="text-xs text-red-600 mt-2">2 urgentes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl text-gray-900">Miembros Recientes</h2>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Ver todos
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.voice} • {member.joined}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {member.status === "active" ? "Activo" : "Pendiente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl text-gray-900">Próximos Eventos</h2>
                  <button className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    <Plus className="w-4 h-4" />
                    Nuevo
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('es-ES')} • {event.attendees} asistentes
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900">Tareas Pendientes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {pendingTasks.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-600" />
                        <span className="text-gray-900">{item.task}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        item.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : item.priority === "medium"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {item.priority === "high" ? "Urgente" : item.priority === "medium" ? "Media" : "Baja"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Gestión de Miembros</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-5 h-5" />
                Agregar Miembro
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-12">
                Panel de gestión de miembros en construcción...
              </p>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Gestión de Eventos</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-5 h-5" />
                Crear Evento
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-12">
                Panel de gestión de eventos en construcción...
              </p>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Gestión de Contenido</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-5 h-5" />
                Nueva Publicación
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center py-12">
                Panel de gestión de contenido en construcción...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
