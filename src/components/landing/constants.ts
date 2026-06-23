export const ANALYZE_IMAGE_URL = "https://functions.poehali.dev/82aa100b-18c1-4a0f-959d-7e36027ecf84";
export const SEND_ORDER_URL = "https://functions.poehali.dev/3d462ff9-cdff-4155-bb2d-15fdee341c9e";
export const UPLOAD_URL = "https://functions.poehali.dev/db1062dc-e62e-4ff1-adf3-e68e0e0e2495";

export const PHOTO_MATERIALS = [
  { id: "standard", name: "Стандартная смола", pricePerCm3: 35, color: "#60a5fa", desc: "Общие модели, прототипы, детали" },
  { id: "abs-like", name: "ABS-подобная смола", pricePerCm3: 42, color: "#818cf8", desc: "Функциональные детали, высокая прочность" },
  { id: "flexible", name: "Гибкая смола", pricePerCm3: 58, color: "#34d399", desc: "Гнущиеся детали, прокладки, грипсы" },
  { id: "castable", name: "Выжигаемая смола", pricePerCm3: 90, color: "#fbbf24", desc: "Ювелирное литьё, мастер-модели" },
];

export const EXTRUSION_MATERIALS = [
  { id: "pla", name: "PLA", pricePerCm3: 12, color: "#60a5fa", desc: "Прототипы, декор, фигурки" },
  { id: "petg", name: "PETG", pricePerCm3: 16, color: "#34d399", desc: "Водостойкие детали, функциональные части" },
  { id: "abs", name: "ABS", pricePerCm3: 18, color: "#f97316", desc: "Термостойкие детали, корпуса" },
  { id: "tpu", name: "TPU", pricePerCm3: 24, color: "#a78bfa", desc: "Гибкие изделия, уплотнители" },
  { id: "pa", name: "Нейлон (PA)", pricePerCm3: 32, color: "#fbbf24", desc: "Высоконагруженные детали, шестерни" },
  { id: "carbon", name: "Carbon Fiber", pricePerCm3: 55, color: "#94a3b8", desc: "Лёгкие прочные конструкции" },
];

export const PHOTO_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/files/4fa4d864-4f3a-4eeb-8ab8-acf791a0cbd2.jpg";
export const EXTRUSION_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/files/4b923267-4b74-4b4e-a986-c6d8bbebd213.jpg";

export const LOGO_IMAGE = "https://cdn.poehali.dev/projects/e31e930a-24cf-44c8-937f-81d66ffe9044/bucket/36208e6f-53ef-46f2-89b4-57689e1acfda.jpg";

export type PrintType = "photo" | "extrusion";

export type ImageResult = {
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  volume_cm3?: number;
  note?: string;
  error?: string;
} | null;

export const navLinks = [
  { id: "home", label: "Главная" },
  { id: "types", label: "Виды печати" },
  { id: "calculator", label: "Калькулятор" },
  { id: "about", label: "О компании" },
  { id: "contacts", label: "Контакты" },
];