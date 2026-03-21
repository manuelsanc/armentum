"""
Image Service
Handles image processing, resizing, and optimization for gallery uploads
"""

import logging
from io import BytesIO
from datetime import datetime
from typing import Tuple, Optional
import uuid

from PIL import Image

from app.services.storage_service import storage_service

logger = logging.getLogger(__name__)

# Image processing constants
MAX_FULL_SIZE = 2000
THUMBNAIL_SIZE = 400
JPEG_QUALITY = 85
BUCKET_NAME = "images"  # Supabase public bucket name


class ImageService:
    """Service for processing and managing gallery images"""

    def __init__(self):
        self.storage = storage_service

    async def process_and_upload(
        self,
        file_content: bytes,
        original_filename: str
    ) -> Tuple[str, str]:
        """
        Process an image file and upload both full-size and thumbnail versions.

        Args:
            file_content: Raw image file bytes
            original_filename: Original filename (for extension detection)

        Returns:
            Tuple of (full_image_url, thumbnail_url)

        Raises:
            Exception: If image processing or upload fails
        """
        try:
            # Open and validate image
            image = Image.open(BytesIO(file_content))

            # Convert RGBA to RGB if necessary (for JPEG compatibility)
            if image.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode in ('RGBA', 'LA') else None)
                image = background

            # Generate unique filenames
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            base_filename = f"gallery/{timestamp}_{unique_id}"

            # Process full-size image (max 2000x2000)
            full_image = self._resize_image(image, MAX_FULL_SIZE)
            full_path = f"{base_filename}_full.jpg"
            full_bytes = self._image_to_bytes(full_image)

            # Process thumbnail (400x400)
            thumbnail = self._resize_image(image, THUMBNAIL_SIZE)
            thumb_path = f"{base_filename}_thumb.jpg"
            thumb_bytes = self._image_to_bytes(thumbnail)

            # Upload both images
            await self.storage.upload_file(
                BUCKET_NAME,
                full_path,
                full_bytes,
                content_type="image/jpeg"
            )

            await self.storage.upload_file(
                BUCKET_NAME,
                thumb_path,
                thumb_bytes,
                content_type="image/jpeg"
            )

            # Get public URLs
            full_url = await self.storage.get_public_url(BUCKET_NAME, full_path)
            thumb_url = await self.storage.get_public_url(BUCKET_NAME, thumb_path)

            logger.info(f"Successfully processed and uploaded image: {base_filename}")
            return (full_url, thumb_url)

        except Exception as e:
            logger.error(f"Image processing error: {e}")
            raise Exception(f"Failed to process image: {str(e)}")

    async def delete_images(self, image_url: str, thumbnail_url: str) -> bool:
        """
        Delete both full-size and thumbnail images from storage.

        Args:
            image_url: Full-size image URL
            thumbnail_url: Thumbnail image URL

        Returns:
            True if both deleted successfully

        Raises:
            Exception: If deletion fails
        """
        try:
            # Extract paths from URLs
            full_path = self._extract_path_from_url(image_url)
            thumb_path = self._extract_path_from_url(thumbnail_url)

            # Delete both files
            await self.storage.delete_file(BUCKET_NAME, full_path)
            await self.storage.delete_file(BUCKET_NAME, thumb_path)

            logger.info(f"Successfully deleted images: {full_path}, {thumb_path}")
            return True

        except Exception as e:
            logger.error(f"Image deletion error: {e}")
            raise Exception(f"Failed to delete images: {str(e)}")

    def _resize_image(self, image: Image.Image, max_size: int) -> Image.Image:
        """
        Resize image maintaining aspect ratio.

        Args:
            image: PIL Image object
            max_size: Maximum dimension (width or height)

        Returns:
            Resized PIL Image
        """
        # Calculate new dimensions maintaining aspect ratio
        width, height = image.size

        if width <= max_size and height <= max_size:
            return image

        if width > height:
            new_width = max_size
            new_height = int((max_size / width) * height)
        else:
            new_height = max_size
            new_width = int((max_size / height) * width)

        # Use LANCZOS for high-quality downsampling
        return image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    def _image_to_bytes(self, image: Image.Image) -> bytes:
        """
        Convert PIL Image to JPEG bytes.

        Args:
            image: PIL Image object

        Returns:
            JPEG image bytes
        """
        buffer = BytesIO()
        image.save(buffer, format='JPEG', quality=JPEG_QUALITY, optimize=True)
        return buffer.getvalue()

    def _extract_path_from_url(self, url: str) -> str:
        """
        Extract storage path from public URL.

        Args:
            url: Full public URL

        Returns:
            Storage path (e.g., 'gallery/20240320_abc123_full.jpg')
        """
        # URL format: https://{project}.supabase.co/storage/v1/object/public/images/gallery/...
        # We need to extract everything after 'images/'
        parts = url.split(f'/{BUCKET_NAME}/')
        if len(parts) == 2:
            return parts[1]

        # Fallback: try to extract just the filename part
        return url.split('/')[-1]


# Singleton instance
image_service = ImageService()
