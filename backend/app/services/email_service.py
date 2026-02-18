"""
Email Service
Supports SendGrid and Resend providers with development fallback
"""

import logging
from typing import Optional
from abc import ABC, abstractmethod

from app.config import settings

logger = logging.getLogger(__name__)


class EmailProvider(ABC):
    @abstractmethod
    async def send_email(self, to: str, subject: str, html_content: str) -> bool:
        pass


class SendGridProvider(EmailProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def send_email(self, to: str, subject: str, html_content: str) -> bool:
        try:
            import sendgrid
            from sendgrid.helpers.mail import Mail

            sg = sendgrid.SendGridAPIClient(api_key=self.api_key)
            message = Mail(
                from_email=settings.EMAIL_FROM,
                to_emails=to,
                subject=subject,
                html_content=html_content,
            )
            response = sg.send(message)
            return response.status_code in (200, 201, 202)
        except Exception as e:
            logger.error(f"SendGrid error: {e}")
            return False


class ResendProvider(EmailProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def send_email(self, to: str, subject: str, html_content: str) -> bool:
        try:
            import httpx

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": settings.EMAIL_FROM,
                        "to": [to],
                        "subject": subject,
                        "html": html_content,
                    },
                )
                return response.status_code in (200, 201, 202)
        except Exception as e:
            logger.error(f"Resend error: {e}")
            return False


class DevelopmentProvider(EmailProvider):
    async def send_email(self, to: str, subject: str, html_content: str) -> bool:
        logger.info(f"""
        ===== DEVELOPMENT EMAIL =====
        To: {to}
        From: {settings.EMAIL_FROM}
        Subject: {subject}
        ------------------------------
        {html_content[:500]}...
        ===== END EMAIL =====
        """)
        return True


class EmailService:
    def __init__(self):
        self.provider: EmailProvider = self._get_provider()

    def _get_provider(self) -> EmailProvider:
        provider_name = settings.EMAIL_PROVIDER.lower()

        if settings.ENVIRONMENT == "development" and not settings.DEBUG is False:
            logger.info("Using development email provider (emails will be logged)")
            return DevelopmentProvider()

        if provider_name == "sendgrid" and settings.SENDGRID_API_KEY:
            return SendGridProvider(settings.SENDGRID_API_KEY)

        if provider_name == "resend" and settings.RESEND_API_KEY:
            return ResendProvider(settings.RESEND_API_KEY)

        logger.warning("No email provider configured, using development mode")
        return DevelopmentProvider()

    async def send_verification_email(self, email: str, token: str) -> bool:
        verify_url = f"{settings.APP_URL}/verify-email?token={token}"
        subject = "Verifica tu cuenta - Armentum"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Bienvenido a Armentum</h2>
                <p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href="{verify_url}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verificar cuenta
                </a>
                <p>Este enlace expirará en 24 horas.</p>
                <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            </body>
        </html>
        """
        return await self.provider.send_email(email, subject, html_content)

    async def send_password_reset_email(self, email: str, token: str) -> bool:
        reset_url = f"{settings.APP_URL}/reset-password?token={token}"
        subject = "Restablecer contraseña - Armentum"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Restablecer tu contraseña</h2>
                <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                <a href="{reset_url}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Restablecer contraseña
                </a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            </body>
        </html>
        """
        return await self.provider.send_email(email, subject, html_content)

    async def send_notification_email(
        self, email: str, subject: str, body: str
    ) -> bool:
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                {body}
            </body>
        </html>
        """
        return await self.provider.send_email(email, subject, html_content)


email_service = EmailService()
