import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Большая матрёшка 11x16
const BIG: number[][] = [
  [0,0,1,1,1,1,1,1,1,0,0],
  [0,1,1,2,2,2,2,2,1,1,0],
  [0,1,2,2,2,2,2,2,2,1,0],
  [1,1,2,3,2,2,2,3,2,1,1],
  [1,2,2,3,2,2,2,3,2,2,1],
  [1,2,2,2,2,4,2,2,2,2,1],
  [1,1,2,2,4,4,4,2,2,1,1],
  [0,1,1,2,2,2,2,2,1,1,0],
  [0,0,1,1,5,5,5,1,1,0,0],
  [0,0,1,5,5,5,5,5,1,0,0],
  [0,1,5,5,6,5,6,5,5,1,0],
  [0,1,5,5,5,5,5,5,5,1,0],
  [0,1,5,6,6,6,6,6,5,1,0],
  [0,1,5,5,5,5,5,5,5,1,0],
  [0,1,1,5,5,5,5,5,1,1,0],
  [0,0,1,1,1,1,1,1,1,0,0],
]

// Средняя матрёшка 7x10
const MED: number[][] = [
  [0,1,1,1,1,1,0],
  [1,2,2,2,2,2,1],
  [1,2,3,2,3,2,1],
  [1,2,2,4,2,2,1],
  [1,1,2,2,2,1,1],
  [0,1,5,5,5,1,0],
  [0,1,5,6,5,1,0],
  [0,1,5,5,5,1,0],
  [0,1,5,5,5,1,0],
  [0,1,1,1,1,1,0],
]

// Маленькая матрёшка 5x8
const TINY: number[][] = [
  [0,1,1,1,0],
  [1,2,2,2,1],
  [1,3,2,3,1],
  [1,1,4,1,1],
  [0,1,5,1,0],
  [0,1,6,1,0],
  [0,1,5,1,0],
  [0,1,1,1,0],
]

const COLORS: Record<number, string> = {
  0: "transparent",
  1: "#7c2d12",
  2: "#fca5a5",
  3: "#1e3a5f",
  4: "#ef4444",
  5: "#dc2626",
  6: "#facc15",
}

function PixelGrid({ grid, pixelSize }: { grid: number[][], pixelSize: number }) {
  return (
    <div style={{ display: "inline-block", imageRendering: "pixelated" }}>
      {grid.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.map((cell, x) => (
            <div key={x} style={{ width: pixelSize, height: pixelSize, backgroundColor: COLORS[cell] }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Одна сцена: большая матрёшка + вылетающая из неё маленькая → летит влево/вправо
function MatryoshkaScene({
  popGrid,
  popPixel,
  flyTo,        // куда улетает по X (px)
  trigger,      // когда начинать анимацию
}: {
  popGrid: number[][]
  popPixel: number
  flyTo: number
  trigger: boolean
}) {
  const BIG_PX = 8
  const bigH = BIG.length * BIG_PX
  const bigW = BIG[0].length * BIG_PX
  const popH = popGrid.length * popPixel
  const popW = popGrid[0].length * popPixel

  const [popY, setPopY] = useState(bigH * 0.4)
  const [popX, setPopX] = useState(0)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!trigger) {
      setPopY(bigH * 0.4)
      setPopX(0)
      setOpacity(0)
      return
    }
    // появляется
    setOpacity(1)
    // вылетает вверх
    const t1 = setTimeout(() => setPopY(-popH - 10), 50)
    // улетает в сторону
    const t2 = setTimeout(() => setPopX(flyTo), 500)
    // исчезает
    const t3 = setTimeout(() => setOpacity(0), 900)

    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [trigger])

  return (
    <div style={{ position: "relative", width: bigW, height: bigH + 10, display: "inline-block" }}>
      {/* Большая матрёшка */}
      <PixelGrid grid={BIG} pixelSize={BIG_PX} />

      {/* Вылетающая маленькая */}
      <div
        style={{
          position: "absolute",
          bottom: bigH * 0.42,
          left: (bigW - popW) / 2 + popX,
          top: popY,
          opacity,
          transition: trigger
            ? "top 0.45s cubic-bezier(0.34,1.56,0.64,1), left 0.5s ease-in 0.45s, opacity 0.3s ease 0.85s"
            : "none",
          zIndex: 10,
        }}
      >
        <PixelGrid grid={popGrid} pixelSize={popPixel} />
      </div>
    </div>
  )
}

const CYCLE = 5000 // полный цикл мс
const STAGGER = 900  // задержка между матрёшками

export default function Mods() {
  const [tick, setTick] = useState(0)
  const [triggers, setTriggers] = useState([false, false, false])

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), CYCLE)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // запускаем по очереди: 0 → 1 → 2
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
            {/* Левая — маленькая вылетает влево */}
            <MatryoshkaScene popGrid={TINY} popPixel={5} flyTo={-80} trigger={triggers[0]} />
            {/* Центральная — средняя вылетает вверх */}
            <MatryoshkaScene popGrid={MED}  popPixel={6} flyTo={0}   trigger={triggers[1]} />
            {/* Правая — маленькая вылетает вправо */}
            <MatryoshkaScene popGrid={TINY} popPixel={5} flyTo={80}  trigger={triggers[2]} />
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
