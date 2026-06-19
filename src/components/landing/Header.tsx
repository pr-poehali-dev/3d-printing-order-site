import Icon from "@/components/ui/icon";
import { PHOTO_MATERIALS, EXTRUSION_MATERIALS, PHOTO_IMAGE, EXTRUSION_IMAGE, LOGO_IMAGE, navLinks, PrintType } from "./constants";

interface HeaderProps {
  activeSection: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  scrollTo: (id: string) => void;
  selectPrintType: (type: PrintType) => void;
}

export default function Header({ activeSection, mobileMenuOpen, setMobileMenuOpen, scrollTo, selectPrintType }: HeaderProps) {
  return (
    <>
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_IMAGE} alt="DATAR 3D" className="w-16 h-16 md:w-24 md:h-24 rounded object-cover" />
            <span className="font-bold text-white tracking-tight">DATA<span className="text-blue-400">R</span> <span className="text-white">3D</span></span>
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

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fade-up animate-delay-100">
            Точность до<br />
            <span className="text-gradient">микрона</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up animate-delay-200 px-2">
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

          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-lg mx-auto mt-16 md:mt-20 animate-fade-up animate-delay-400">
            {[
              { value: "24ч", label: "Минимальный срок" },
              { value: "0.01мм", label: "Точность фотополимера" },
              { value: "50+", label: "Материалов" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl md:text-2xl font-black text-white font-mono-code">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</div>
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
      <section id="types" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">01 / Технологии</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Виды 3D печати</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-8">
            {/* PHOTOPOLYMER */}
            <div onClick={() => selectPrintType("photo")} className="card-glow bg-card rounded-xl overflow-hidden group cursor-pointer">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
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
            <div onClick={() => selectPrintType("extrusion")} className="card-glow bg-card rounded-xl overflow-hidden group cursor-pointer">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
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

      {/* EXTRA SERVICES */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">Дополнительно</span>
            <h2 className="text-3xl font-black text-white mt-3">Дополнительные услуги</h2>
          </div>
          <div className="max-w-3xl mx-auto grid md:grid-cols-1 gap-4">
            <div className="card-glow bg-card rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Icon name="PenTool" size={22} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white mb-1">3D моделирование по чертежам или эскизам</h3>
                <p className="text-sm text-muted-foreground">Создадим готовую 3D модель по вашему чертежу, фотографии или эскизу от руки — файл готов в течении 2–4 дней.
                <span className="block text-xs text-muted-foreground/60 mt-2">* Услуга не относится к художественным моделям.</span></p>
              </div>
              <div className="sm:text-right flex-shrink-0">
                <div className="text-xl md:text-2xl font-black text-white font-mono-code">от 1 500 ₽</div>
                <div className="text-xs text-muted-foreground mt-0.5">за модель</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}