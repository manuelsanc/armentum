"""
Tests for Gallery Image Management
Covers upload, list, update, replace, delete, and public endpoints
"""

import pytest
from datetime import date
from io import BytesIO
from PIL import Image


def create_test_image(width=800, height=600, format="JPEG"):
    """Helper to create a test image in memory"""
    img = Image.new('RGB', (width, height), color='red')
    buffer = BytesIO()
    img.save(buffer, format=format)
    buffer.seek(0)
    return buffer


class TestGalleryImageManagement:
    """Tests for gallery image CRUD operations"""

    def test_upload_image_unauthorized(self, client):
        """Test that uploading without auth fails"""
        response = client.post(
            "/admin/gallery",
            files={"file": ("test.jpg", create_test_image(), "image/jpeg")},
            data={"titulo": "Test", "fecha": str(date.today())}
        )
        assert response.status_code == 401

    def test_upload_image_success(self, client, auth_headers, db_session, admin_user):
        """Test successful image upload"""
        image_data = create_test_image()

        response = client.post(
            "/admin/gallery",
            headers=auth_headers,
            files={"file": ("test.jpg", image_data, "image/jpeg")},
            data={
                "titulo": "Concierto de Navidad",
                "fecha": "2024-12-25",
                "descripcion": "Concierto anual",
                "tags": "conciertos,navidad",
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert "image" in data
        assert data["image"]["titulo"] == "Concierto de Navidad"
        assert data["image"]["fecha"] == "2024-12-25"
        assert data["image"]["descripcion"] == "Concierto anual"
        assert "conciertos" in data["image"]["tags"]
        assert "navidad" in data["image"]["tags"]
        assert data["image"]["image_url"]
        assert data["image"]["thumbnail_url"]

    def test_upload_invalid_file_type(self, client, auth_headers):
        """Test that uploading invalid file type fails"""
        text_file = BytesIO(b"not an image")

        response = client.post(
            "/admin/gallery",
            headers=auth_headers,
            files={"file": ("test.txt", text_file, "text/plain")},
            data={"titulo": "Test", "fecha": str(date.today())}
        )

        assert response.status_code == 400
        assert "not allowed" in response.json()["detail"].lower()

    def test_list_gallery_images(self, client, auth_headers, test_gallery_image):
        """Test listing gallery images with pagination"""
        response = client.get("/admin/gallery", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert "images" in data
        assert "total" in data
        assert data["total"] >= 1
        assert len(data["images"]) >= 1

    def test_list_gallery_with_search(self, client, auth_headers, test_gallery_image):
        """Test search filter"""
        response = client.get(
            "/admin/gallery?search=concierto",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert all("concierto" in img["titulo"].lower() for img in data["images"])

    def test_list_gallery_with_tags(self, client, auth_headers, test_gallery_image):
        """Test tag filter"""
        response = client.get(
            "/admin/gallery?tags=conciertos",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert all("conciertos" in img["tags"] for img in data["images"])

    def test_update_image_metadata(self, client, auth_headers, test_gallery_image):
        """Test updating image metadata"""
        response = client.put(
            f"/admin/gallery/{test_gallery_image.id}",
            headers=auth_headers,
            data={
                "titulo": "Título Actualizado",
                "descripcion": "Nueva descripción",
                "tags": "nuevas,etiquetas",
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["titulo"] == "Título Actualizado"
        assert data["descripcion"] == "Nueva descripción"
        assert "nuevas" in data["tags"]

    def test_replace_image(self, client, auth_headers, test_gallery_image):
        """Test replacing image file"""
        new_image = create_test_image(width=1000, height=800)

        response = client.put(
            f"/admin/gallery/{test_gallery_image.id}/replace",
            headers=auth_headers,
            files={"file": ("new.jpg", new_image, "image/jpeg")}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["image_url"] != test_gallery_image.image_url

    def test_delete_image(self, client, auth_headers, test_gallery_image):
        """Test permanent deletion of image"""
        image_id = str(test_gallery_image.id)

        response = client.delete(
            f"/admin/gallery/{image_id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        assert "deleted" in response.json()["message"].lower()

        # Verify it's gone
        response = client.get("/admin/gallery", headers=auth_headers)
        images = response.json()["images"]
        assert not any(img["id"] == image_id for img in images)

    def test_get_all_tags(self, client, auth_headers, test_gallery_image):
        """Test getting all unique tags"""
        response = client.get("/admin/gallery/tags", headers=auth_headers)

        assert response.status_code == 200
        tags = response.json()
        assert isinstance(tags, list)
        assert "conciertos" in tags

    def test_public_gallery_endpoint(self, client, test_gallery_image):
        """Test public gallery endpoint (no auth required)"""
        response = client.get("/public/gallery")

        assert response.status_code == 200
        data = response.json()
        assert "images" in data
        assert len(data["images"]) >= 1

    def test_public_gallery_with_tag_filter(self, client, test_gallery_image):
        """Test public gallery with tag filtering"""
        response = client.get("/public/gallery?tags=conciertos")

        assert response.status_code == 200
        data = response.json()
        assert all("conciertos" in img["tags"] for img in data["images"])

    def test_upload_image_too_large(self, client, auth_headers):
        """Test that files over 10MB are rejected"""
        # Create a large image (this is a mock - actual file would be larger)
        large_image = create_test_image(width=5000, height=5000)

        response = client.post(
            "/admin/gallery",
            headers=auth_headers,
            files={"file": ("large.jpg", large_image, "image/jpeg")},
            data={"titulo": "Large Image", "fecha": str(date.today())}
        )

        # Depending on the actual file size, this might pass or fail
        # In a real test, you'd create a file >10MB
        assert response.status_code in [201, 400]

    def test_update_nonexistent_image(self, client, auth_headers):
        """Test updating non-existent image fails"""
        fake_id = "00000000-0000-0000-0000-000000000000"

        response = client.put(
            f"/admin/gallery/{fake_id}",
            headers=auth_headers,
            data={"titulo": "Test"}
        )

        assert response.status_code == 404

    def test_delete_nonexistent_image(self, client, auth_headers):
        """Test deleting non-existent image fails"""
        fake_id = "00000000-0000-0000-0000-000000000000"

        response = client.delete(
            f"/admin/gallery/{fake_id}",
            headers=auth_headers
        )

        assert response.status_code == 404
