import { useState } from "react";
import Icon from "@/components/ui/icon";

const PHOTO_MATERIALS = [
  { id: "standard", name: "Стандартная смола", pricePerCm3: 35, color: "#60a5fa", desc: "Общие модели, прототипы, детали" },
  { id: "abs-like", name: "ABS-подобная смола", pricePerCm3: 42, color: "#818cf8", desc: "Функциональные детали, высокая прочность" },
  { id: "flexible", name: "Гибкая смола", pricePerCm3: 58, color: "#34d399", desc: "Гнущиеся детали, прокладки, грипсы" },
  { id: "castable", name: "Выжигаемая смола", pricePerCm3: 90, color: "#fbbf24", desc: "Ювелирное литьё, мастер-модели" },
];

const EXTRUSION_MATERIALS = [
  { id: "pla", name: "PLA", pricePerCm3: 12, color: "#60a5fa", desc: "Прототипы, декор, фигурки" },
  { id: "petg", name: "PETG", pricePerCm3: 16, color: "#34d399", desc: "Водостойкие детали, функциональные части" },
  { id: "abs", name: "ABS", pricePerCm3: 18, color: "#f97316", desc: "Термостойкие детали, корпуса" },
  { id: "tpu", name: "TPU", pricePerCm3: 24, color: "#a78bfa", desc: "Гибкие изделия, уплотнители" },
  { id: "pa", name: "Нейлон (PA)", pricePerCm3: 32, color: "#fbbf24", desc: "Высоконагруженные детали, шестерни" },
  { id: "carbon", name: "Carbon Fiber", pricePerCm3: 55, color: "#94a3b8", desc: "Лёгкие прочные конструкции" },
];

const PHOTO_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/files/4b5c0e6d-506b-43b8-bd67-f566525cce27.jpg";
const EXTRUSION_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/files/b6f8e23b-6753-4f85-8cc5-f63e33f631ef.jpg";

type PrintType = "photo" | "extrusion";

