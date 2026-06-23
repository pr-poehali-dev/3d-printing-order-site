import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { LOGO_IMAGE } from "./constants";

interface ContactSectionProps {
  orderName: string;
  setOrderName: (v: string) => void;
  orderContact: string;
  setOrderContact: (v: string) => void;
  orderPrintType: string;
  setOrderPrintType: (v: string) => void;
  orderDescription: string;
  setOrderDescription: (v: string) => void;
  orderSending: boolean;
  orderSent: boolean;
  setOrderSent: (v: boolean) => void;
  orderError: string;
  orderAgreed: boolean;
  setOrderAgreed: (v: boolean) => void;
  orderModelFile: File | null;
  setOrderModelFile: (v: File | null) => void;
  submitOrder: () => void;
}

export default function ContactSection({
  orderName,
  setOrderName,
  orderContact,
  setOrderContact,
  orderPrintType,
  setOrderPrintType,
  orderDescription,
  setOrderDescription,
  orderSending,
  orderSent,
  setOrderSent,
  orderError,
  orderAgreed,
  setOrderAgreed,
  orderModelFile,
  setOrderModelFile,
  submitOrder,
}: ContactSectionProps) {
  return (
    <>
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
                { icon: "MessageCircle", label: "Telegram", value: "@DATAR3D", href: "https://t.me/DATAR3D" },
                { icon: "MapPin", label: "Адрес", value: "г. Москва, Ореховый проезд, д. 29 к. 1", href: "#" },
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
                  <button onClick={() => { setOrderSent(false); setOrderName(""); setOrderContact(""); setOrderPrintType(""); setOrderDescription(""); setOrderAgreed(false); setOrderModelFile(null); }} className="text-blue-400 text-sm hover:underline mt-2">Отправить ещё одну</button>
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

                  {orderModelFile ? (
                    <div className="flex items-center justify-between gap-3 bg-secondary/50 border border-blue-500/40 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name="FileBox" size={18} className="text-blue-400 flex-shrink-0" />
                        <span className="text-white text-sm truncate">{orderModelFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOrderModelFile(null)}
                        className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-blue-500/50 rounded-lg px-4 py-3 cursor-pointer transition-colors text-muted-foreground hover:text-blue-400 text-sm">
                      <Icon name="Upload" size={16} />
                      Прикрепить 3D-модель (STL, OBJ, STEP, 3MF)
                      <input
                        type="file"
                        accept=".stl,.obj,.step,.stp,.3mf,.ply,.gcode,.zip"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) setOrderModelFile(f); }}
                      />
                    </label>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={orderAgreed}
                      onChange={e => setOrderAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      Я ознакомлен(а) и принимаю условия{" "}
                      <Link to="/offer" target="_blank" className="text-blue-400 hover:underline">
                        договора публичной оферты
                      </Link>{" "}
                      и даю согласие на обработку персональных данных.
                    </span>
                  </label>
                  {orderError && <p className="text-red-400 text-sm">{orderError}</p>}
                  <button
                    disabled={orderSending}
                    onClick={submitOrder}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100"
                  >
                    {orderSending && <Icon name="Loader" size={16} className="animate-spin" />}
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
            <img src={LOGO_IMAGE} alt="DATAR 3D" className="w-8 h-8 rounded object-cover" />
            <span className="font-bold text-white text-sm tracking-tight">DATA<span className="text-blue-400">R</span> <span className="text-white">3D</span></span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Профессиональная 3D печать на заказ. Фотополимер и экструзия.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/offer" className="text-xs text-muted-foreground hover:text-blue-400 transition-colors">
              Договор оферты
            </Link>
            <span className="text-xs text-muted-foreground font-mono-code">© 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}