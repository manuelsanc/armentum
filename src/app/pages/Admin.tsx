import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Users, Calendar, FileText, LogOut, TrendingUp, Bell } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { AdminMembers } from "../components/admin/AdminMembers";
import { AdminEvents } from "../components/admin/AdminEvents";
import { AdminRehearsals } from "../components/admin/AdminRehearsals";
import { AdminAttendance } from "../components/admin/AdminAttendance";
import { AdminFinance } from "../components/admin/AdminFinance";

type TabType = "overview" | "members" | "events" | "rehearsals" | "attendance" | "finance";

export function Admin(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

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
    pendingTasks: 5,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">
                Bienvenido/a, {user?.nombre || user?.email?.split("@")[0] || "Admin"}
              </p>
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
          <nav className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "members"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Miembros
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "events"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab("rehearsals")}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "rehearsals"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Ensayos
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "attendance"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Asistencias
            </button>
            <button
              onClick={() => setActiveTab("finance")}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "finance"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Finanzas
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

            <p className="text-center text-gray-500 py-8">
              Bienvenido al panel de administración. Selecciona una sección en los tabs superiores.
            </p>
          </div>
        )}

        {activeTab === "members" && <AdminMembers />}
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "rehearsals" && <AdminRehearsals />}
        {activeTab === "attendance" && <AdminAttendance />}
        {activeTab === "finance" && <AdminFinance />}
      </div>
    </div>
  );
}
