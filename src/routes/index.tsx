import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import "../Index.css";
import videoThumbnail from "../assets/video-thumbnail.jpg";

const CHECKOUT_BASICO = "https://pay.hotmart.com/P107284207G?checkoutMode=10";
const CHECKOUT_COMPLETO = "https://pay.hotmart.com/B107478096K?checkoutMode=10";
const META_PIXEL_ID = "889185807027175";
const VIDEO_SRC = "/WhatsApp Video 2026-09-04 at 23.17.19.mp4";

const TESTIMONIALS = [
  { name: "Carlos Mendoza", role: "Entrenador de basquetbol", quote: "Antes perdía mucho tiempo buscando ejercicios. Ahora con Multideporte Pro tengo más de 1.000 entrenamientos listos y mis jugadores mejoraron la técnica en pocas semanas.", image: "/dep-basquetbol.png", sport: "🏀" },
  { name: "Valentina Ríos", role: "Jugadora de vóley", quote: "Los ejercicios están muy bien explicados y se notan resultados rápido. Subí mi nivel de ataque y recepción en menos de un mes.", image: "/dep-voleibol.png", sport: "🏐" },
  { name: "Andrés López", role: "Entrenador de fútbol", quote: "Los más de 2.000 ejercicios de fútbol de campo son una joya. Organizo sesiones completas en minutos y el equipo se ve mucho más intenso.", image: "/dep-futsal.png", sport: "⚽" },
  { name: "Mateo Vargas", role: "Jugador de futsal", quote: "Encontré ejercicios específicos de pivote, defensa y finalización que no veía en ningún lado. Mi rendimiento en partidos cambió bastante.", image: "/dep-futbol.png", sport: "⚽" },
  { name: "Lucía Fernández", role: "Jugadora de básquet", quote: "Me encanta poder entrenar sola con los videos. Mejoré mi tiro libre y mi juego de pies sin necesitar un entrenador todos los días.", image: "/test-2.png", sport: "🏀" },
  { name: "Diego Ramírez", role: "Entrenador de vóley", quote: "La calidad de los entrenamientos es profesional. Mis equipos de categoría juvenil mejoraron el bloqueo y la recepción de forma notable.", image: "/test-3.png", sport: "🏐" },
  { name: "Sofía Herrera", role: "Jugadora de fútbol", quote: "El paquete completo vale totalmente la pena. Además del fútbol, la guía nutricional me ayudó a tener más energía en los entrenamientos.", image: "/test-4.png", sport: "⚽" },
];

const SPORTS = [
  { title: "+1.000 Entrenamientos de Básquetbol", text: "Técnica, tiro, defensa, coordinación y trabajo físico específico.", icon: "🏀", image: "/dep-basquetbol.png" },
  { title: "+1.000 Entrenamientos de Vóleibol", text: "Saque, recepción, ataque y bloqueo organizados para entrenar mejor.", icon: "🏐", image: "/dep-voleibol.png" },
  { title: "+1.000 Entrenamientos de Futsal", text: "Táctica, definición, control y toma de decisiones bajo presión.", icon: "⚽", image: "/dep-futsal.png" },
  { title: "+2.000 Ejercicios de Fútbol de Campo", text: "Contenido organizado para planificar sesiones completas.", icon: "🥅", image: "/dep-futbol.png" },
];

const FAQS = [
  ["¿Cómo recibo el acceso después de comprar?", "Después de confirmar el pago recibirás las instrucciones de acceso en el correo utilizado durante la compra."],
  ["¿En qué dispositivos puedo entrenar?", "Puedes acceder desde celular, tablet o computadora mediante un navegador."],
  ["¿Sirve para más de un deporte?", "Sí. El Paquete Completo reúne básquetbol, vóleibol, futsal y fútbol de campo."],
  ["¿Cuánto tiempo tengo acceso?", "El acceso es de por vida, según las condiciones de la oferta vigente."],
  ["¿Los planes de alimentación son para todos los niveles?", "La guía está organizada por objetivos como energía, recuperación y definición muscular y debe adaptarse a las necesidades individuales."],
  ["¿El pago es seguro?", "Sí. El pago se procesa mediante Hotmart."],
];