export default function Index() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [calcType, setCalcType] = useState<PrintType>("photo");
  const [calcMaterial, setCalcMaterial] = useState("standard");
  const [volume, setVolume] = useState<string>("10");
  const [quantity, setQuantity] = useState<string>("1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const materials = calcType === "photo" ? PHOTO_MATERIALS : EXTRUSION_MATERIALS;
  const selectedMaterial = materials.find(m => m.id === calcMaterial) || materials[0];
  const vol = parseFloat(volume) || 0;
  const qty = parseInt(quantity) || 1;
  const basePrice = vol * selectedMaterial.pricePerCm3;
  const totalPrice = basePrice * qty;
  const pricePerPiece = basePrice;

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "types", label: "Типы печати" },
    { id: "calculator", label: "Калькулятор" },
    { id: "about", label: "О компании" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center">
              <Icon name="Layers" size={14} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">DATAR 3D</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`nav-link text-sm font-medium transition-colors ${activeSection === link.id ? "text-blue-400" : "text-muted-foreground hover:text-white"}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollTo("calculator")}
            className="hidden md:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            <Icon name="Calculator" size={14} />
            Рассчитать
          </button>

          <button
            className="md:hidden text-muted-foreground hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-grid overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
            <span className="text-blue-400 text-xs font-mono-code font-medium tracking-widest uppercase">Профессиональная 3D печать</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fade-up animate-delay-100">
            Точность до<br />
            <span className="text-gradient">микрона</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up animate-delay-200">
            Фотополимерная и экструзионная 3D печать на заказ.<br />
            Стоимость рассчитывается по объёму — честно и прозрачно.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-300">
            <button
              onClick={() => scrollTo("calculator")}
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-md transition-all hover:scale-105 active:scale-100"
            >
              <Icon name="Calculator" size={18} />
              Рассчитать стоимость
            </button>
            <button
              onClick={() => scrollTo("types")}
              className="inline-flex items-center justify-center gap-2 border border-border hover:border-blue-500/50 text-white font-semibold px-8 py-3.5 rounded-md transition-all hover:bg-blue-500/5"
            >
              <Icon name="ChevronDown" size={18} />
              Виды печати
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-20 animate-fade-up animate-delay-400">
            {[
              { value: "24ч", label: "Минимальный срок" },
              { value: "0.01мм", label: "Точность фотополимера" },
              { value: "50+", label: "Материалов" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-white font-mono-code">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-fade-up animate-delay-500">
          <span className="text-xs font-mono-code">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-blue-500/40 to-transparent" />
        </div>
      </section>

      {/* TYPES */}
      <section id="types" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">01 / Технологии</span>
            <h2 className="text-4xl font-black text-white mt-3">Виды 3D печати</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PHOTOPOLYMER */}
            <div className="card-glow bg-card rounded-xl overflow-hidden group">
              <div className="relative h-56 overflow-hidden">
                <img src={PHOTO_IMAGE} alt="Фотополимерная печать" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="scanner-line" />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500/90 text-white text-xs font-bold px-3 py-1 rounded-full font-mono-code">MSLA / LCD</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-2">Фотополимерная</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Ультрафиолетовое отверждение смолы слой за слоем. Обеспечивает исключительную детализацию — идеально для ювелирных изделий, миниатюр и прецизионных прототипов.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: "Maximize2", text: "Точность 0.01–0.05 мм" },
                    { icon: "Layers", text: "Слой 25–100 мкм" },
                    { icon: "Sparkles", text: "Гладкая поверхность" },
                    { icon: "Microscope", text: "Тонкие детали" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name={item.icon} size={14} className="text-blue-400 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground mb-3 font-mono-code uppercase tracking-wider">Материалы</div>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_MATERIALS.map(m => (
                      <span key={m.id} className="text-xs px-2.5 py-1 rounded border border-border text-muted-foreground">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Стоимость от</span>
                  <span className="font-black text-white text-lg">35 ₽<span className="text-muted-foreground text-sm font-normal">/см³</span></span>
                </div>
              </div>
            </div>

            {/* EXTRUSION */}
            <div className="card-glow bg-card rounded-xl overflow-hidden group">
              <div className="relative h-56 overflow-hidden">
                <img src={EXTRUSION_IMAGE} alt="Экструзионная печать" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="scanner-line" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500/90 text-white text-xs font-bold px-3 py-1 rounded-full font-mono-code">FDM / FFF</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-2">Экструзионная</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Послойное нанесение расплавленного пластика. Широкий выбор материалов от гибких до инженерных. Оптимально для функциональных деталей и крупных изделий.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: "Maximize2", text: "Точность 0.1–0.4 мм" },
                    { icon: "Layers", text: "Слой 0.1–0.4 мм" },
                    { icon: "Wrench", text: "Функциональные детали" },
                    { icon: "Package", text: "Крупные изделия" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name={item.icon} size={14} className="text-blue-400 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground mb-3 font-mono-code uppercase tracking-wider">Материалы</div>
                  <div className="flex flex-wrap gap-2">
                    {EXTRUSION_MATERIALS.map(m => (
                      <span key={m.id} className="text-xs px-2.5 py-1 rounded border border-border text-muted-foreground">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Стоимость от</span>
                  <span className="font-black text-white text-lg">12 ₽<span className="text-muted-foreground text-sm font-normal">/см³</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-24 bg-secondary/20 bg-grid">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">02 / Калькулятор</span>
            <h2 className="text-4xl font-black text-white mt-3">Расчёт стоимости</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Введите объём модели из вашей слайсер-программы (Chitubox, PrusaSlicer и др.)</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="card-glow bg-card rounded-xl overflow-hidden">
              {/* TYPE TOGGLE */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => { setCalcType("photo"); setCalcMaterial("standard"); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${calcType === "photo" ? "bg-blue-500/10 text-blue-400 border-b-2 border-blue-500" : "text-muted-foreground hover:text-white"}`}
                >
                  <Icon name="Droplets" size={16} />
                  Фотополимерная
                </button>
                <button
                  onClick={() => { setCalcType("extrusion"); setCalcMaterial("pla"); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${calcType === "extrusion" ? "bg-blue-500/10 text-blue-400 border-b-2 border-blue-500" : "text-muted-foreground hover:text-white"}`}
                >
                  <Icon name="Layers" size={16} />
                  Экструзионная
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* INPUTS */}
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-3 block">Материал</label>
                      <div className="grid grid-cols-1 gap-2">
                        {materials.map(m => (
                          <button
                            key={m.id}
                            onClick={() => setCalcMaterial(m.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${calcMaterial === m.id ? "border-blue-500/60 bg-blue-500/10" : "border-border hover:border-blue-500/30 hover:bg-secondary/50"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                              <div>
                                <div className={`text-sm font-semibold ${calcMaterial === m.id ? "text-white" : "text-muted-foreground"}`}>{m.name}</div>
                                <div className="text-xs text-muted-foreground">{m.desc}</div>
                              </div>
                            </div>
                            <div className={`text-sm font-bold font-mono-code flex-shrink-0 ${calcMaterial === m.id ? "text-blue-400" : "text-muted-foreground"}`}>
                              {m.pricePerCm3}₽/см³
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* VOLUME & RESULT */}
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-3 block">Объём модели (см³)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={volume}
                          onChange={e => setVolume(e.target.value)}
                          min="0.1"
                          step="0.1"
                          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white text-2xl font-black font-mono-code focus:outline-none focus:border-blue-500/60 transition-colors"
                          placeholder="0.0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono-code">см³</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Найдите в настройках слайсера: «Объём модели» или «Model Volume»</p>
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-3 block">Количество штук</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(q => String(Math.max(1, parseInt(q) - 1)))}
                          className="w-10 h-10 rounded-lg border border-border hover:border-blue-500/40 text-white flex items-center justify-center transition-colors"
                        >
                          <Icon name="Minus" size={16} />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          min="1"
                          className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-white text-xl font-black font-mono-code text-center focus:outline-none focus:border-blue-500/60 transition-colors"
                        />
                        <button
                          onClick={() => setQuantity(q => String(parseInt(q) + 1))}
                          className="w-10 h-10 rounded-lg border border-border hover:border-blue-500/40 text-white flex items-center justify-center transition-colors"
                        >
                          <Icon name="Plus" size={16} />
                        </button>
                      </div>
                    </div>

                    {/* RESULT CARD */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                      <div className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-4">Расчёт</div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Материал</span>
                          <span className="text-white font-medium">{selectedMaterial.name}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Объём × Цена</span>
                          <span className="text-white font-medium font-mono-code">{vol.toFixed(1)} × {selectedMaterial.pricePerCm3} ₽</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Цена за штуку</span>
                          <span className="text-white font-medium">{pricePerPiece.toFixed(0)} ₽</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Количество</span>
                          <span className="text-white font-medium">× {qty}</span>
                        </div>
                      </div>

                      <div className="border-t border-blue-500/20 pt-4 flex items-end justify-between">
                        <span className="text-muted-foreground text-sm">Итого</span>
                        <div className="text-right">
                          <div className="text-4xl font-black text-white font-mono-code">
                            {vol > 0 ? totalPrice.toFixed(0) : "—"} <span className="text-2xl">₽</span>
                          </div>
                          {vol <= 0 && <div className="text-xs text-muted-foreground">введите объём модели</div>}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-4">* Финальная стоимость может включать постобработку и доставку. Точная цена — после анализа файла.</p>
                    </div>

                    <button
                      onClick={() => scrollTo("contacts")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100"
                    >
                      <Icon name="Send" size={16} />
                      Отправить заказ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">03 / О нас</span>
            <h2 className="text-4xl font-black text-white mt-3">О компании</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-black text-white mb-4">Производство с точными допусками</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Мы специализируемся на профессиональной 3D печати для инженеров, дизайнеров и производств. Каждый заказ — это точно выполненная задача с контролем качества.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Работаем с частными клиентами и юридическими лицами. Готовы к серийному производству, штучным заказам и сложным проектам с нестандартными требованиями.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Award", title: "Гарантия качества", desc: "Контроль на каждом этапе" },
                  { icon: "Zap", title: "Быстрые сроки", desc: "От 24 часов до выдачи" },
                  { icon: "FileCheck", title: "Работа с файлами", desc: "STL, OBJ, STEP, 3MF" },
                  { icon: "Headphones", title: "Консультация", desc: "Поможем выбрать технологию" },
                ].map(item => (
                  <div key={item.title} className="card-glow bg-card p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                      <Icon name={item.icon} size={18} className="text-blue-400" />
                    </div>
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROCESS */}
            <div className="border-t border-border pt-12">
              <h3 className="text-xl font-black text-white text-center mb-8">Как это работает</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Загрузите файл", desc: "Отправьте STL/OBJ модель нам на почту или в мессенджер" },
                  { step: "02", title: "Расчёт", desc: "Рассчитаем точную стоимость и уточним требования" },
                  { step: "03", title: "Производство", desc: "Печатаем с контролем качества и постобработкой" },
                  { step: "04", title: "Получите", desc: "Самовывоз или доставка курьером / почтой" },
                ].map(item => (
                  <div key={item.step} className="text-center">
                    <div className="text-4xl font-black font-mono-code text-blue-500/20 mb-2">{item.step}</div>
                    <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-secondary/20 bg-grid">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">04 / Контакты</span>
            <h2 className="text-4xl font-black text-white mt-3">Свяжитесь с нами</h2>
            <p className="text-muted-foreground mt-3">Отправьте файл модели и получите точный расчёт в течение часа</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="card-glow bg-card rounded-xl p-6 space-y-6">
              <h3 className="font-bold text-white text-lg">Контактная информация</h3>

              {[
                { icon: "Mail", label: "Email", value: "info@print3d.ru", href: "mailto:info@print3d.ru" },
                { icon: "Phone", label: "Телефон", value: "+7 (000) 000-00-00", href: "tel:+70000000000" },
                { icon: "MessageCircle", label: "Telegram", value: "@print3d_bot", href: "#" },
                { icon: "MapPin", label: "Адрес", value: "г. Москва, ул. Примерная, д. 1", href: "#" },
                { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00–18:00", href: null },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-white font-medium hover:text-blue-400 transition-colors text-sm">{item.value}</a>
                    ) : (
                      <span className="text-white font-medium text-sm">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="card-glow bg-card rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-white text-lg">Отправить запрос</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Телефон или email"
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                />
                <select className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors appearance-none">
                  <option value="" className="bg-card">Тип печати</option>
                  <option value="photo" className="bg-card">Фотополимерная</option>
                  <option value="extrusion" className="bg-card">Экструзионная</option>
                </select>
                <textarea
                  placeholder="Опишите задачу: объём, количество, требования к материалу и срокам..."
                  rows={4}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-blue-500/60 transition-colors resize-none"
                />
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100">
                  <Icon name="Send" size={16} />
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
              <Icon name="Layers" size={12} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">PRINT<span className="text-blue-400">3D</span></span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Профессиональная 3D печать на заказ. Фотополимер и экструзия.
          </div>
          <div className="text-xs text-muted-foreground font-mono-code">
            © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}