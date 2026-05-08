import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const ICON = "https://cdn.poehali.dev/projects/6c7f18c2-1697-4011-8624-e0870f54466d/bucket/b13d3327-364b-4e4f-82d3-af08555fca09.png"

function MatryoshkaScene({
  flyTo,
  trigger,
  size,
  popSize,
}: {
  flyTo: number
  trigger: boolean
  size: number
  popSize: number
}) {
  const [popY, setPopY] = useState(0)
  const [popX, setPopX] = useState(0)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!trigger) {
      setPopY(0)
      setPopX(0)
      setOpacity(0)
      return
    }
    setOpacity(1)
    const t1 = setTimeout(() => setPopY(-(size * 0.8)), 50)
    const t2 = setTimeout(() => setPopX(flyTo), 480)
    const t3 = setTimeout(() => setOpacity(0), 860)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [trigger])

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      {/* Большая матрёшка */}
      <img
        src={ICON}
        alt="матрёшка"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: "invert(1) drop-shadow(0 0 6px rgba(239,68,68,0.3))",
          display: "block",
        }}
      />

      {/* Маленькая вылетающая */}
      <img
        src={ICON}
        alt="матрёшка мини"
        style={{
          position: "absolute",
          width: popSize,
          height: popSize,
          objectFit: "contain",
          left: (size - popSize) / 2 + popX,
          top: size * 0.3 + popY,
          opacity,
          filter: "invert(1) sepia(1) saturate(5) hue-rotate(310deg) drop-shadow(0 0 8px #ef4444)",
          transition: trigger
            ? "top 0.43s cubic-bezier(0.34,1.56,0.64,1), left 0.45s ease-in 0.43s, opacity 0.3s ease 0.83s"
            : "none",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

const CYCLE = 5000
const STAGGER = 900

export default function Mods() {
  const [tick, setTick] = useState(0)
  const [triggers, setTriggers] = useState([false, false, false])

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), CYCLE)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setTriggers([false, false, false])
    const t0 = setTimeout(() => setTriggers(([, b, c]) => [true, b, c]), 200)
    const t1 = setTimeout(() => setTriggers(([a, , c]) => [a, true, c]), 200 + STAGGER)
    const t2 = setTimeout(() => setTriggers(([a, b]) => [a, b, true]), 200 + STAGGER * 2)
    return () => [t0, t1, t2].forEach(clearTimeout)
  }, [tick])

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

          {/* Три матрёшки в ряд */}
          <div className="flex items-end justify-center gap-10 mb-14" style={{ minHeight: 160 }}>
            <MatryoshkaScene size={80}  popSize={36} flyTo={-70} trigger={triggers[0]} />
            <MatryoshkaScene size={100} popSize={44} flyTo={0}   trigger={triggers[1]} />
            <MatryoshkaScene size={80}  popSize={36} flyTo={70}  trigger={triggers[2]} />
          </div>

          <div className="text-red-400 font-mono text-sm mb-4 tracking-widest uppercase">// в разработке</div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">Список модов</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-12 leading-relaxed">
            Мы собираем лучшие моды специально для нашего сервера. Скоро здесь появится полный список с описаниями.
          </p>

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
