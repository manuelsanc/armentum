"""Initial schema with all tables

Revision ID: 001
Revises: 
Create Date: 2024-01-15 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('nombre', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('email_verified', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'])

    # Create roles table
    op.create_table(
        'roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('nombre', sa.String(100), unique=True, nullable=False),
        sa.Column('descripcion', sa.Text()),
        sa.Column('permisos', sa.JSON(), default={}),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )

    # Create users_roles junction table
    op.create_table(
        'users_roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('roles.id', ondelete='CASCADE'), nullable=False),
    )
    op.create_index('ix_users_roles_user_id', 'users_roles', ['user_id'])
    op.create_index('ix_users_roles_role_id', 'users_roles', ['role_id'])

    # Create miembros table
    op.create_table(
        'miembros',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('voz', sa.String(50), nullable=False),
        sa.Column('fecha_ingreso', sa.Date(), nullable=False),
        sa.Column('estado', sa.String(50), default='activo'),
        sa.Column('telefono', sa.String(20)),
        sa.Column('saldo_actual', sa.Numeric(10, 2), default=0),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_miembros_user_id', 'miembros', ['user_id'])
    op.create_index('ix_miembros_estado', 'miembros', ['estado'])

    # Create eventos_publicos table
    op.create_table(
        'eventos_publicos',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('nombre', sa.String(255), nullable=False),
        sa.Column('descripcion', sa.Text()),
        sa.Column('fecha', sa.Date(), nullable=False),
        sa.Column('hora', sa.String(10), nullable=False),
        sa.Column('lugar', sa.String(255), nullable=False),
        sa.Column('tipo', sa.String(50), nullable=False),
        sa.Column('estado', sa.String(50), default='planificado'),
        sa.Column('imagen_url', sa.String(255)),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_eventos_publicos_fecha', 'eventos_publicos', ['fecha'])
    op.create_index('ix_eventos_publicos_estado', 'eventos_publicos', ['estado'])
    op.create_index('ix_eventos_publicos_created_by', 'eventos_publicos', ['created_by'])

    # Create ensayos table
    op.create_table(
        'ensayos',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tipo', sa.String(50), nullable=False),
        sa.Column('nombre', sa.String(255)),
        sa.Column('fecha', sa.Date(), nullable=False),
        sa.Column('hora', sa.String(10), nullable=False),
        sa.Column('lugar', sa.String(255), nullable=False),
        sa.Column('cuerdas', sa.String(255)),
        sa.Column('descripcion', sa.Text()),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_ensayos_fecha', 'ensayos', ['fecha'])
    op.create_index('ix_ensayos_created_by', 'ensayos', ['created_by'])

    # Create asistencias table
    op.create_table(
        'asistencias',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('miembro_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('miembros.id', ondelete='CASCADE'), nullable=False),
        sa.Column('ensayo_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ensayos.id', ondelete='CASCADE'), nullable=False),
        sa.Column('presente', sa.Boolean(), default=True),
        sa.Column('justificacion', sa.Text()),
        sa.Column('registrado_por', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('registrado_en', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('ix_asistencias_miembro_id', 'asistencias', ['miembro_id'])
    op.create_index('ix_asistencias_ensayo_id', 'asistencias', ['ensayo_id'])
    op.create_index('ix_asistencias_registrado_por', 'asistencias', ['registrado_por'])
    op.create_unique_constraint('uq_asistencias_miembro_ensayo', 'asistencias', ['miembro_id', 'ensayo_id'])

    # Create cuotas table
    op.create_table(
        'cuotas',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('miembro_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('miembros.id', ondelete='CASCADE'), nullable=False),
        sa.Column('monto', sa.Numeric(10, 2), nullable=False),
        sa.Column('descripcion', sa.String(255)),
        sa.Column('tipo', sa.String(50), default='regular'),
        sa.Column('fecha_vencimiento', sa.Date(), nullable=False),
        sa.Column('estado', sa.String(50), default='pendiente'),
        sa.Column('fecha_pago', sa.Date()),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('ix_cuotas_miembro_id', 'cuotas', ['miembro_id'])
    op.create_index('ix_cuotas_estado', 'cuotas', ['estado'])
    op.create_index('ix_cuotas_fecha_vencimiento', 'cuotas', ['fecha_vencimiento'])
    op.create_index('ix_cuotas_created_by', 'cuotas', ['created_by'])

    # Create comunicados table
    op.create_table(
        'comunicados',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('titulo', sa.String(255), nullable=False),
        sa.Column('contenido', sa.Text(), nullable=False),
        sa.Column('dirigido_a', sa.String(50)),
        sa.Column('grupo_destino', sa.String(255)),
        sa.Column('miembro_destino', postgresql.UUID(as_uuid=True)),
        sa.Column('enviado_por', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('programado_para', sa.DateTime()),
        sa.Column('enviado_en', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('ix_comunicados_enviado_por', 'comunicados', ['enviado_por'])
    op.create_index('ix_comunicados_miembro_destino', 'comunicados', ['miembro_destino'])

    # Create archivos table
    op.create_table(
        'archivos',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('nombre', sa.String(255), nullable=False),
        sa.Column('tipo', sa.String(50), nullable=False),
        sa.Column('voz', sa.String(50)),
        sa.Column('evento_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('eventos_publicos.id')),
        sa.Column('ensayo_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ensayos.id')),
        sa.Column('url', sa.String(255), nullable=False),
        sa.Column('privado', sa.Boolean(), default=True),
        sa.Column('subido_por', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index('ix_archivos_evento_id', 'archivos', ['evento_id'])
    op.create_index('ix_archivos_ensayo_id', 'archivos', ['ensayo_id'])
    op.create_index('ix_archivos_subido_por', 'archivos', ['subido_por'])


def downgrade() -> None:
    op.drop_table('archivos')
    op.drop_table('comunicados')
    op.drop_table('cuotas')
    op.drop_table('asistencias')
    op.drop_table('ensayos')
    op.drop_table('eventos_publicos')
    op.drop_table('miembros')
    op.drop_table('users_roles')
    op.drop_table('roles')
    op.drop_table('users')
