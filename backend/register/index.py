"""Регистрация нового игрока на сервере МАТ&РЕШКА"""
import json
import os
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def send_confirm_email(to_email: str, username: str, token: str):
    smtp_email = os.environ.get("SMTP_EMAIL", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_email or not smtp_password:
        return  # почта не настроена — пропускаем

    site_url = "https://matreshka.poehali.dev"
    confirm_url = f"{site_url}/confirm?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Подтверждение регистрации на МАТ&РЕШКА"
    msg["From"] = smtp_email
    msg["To"] = to_email

    html = f"""
    <div style="background:#000;color:#fff;font-family:monospace;padding:40px;max-width:500px;margin:auto">
      <h1 style="color:#ef4444;font-size:28px;margin-bottom:8px">МАТ&amp;РЕШКА</h1>
      <p style="color:#9ca3af;margin-bottom:24px">Добро пожаловать, <b style="color:#fff">{username}</b>!</p>
      <p style="color:#d1d5db;margin-bottom:24px">Для завершения регистрации нажми на кнопку ниже:</p>
      <a href="{confirm_url}"
         style="display:inline-block;background:#ef4444;color:#fff;text-decoration:none;
                font-weight:bold;padding:14px 32px;font-size:16px;border:none">
        ✓ Подтвердить регистрацию
      </a>
      <p style="color:#6b7280;font-size:12px;margin-top:32px">
        Ссылка действует 24 часа. Если ты не регистрировался — просто проигнорируй это письмо.
      </p>
    </div>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    """Регистрация игрока: никнейм, email, 6-значный пароль"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    username = (body.get("username") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = str(body.get("password") or "").strip()

    # Валидация
    if not username or not email or not password:
        return {"statusCode": 400, "headers": headers,
                "body": json.dumps({"error": "Заполни все поля"})}

    if len(username) < 3 or len(username) > 32:
        return {"statusCode": 400, "headers": headers,
                "body": json.dumps({"error": "Никнейм: от 3 до 32 символов"})}

    if len(password) != 6 or not password.isdigit():
        return {"statusCode": 400, "headers": headers,
                "body": json.dumps({"error": "Пароль должен быть ровно 6 цифр"})}

    if "@" not in email:
        return {"statusCode": 400, "headers": headers,
                "body": json.dumps({"error": "Некорректный email"})}

    token = secrets.token_hex(32)
    password_hash = hash_password(password)

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, email, password_hash, confirm_token) VALUES (%s, %s, %s, %s)",
                (username, email, password_hash, token)
            )
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return {"statusCode": 409, "headers": headers,
                "body": json.dumps({"error": "Никнейм или email уже занят"})}
    finally:
        conn.close()

    send_confirm_email(email, username, token)

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True, "message": "Проверь почту и подтверди регистрацию!"}),
    }
