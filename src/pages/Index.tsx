import { useEffect, useState } from "react"
import { Copy, Check, ArrowUp } from "lucide-react"
import { Link } from "react-router-dom"

export default function Index() {
  const [currentCommand, setCurrentCommand] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [matrixChars, setMatrixChars] = useState<string[]>([])
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentTyping, setCurrentTyping] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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

  const commands = [
    "/server join mat-reshka",
    "/game start --mode pvp",
    "/shop open --category weapons",
    "/clan create --name МАТ&РЕШКА",
  ]

  const terminalSequences = [
    {
      command: "/server join mat-reshka",
      outputs: [
        "Подключение к серверу МАТ&РЕШКА...",
        "Авторизация игрока...",
        "Загрузка мира...",
        "Добро пожаловать на сервер!",
      ],
    },
    {
      command: "/game start --mode pvp",
      outputs: [
        "Инициализация PvP-режима...",
        "Поиск противников...",
        "Формирование команд...",
        "Бой начался! Удачи!",
      ],
    },
    {
      command: "/shop open --category weapons",
      outputs: [
        "Открытие магазина...",
        "Загрузка каталога оружия...",
        "Проверка баланса...",
        "Магазин готов к работе!",
      ],
    },
    {
      command: "/clan create --name МАТ&РЕШКА",
      outputs: [
        "Создание клана...",
        "Регистрация названия...",
        "Настройка прав доступа...",
        "Клан МАТ&РЕШКА создан!",
      ],
    },
  ]

  useEffect(() => {
    const chars = "МАТРЕШКА01010101ABCDEF".split("")
    const newMatrixChars = Array.from({ length: 100 }, () => chars[Math.floor(Math.random() * chars.length)])
    setMatrixChars(newMatrixChars)

    const interval = setInterval(() => {
      setMatrixChars((prev) => prev.map(() => chars[Math.floor(Math.random() * chars.length)]))
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const sequence = terminalSequences[currentCommand]
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const runSequence = async () => {
      setTerminalLines([])
      setCurrentTyping("")
      setIsExecuting(false)

      const command = sequence.command
      for (let i = 0; i <= command.length; i++) {
        timeouts.push(
          setTimeout(() => {
            setCurrentTyping(command.slice(0, i))
          }, i * 50),
        )
      }

      timeouts.push(
        setTimeout(
          () => {
            setIsExecuting(true)
            setCurrentTyping("")
            setTerminalLines((prev) => [...prev, `player@mat-reshka:~$ ${command}`])
          },
          command.length * 50 + 500,
        ),
      )

      sequence.outputs.forEach((output, index) => {
        timeouts.push(
          setTimeout(
            () => {
              setTerminalLines((prev) => [...prev, output])
            },
            command.length * 50 + 1000 + index * 800,
          ),
        )
      })

      timeouts.push(
        setTimeout(
          () => {
            setCurrentCommand((prev) => (prev + 1) % commands.length)
          },
          command.length * 50 + 1000 + sequence.outputs.length * 800 + 2000,
        ),
      )
    }

    runSequence()

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [currentCommand])

  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { label: "Об игре", emoji: "🪆", to: "/about", isLink: true },
    { label: "Список модов", emoji: "🪆", to: "/mods", isLink: true },
    { label: "Правила", emoji: "🪆", href: "#integrations", isLink: false },
    { label: "Как начать", emoji: "🪆", href: "#docs", isLink: false },
    { label: "Подключиться", emoji: "🪆", to: "/connect", isLink: true, accent: true },
  ]

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">

      {/* Matrix Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-25 gap-1 h-full">
          {matrixChars.map((char, i) => (
            <div key={i} className="text-red-500 text-xs animate-pulse">
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Matryoshka Image + hover menu */}
            <div className="mb-2 flex justify-center">
              {/* Подсказка над матрёшкой */}
              <div className="flex flex-col items-center" style={{ gap: 0 }}>
                <div
                  className="relative"
                  style={{ paddingTop: 160 }}
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {/* Выдвигающиеся матрёшки-вкладки */}
                  {menuItems.map((item, i) => {
                    const total = menuItems.length
                    const angleMin = -70
                    const angleMax = 70
                    const angle = angleMin + (angleMax - angleMin) * (i / (total - 1))
                    const rad = (angle * Math.PI) / 180
                    const dist = menuOpen ? 140 : 0
                    const tx = Math.sin(rad) * dist
                    const ty = -Math.cos(rad) * dist

                    const inner = (
                      <div className="flex flex-col items-center gap-1.5 select-none group/item">
                        <div
                          className="w-10 h-10 flex items-center justify-center transition-all duration-300"
                          style={{ filter: "invert(1)" }}
                        >
                          <img
                            src="https://cdn.poehali.dev/projects/6c7f18c2-1697-4011-8624-e0870f54466d/bucket/ffde2b46-a500-4b0c-9227-bfde8ee89107.png"
                            alt={item.label}
                            className="w-9 h-9 object-contain transition-all duration-300 group/item-hover:drop-shadow-[0_0_8px_#ef4444]"
                            style={{
                              filter: item.accent
                                ? "invert(1) sepia(1) saturate(5) hue-rotate(310deg)"
                                : "invert(1)",
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold whitespace-nowrap px-2 py-0.5 rounded ${item.accent ? "bg-red-500 text-white" : "bg-gray-900/90 text-white border border-gray-700"}`}
                          style={{ textShadow: "0 0 6px #000" }}
                        >
                          {item.label}
                        </span>
                      </div>
                    )

                    const wrapClass = "absolute left-1/2 top-1/2 z-20 transition-all duration-500 [&:hover_img]:brightness-0 [&:hover_img]:[filter:invert(1)_sepia(1)_saturate(5)_hue-rotate(310deg)] [&:hover_img]:drop-shadow-[0_0_10px_#ef4444] hover:scale-125"
                    const wrapStyle = {
                      transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
                      opacity: menuOpen ? 1 : 0,
                      pointerEvents: (menuOpen ? "auto" : "none") as React.CSSProperties["pointerEvents"],
                      transitionDelay: menuOpen ? `${i * 55}ms` : "0ms",
                    }

                    return item.isLink ? (
                      <Link key={i} to={item.to!} className={wrapClass} style={wrapStyle}>
                        {inner}
                      </Link>
                    ) : (
                      <a key={i} href={item.href} className={wrapClass} style={wrapStyle}>
                        {inner}
                      </a>
                    )
                  })}

                  {/* Главная матрёшка */}
                  <div className="absolute inset-0 blur-2xl bg-red-500/30 rounded-full scale-75 pointer-events-none"></div>
                  <img
                    src="https://cdn.poehali.dev/projects/6c7f18c2-1697-4011-8624-e0870f54466d/files/631f9049-072d-4b0e-ac4e-3a26f0586ca1.jpg"
                    alt="Матрёшка МАТ&РЕШКА"
                    className="relative w-48 h-48 lg:w-64 lg:h-64 object-cover rounded-none border-2 shadow-2xl shadow-red-500/30 cursor-pointer z-10 transition-all duration-300"
                    style={{
                      borderColor: menuOpen ? "#ef4444" : "rgba(239,68,68,0.5)",
                      transform: menuOpen ? "scale(1.07)" : "scale(1)",
                    }}
                  />

                  {/* Пульсирующая подсказка «наведи» */}
                  {!menuOpen && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-30">
                      <div className="text-gray-400 text-xs font-mono animate-bounce whitespace-nowrap">наведи курсор ↑</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* отступ под подсказку */}
            <div className="mt-12"></div>

            <h1 className="text-5xl lg:text-8xl font-bold mb-6 leading-tight tracking-wider">
              <span className="text-white">МАТ</span>
              <span className="text-red-400">&</span>
              <span className="text-white">РЕШКА</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Матрёшка, матрёшка и ещё раз матрёшка.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div
                className="group relative cursor-pointer w-full sm:w-auto"
                onClick={() => copyToClipboard("mat-reshka.ru", "hero-install")}
              >
                <div className="absolute inset-0 border border-red-600 bg-red-900/20 transition-all duration-300 group-hover:border-red-400 group-hover:shadow-lg group-hover:shadow-red-400/30"></div>
                <div className="relative border border-red-400 bg-red-500 text-white font-bold px-6 sm:px-10 py-4 text-base sm:text-lg transition-all duration-300 group-hover:bg-red-400 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 text-center">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {copiedStates["hero-install"] ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                    )}
                    <span className="text-sm sm:text-base">mat-reshka.ru</span>
                  </div>
                </div>
              </div>

              <a href="#features" className="group relative cursor-pointer w-full sm:w-auto">
                <div className="absolute inset-0 border-2 border-dashed border-gray-600 bg-gray-900/20 transition-all duration-300 group-hover:border-white group-hover:shadow-lg group-hover:shadow-white/20"></div>
                <div className="relative border-2 border-dashed border-gray-400 bg-transparent text-white font-bold px-10 py-4 text-lg transition-all duration-300 group-hover:border-white group-hover:bg-gray-900/30 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">-&gt;</span>
                    <span>О сервере</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Terminal Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-950 border border-gray-700 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                  </div>
                  <span className="text-gray-400 text-sm">mat-reshka — терминал</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-500 text-xs">СЕРВЕР ОНЛАЙН</span>
                </div>
              </div>

              <div className="p-6 bg-black min-h-48">
                <div className="space-y-2 font-mono text-sm">
                  {terminalLines.map((line, index) => (
                    <div
                      key={index}
                      className={`${line.startsWith("player@") ? "text-red-400" : "text-green-400"}`}
                    >
                      {line.startsWith("player@") ? line : `  > ${line}`}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 font-mono text-sm mt-2">
                  <span className="text-red-400">player@mat-reshka:~$</span>
                  <span className="text-white">{currentTyping}</span>
                  {showCursor && <span className="text-white animate-pulse">█</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-gray-800" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Почему МАТ&РЕШКА?</h2>
            <p className="text-xl text-gray-400">Всё что нужно для настоящей игры — в одном месте</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🗡️",
                title: "PvP-арены",
                desc: "Сражайся с игроками со всего сервера в честных боях один на один или командами.",
                cmd: "/pvp join",
              },
              {
                icon: "🏰",
                title: "Защита территории",
                desc: "Стройте базы, укрепляйте замки и защищайте свои владения от нашествий.",
                cmd: "/claim land",
              },
              {
                icon: "💎",
                title: "Экономика",
                desc: "Торгуйте ресурсами, открывайте магазины и становитесь богатейшим кланом.",
                cmd: "/shop create",
              },
              {
                icon: "⚔️",
                title: "Клановые войны",
                desc: "Создавай кланы, захватывай территории и веди эпические войны за господство.",
                cmd: "/clan war",
              },
              {
                icon: "🎁",
                title: "Ежедневные события",
                desc: "Боссы, турниры, ивенты каждый день — скучать не придётся.",
                cmd: "/event list",
              },
              {
                icon: "🛡️",
                title: "Античит",
                desc: "Справедливая игра гарантирована. Нарушителей блокируем мгновенно.",
                cmd: "/report player",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-black border border-gray-700 p-6 hover:border-red-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-red-500/10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{feature.desc}</p>
                  <div className="bg-gray-900 border border-gray-700 p-2 font-mono text-xs text-gray-400 group-hover:border-gray-500 transition-colors">
                    <span className="text-red-400">$ </span>{feature.cmd}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-gray-800" id="modes">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Режимы игры</h2>
            <p className="text-xl text-gray-400">Выбери свой стиль — у нас есть всё</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-950 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <div className="w-3 h-3 bg-yellow-500"></div>
                    <div className="w-3 h-3 bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">/game --list</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-500 text-xs">5 РЕЖИМОВ</span>
                </div>
              </div>

              <div className="p-6 bg-black">
                <div className="text-sm text-gray-400 mb-4">$ /game list --all</div>

                <div className="space-y-2 font-mono text-sm">
                  {[
                    { id: "1", name: "Выживание", tag: "survival", status: "★", color: "text-yellow-400" },
                    { id: "2", name: "PvP-арена", tag: "pvp", status: "★", color: "text-red-400" },
                    { id: "3", name: "Мини-игры", tag: "minigames", status: "★", color: "text-green-400" },
                    { id: "4", name: "Ролевая игра", tag: "rpg", status: "★", color: "text-purple-400" },
                    { id: "5", name: "Творческий", tag: "creative", status: "★", color: "text-blue-400" },
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      className="flex items-center justify-between py-2 px-4 hover:bg-gray-900 cursor-pointer group transition-all duration-200 border border-transparent hover:border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 w-6">[{mode.id}]</span>
                        <span className={`${mode.color} group-hover:text-white transition-colors`}>
                          {mode.status}
                        </span>
                        <span className="text-white group-hover:text-gray-200 transition-colors">{mode.name}</span>
                        <span className="text-gray-500 text-xs">({mode.tag})</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 text-xs">
                        /game join {mode.tag}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-sm text-gray-400">
                      <div className="mb-2">Как играть:</div>
                      <div className="font-mono text-xs text-gray-500 space-y-1">
                        <div>$ /game join survival # Зайти в выживание</div>
                        <div>$ /game join pvp # Войти в PvP-арену</div>
                        <div>$ /spawn # Вернуться на спавн</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>5 активно</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>24/7 онлайн</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-red-400">*</span>
                <span>Все режимы доступны сразу — Без платного доступа — Играй везде</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-gray-800" id="integrations">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Правила сервера</h2>
            <p className="text-xl text-gray-400">Честная игра — основа нашего сервера</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-950 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <div className="w-3 h-3 bg-yellow-500"></div>
                    <div className="w-3 h-3 bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm">/rules --list</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-500 text-xs">ОБЯЗАТЕЛЬНО К ПРОЧТЕНИЮ</span>
                </div>
              </div>

              <div className="p-6 bg-black">
                <div className="text-sm text-gray-400 mb-4">$ /rules show</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm mb-6">
                  {[
                    { rule: "Без читов и багоюза", status: "✓", desc: "Банан навсегда" },
                    { rule: "Уважай игроков", status: "✓", desc: "Без оскорблений" },
                    { rule: "Без гриферства", status: "✓", desc: "Порча чужого имущества" },
                    { rule: "Честная игра", status: "✓", desc: "Запрещён дюп предметов" },
                    { rule: "Без спама в чате", status: "✓", desc: "Мут за нарушение" },
                    { rule: "Слушай модераторов", status: "✓", desc: "Их решение финальное" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 hover:bg-gray-900 cursor-pointer group transition-all duration-200 border border-transparent hover:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 group-hover:text-white transition-colors w-4">
                          {item.status}
                        </span>
                        <span className="text-white group-hover:text-gray-200 transition-colors">{item.rule}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 text-xs">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-sm text-gray-400">
                      <div className="font-mono text-xs text-gray-500 space-y-1">
                        <div>$ /report [игрок] # Пожаловаться на нарушителя</div>
                        <div>$ /helpop [сообщение] # Позвать модератора</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>6 правил</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Мод онлайн 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-red-400">*</span>
                <span>Справедливая игра - Активная модерация - Дружное сообщество</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-gray-800 bg-gray-950/30" id="docs">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Готов играть?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Подключайся прямо сейчас — скопируй адрес сервера и вступай в игру. Тысячи игроков ждут тебя на полях МАТ&РЕШКА.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-black border border-gray-700 p-6 h-full flex flex-col justify-between hover:border-red-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-red-500/10">
                <div className="text-center flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 border border-gray-600 flex items-center justify-center group-hover:border-red-500/50 transition-colors group-hover:bg-gray-800">
                      <span className="text-lg font-mono text-white group-hover:text-gray-100">01</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-gray-100">Скопируй адрес</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 text-sm leading-relaxed">
                      Скопируй IP сервера в один клик
                    </p>
                  </div>
                  <div
                    className="bg-gray-900 border border-gray-700 p-2.5 font-mono text-xs text-left group-hover:border-gray-500 transition-colors group-hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                    onClick={() => copyToClipboard("mat-reshka.ru", "step1-cmd")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">$ </span>
                      <span className="text-white group-hover:text-gray-100">mat-reshka.ru</span>
                    </div>
                    {copiedStates["step1-cmd"] ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-black border border-gray-700 p-6 h-full flex flex-col justify-between hover:border-red-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-red-500/10">
                <div className="text-center flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 border border-gray-600 flex items-center justify-center group-hover:border-red-500/50 transition-colors group-hover:bg-gray-800">
                      <span className="text-lg font-mono text-white group-hover:text-gray-100">02</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-gray-100">Запусти игру</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 text-sm leading-relaxed">
                      Зайди в многопользовательский режим
                    </p>
                  </div>
                  <div
                    className="bg-gray-900 border border-gray-700 p-2.5 font-mono text-xs text-left group-hover:border-gray-500 transition-colors group-hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                    onClick={() => copyToClipboard("/server add МАТ&РЕШКА mat-reshka.ru", "step2-cmd")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">$ </span>
                      <span className="text-white group-hover:text-gray-100">/server add МАТ&РЕШКА</span>
                    </div>
                    {copiedStates["step2-cmd"] ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative h-full md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-black border border-gray-700 p-6 h-full flex flex-col justify-between hover:border-red-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-red-500/10">
                <div className="text-center flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 border border-gray-600 flex items-center justify-center group-hover:border-red-500/50 transition-colors group-hover:bg-gray-800">
                      <span className="text-lg font-mono text-white group-hover:text-gray-100">03</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-gray-100">Начни играть</h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 text-sm leading-relaxed">
                      Подключайся и врывайся в бой!
                    </p>
                  </div>
                  <div
                    className="bg-gray-900 border border-gray-700 p-2.5 font-mono text-xs text-left group-hover:border-gray-500 transition-colors group-hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                    onClick={() => copyToClipboard("/pvp join", "step3-cmd")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">$ </span>
                      <span className="text-white group-hover:text-gray-100">/pvp join</span>
                    </div>
                    {copiedStates["step3-cmd"] ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="group relative cursor-pointer inline-block w-full sm:w-auto"
              onClick={() => copyToClipboard("mat-reshka.ru", "bottom-install")}
            >
              <div className="absolute inset-0 border-2 border-red-600 bg-red-900/20 transition-all duration-300 group-hover:border-red-400 group-hover:shadow-lg group-hover:shadow-red-400/30"></div>
              <div className="relative border-2 border-red-400 bg-red-500 text-white font-bold px-8 sm:px-16 py-4 sm:py-5 text-lg sm:text-xl transition-all duration-300 group-hover:bg-red-400 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 text-center">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {copiedStates["bottom-install"] ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                  )}
                  <span className="text-base sm:text-lg">Скопировать IP: mat-reshka.ru</span>
                </div>
              </div>
            </div>

            <div className="text-gray-400 text-base sm:text-lg font-mono flex items-center justify-center gap-2 sm:gap-3 px-4 py-2">
              <span className="text-green-400 animate-pulse">●</span>
              <span>Сервер работает 24/7 — Без лагов — Дружное сообщество</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-12 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white font-bold text-xl">МАТ</span>
                <span className="text-red-400 font-bold text-xl">&</span>
                <span className="text-white font-bold text-xl">РЕШКА</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs">
                Легендарный игровой сервер для настоящих бойцов.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="text-white font-bold mb-3">Сервер</h4>
                <div className="space-y-2 text-gray-500">
                  <div>О сервере</div>
                  <div>Режимы игры</div>
                  <div>Правила</div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">Сообщество</h4>
                <div className="space-y-2 text-gray-500">
                  <div>Discord</div>
                  <div>ВКонтакте</div>
                  <div>Telegram</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm font-mono">
              © 2024 МАТ&РЕШКА. Все права защищены.
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-xs font-mono">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>player@mat-reshka:~$ █</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 group border border-red-500 bg-black p-3 hover:bg-red-500 transition-all duration-300 shadow-lg shadow-red-500/20"
        >
          <ArrowUp className="w-5 h-5 text-red-400 group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  )
}