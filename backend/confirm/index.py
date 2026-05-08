"""Подтверждение email после регистрации на МАТ&РЕШКА"""
import json
import os
import psycopg2


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Подтверждение email по токену из письма"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    params = event.get("queryStringParameters") or {}
    token = params.get("token", "").strip()

    if not token:
        return {"statusCode": 400, "headers": headers,
                "body": json.dumps({"error": "Токен не указан"})}

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET is_confirmed=TRUE, confirm_token=NULL WHERE confirm_token=%s RETURNING username",
                (token,)
            )
            row = cur.fetchone()
        conn.commit()
    finally:
        conn.close()

    if not row:
        return {"statusCode": 404, "headers": headers,
                "body": json.dumps({"error": "Ссылка недействительна или уже использована"})}

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True, "username": row[0]}),
    }
