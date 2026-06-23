import { RefObject } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PrintType, ImageResult } from "./constants";

interface Material {
  id: string;
  name: string;
  pricePerCm3: number;
  color: string;
  desc: string;
}

interface CalculatorProps {
  calcType: PrintType;
  setCalcType: (v: PrintType) => void;
  calcMaterial: string;
  setCalcMaterial: (v: string) => void;
  materials: Material[];
  selectedMaterial: Material;
  volume: string;
  setVolume: (v: string) => void;
  quantity: string;
  setQuantity: (v: string | ((q: string) => string)) => void;
  vol: number;
  qty: number;
  pricePerPiece: number;
  totalPrice: number;
  isMinOrder: boolean;
  imageAnalyzing: boolean;
  imageResult: ImageResult;
  previewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleImageUpload: (file: File) => void;
  scrollTo: (id: string) => void;
  orderAgreed: boolean;
  setOrderAgreed: (v: boolean) => void;
}

export default function Calculator({
  calcType,
  setCalcType,
  calcMaterial,
  setCalcMaterial,
  materials,
  selectedMaterial,
  volume,
  setVolume,
  quantity,
  setQuantity,
  vol,
  qty,
  pricePerPiece,
  totalPrice,
  isMinOrder,
  imageAnalyzing,
  imageResult,
  previewUrl,
  fileInputRef,
  handleImageUpload,
  scrollTo,
  orderAgreed,
  setOrderAgreed,
}: CalculatorProps) {
  return (
    <section id="calculator" className="py-16 md:py-24 bg-secondary/20 bg-grid overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">02 / Калькулятор</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Расчёт стоимости</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm md:text-base">Введите объём модели из вашей слайсер-программы (Chitubox, PrusaSlicer и др.)</p>
        </div>

        <div className="w-full max-w-md sm:max-w-4xl mx-auto">
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
                <div className="space-y-6 min-w-0">
                  <div>
                    <label className="text-xs font-mono-code text-blue-400 uppercase tracking-wider mb-3 block">Материал</label>
                    <div className="grid grid-cols-1 gap-2">
                      {materials.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setCalcMaterial(m.id)}
                          className={`w-full flex items-center justify-between gap-2 p-3 rounded-lg border text-left transition-all ${calcMaterial === m.id ? "border-blue-500/60 bg-blue-500/10" : "border-border hover:border-blue-500/30 hover:bg-secondary/50"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                            <div className="min-w-0">
                              <div className={`text-sm font-semibold ${calcMaterial === m.id ? "text-white" : "text-muted-foreground"}`}>{m.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{m.desc}</div>
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
                <div className="space-y-6 min-w-0">
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
                        onChange={e => {
                          let v = e.target.value;
                          if (/^0\d/.test(v)) v = v.replace(/^0+/, "");
                          setVolume(v);
                        }}
                        min="0.1"
                        step="0.1"
                        className="no-spinner w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-white text-xl sm:text-2xl font-black font-mono-code focus:outline-none focus:border-blue-500/60 transition-colors"
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
                        className="no-spinner flex-1 min-w-0 bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-white text-xl font-black font-mono-code text-center focus:outline-none focus:border-blue-500/60 transition-colors"
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
                        {isMinOrder && <div className="text-xs text-blue-400 mt-1">минимальный заказ 2 000 ₽</div>}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">* Финальная стоимость может включать постобработку и доставку. Точная цена — после анализа файла.</p>
                  </div>

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
                  <button
                    onClick={() => scrollTo("contacts")}
                    disabled={!orderAgreed}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100"
                  >
                    Отправить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}