import { useState } from "react"
import { Link } from "react-router-dom"

const REGISTER_URL = "https://functions.poehali.dev/64a54e1f-24c1-4001-b1ce-aeaf3319838f"
const ICON = "https://cdn.poehali.dev/projects/6c7f18c2-1697-4011-8624-e0870f54466d/bucket/b13d3327-364b-4e4f-82d3-af08555fca09.png"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Ошибка регистрации")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("Ошибка соединения с сервером")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      {/* Шапка */}
      <nav className="border-b border-gray-800 bg-gray-950/95 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={ICON} alt="" className="w-7 h-7 object-contain" style={{ filter: "invert(1)" }} />
            <span className="text-white font-bold text-lg">МАТ</span>
            <span className="text-red-400 font-bold text-lg">&</span>
            <span className="text-white font-bold text-lg">РЕШКА</span>
          </Link>
          <Link to="/connect" className="text-red-400 hover:text-red-300 text-sm font-bold transition-colors">
            🎮 Подключиться
          </Link>
        </div>
      </nav>

      {/* Контент */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {success ? (
            /* Успех */
            <div className="text-center">
              <img src={ICON} alt="" className="w-20 h-20 mx-auto mb-6 object-contain"
                style={{ filter: "invert(1) sepia(1) saturate(5) hue-rotate(310deg) drop-shadow(0 0 16px #ef4444)" }} />
              <div className="text-green-400 text-sm mb-3 tracking-widest">// регистрация принята</div>
              <h1 className="text-3xl font-bold mb-4">Почти готово!</h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Мы отправили письмо на <span className="text-white">{email}</span>.<br />
                Перейди по ссылке в письме чтобы подтвердить аккаунт.
              </p>
              <div className="bg-gray-950 border border-gray-800 p-4 text-left text-sm text-gray-500 mb-8">
                <div className="text-gray-600 text-xs mb-2">$ /register --status</div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Аккаунт создан: <span className="text-white">{username}</span></span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400 animate-pulse">▶</span>
                  <span>Ожидание подтверждения email...</span>
                </div>
              </div>
              <Link to="/" className="text-gray-500 hover:text-white transition-colors text-sm">
                ← На главную
              </Link>
            </div>
          ) : (
            /* Форма */
            <>
              <div className="text-center mb-10">
                <img src={ICON} alt="" className="w-16 h-16 mx-auto mb-4 object-contain"
                  style={{ filter: "invert(1) drop-shadow(0 0 8px rgba(239,68,68,0.4))" }} />
                <div className="text-red-400 text-sm mb-2 tracking-widest">// регистрация</div>
                <h1 className="text-3xl font-bold">Создать аккаунт</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Никнейм */}
                <div>
                  <label className="block text-gray-400 text-xs mb-2 tracking-widest uppercase">
                    Никнейм на сервере
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">$</span>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Steve"
                      maxLength={32}
                      required
                      className="w-full bg-gray-950 border border-gray-700 text-white pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600"
                    />
                  </div>
                  <div className="text-gray-600 text-xs mt-1">от 3 до 32 символов</div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-xs mb-2 tracking-widest uppercase">
                    Адрес электронной почты
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">@</span>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="player@example.com"
                      required
                      className="w-full bg-gray-950 border border-gray-700 text-white pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600"
                    />
                  </div>
                  <div className="text-gray-600 text-xs mt-1">на него придёт письмо подтверждения</div>
                </div>

                {/* Пароль */}
                <div>
                  <label className="block text-gray-400 text-xs mb-2 tracking-widest uppercase">
                    6-значный пароль
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">#</span>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••"
                      maxLength={6}
                      pattern="\d{6}"
                      required
                      className="w-full bg-gray-950 border border-gray-700 text-white pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600 tracking-widest"
                    />
                  </div>
                  <div className="text-gray-600 text-xs mt-1">только цифры, ровно 6 знаков · введено: {password.length}/6</div>
                </div>

                {/* Ошибка */}
                {error && (
                  <div className="border border-red-800 bg-red-950/30 p-3 text-red-400 text-sm flex items-center gap-2">
                    <span>✗</span> {error}
                  </div>
                )}

                {/* Кнопка */}
                <button
                  type="submit"
                  disabled={loading || password.length !== 6}
                  className="w-full bg-red-500 hover:bg-red-400 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 text-base transition-all duration-200 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">◌</span>
                      <span>Регистрируем...</span>
                    </>
                  ) : (
                    <span>Зарегистрироваться →</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-8 text-gray-600 text-sm">
                Уже есть аккаунт?{" "}
                <Link to="/connect" className="text-red-400 hover:text-red-300 transition-colors">
                  Подключиться к серверу
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
