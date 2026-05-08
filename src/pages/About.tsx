import { Link } from "react-router-dom"

export default function About() {
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
              <Link to="/about" className="text-white transition-colors relative">
                <span>Об игре</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400"></div>
              </Link>
              <Link to="/mods" className="text-gray-400 hover:text-white transition-colors relative group">
                <span>Список модов</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
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

      <section className="px-6 py-20 lg:px-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="text-red-400 text-sm mb-4">// об игре</div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Что такое Minecraft?</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Minecraft — это игра-песочница, где ты можешь строить, исследовать и выживать в бесконечно генерируемом мире из кубиков. Нет единой цели — ты сам решаешь, как играть.
          </p>
        </div>

        {/* Goals */}
        <div className="bg-gray-950 border border-gray-800 mb-12">
          <div className="flex items-center gap-3 px-6 py-4 bg-gray-900 border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500"></div>
              <div className="w-3 h-3 bg-yellow-500"></div>
              <div className="w-3 h-3 bg-green-500"></div>
            </div>
            <span className="text-gray-400 text-sm">/minecraft --goals</span>
          </div>
          <div className="p-6 bg-black space-y-6">
            <div className="text-gray-500 text-sm mb-2">$ /help цели_игры</div>
            {[
              {
                icon: "⛏️",
                title: "Добыча ресурсов",
                desc: "Копай землю, камень и руды. Из добытых материалов создаёшь инструменты, оружие, броню и постройки.",
              },
              {
                icon: "🏠",
                title: "Строительство",
                desc: "Возводи дома, замки, города — от простой хижины до мегаполиса. Ограничений нет.",
              },
              {
                icon: "🗡️",
                title: "Выживание",
                desc: "По ночам появляются монстры. Построй укрытие, скрафти оружие и защищай себя.",
              },
              {
                icon: "🐉",
                title: "Главный босс",
                desc: "Финальная цель режима выживания — победить Дракона Края. Путь к нему долгий и непростой.",
              },
              {
                icon: "🌍",
                title: "Исследование",
                desc: "Мир бесконечен. Биомы, пещеры, подземелья, океаны, горы — всегда есть что открыть.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start group border-b border-gray-900 pb-6 last:border-0 last:pb-0">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="text-white font-bold mb-1">{item.title}</div>
                  <div className="text-gray-400 text-sm leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game modes */}
        <div className="mb-16">
          <div className="text-red-400 text-sm mb-4">// режимы игры</div>
          <h2 className="text-3xl font-bold mb-8">Режимы Minecraft</h2>

          <div className="bg-gray-950 border border-gray-800">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-900 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <div className="w-3 h-3 bg-yellow-500"></div>
                <div className="w-3 h-3 bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">/gamemode --list</span>
            </div>
            <div className="p-6 bg-black space-y-2">
              {[
                {
                  id: "01",
                  name: "Выживание",
                  tag: "survival",
                  color: "text-green-400",
                  desc: "Добывай ресурсы, крафти, выживай среди монстров. Основной режим игры.",
                },
                {
                  id: "02",
                  name: "Творческий",
                  tag: "creative",
                  color: "text-blue-400",
                  desc: "Все блоки и предметы доступны бесплатно. Летай и строй без ограничений.",
                },
                {
                  id: "03",
                  name: "Приключение",
                  tag: "adventure",
                  color: "text-yellow-400",
                  desc: "Режим для прохождения карт других игроков. Нельзя ломать блоки без спецтегов.",
                },
                {
                  id: "04",
                  name: "Наблюдатель",
                  tag: "spectator",
                  color: "text-purple-400",
                  desc: "Летай сквозь блоки и наблюдай за миром невидимым. Для модераторов и зрителей.",
                },
                {
                  id: "05",
                  name: "Хардкор",
                  tag: "hardcore",
                  color: "text-red-400",
                  desc: "Как выживание, но смерть — навсегда. Мир удаляется после гибели.",
                },
              ].map((mode) => (
                <div
                  key={mode.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 px-4 border border-transparent hover:border-gray-700 hover:bg-gray-900 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-gray-600 text-xs w-6">[{mode.id}]</span>
                    <span className={`${mode.color} font-bold w-28`}>{mode.name}</span>
                    <span className="text-gray-600 text-xs">({mode.tag})</span>
                  </div>
                  <div className="text-gray-400 text-sm leading-relaxed sm:border-l sm:border-gray-800 sm:pl-6">
                    {mode.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-gray-800 pt-12">
          <p className="text-gray-400 mb-6">Хочешь попробовать? Заходи на наш сервер!</p>
          <Link
            to="/connect"
            className="inline-block border-2 border-red-500 bg-red-500 text-white font-bold px-10 py-4 text-lg hover:bg-red-400 hover:border-red-400 transition-all duration-200"
          >
            🎮 Подключиться к МАТ&РЕШКА
          </Link>
          <div className="mt-6">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors text-sm">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
