export default function SeoSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono-code text-blue-400 tracking-widest uppercase">03 / Услуги</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
              3D печать на заказ в Москве
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground leading-relaxed text-sm md:text-base">
            <div className="card-glow bg-card rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Фотополимерная печать на заказ</h3>
              <p>
                Печатаем на фотополимерном 3D-принтере с высокой детализацией: стандартная смола, ABS-подобная,
                гибкая и выжигаемая смола для ювелирного литья. Подходит для мастер-моделей, миниатюр и
                функциональных прототипов.
              </p>
            </div>
            <div className="card-glow bg-card rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Экструзионная (FDM) 3D печать</h3>
              <p>
                Печать PLA, ABS, PETG, TPU, нейлоном и карбоном для прочных функциональных деталей, корпусов
                и крупногабаритных изделий. Заказать 3D печать по своему файлу STL можно с точным расчётом
                стоимости на сайте.
              </p>
            </div>
            <div className="card-glow bg-card rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Расчёт стоимости 3D печати онлайн</h3>
              <p>
                Загрузите фото или укажите объём модели — калькулятор мгновенно посчитает точную цену печати
                по объёму, материалу и количеству изделий.
              </p>
            </div>
            <div className="card-glow bg-card rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Печать по чертежу и прототипирование</h3>
              <p>
                Работаем с инженерами и дизайнерами: печать прототипов, единичных деталей и партий по STL,
                OBJ, STEP и 3MF файлам. Доставка по Москве или самовывоз с Орехового проезда.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}