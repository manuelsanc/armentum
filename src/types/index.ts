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
  miembro_id?: string;
  ensayo_id?: string;
  rehearsalId?: string;
  presente: boolean;
  justificacion?: string;
  ensayo_nombre?: string;
  ensayo_fecha?: string;
  rehearsal?: Rehearsal;
  registrado_en?: string;
  createdAt?: string;
  updatedAt?: string;
  // Admin attendance fields
  userId?: string;
  nombre?: string;
  voz?: string;
}

export interface AttendanceStats {
  total_ensayos?: number;
  totalRehearsals?: number;
  asistencias?: number;
  attended?: number;
  inasistencias?: number;
  absent?: number;
  justified?: number;
  porcentaje?: number;
  percentage?: number; // Porcentaje de asistencia
}

// Finance (Finanzas)
export interface Cuota {
  id: string;
  miembro_id: string;
  monto: number;
  descripcion: string;
  tipo: string;
  fecha_vencimiento: string; // ISO date from API
  vencimiento?: string; // ISO date (alternative)
  estado: "pendiente" | "pagada" | "vencida";
  fecha_pago?: string | null;
  created_at?: string;
  // Legacy fields for compatibility
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceHistory {
  id: string;
  miembro_id: string;
  monto: number;
  descripcion?: string;
  tipo?: string;
  fecha_vencimiento?: string;
  fecha_pago?: string;
  estado?: string;
  // Legacy fields
  userId?: string;
  cuotaId?: string;
  fechaPago?: string;
  metodoPago?: string;
  referencia?: string;
  cuota?: Cuota;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinanceSummary {
  totalIngresos: number;
  totalPendiente: number;
  totalVencido: number;
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
