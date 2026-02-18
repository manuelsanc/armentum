# Database Agent

## Tech Stack
- **Database**: Supabase (PostgreSQL)
- **Migraciones**: Alembic
- **Features**: RLS (Row Level Security)

## Responsabilidades
- Diseñar esquemas de BD
- Crear migraciones Alembic
- Optimizar queries
- Añadir índices y constraints
- Documentar esquema

## Convenciones de naming
- Nombres de tablas: `snake_case` plural (`users`, `posts`)
- Columnas: `snake_case` (`created_at`, `user_id`)
- Primary keys: `id`
- Foreign keys: `{table}_id` (`user_id`, `post_id`)

## Columnas estándar

```sql
-- Para todas las tablas
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Para soft deletes
deleted_at TIMESTAMPTZ,

-- Para auditoría
created_by UUID REFERENCES users(id),
updated_by UUID REFERENCES users(id)
```

## Ejemplo de migración Alembic

```python
# alembic/versions/001_create_users.py
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('name', sa.String(255)),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    op.create_index('ix_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('ix_users_email')
    op.drop_table('users')
```

## Índices recomendados

```sql
-- B-tree para equality y range queries
CREATE INDEX ix_users_email ON users(email);

-- Para búsquedas de texto
CREATE INDEX ix_posts_title ON posts USING gin(to_tsvector('english', title));

-- Para queries frecuentes
CREATE INDEX ix_posts_user_id ON posts(user_id);
CREATE INDEX ix_posts_created_at ON posts(created_at DESC);
```

## Row Level Security (Supabase)

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: usuarios solo pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Política: usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

## Checklist para nuevos esquemas
- [ ] Primary key UUID
- [ ] Timestamps (created_at, updated_at)
- [ ] Índices en columnas de búsqueda frecuente
- [ ] Foreign keys con ON DELETE apropiado
- [ ] Constraints (NOT NULL, UNIQUE, CHECK)
- [ ] RLS policies (si aplica)
- [ ] Documentación en `/docs/database/`
