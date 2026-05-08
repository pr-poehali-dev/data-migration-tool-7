"""Получение онлайна игроков на Minecraft сервере МАТ&РЕШКА в реальном времени"""
import json
import socket
import struct
import os
import psycopg2


def ping_minecraft(host: str, port: int = 25565, timeout: float = 3.0) -> dict:
    """Пингует Minecraft-сервер и возвращает онлайн игроков"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        sock.connect((host, port))

        # Handshake пакет
        def pack_varint(val):
            out = b""
            while True:
                b = val & 0x7F
                val >>= 7
                if val:
                    b |= 0x80
                out += bytes([b])
                if not val:
                    break
            return out

        host_bytes = host.encode("utf-8")
        data = (
            b"\x00"                          # packet id
            + b"\x00"                        # protocol version (0 = status)
            + pack_varint(len(host_bytes))
            + host_bytes
            + struct.pack(">H", port)
            + b"\x01"                        # next state: status
        )
        length = pack_varint(len(data))
        sock.send(length + data)
        sock.send(b"\x01\x00")  # status request

        # Читаем ответ
        def read_varint(s):
            n = 0
            for i in range(5):
                b = s.recv(1)[0]
                n |= (b & 0x7F) << (7 * i)
                if not (b & 0x80):
                    break
            return n

        read_varint(sock)   # packet length
        read_varint(sock)   # packet id
        str_len = read_varint(sock)
        raw = b""
        while len(raw) < str_len:
            chunk = sock.recv(str_len - len(raw))
            if not chunk:
                break
            raw += chunk
        sock.close()

        info = json.loads(raw.decode("utf-8"))
        players = info.get("players", {})
        return {
            "online": players.get("online", 0),
            "max": players.get("max", 0),
            "motd": info.get("description", {}).get("text", "") if isinstance(info.get("description"), dict) else str(info.get("description", "")),
            "reachable": True,
        }
    except Exception:
        return {"online": 0, "max": 0, "motd": "", "reachable": False}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Возвращает текущий онлайн игроков на сервере matreshka.hypixel.ws"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    result = ping_minecraft("matreshka.hypixel.ws", 25565)

    # Обновляем статистику в БД
    if result["reachable"]:
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE server_stats
                    SET online_count=%s,
                        max_online=GREATEST(max_online, %s),
                        updated_at=NOW()
                    WHERE id=1
                """, (result["online"], result["online"]))
            conn.commit()
        finally:
            conn.close()

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(result),
    }
