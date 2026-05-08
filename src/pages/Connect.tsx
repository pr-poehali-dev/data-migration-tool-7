import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Link } from "react-router-dom"

const SERVER_IP = "matreshka.hypixel.ws"

export default function Connect() {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm p-4 relative z-10 sticky top-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <div className="w-3 h-3 bg-yellow-500"></div>
                <div className="w-3 h-3 bg-green-500"></div>
              </div>
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white font-bold text-lg">МАТ</span>
                <span className="text-red-400 font-bold text-lg">&</span>
                <span className="text-white font-bold text-lg">РЕШКА</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 ml-8">
              <Link to="/#features" className="text-gray-400 hover:text-white transition-colors relative group">
                <span>О сервере</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link to="/#modes" className="text-gray-400 hover:text-white transition-colors relative group">
                <span>Режимы игры</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link to="/connect" className="text-white transition-colors relative group">
                <span>Подключиться</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400"></div>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>онлайн</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="px-6 py-20 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-red-400 font-mono text-sm mb-4">// как подключиться</div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Адрес сервера
            </h1>
            <p className="text-gray-400 text-lg">Скопируй IP и вставь в Minecraft → Мультиплеер → Добавить сервер</p>
          </div>

          {/* Big IP Block */}
          <div
            className="group relative cursor-pointer mb-12"
            onClick={() => copyToClipboard(SERVER_IP, "main-ip")}
          >
            <div className="absolute inset-0 border-2 border-red-600 bg-red-900/10 transition-all duration-300 group-hover:border-red-400 group-hover:shadow-2xl group-hover:shadow-red-500/30 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
            <div className="relative border-2 border-red-500 bg-gray-950 p-8 lg:p-12 text-center transition-all duration-300">
              <div className="text-gray-500 text-sm mb-4">$ /connect --server</div>
              <div className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-widest break-all">
                {SERVER_IP}
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                {copiedStates["main-ip"] ? (
                  <>
                    <Check className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-bold">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-6 h-6 text-red-400" />
                    <span className="text-red-400 font-bold">Нажми, чтобы скопировать</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step by step */}
          <div className="bg-gray-950 border border-gray-800 mb-12">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-900 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <div className="w-3 h-3 bg-yellow-500"></div>
                <div className="w-3 h-3 bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">/guide --connect step-by-step</span>
            </div>

            <div className="p-6 bg-black space-y-6">
              {[
                {
                  step: "01",
                  title: "Открой Minecraft",
                  desc: "Запусти лаунчер и зайди в игру",
                  cmd: "minecraft --launch",
                },
                {
                  step: "02",
                  title: "Мультиплеер",
                  desc: "Выбери «Сетевая игра» / «Мультиплеер» в главном меню",
                  cmd: "/menu multiplayer",
                },
                {
                  step: "03",
                  title: "Добавить сервер",
                  desc: "Нажми «Добавить сервер» и вставь адрес",
                  cmd: `/server add ${SERVER_IP}`,
                },
                {
                  step: "04",
                  title: "Подключиться",
                  desc: "Выбери МАТ&РЕШКА в списке и нажми «Войти»",
                  cmd: "/connect --join",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 flex-shrink-0 bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                    <span className="text-xs font-mono text-gray-400">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold mb-1">{item.title}</div>
                    <div className="text-gray-400 text-sm mb-2">{item.desc}</div>
                    <div
                      className="bg-gray-900 border border-gray-800 px-3 py-1.5 text-xs font-mono text-gray-500 inline-flex items-center gap-2 cursor-pointer hover:border-gray-600 hover:text-gray-300 transition-all"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(item.cmd, `step-${item.step}`) }}
                    >
                      <span className="text-red-400">$</span>
                      <span>{item.cmd}</span>
                      {copiedStates[`step-${item.step}`] ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Версия", value: "Java Edition", icon: "☕" },
              { label: "Режим", value: "Мультиплеер", icon: "🌐" },
              { label: "Статус", value: "Онлайн 24/7", icon: "🟢" },
            ].map((info) => (
              <div key={info.label} className="bg-gray-950 border border-gray-800 p-4 text-center hover:border-gray-600 transition-colors">
                <div className="text-2xl mb-2">{info.icon}</div>
                <div className="text-gray-500 text-xs mb-1">{info.label}</div>
                <div className="text-white font-bold text-sm">{info.value}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors text-sm">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