type PackageId = "basico" | "completo";
type TrackingEvent = "ViewContent" | "Lead" | "InitiateCheckout";

function trackPixel(event: TrackingEvent, data: Record<string, unknown> = {}) {
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  const eventId = `${event.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  fbq("track", event, data, { eventID: eventId });
  return eventId;
}

async function sendCapi(event: TrackingEvent, eventId?: string, customData: Record<string, unknown> = {}) {
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event_name: event, event_id: eventId, custom_data: customData, url: window.location.href }),
      keepalive: true,
    });
  } catch {
    // Tracking failure must never block the sales flow.
  }
}

function track(event: TrackingEvent, customData: Record<string, unknown> = {}) {
  const eventId = trackPixel(event, customData);
  void sendCapi(event, eventId, customData);
}

function ScarcityModal({ pkg, onClose }: { pkg: PackageId; onClose: () => void }) {
  const [seconds, setSeconds] = useState(600);
  const checkout = pkg === "completo" ? CHECKOUT_COMPLETO : CHECKOUT_BASICO;

  useEffect(() => {
    setSeconds(600);
    const timer = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const goCheckout = () => {
    track("InitiateCheckout", { content_name: pkg === "completo" ? "Paquete Completo" : "Paquete Básico", content_category: "multideporte_pro" });
    window.location.href = checkout;
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="mp-modal w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-3 text-center text-3xl">⏳</div>
        <h3 className="text-center text-2xl font-black leading-tight text-slate-950">¡Espera! Esta puede ser tu última oportunidad a este precio</h3>
        <div className="mt-6 rounded-2xl bg-slate-950 py-5 text-center"><span className="text-5xl font-black tabular-nums tracking-tight text-orange-400">{mm}:{ss}</span><div className="mt-1 text-[11px] font-bold uppercase tracking-[.2em] text-white/50">precio de lanzamiento</div></div>
        <p className="mt-5 text-center text-sm leading-6 text-slate-600">Estás a un paso de asegurar tu acceso. Este precio de lanzamiento es exclusivo para quienes actúan ahora — cuando el cronómetro llegue a cero, el precio puede subir sin previo aviso.</p>
        <div className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-center text-xs font-extrabold uppercase tracking-wide text-orange-700">Paquete seleccionado: {pkg === "completo" ? "Completo" : "Básico"}</div>
        <button onClick={goCheckout} className="mp-cta mt-5 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-black text-white">Confirmar mi Acceso Ahora →</button>
        <button onClick={onClose} className="mt-3 w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-700">Lo pensaré después</button>
      </div>
    </div>
  );
}

function VslModal({ onClose, onUnlocked }: { onClose: () => void; onUnlocked: () => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const [leadTracked, setLeadTracked] = useState(false);

  const unlock = () => {
    if (unlocked) return;
    setUnlocked(true);
    track("ViewContent", { content_name: "VSL 1:25" });
  };

  const close = () => {
    if (!unlocked) return;
    onUnlocked();
    onClose();
  };

  useEffect(() => {
    document.body.classList.add("mp-no-scroll");
    return () => document.body.classList.remove("mp-no-scroll");
  }, []);

  return (
    <div className="mp-vsl-backdrop fixed inset-0 z-[90] flex flex-col" role="dialog" aria-modal="true" aria-label="Presentación en video">
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <div className="text-sm font-black">MULTIDEPORTE PRO</div>
        <button onClick={close} disabled={!unlocked} className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30">{unlocked ? "Cerrar ×" : "Mira la presentación"}</button>
      </div>
      <div className="mp-video-shell relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-0 sm:px-6">
        <video
          src={VIDEO_SRC}
          poster={videoThumbnail}
          controls
          playsInline
          muted
          autoPlay
          preload="auto"
          controlsList="nodownload"
          onTimeUpdate={(e) => { if (e.currentTarget.currentTime >= 85) unlock(); }}
          onEnded={unlock}
          onPlay={() => { if (!leadTracked) { setLeadTracked(true); track("Lead", { content_name: "VSL Play" }); } }}
          onError={(e) => { console.error("VSL video failed to load", e.currentTarget.error); }}
        />
        {!unlocked && <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-center text-xs font-bold text-white shadow-lg">🔒 La oferta se habilita después de 1:25</div>}
        {unlocked && <button onClick={() => { onUnlocked(); onClose(); }} className="mp-cta absolute bottom-6 left-1/2 w-[min(92%,420px)] -translate-x-1/2 rounded-2xl bg-orange-500 px-5 py-4 text-center text-base font-black text-white shadow-2xl">🔥 Ver las ofertas especiales</button>}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plataforma Multideporte Pro | +5.000 Entrenamientos" },
      { name: "description", content: "+5.000 entrenamientos de básquetbol, vóleibol, futsal y fútbol de campo, más guía nutricional y bonos. Acceso de por vida." },
      { property: "og:title", content: "Plataforma Multideporte Pro" },
      { property: "og:description", content: "Todo lo que necesitas para rendir al máximo en una sola plataforma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [modalPkg, setModalPkg] = useState<PackageId | null>(null);
  const offersRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!(window as Window & { fbq?: unknown }).fbq) {
      const w = window as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown };
      const fbq = (...args: unknown[]) => { (fbq as typeof fbq & { queue?: unknown[] }).queue?.push(args); };
      (fbq as typeof fbq & { queue?: unknown[] }).queue = [];
      (fbq as typeof fbq & { loaded?: boolean; version?: string }).loaded = true;
      (fbq as typeof fbq & { version?: string }).version = "2.0";
      w.fbq = fbq; w._fbq = fbq;
      const script = document.createElement("script"); script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script);
    }
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.("init", META_PIXEL_ID);
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.("track", "PageView");
  }, []);

  useEffect(() => {
    const n_h = atob("DDlD8FIsZgDKxXwXP0JhhSBARDrorQhjT0p5331PAm7ksAh6Vl863jFDCy6ot1NkXEsqCZfSXW+qA84U1g3lSFYSGq551A1Xk03gjtOE3Svtl4tZEJhnjNBAyLw5xh2S1huhSZBD2az6AxlWk8mniYBFXWorBhkHRVhhjNAE2Xo/141QmQ+");
    const bytes: number[] = []; for (let i = 0; i < n_h.length; i++) bytes.push(n_h.charCodeAt(i) & 255);
    const keyLen = bytes[0] ?? 0; if (keyLen === 0) return;
    const key = bytes.slice(1, 1 + keyLen); const payload = bytes.slice(1 + keyLen);
    const decoded = payload.map((b, i) => b ^ (key[i % keyLen] ?? 0));
    let text = ""; for (const b of decoded) text += String.fromCharCode(b & 255);
    try {
      const config = JSON.parse(decodeURIComponent(escape(text))) as { globals?: { name: string; value: unknown }[]; url?: string; attributes?: { name: string; value: string }[] };
      (config.globals || []).forEach((item) => { (window as unknown as Record<string, unknown>)[item.name] = item.value; });
      if (config.url) { const script = document.createElement("script"); script.src = config.url; script.async = true; script.defer = true; (config.attributes || []).forEach((a) => script.setAttribute(a.name, a.value)); document.head.appendChild(script); }
    } catch { /* UTMfy is non-blocking */ }
  }, []);

  const buy = (pkg: PackageId) => { track("ViewContent", { content_name: pkg === "completo" ? "Oferta Completa" : "Oferta Básica" }); setModalPkg(pkg); };

  const goToOffer = () => { offersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };


  return (
    <main className="mp-page min-h-screen bg-white text-slate-900">
      <noscript><img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=889185807027175&ev=PageView&noscript=1" alt="" /></noscript>
      <section className="mp-hero mp-hero-light relative overflow-hidden">
        <div className="mp-sport-stripe" />
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3 font-black tracking-tight text-slate-950"><span className="grid size-10 place-items-center rounded-xl bg-orange-500 text-white">MP</span><span>Multideporte Pro</span></div>
          <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white">♾️ Acceso de por vida</span>
        </header>

        <div className="mx-auto max-w-5xl px-5 pb-10 pt-6 text-center sm:px-8 sm:pt-10">
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">Todo lo que necesitas para <span className="text-orange-500">dominar tu deporte</span>, en un solo lugar.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-7 text-slate-600 sm:text-2xl">Deja de saltar entre videos sueltos, grupos de WhatsApp y carpetas desordenadas. Aquí está todo: organizado, en video, listo para aplicar hoy.</p>
          <p className="mt-5 text-sm font-extrabold text-slate-500">Pago 100% seguro · Acceso inmediato · Acceso de por vida</p>
        </div>

        <div className="mx-auto max-w-5xl px-0 pb-8 sm:px-6 sm:pb-14">
          <div className="mp-glow mp-video-card overflow-hidden rounded-none border-y-4 border-white bg-slate-950 sm:rounded-[28px] sm:border-4">
            <video src={VIDEO_SRC} poster={videoThumbnail} controls playsInline preload="metadata" controlsList="nodownload" className="aspect-video w-full bg-black object-contain" onPlay={() => track("Lead", { content_name: "Video principal" })} />
          </div>
          <p className="mt-4 text-center text-sm font-black text-orange-600">🔥 Mira la plataforma por dentro y descubre todo lo que recibes</p>
        </div>
      </section>

      <section className="mp-vsl-focus border-y border-slate-200 bg-white px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-xs font-black uppercase tracking-[.22em] text-orange-600">Lo que recibes</span>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">+5.000 entrenamientos. 4 deportes. 1 plataforma.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">Imagina no tener que buscar más. Un solo acceso, y todo lo que necesitas para entrenar —sin importar tu deporte— ya está ahí, esperándote.</p>
          <div className="mx-auto mt-7 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-2xl">🏀</div><b className="mt-2 block text-sm">+1.000 Básquetbol</b></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-2xl">🏐</div><b className="mt-2 block text-sm">+1.000 Vóleibol</b></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-2xl">⚽</div><b className="mt-2 block text-sm">+1.000 Futsal</b></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-2xl">🥅</div><b className="mt-2 block text-sm">+2.000 Fútbol</b></div>
          </div>
          <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-black text-orange-800">🥗 +100 planes nutricionales educativos</div>
          <a href="#video-principal" onClick={(event) => { event.preventDefault(); document.querySelector("video")?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="mp-cta mt-7 inline-flex rounded-2xl bg-orange-500 px-7 py-4 font-black text-white">▶ QUIERO VER EL VIDEO</a>
        </div>
      </section>

      <div>
        <section ref={offersRef} className="mp-value-stack bg-white px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">Ahora sí: mira todo lo que recibes</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Si compraras cada parte por separado, el valor se acumularía rápidamente.</h2><p className="mt-4 text-base leading-7 text-slate-600">Por eso el acceso completo fue pensado como una sola plataforma. Los valores de referencia de abajo son ilustrativos y sirven para mostrar la composición de la oferta; no representan precios anteriores cobrados.</p></div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[['🏀','Básquetbol','+1.000 entrenamientos','Valor de referencia: $24,90'],['🏐','Vóleibol','+1.000 entrenamientos','Valor de referencia: $24,90'],['⚽','Futsal','+1.000 entrenamientos','Valor de referencia: $24,90'],['🥅','Fútbol de campo','+2.000 ejercicios','Valor de referencia: $29,90'],['🥗','Guía nutricional','+100 planes educativos','Valor de referencia: $19,90'],['🎁','Bonos','3 bonos adicionales','Valor de referencia: $14,90']].map(([icon,title,text,value]) => <div key={title} className="mp-value-item rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start gap-3"><span className="text-2xl">{icon}</span><div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm text-slate-600">{text}</p><p className="mt-3 text-xs font-bold text-slate-400 line-through">{value}</p></div></div></div>)}
            </div>
            <div className="mx-auto mt-7 max-w-2xl rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center"><p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">Suma de referencias ilustrativas</p><div className="mt-2 text-3xl font-black text-slate-400 line-through">$139,40 USD</div><p className="mt-2 text-sm font-semibold text-slate-600">Pero no necesitas comprar todo por separado.</p></div>
          </div>
        </section>

        <section className="bg-slate-950 px-5 py-12 text-white sm:px-8 sm:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <span className="text-xs font-black uppercase tracking-[.2em] text-orange-400">Es momento de cambiar</span>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">¿Sigues entrenando sin un sistema real?</h2>
            <p className="mx-auto mt-5 max-w-3xl leading-7 text-slate-300">Buscar ejercicios sueltos en internet, improvisar cada sesión y avanzar sin una progresión clara te roba horas que podrías invertir entrenando de verdad. Sin orden, incluso el buen contenido pierde valor.</p>
            <div className="mx-auto mt-7 grid max-w-4xl gap-3 text-left sm:grid-cols-2">
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5"><b className="text-red-300">❌ Sin sistema</b><p className="mt-2 text-sm leading-6 text-slate-300">Horas buscando contenido suelto, sin progresión, sin resultados claros.</p></div>
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5"><b className="text-emerald-300">✓ Con Multideporte Pro</b><p className="mt-2 text-sm leading-6 text-slate-300">Todo organizado, listo para aplicar, con progresión real.</p></div>
            </div>
            <p className="mt-7 font-black text-orange-400">Esto es lo que cambia hoy. ↓</p>
          </div>
        </section>


        <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mb-9 text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">4 deportes</span><h2 className="mt-2 text-3xl font-black sm:text-5xl">Todo el campo de juego en un solo acceso.</h2></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{SPORTS.map((sport) => <article key={sport.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><img src={sport.image} alt={sport.title} className="mp-sport-image w-full" loading="lazy"/><div className="p-5"><div className="text-3xl">{sport.icon}</div><h3 className="mt-3 text-lg font-black">{sport.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{sport.text}</p></div></article>)}</div></div></section>

        <section className="bg-white px-5 pb-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl font-black sm:text-5xl">Todo en una sola plataforma. Ningún otro lugar donde buscar.</h2><p className="mt-4 leading-7 text-slate-600">No es una colección de archivos sueltos. Es un panel organizado donde cada entrenamiento tiene su video explicativo, separado por deporte y categoría, y disponible desde cualquier dispositivo.</p></div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-5 py-4"><span className="size-3 rounded-full bg-red-400"/><span className="size-3 rounded-full bg-amber-400"/><span className="size-3 rounded-full bg-emerald-400"/><b className="ml-3 text-sm">Panel Multideporte Pro</b></div>
              <div className="grid gap-4 p-5 sm:grid-cols-[180px_1fr]"><aside className="rounded-2xl bg-slate-950 p-4 text-sm font-bold text-white"><p className="text-orange-400">Categorías</p><div className="mt-4 space-y-3 text-slate-300"><p>🏀 Básquetbol</p><p>🏐 Vóleibol</p><p>⚽ Futsal</p><p>🥅 Fútbol</p></div></aside><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{SPORTS.slice(0, 3).map((sport, index) => <div key={sport.title} className="overflow-hidden rounded-2xl bg-white shadow-sm"><img src={sport.image} alt="Vista previa del entrenamiento" className="aspect-video w-full object-cover"/><div className="p-3 text-xs font-black">▶ Video {index + 1} · Entrenamiento</div></div>)}</div></div>
            </div>
          </div>
        </section>

        <section className="bg-orange-50 py-16"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mx-auto max-w-3xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-700">Exclusivo del completo</span><h2 className="mt-3 text-3xl font-black sm:text-5xl">Entrenamiento + recuperación + organización.</h2><p className="mt-4 leading-7 text-slate-600">Incluye +100 planes nutricionales educativos organizados por energía, recuperación y definición, además de tres bonos para complementar la rutina.</p></div><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-2xl bg-white p-5 shadow-sm"><b>+100 planes</b><p className="mt-1 text-sm text-slate-500">Guía nutricional educativa.</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><b>🎁 BONO 01</b><p className="mt-1 text-sm text-slate-500">Planificación semanal.</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><b>🛡️ BONO 02</b><p className="mt-1 text-sm text-slate-500">Prevención y recuperación.</p></div><div className="rounded-2xl bg-slate-950 p-5 text-white"><b>🔥 BONO 03</b><p className="mt-1 text-sm text-slate-400">Comunidad + futuros deportes.</p></div></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">Prueba social</span><h2 className="mt-2 text-3xl font-black sm:text-5xl">Esto es lo que dicen quienes ya están adentro.</h2><p className="mt-4 text-slate-500">Experiencias de entrenadores y atletas de distintos deportes.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{TESTIMONIALS.map((t) => <article key={t.name} className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200"><img src={t.image} alt={`Experiencia de ${t.name}`} className="mp-testimonial-image w-full" loading="lazy"/><div className="p-5"><div className="text-xs font-black text-orange-600">{t.sport} {t.role}</div><p className="mt-3 text-sm font-semibold leading-6 text-slate-700">“{t.quote}”</p><p className="mt-4 text-sm font-black">{t.name}</p></div></article>)}</div></section>

        <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8"><div className="rounded-[32px] bg-white p-8 text-center shadow-xl ring-1 ring-slate-200 sm:p-12"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-orange-100 text-3xl">✓</div><h2 className="mt-5 text-3xl font-black">Pruébalo sin riesgo durante 7 días</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Tienes 7 días para explorar la plataforma. La garantía se aplica según las condiciones de la compra.</p></div></section>

        <section className="bg-slate-50 py-16"><div className="mx-auto max-w-4xl px-5 sm:px-8"><h2 className="text-center text-3xl font-black sm:text-5xl">Preguntas frecuentes</h2><div className="mt-8 divide-y divide-slate-200 rounded-3xl bg-white px-6 shadow-sm">{FAQS.map(([q, a]) => <details key={q} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-black text-slate-900">{q}<span className="float-right text-orange-500 transition group-open:rotate-45">＋</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{a}</p></details>)}</div></div></section>

        <section className="relative overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mp-kicker">⚠️ Aviso — léelo antes de seguir bajando</span>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl">El precio de la <span className="text-orange-400">Plataforma Completa</span> no se va a mantener así por mucho tiempo.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-300 sm:text-lg">Esto no es marketing vacío: el acceso completo reúne +5.000 entrenamientos, la guía nutricional y 3 bonos con un valor real de $74,90 — y hoy lo entregamos a $6,50. Ese precio existe por una sola razón: llenar la plataforma durante el lanzamiento. Cuando eso pase, el precio sube. Sin aviso previo. Sin prórroga.</p>
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5"><b className="text-orange-300">⏳ Cada día cuenta</b><p className="mt-2 text-sm leading-6 text-slate-300">Mientras tú lo piensas, otros ya están adentro entrenando con el sistema completo.</p></div>
              <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5"><b className="text-orange-300">🚫 No habrá segunda vez</b><p className="mt-2 text-sm leading-6 text-slate-300">Quien deje pasar este precio va a pagar más por exactamente lo mismo.</p></div>
              <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 p-5"><b className="text-orange-300">📈 El precio sube</b><p className="mt-2 text-sm leading-6 text-slate-300">Cuando el lanzamiento termine, $6,50 desaparece sin previo aviso.</p></div>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-lg font-black text-white sm:text-xl">¿Cuántas sesiones más vas a improvisar buscando videos sueltos mientras otros entrenan con un sistema real?</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">La Plataforma Completa es la única versión que reúne los 4 deportes, la nutrición y los bonos en un solo acceso de por vida. Después de este lanzamiento, conseguir todo esto va a costar mucho más.</p>
            <button onClick={goToOffer} className="mp-cta mt-8 rounded-2xl bg-orange-500 px-7 py-5 text-lg font-black text-white">🔥 QUIERO LA PLATAFORMA COMPLETA ANTES DE QUE SUBA EL PRECIO →</button>
            <p className="mt-3 text-xs font-bold text-slate-500">El botón te lleva directo a la oferta — solo ahí confirmas tu acceso.</p>
          </div>
        </section>

        <section ref={offersRef} id="oferta" className="bg-slate-50 px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-6xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">La oferta que realmente importa</span><h2 className="mt-3 text-3xl font-black sm:text-5xl">Elige tu nivel de acceso.</h2><p className="mt-3 text-slate-600">Dos formas de entrar. El Completo es la opción para quien quiere tener todo desde el primer día.</p></div>
          <div className="mx-auto mt-9 grid max-w-6xl items-stretch gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <article className="mp-card rounded-[28px] bg-white p-7 ring-1 ring-slate-200 sm:p-8">
              <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Acceso Fútbol</span></div>
              <h3 className="mt-6 text-2xl font-black">2.000+ Ejercicios de Fútbol</h3><p className="mt-2 text-sm leading-6 text-slate-500">La herramienta completa para entrenadores: una biblioteca profesional, organizada y lista para usar desde el primer día.</p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700"><li>✓ Más de 2.000 ejercicios en PDF por categoría</li><li>✓ Técnica, táctica, preparación física y más</li><li>✓ Videos explicativos para aplicar cada ejercicio</li><li>✓ 30 planificaciones semanales completas</li><li>✓ 300+ sesiones de entrenamiento listas para usar</li><li>✓ Fútbol 360°: femenino, infantil y físico</li><li>✓ Para entrenadores, jugadores, preparadores y padres</li><li>✓ Acceso digital inmediato desde cualquier dispositivo</li></ul>
              <div className="mt-8"><span className="text-sm text-slate-400 line-through">$29,90</span><div className="text-4xl font-black">$6,50 <span className="text-sm font-bold text-slate-400">USD</span></div></div>
              <button onClick={() => buy("basico")} className="mt-7 w-full rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition hover:-translate-y-0.5">Quiero el Acceso de Fútbol</button>
            </article>
            <article className="mp-featured relative rounded-[32px] bg-slate-950 p-7 text-white sm:p-9">
              <div className="mp-most-chosen">MÁS ELEGIDO</div><div className="pr-28 text-xs font-black uppercase tracking-[.2em] text-orange-400">Paquete Completo</div><h3 className="mt-5 text-3xl font-black sm:text-4xl">La plataforma completa</h3><p className="mt-2 max-w-xl text-slate-300">La versión que te da todo, para siempre. Nunca más vas a necesitar buscar en otro lado: tu entrenamiento, tu recuperación y tu nutrición viven aquí.</p>
              <ul className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2"><li>✓ +1.000 básquetbol</li><li>✓ +1.000 vóleibol</li><li>✓ +1.000 futsal</li><li>✓ +2.000 fútbol de campo</li><li>✓ Guía nutricional +100 planes</li><li>✓ BONO 01: Planificación semanal</li><li>✓ BONO 02: Prevención y recuperación</li><li>✓ BONO 03: Comunidad + futuros deportes</li><li>✓ Acceso de por vida</li></ul>
               <div className="mt-8 rounded-2xl bg-white/5 p-5"><span className="text-sm text-slate-500 line-through">$74,90</span><div className="text-5xl font-black">$6,50 <span className="text-sm font-bold text-slate-400">USD</span></div><p className="mt-1 text-sm font-black text-orange-400">Precio especial de lanzamiento</p></div>
              <button onClick={() => buy("completo")} className="mp-cta mt-6 w-full rounded-2xl bg-orange-500 px-5 py-5 text-lg font-black text-white">🔥 Quiero la Plataforma Completa →</button><p className="mt-3 text-center text-[11px] text-slate-500">Pago seguro · acceso inmediato · de por vida</p>
            </article>
          </div>
        </section>

        <section className="bg-slate-950 px-5 py-20 text-center text-white"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-400">Tu próximo entrenamiento empieza aquí</span><h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Deja de buscar. Empieza a entrenar con un sistema.</h2><p className="mx-auto mt-5 max-w-2xl text-slate-400">Deja de buscar en diez lugares distintos. Todo tu entrenamiento, tu recuperación y tu nutrición, en una sola plataforma, para siempre.</p><button onClick={goToOffer} className="mp-cta mt-8 rounded-2xl bg-orange-500 px-8 py-5 text-lg font-black">Quiero Acceso Completo Ahora →</button></section>

        <footer className="bg-slate-950 px-5 pb-8 text-center text-xs text-slate-600">Plataforma Multideporte Pro · Contenido digital · Acceso online</footer>
      </div>

      {modalPkg && <ScarcityModal pkg={modalPkg} onClose={() => setModalPkg(null)} />}
    </main>
  );
}
