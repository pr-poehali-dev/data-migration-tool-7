import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const MATRYOSHKAS = ["🪆", "🪆", "🪆", "🪆", "🪆"]

export default function Mods() {
  const [visible, setVisible] = useState<number[]>([])

  useEffect(() => {
    setVisible([])
    MATRYOSHKAS.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i])
      }, i * 350)
    })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm p-4 sticky top-0 z-10">
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
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors relative group">
                <span>Об игре</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link to="/mods" className="text-white transition-colors relative group">
                <span>Список модов</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400"></div>
              </Link>
              <Link to="/connect" className="text-red-400 hover:text-red-300 transition-colors font-bold">
                🎮 Подключиться
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>онлайн</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="px-6 py-24 lg:px-12 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center">
          {/* Матрёшки */}
          <div className="flex items-end justify-center gap-2 mb-12" style={{ minHeight: "120px" }}>
            {MATRYOSHKAS.map((m, i) => (
              <span
                key={i}
                className="transition-all duration-500"
                style={{
                  fontSize: `${2 + i * 0.6}rem`,
                  opacity: visible.includes(i) ? 1 : 0,
                  transform: visible.includes(i) ? "translateY(0) scale(1)" : "translateY(30px) scale(0.5)",
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                {m}
              </span>
            ))}
          </div>

          <div className="text-red-400 font-mono text-sm mb-4 tracking-widest uppercase">// в разработке</div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">Список модов</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-12 leading-relaxed">
            Мы собираем лучшие моды специально для нашего сервера. Скоро здесь появится полный список с описаниями.
          </p>

          {/* Terminal-style progress */}
          <div className="bg-gray-950 border border-gray-800 p-6 max-w-md mx-auto text-left mb-10">
            <div className="text-gray-500 text-xs mb-3">$ /mods --status</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 animate-pulse">▶</span>
                <span className="text-gray-300">Сбор списка модов...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 animate-pulse">▶</span>
                <span className="text-gray-300">Тестирование совместимости...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">○</span>
                <span className="text-gray-600">Публикация страницы...</span>
              </div>
            </div>
          </div>

          <Link to="/" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← Вернуться на главную
          </Link>
        </div>
      </section>
    </div>
  )
}
