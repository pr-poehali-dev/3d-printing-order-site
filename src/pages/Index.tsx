import { useState, useRef } from "react";
import Header from "@/components/landing/Header";
import Calculator from "@/components/landing/Calculator";
import ContactSection from "@/components/landing/ContactSection";
import {
  ANALYZE_IMAGE_URL,
  SEND_ORDER_URL,
  PHOTO_MATERIALS,
  EXTRUSION_MATERIALS,
  PrintType,
  ImageResult,
} from "@/components/landing/constants";

export default function Index() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [calcType, setCalcType] = useState<PrintType>("photo");
  const [calcMaterial, setCalcMaterial] = useState("standard");
  const [volume, setVolume] = useState<string>("0");
  const [quantity, setQuantity] = useState<string>("1");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  const [imageResult, setImageResult] = useState<ImageResult>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [orderName, setOrderName] = useState("");
  const [orderContact, setOrderContact] = useState("");
  const [orderPrintType, setOrderPrintType] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderSending, setOrderSending] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderAgreed, setOrderAgreed] = useState(false);
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

  const selectPrintType = (type: PrintType) => {
    setCalcType(type);
    setCalcMaterial(type === "photo" ? "standard" : "pla");
    scrollTo("calculator");
  };

  const submitOrder = async () => {
    setOrderError("");
    if (!orderName.trim() || !orderContact.trim()) {
      setOrderError("Укажите имя и контакт");
      return;
    }
    if (!orderAgreed) {
      setOrderError("Необходимо принять условия договора оферты");
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
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollTo={scrollTo}
        selectPrintType={selectPrintType}
      />

      <Calculator
        calcType={calcType}
        setCalcType={setCalcType}
        calcMaterial={calcMaterial}
        setCalcMaterial={setCalcMaterial}
        materials={materials}
        selectedMaterial={selectedMaterial}
        volume={volume}
        setVolume={setVolume}
        quantity={quantity}
        setQuantity={setQuantity}
        vol={vol}
        qty={qty}
        pricePerPiece={pricePerPiece}
        totalPrice={totalPrice}
        imageAnalyzing={imageAnalyzing}
        imageResult={imageResult}
        previewUrl={previewUrl}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
        scrollTo={scrollTo}
        orderAgreed={orderAgreed}
        setOrderAgreed={setOrderAgreed}
      />

      <ContactSection
        orderName={orderName}
        setOrderName={setOrderName}
        orderContact={orderContact}
        setOrderContact={setOrderContact}
        orderPrintType={orderPrintType}
        setOrderPrintType={setOrderPrintType}
        orderDescription={orderDescription}
        setOrderDescription={setOrderDescription}
        orderSending={orderSending}
        orderSent={orderSent}
        setOrderSent={setOrderSent}
        orderError={orderError}
        orderAgreed={orderAgreed}
        setOrderAgreed={setOrderAgreed}
        submitOrder={submitOrder}
      />
    </div>
  );
}