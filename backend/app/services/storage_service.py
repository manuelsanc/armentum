"""
Storage Service
Handles Supabase Storage operations for files and media
"""

import logging
from typing import Optional
from datetime import datetime

from app.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    def __init__(self):
        self._client = None
        self._supabase_url = settings.SUPABASE_URL
        self._supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY

    @property
    def client(self):
        if self._client is None:
            try:
                from supabase import create_client

                self._client = create_client(
                    self._supabase_url, self._supabase_key
                )
            except ImportError:
                logger.warning("Supabase client not installed")
                raise RuntimeError("supabase package not installed")
            except Exception as e:
                logger.error(f"Failed to create Supabase client: {e}")
                raise
        return self._client

    async def upload_file(
        self,
        bucket: str,
        path: str,
        file: bytes,
        content_type: Optional[str] = None,
    ) -> str:
        try:
            options = {}
            if content_type:
                options["content-type"] = content_type

            response = self.client.storage.from_(bucket).upload(
                path, file, file_options=options
            )

            if hasattr(response, "error") and response.error:
                raise Exception(response.error)

            return path
        except Exception as e:
            logger.error(f"Upload error: {e}")
            raise

    async def delete_file(self, bucket: str, path: str) -> bool:
        try:
            response = self.client.storage.from_(bucket).remove([path])

            if hasattr(response, "error") and response.error:
                raise Exception(response.error)

            return True
        except Exception as e:
            logger.error(f"Delete error: {e}")
            raise

    async def get_signed_url(
        self, bucket: str, path: str, expires_in: int = 3600
    ) -> str:
        try:
            response = self.client.storage.from_(bucket).create_signed_url(
                path, expires_in
            )

            if hasattr(response, "error") and response.error:
                raise Exception(response.error)

            return response.get("signedURL", response) if isinstance(response, dict) else response
        except Exception as e:
            logger.error(f"Signed URL error: {e}")
            raise

    async def list_files(self, bucket: str, folder: str = "") -> list:
        try:
            response = self.client.storage.from_(bucket).list(folder)

            if hasattr(response, "error") and response.error:
                raise Exception(response.error)

            return response if isinstance(response, list) else []
        except Exception as e:
            logger.error(f"List files error: {e}")
            raise

    async def get_public_url(self, bucket: str, path: str) -> str:
        try:
            response = self.client.storage.from_(bucket).get_public_url(path)
            return response
        except Exception as e:
            logger.error(f"Public URL error: {e}")
            raise

    async def file_exists(self, bucket: str, path: str) -> bool:
        try:
            files = await self.list_files(bucket, "/".join(path.split("/")[:-1]))
            filename = path.split("/")[-1]
            return any(f.get("name") == filename for f in files)
        except Exception:
            return False


storage_service = StorageService()
