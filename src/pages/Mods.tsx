import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Пиксельная матрёшка 11x16 (большая)
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

// Пиксельная матрёшка 7x10 (маленькая)
const SMALL: number[][] = [
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

const COLORS: Record<number, string> = {
  0: "transparent",
  1: "#7c2d12", // тёмно-красный контур
  2: "#fca5a5", // телесный
  3: "#1e3a5f", // глаза
  4: "#ef4444", // рот/нос
  5: "#dc2626", // тело красное
  6: "#facc15", // узор золотой
}

function PixelGrid({ grid, pixelSize }: { grid: number[][], pixelSize: number }) {
  return (
    <div style={{ display: "inline-block", imageRendering: "pixelated" }}>
      {grid.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: COLORS[cell],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Mods() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open" | "peek" | "out">("closed")
  const [smallY, setSmallY] = useState(100)

  useEffect(() => {
    // Последовательность анимации
    const t1 = setTimeout(() => setPhase("opening"), 600)
    const t2 = setTimeout(() => { setPhase("open"); setSmallY(60) }, 1200)
    const t3 = setTimeout(() => { setPhase("peek"); setSmallY(20) }, 1900)
    const t4 = setTimeout(() => { setPhase("out"); setSmallY(-110) }, 2700)
    // Повтор через паузу
    const t5 = setTimeout(() => {
      setPhase("closed")
      setSmallY(100)
    }, 4500)

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [phase === "closed" ? phase : ""])

  // Перезапуск цикла
  useEffect(() => {
    if (phase !== "closed") return
    const t = setTimeout(() => setPhase("opening"), 600)
    return () => clearTimeout(t)
  }, [phase])

  const bigPixel = 10
  const smallPixel = 6

  const bigH = BIG.length * bigPixel
  const bigW = BIG[0].length * bigPixel
  const smallH = SMALL.length * smallPixel

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

          {/* Пиксельная анимация */}
          <div
            className="relative mx-auto mb-12 flex items-end justify-center"
            style={{ width: bigW, height: bigH + 20 }}
          >
            {/* Большая матрёшка — нижняя половина как «чаша» */}
            <div style={{ position: "absolute", bottom: 0, left: 0 }}>
              <PixelGrid grid={BIG} pixelSize={bigPixel} />
            </div>

            {/* Маленькая матрёшка вылезает из большой */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: `${bigH * 0.42}px`,
                transition: "top 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                top: `${smallY}%`,
                zIndex: 10,
              }}
            >
              <PixelGrid grid={SMALL} pixelSize={smallPixel} />
            </div>

            {/* Верхняя половина большой матрёшки — перекрывает маленькую пока та внутри */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                clipPath: phase === "closed" || phase === "opening"
                  ? `inset(0 0 ${bigH * 0.42}px 0)`
                  : `inset(0 0 ${bigH * 0.55}px 0)`,
                transition: "clip-path 0.6s ease",
                zIndex: 20,
              }}
            >
              <PixelGrid grid={BIG} pixelSize={bigPixel} />
            </div>
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
