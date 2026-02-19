export type UserRole = "admin" | "corista" | "public";

export interface User {
  id: string;
  email: string;
  nombre?: string;
  userType: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre?: string;
}

export interface Event {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
  tipo: string;
  estado: string;
  imagen_url?: string;
  // Campos alternativos por compatibilidad
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  capacity?: number;
}

export interface News {
  id: string;
  titulo: string;
  contenido: string;
  created_at: string;
  autor?: string;
  // Campos alternativos por compatibilidad
  title?: string;
  content?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
  status: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// ============ Corista Zone Types ============

// Rehearsals (Ensayos)
export interface Rehearsal {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha: string; // ISO date
  horaInicio: string;
  horaFin?: string;
  lugar: string;
  estado: "scheduled" | "completed" | "cancelled";
  asistentes?: number;
  createdAt: string;
  updatedAt: string;
}

// Attendance (Asistencias)
export interface Attendance {
  id: string;
  userId: string;
  rehearsalId: string;
  presente: boolean;
  justificacion?: string;
  rehearsal?: Rehearsal;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  totalRehearsals: number;
  attended: number;
  absent: number;
  justified: number;
  percentage: number; // Porcentaje de asistencia
}

// Finance (Finanzas)
export interface Cuota {
  id: string;
  userId: string;
  monto: number;
  descripcion: string;
  vencimiento: string; // ISO date
  estado: "pendiente" | "pagada" | "vencida";
  createdAt: string;
  updatedAt: string;
}

export interface FinanceHistory {
  id: string;
  userId: string;
  cuotaId: string;
  monto: number;
  fechaPago: string; // ISO date
  metodoPago: string;
  referencia?: string;
  cuota?: Cuota;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceSummary {
  totalPendiente: number;
  totalPagado: number;
  totalVencido: number;
  cuotasPendientes: Cuota[];
  historialPagos: FinanceHistory[];
}

// Member Profile (Perfil de Corista)
export interface MemberProfile extends User {
  numeroAfiliacion?: string;
  telefonoContacto?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  voz?: string; // Soprano, Alto, Tenor, Bajo
  fechaIngreso?: string;
  fecha_ingreso?: string;
  fotoPerfil?: string;
  estado?: string;
  activo?: boolean;
  telefono?: string;
  saldo_actual?: number;
}
