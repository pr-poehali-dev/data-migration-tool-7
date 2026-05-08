import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

const CONFIRM_URL = "https://functions.poehali.dev/7ea88830-94d9-44b8-9e18-699e06a65996"
const ICON = "https://cdn.poehali.dev/projects/6c7f18c2-1697-4011-8624-e0870f54466d/bucket/b13d3327-364b-4e4f-82d3-af08555fca09.png"

export default function Confirm() {
  const [params] = useSearchParams()
  const token = params.get("token") || ""
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [username, setUsername] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!token) { setStatus("error"); setErrorMsg("Ссылка недействительна"); return }
    fetch(`${CONFIRM_URL}?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) { setUsername(data.username); setStatus("ok") }
        else { setErrorMsg(data.error || "Ошибка"); setStatus("error") }
      })
      .catch(() => { setErrorMsg("Ошибка соединения"); setStatus("error") })
  }, [token])

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center px-6">
      <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
        <img src={ICON} alt="" className="w-8 h-8 object-contain" style={{ filter: "invert(1)" }} />
        <span className="text-white font-bold text-xl">МАТ</span>
        <span className="text-red-400 font-bold text-xl">&</span>
        <span className="text-white font-bold text-xl">РЕШКА</span>
      </Link>

      {status === "loading" && (
        <div className="text-center">
          <img src={ICON} alt="" className="w-16 h-16 mx-auto mb-6 object-contain animate-pulse"
            style={{ filter: "invert(1)" }} />
          <div className="text-gray-400">Проверяем ссылку...</div>
        </div>
      )}

      {status === "ok" && (
        <div className="text-center">
          <img src={ICON} alt="" className="w-20 h-20 mx-auto mb-6 object-contain"
            style={{ filter: "invert(1) sepia(1) saturate(5) hue-rotate(310deg) drop-shadow(0 0 20px #ef4444)" }} />
          <div className="text-green-400 text-sm mb-3 tracking-widest">// подтверждено</div>
          <h1 className="text-3xl font-bold mb-4">Добро пожаловать!</h1>
          <p className="text-gray-400 mb-2">Аккаунт <span className="text-white font-bold">{username}</span> успешно активирован.</p>
          <p className="text-gray-500 text-sm mb-10">Теперь можешь заходить на сервер!</p>
          <Link
            to="/connect"
            className="inline-block bg-red-500 hover:bg-red-400 text-white font-bold px-10 py-4 transition-all duration-200"
          >
            🎮 Подключиться к серверу
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <img src={ICON} alt="" className="w-16 h-16 mx-auto mb-6 object-contain opacity-40"
            style={{ filter: "invert(1)" }} />
          <div className="text-red-400 text-sm mb-3 tracking-widest">// ошибка</div>
          <h1 className="text-2xl font-bold mb-4">{errorMsg}</h1>
          <p className="text-gray-500 text-sm mb-8">Попробуй зарегистрироваться заново.</p>
          <Link to="/register" className="text-red-400 hover:text-red-300 transition-colors">
            ← Регистрация
          </Link>
        </div>
      )}
    </div>
  )
}
