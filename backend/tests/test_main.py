"""
Tests for main.py endpoints
"""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Tests for the /health endpoint."""

    def test_health_check_returns_ok(self, client):
        """Test that health check returns status ok."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"

    def test_health_check_returns_environment(self, client):
        """Test that health check returns environment info."""
        response = client.get("/health")
        data = response.json()
        assert "environment" in data

    def test_health_check_returns_version(self, client):
        """Test that health check returns version info."""
        response = client.get("/health")
        data = response.json()
        assert "version" in data
        assert data["version"] == "1.0.0"


class TestRootEndpoint:
    """Tests for the / root endpoint."""

    def test_root_returns_api_name(self, client):
        """Test that root returns API name."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Armentum API"

    def test_root_returns_description(self, client):
        """Test that root returns API description."""
        response = client.get("/")
        data = response.json()
        assert "description" in data
        assert "Estudio Coral" in data["description"]

    def test_root_returns_version(self, client):
        """Test that root returns API version."""
        response = client.get("/")
        data = response.json()
        assert data["version"] == "1.0.0"

    def test_root_returns_docs_url(self, client):
        """Test that root returns docs URL."""
        response = client.get("/")
        data = response.json()
        assert data["docs"] == "/docs"

    def test_root_returns_health_url(self, client):
        """Test that root returns health URL."""
        response = client.get("/")
        data = response.json()
        assert data["health"] == "/health"


class TestOpenAPI:
    """Tests for OpenAPI documentation."""

    def test_docs_endpoint_accessible(self, client):
        """Test that /docs endpoint is accessible."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_redoc_endpoint_accessible(self, client):
        """Test that /redoc endpoint is accessible."""
        response = client.get("/redoc")
        assert response.status_code == 200

    def test_openapi_json_accessible(self, client):
        """Test that OpenAPI JSON schema is accessible."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert data["info"]["title"] == "Armentum API"
