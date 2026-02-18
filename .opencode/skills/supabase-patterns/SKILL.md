---
name: supabase-patterns
description: Patrones y convenciones de Supabase/PostgreSQL para el proyecto Armentum
license: MIT
---

# Supabase Patterns

## Configuración

```python
# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

## Environment Variables

```bash
# .env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Esquemas de Base de Datos

### Tabla de Usuarios

```sql
-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX ix_users_email ON users(email);
CREATE INDEX ix_users_created_at ON users(created_at DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Tabla de Relaciones

```sql
-- posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX ix_posts_user_id ON posts(user_id);
CREATE INDEX ix_posts_published ON posts(published) WHERE published = TRUE;
CREATE INDEX ix_posts_created_at ON posts(created_at DESC);

-- Full text search
CREATE INDEX ix_posts_content_search ON posts 
USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));
```

## Row Level Security (RLS)

### Habilitar RLS

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Políticas de Usuarios

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Users cannot delete themselves (handled by soft delete)
```

### Políticas de Posts

```sql
-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
ON posts FOR SELECT
USING (published = TRUE OR auth.uid() = user_id);

-- Users can create their own posts
CREATE POLICY "Users can create own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

## Migraciones Alembic

### Crear migración

```bash
# Generar migración
alembic revision --autogenerate -m "create posts table"

# Aplicar migraciones
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Ejemplo de Migración

```python
# alembic/versions/002_create_posts.py
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '002'
down_revision = '001'

def upgrade():
    op.create_table(
        'posts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('content', sa.Text),
        sa.Column('published', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    op.create_index('ix_posts_user_id', 'posts', ['user_id'])
    op.create_index('ix_posts_published', 'posts', ['published'], postgresql_where=sa.text('published = TRUE'))

def downgrade():
    op.drop_index('ix_posts_published')
    op.drop_index('ix_posts_user_id')
    op.drop_table('posts')
```

## Queries Comunes

### Con SQLAlchemy

```python
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.post import Post

# Get user with posts
def get_user_with_posts(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

# Get published posts with author
def get_published_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Post).join(User).filter(
        Post.published == True
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

# Search posts
from sqlalchemy import or_

def search_posts(db: Session, query: str):
    return db.query(Post).filter(
        or_(
            Post.title.ilike(f"%{query}%"),
            Post.content.ilike(f"%{query}%")
        )
    ).all()
```

### Con Supabase Client

```python
from supabase import create_client
from app.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

# Get user
def get_user(user_id: str):
    response = supabase.table('users').select('*').eq('id', user_id).execute()
    return response.data[0] if response.data else None

# Create post
def create_post(user_id: str, title: str, content: str):
    response = supabase.table('posts').insert({
        'user_id': user_id,
        'title': title,
        'content': content
    }).execute()
    return response.data[0]

# Search with filter
def get_user_posts(user_id: str):
    response = supabase.table('posts').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
    return response.data
```

## Functions y Triggers

### Function para estadísticas

```sql
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
    total_posts BIGINT,
    published_posts BIGINT,
    total_views BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_posts,
        COUNT(*) FILTER (WHERE published = TRUE) as published_posts,
        COALESCE(SUM(views), 0) as total_views
    FROM posts
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
```

### Trigger para notificaciones

```sql
CREATE OR REPLACE FUNCTION notify_new_post()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'new_post',
        json_build_object(
            'post_id', NEW.id,
            'user_id', NEW.user_id,
            'title', NEW.title
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_new_post_trigger
    AFTER INSERT ON posts
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_post();
```

## Checklist de Migración

- [ ] Crear migración con `alembic revision`
- [ ] Definir `upgrade()` y `downgrade()`
- [ ] Añadir índices necesarios
- [ ] Configurar RLS policies
- [ ] Probar rollback
- [ ] Documentar cambios
