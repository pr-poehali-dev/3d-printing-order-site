import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const ANALYZE_IMAGE_URL = "https://functions.poehali.dev/82aa100b-18c1-4a0f-959d-7e36027ecf84";
const SEND_ORDER_URL = "https://functions.poehali.dev/3d462ff9-cdff-4155-bb2d-15fdee341c9e";

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

const PHOTO_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/files/4fa4d864-4f3a-4eeb-8ab8-acf791a0cbd2.jpg";
const EXTRUSION_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/files/4b923267-4b74-4b4e-a986-c6d8bbebd213.jpg";

type PrintType = "photo" | "extrusion";

export default function Index() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [calcType, setCalcType] = useState<PrintType>("photo");
  const [calcMaterial, setCalcMaterial] = useState("standard");
  const [volume, setVolume] = useState<string>("10");
  const [quantity, setQuantity] = useState<string>("1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  const [imageResult, setImageResult] = useState<{length_mm?: number; width_mm?: number; height_mm?: number; volume_cm3?: number; note?: string; error?: string} | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [orderName, setOrderName] = useState("");
  const [orderContact, setOrderContact] = useState("");
  const [orderPrintType, setOrderPrintType] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderSending, setOrderSending] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [orderError, setOrderError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const materials = calcType === "photo" ? PHOTO_MATERIALS : EXTRUSION_MATERIALS;
  const selectedMaterial = materials.find(m => m.id === calcMaterial) || materials[0];
  const vol = parseFloat(volume) || 0;
  const qty = parseInt(quantity) || 1;
  const basePrice = vol * selectedMaterial.pricePerCm3;
  const totalPrice = basePrice * qty;
  const pricePerPiece = basePrice;

  const handleImageUpload = async (file: File) => {
    setImageResult(null);
    setPreviewUrl(URL.createObjectURL(file));
    setImageAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      try {
        const res = await fetch(ANALYZE_IMAGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        const data = await res.json();
        setImageResult(data);
        if (data.volume_cm3 && !data.error) {
          setVolume(String(Math.round(data.volume_cm3 * 10) / 10));
        }
      } catch {
        setImageResult({ error: 'Ошибка соединения с сервером' });
      } finally {
        setImageAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

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
            <img src="https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/bucket/36208e6f-53ef-46f2-89b4-57689e1acfda.jpg" alt="DATAR 3D" className="w-16 h-16 md:w-24 md:h-24 rounded object-cover" />
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

      {/* CALCULATOR */}
      <section id="calculator" className="py-16 md:py-24 bg-secondary/20 bg-grid">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">02 / Калькулятор</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Расчёт стоимости</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm md:text-base">Введите объём модели из вашей слайсер-программы (Chitubox, PrusaSlicer и др.)</p>
          </div>

          <div className="max-w-sm sm:max-w-4xl mx-auto">
            <div className="card-glow bg-card rounded-xl overflow-hidden">
              {/* TYPE TOGGLE */}
              <div className="flex flex-col gap-3 p-4 border-b border-border">
                <button
                  onClick={() => { setCalcType("photo"); setCalcMaterial("standard"); }}
                  className={`flex items-center justify-center gap-2 py-3 sm:py-4 text-sm font-semibold rounded-lg border-2 transition-all ${calcType === "photo" ? "bg-blue-500/10 text-blue-400 border-blue-500" : "text-muted-foreground border-border hover:border-blue-500/40 hover:text-white"}`}
                >
                  <Icon name="Droplets" size={16} />
                  Фотополимерная
                </button>
                <button
                  onClick={() => { setCalcType("extrusion"); setCalcMaterial("pla"); }}
                  className={`flex items-center justify-center gap-2 py-3 sm:py-4 text-sm font-semibold rounded-lg border-2 transition-all ${calcType === "extrusion" ? "bg-blue-500/10 text-blue-400 border-blue-500" : "text-muted-foreground border-border hover:border-blue-500/40 hover:text-white"}`}
                >
                  <Icon name="Layers" size={16} />
                  Экструзионная
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-5 md:gap-8">
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
                    {/* IMAGE ANALYZE */}
                    <div>
                      <label className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-3 block">Расчёт по фото с размерами</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleImageUpload(f); }}
                        className="border-2 border-dashed border-border hover:border-blue-500/50 rounded-lg p-4 cursor-pointer transition-colors text-center group"
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="preview" className="max-h-32 mx-auto rounded object-contain mb-2" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <Icon name="ImagePlus" size={28} className="text-muted-foreground group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm text-muted-foreground">Загрузите фото изделия с указанными размерами</span>
                            <span className="text-xs text-muted-foreground/60">Поддерживаются JPG, PNG</span>
                          </div>
                        )}
                      </div>

                      {imageAnalyzing && (
                        <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm">
                          <Icon name="Loader2" size={16} className="animate-spin" />
                          ИИ распознаёт габариты...
                        </div>
                      )}

                      {imageResult && !imageAnalyzing && (
                        <div className={`mt-3 rounded-lg p-3 text-sm ${imageResult.error ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                          {imageResult.error ? (
                            <span>{imageResult.error}</span>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex gap-4 text-white font-mono-code text-xs">
                                <span>Д: <b>{imageResult.length_mm} мм</b></span>
                                <span>Ш: <b>{imageResult.width_mm} мм</b></span>
                                <span>В: <b>{imageResult.height_mm} мм</b></span>
                              </div>
                              <div className="text-blue-400 font-semibold">Объём: {imageResult.volume_cm3} см³ — подставлен автоматически</div>
                              {imageResult.note && <div className="text-muted-foreground text-xs">{imageResult.note}</div>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-3 block">Объём модели (см³)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={volume}
                          onChange={e => setVolume(e.target.value)}
                          min="0.1"
                          step="0.1"
                          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white text-xl sm:text-2xl font-black font-mono-code focus:outline-none focus:border-blue-500/60 transition-colors"
                          placeholder="0.0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono-code">см³</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Или введите вручную из слайсера: «Объём модели» или «Model Volume»</p>
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
                          <div className="text-3xl sm:text-4xl font-black text-white font-mono-code">
                            {vol > 0 ? totalPrice.toFixed(0) : "—"} <span className="text-xl sm:text-2xl">₽</span>
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
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">03 / О нас</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">О компании</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
              <div>
                <h3 className="text-2xl font-black text-white mb-4">Производство с точными допусками</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Мы специализируемся на профессиональной 3D печати для инженеров, дизайнеров и производств. Каждый заказ — это точно выполненная задача с контролем качества.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Работаем с частными клиентами и юридическими лицами. Готовы к серийному производству, штучным заказам и сложным проектам с нестандартными требованиями.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { step: "01", title: "Загрузите файл", desc: "Отправьте STL/OBJ модель нам на почту или в мессенджер" },
                  { step: "02", title: "Расчёт", desc: "Рассчитаем точную стоимость и уточним требования" },
                  { step: "03", title: "Производство", desc: "Печатаем с контролем качества и постобработкой" },
                  { step: "04", title: "Получите", desc: "Самовывоз или доставка курьером / почтой" },
                ].map(item => (
                  <div key={item.step} className="text-center">
                    <div className="text-3xl md:text-4xl font-black font-mono-code text-blue-500/20 mb-2">{item.step}</div>
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
      <section id="contacts" className="py-16 md:py-24 bg-secondary/20 bg-grid">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">04 / Контакты</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Свяжитесь с нами</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">Отправьте файл модели и получите точный расчёт в течение часа</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5 md:gap-8">
            <div className="card-glow bg-card rounded-xl p-6 space-y-6">
              <h3 className="font-bold text-white text-lg">Контактная информация</h3>

              {[
                { icon: "Mail", label: "Email", value: "DATAR3D@yandex.ru", href: "mailto:DATAR3D@yandex.ru" },
                { icon: "Phone", label: "Телефон", value: "+7 (977) 640-69-64", href: "tel:+79776406964" },
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
              {orderSent ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-green-400" />
                  </div>
                  <p className="text-white font-semibold">Заявка отправлена!</p>
                  <p className="text-muted-foreground text-sm">Мы свяжемся с вами в ближайшее время</p>
                  <button onClick={() => { setOrderSent(false); setOrderName(""); setOrderContact(""); setOrderPrintType(""); setOrderDescription(""); }} className="text-blue-400 text-sm hover:underline mt-2">Отправить ещё одну</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={orderName}
                    onChange={e => setOrderName(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Телефон или email"
                    value={orderContact}
                    onChange={e => setOrderContact(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                  <select
                    value={orderPrintType}
                    onChange={e => setOrderPrintType(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors appearance-none"
                  >
                    <option value="" className="bg-card">Тип печати</option>
                    <option value="photo" className="bg-card">Фотополимерная</option>
                    <option value="extrusion" className="bg-card">Экструзионная</option>
                  </select>
                  <textarea
                    placeholder="Опишите задачу: объём, количество, требования к материалу и срокам..."
                    rows={4}
                    value={orderDescription}
                    onChange={e => setOrderDescription(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white placeholder-muted-foreground text-sm focus:outline-none focus:border-blue-500/60 transition-colors resize-none"
                  />
                  {orderError && <p className="text-red-400 text-sm">{orderError}</p>}
                  <button
                    disabled={orderSending}
                    onClick={async () => {
                      setOrderError("");
                      if (!orderName.trim() || !orderContact.trim()) {
                        setOrderError("Укажите имя и контакт");
                        return;
                      }
                      setOrderSending(true);
                      try {
                        const res = await fetch(SEND_ORDER_URL, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: orderName,
                            contact: orderContact,
                            print_type: orderPrintType,
                            description: orderDescription,
                            calc_type: calcType,
                            calc_material: selectedMaterial.name,
                            calc_volume: vol,
                            calc_quantity: qty,
                            calc_price_per_piece: Math.round(pricePerPiece),
                            calc_total_price: Math.round(totalPrice),
                          }),
                        });
                        if (res.ok) {
                          setOrderSent(true);
                        } else {
                          setOrderError("Ошибка отправки. Попробуйте позже.");
                        }
                      } catch {
                        setOrderError("Ошибка сети. Попробуйте позже.");
                      } finally {
                        setOrderSending(false);
                      }
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100"
                  >
                    <Icon name={orderSending ? "Loader" : "Send"} size={16} className={orderSending ? "animate-spin" : ""} />
                    {orderSending ? "Отправляем..." : "Отправить заявку"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/bucket/36208e6f-53ef-46f2-89b4-57689e1acfda.jpg" alt="DATAR 3D" className="w-8 h-8 rounded object-cover" />
            <span className="font-bold text-white text-sm tracking-tight">DATA<span className="text-blue-400">R</span> <span className="text-white">3D</span></span>
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