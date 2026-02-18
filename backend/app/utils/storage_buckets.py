"""
Storage Bucket Configuration
Constants and helpers for Supabase Storage buckets
"""

import logging
from typing import List

logger = logging.getLogger(__name__)

BUCKET_PARTITURAS = "partituras"
BUCKET_GRABACIONES = "grabaciones"
BUCKET_IMAGES = "images"
BUCKET_DOCUMENTS = "documents"

ALL_BUCKETS = [
    BUCKET_PARTITURAS,
    BUCKET_GRABACIONES,
    BUCKET_IMAGES,
    BUCKET_DOCUMENTS,
]

BUCKET_CONFIGS = {
    BUCKET_PARTITURAS: {
        "public": False,
        "allowed_mime_types": [
            "application/pdf",
            "application/vnd.recordare.musicxml",
            "application/vnd.recordare.musicxml+xml",
            "text/xml",
        ],
        "max_size_mb": 50,
    },
    BUCKET_GRABACIONES: {
        "public": False,
        "allowed_mime_types": [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/x-wav",
            "audio/m4a",
            "audio/mp4",
        ],
        "max_size_mb": 500,
    },
    BUCKET_IMAGES: {
        "public": True,
        "allowed_mime_types": [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ],
        "max_size_mb": 10,
    },
    BUCKET_DOCUMENTS: {
        "public": False,
        "allowed_mime_types": [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ],
        "max_size_mb": 20,
    },
}


async def ensure_buckets_exist(supabase_client) -> List[str]:
    """
    Ensure all required buckets exist in Supabase Storage.
    Returns list of created bucket names.
    
    This should be called by an admin during setup.
    """
    created = []

    for bucket_name in ALL_BUCKETS:
        try:
            existing = supabase_client.storage.list_buckets()
            bucket_names = [b.name for b in existing]

            if bucket_name not in bucket_names:
                config = BUCKET_CONFIGS.get(bucket_name, {})
                supabase_client.storage.create_bucket(
                    id=bucket_name,
                    name=bucket_name,
                    public=config.get("public", False),
                )
                created.append(bucket_name)
                logger.info(f"Created bucket: {bucket_name}")
            else:
                logger.debug(f"Bucket already exists: {bucket_name}")

        except Exception as e:
            logger.error(f"Error creating bucket {bucket_name}: {e}")

    return created


def get_bucket_config(bucket_name: str) -> dict:
    """Get configuration for a specific bucket."""
    return BUCKET_CONFIGS.get(bucket_name, {})


def is_allowed_mime_type(bucket_name: str, mime_type: str) -> bool:
    """Check if a MIME type is allowed for a bucket."""
    config = get_bucket_config(bucket_name)
    allowed = config.get("allowed_mime_types", [])
    return mime_type in allowed if allowed else True


def get_max_file_size_mb(bucket_name: str) -> int:
    """Get maximum file size in MB for a bucket."""
    config = get_bucket_config(bucket_name)
    return config.get("max_size_mb", 10)
