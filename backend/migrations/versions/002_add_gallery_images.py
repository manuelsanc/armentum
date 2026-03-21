"""Add gallery_images table

Revision ID: 002
Revises: 001
Create Date: 2026-03-20 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create gallery_images table
    op.create_table(
        'gallery_images',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('titulo', sa.String(255), nullable=False),
        sa.Column('descripcion', sa.Text()),
        sa.Column('fecha', sa.Date(), nullable=False),
        sa.Column('tags', postgresql.JSONB(), nullable=False, server_default='[]'),
        sa.Column('image_url', sa.String(500), nullable=False),
        sa.Column('thumbnail_url', sa.String(500), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # Create indexes for performance
    op.create_index('ix_gallery_images_titulo', 'gallery_images', ['titulo'])
    op.create_index('ix_gallery_images_fecha', 'gallery_images', ['fecha'])
    op.create_index('ix_gallery_images_created_by', 'gallery_images', ['created_by'])
    # GIN index for JSONB tags for fast array containment queries
    op.create_index('ix_gallery_images_tags', 'gallery_images', ['tags'], postgresql_using='gin')


def downgrade() -> None:
    op.drop_table('gallery_images')
