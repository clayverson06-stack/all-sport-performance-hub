import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import videoThumbnail from "@/assets/video-thumbnail.jpg";

// ============================================================
// LINKS DE CHECKOUT — pega aquí tus enlaces de pago:
// ============================================================
const CHECKOUT_BASICO = "PEGAR_LINK_CHECKOUT_BASICO_AQUI";
const CHECKOUT_COMPLETO = "PEGAR_LINK_CHECKOUT_COMPLETO_AQUI";
// ============================================================

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plataforma Multideporte Pro — +5.000 Entrenamientos en Un Solo Lugar" },
      {
        name: "description",
        content:
          "+1.000 entrenamientos de básquetbol, +1.000 de vóleibol, +1.000 de futsal, +2.000 de fútbol de campo y la guía nutricional de los atletas profesionales. Acceso de por vida.",
      },
      { property: "og:title", content: "Plataforma Multideporte Pro" },
      {
        property: "og:description",
        content:
          "Todo lo que necesitas para rendir al máximo, en una sola plataforma. Entrenamientos de 4 deportes + guía nutricional. Acceso de por vida.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type PackageId = "basico" | "completo";

const FAQ_ITEMS = [
  {
    q: "¿Cómo recibo el acceso después de comprar?",
    a: "Inmediatamente después del pago recibirás un correo con tu acceso personal a la plataforma. El acceso es instantáneo.",
  },
  {
    q: "¿En qué dispositivos puedo entrenar?",
    a: "Desde celular, tablet o computadora. La plataforma es 100% online y funciona en cualquier navegador.",
  },
  {
    q: "¿Sirve para más de un deporte a la vez?",
    a: "Sí. Con el Paquete Completo tienes acceso ilimitado a los 4 deportes: básquetbol, vóleibol, futsal y fútbol de campo.",
  },
  {
    q: "¿Cuánto tiempo tengo acceso?",
    a: "De por vida. Pagas una sola vez y todo el contenido es tuyo para siempre, incluyendo futuras actualizaciones.",
  },
  {
    q: "¿Los planes de alimentación son para todos los niveles?",
    a: "Sí. Están organizados por objetivo — energía, recuperación y definición muscular — para que encuentres el ideal según tu nivel y meta.",
  },
  {
    q: "¿El pago es seguro?",
    a: "Sí, el pago es 100% seguro y procesado por una pasarela de pagos confiable. Además tienes 7 días de garantía total.",
  },
];

const TESTIMONIOS = [
  {
    texto: "[ Espacio para captura de testimonio real #1 ]",
    detalle: "Pega aquí la captura de un comentario o resultado de un alumno.",
  },
  {
    texto: "[ Espacio para captura de testimonio real #2 ]",
    detalle: "Pega aquí la captura de un comentario o resultado de un alumno.",
  },
  {
    texto: "[ Espacio para captura de testimonio real #3 ]",
    detalle: "Pega aquí la captura de un comentario o resultado de un alumno.",
  },
  {
    texto: "[ Espacio para captura de testimonio real #4 ]",
    detalle: "Pega aquí la captura de un comentario o resultado de un alumno.",
  },
];

function ScarcityModal({
  pkg,
  onClose,
}: {
  pkg: PackageId;
  onClose: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    // El cronómetro siempre empieza en 10:00 al abrir el modal
    setSecondsLeft(600);
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const checkoutUrl = pkg === "completo" ? CHECKOUT_COMPLETO : CHECKOUT_BASICO;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Oferta por tiempo limitado"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] bg-card p-8 shadow-2xl ring-4 ring-coral/60"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-2xl font-bold leading-tight text-balance">
          ⏳ ¡Espera! Esta puede ser tu última oportunidad a este precio
        </h3>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-ink py-5">
          <span className="font-display text-5xl font-bold tabular-nums text-mint">
            {mm}
          </span>
          <span className="font-display text-4xl font-bold text-cream/60">:</span>
          <span className="font-display text-5xl font-bold tabular-nums text-mint">
            {ss}
          </span>
        </div>

        <p className="mt-5 text-center text-sm leading-relaxed text-ink/70">
          Estás a un paso de asegurar tu acceso. Este precio de lanzamiento es
          exclusivo para quienes actúan ahora — cuando el cronómetro llegue a
          cero, el precio puede subir sin previo aviso.
        </p>

        <p className="mt-3 text-center text-xs font-extrabold uppercase tracking-wide text-ink/50">
          Paquete seleccionado:{" "}
          <span className="text-coral">
            {pkg === "completo" ? "Completo" : "Básico"}
          </span>
        </p>

        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-pulse mt-5 block w-full rounded-2xl bg-coral py-4 text-center font-display text-lg font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Confirmar mi Acceso Ahora
        </a>
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-xs font-bold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
        >
          Lo pensaré después
        </button>
      </div>
    </div>
  );
}

function Index() {
  const [modalPkg, setModalPkg] = useState<PackageId | null>(null);
  const paquetesRef = useRef<HTMLElement>(null);

  const openModal = (pkg: PackageId) => setModalPkg(pkg);
  const scrollToPaquetes = () =>
    paquetesRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background font-body text-ink">
      {/* HEADER */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-coral text-sm text-white">
            MP
          </span>
          Multideporte Pro
        </div>
        <span className="hidden rounded-full bg-lilac/40 px-4 py-2 text-xs font-extrabold sm:inline-block">
          Acceso de por vida
        </span>
      </header>

      {/* 1. HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center">
        <span className="mb-6 inline-block rounded-full bg-mint/40 px-4 py-2 text-xs font-extrabold">
          +5.000 entrenamientos · 1 plataforma
        </span>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
          Todo lo que Necesitas para Rendir al Máximo, en Una Sola Plataforma
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
          +1.000 entrenamientos de básquetbol, +1.000 de vóleibol, +1.000 de
          futsal, +2.000 de fútbol de campo, y la guía nutricional que usan los
          atletas profesionales. Todo organizado, todo en un solo lugar.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
          <span className="rounded-full bg-peach/60 px-4 py-2">🔒 Pago 100% seguro</span>
          <span className="rounded-full bg-sky/40 px-4 py-2">⚡ Acceso inmediato</span>
          <span className="rounded-full bg-lilac/40 px-4 py-2">♾️ Acceso de por vida</span>
        </div>
        <button
          onClick={scrollToPaquetes}
          className="cta-pulse mt-10 rounded-full bg-coral px-10 py-5 font-display text-xl font-bold text-white shadow-xl transition-transform hover:-translate-y-0.5"
        >
          Quiero Acceso Completo
        </button>
      </section>

      {/* 2. MINI-VSL */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="mb-6 text-center font-display text-3xl font-bold">
          Mira lo que vas a tener dentro de la plataforma
        </h2>
        {/* ESPACIO PARA VIDEO — reemplaza esta imagen por tu video cuando lo grabes */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] outline-1 -outline-offset-1 outline-black/5">
          <img
            src={videoThumbnail}
            alt="Atletas entrenando básquetbol, vóleibol y fútbol dentro de la plataforma"
            width={1280}
            height={720}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 cursor-pointer place-items-center rounded-full bg-coral text-3xl text-white shadow-xl transition-transform hover:scale-105">
              ▶
            </span>
          </span>
        </div>
        <p className="mt-5 text-center text-lg font-extrabold">
          🔥 Cupo limitado para el precio de lanzamiento
        </p>
      </section>

      {/* 3. FEEDBACK */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold">
          Esto es lo que dicen quienes ya están adentro
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIOS.map((t) => (
            <div
              key={t.texto}
              className="grid min-h-40 place-items-center rounded-3xl border-2 border-dashed border-ink/20 bg-card p-6 text-center"
            >
              <div>
                <p className="font-display text-base font-bold text-ink/50">
                  {t.texto}
                </p>
                <p className="mt-2 text-xs text-ink/40">{t.detalle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOS 4 DEPORTES */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold">
          Un solo lugar para todos tus deportes
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-coral/20 text-3xl">🏀</div>
            <p className="font-display text-lg font-bold">+1.000 Básquetbol</p>
            <p className="mt-2 text-sm text-ink/60">
              Técnica, tiro, defensa y trabajo físico específico.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-sky/30 text-3xl">🏐</div>
            <p className="font-display text-lg font-bold">+1.000 Vóleibol</p>
            <p className="mt-2 text-sm text-ink/60">
              Saque, recepción, ataque y bloqueo, organizados por nivel.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-mint/30 text-3xl">⚽</div>
            <p className="font-display text-lg font-bold">+1.000 Futsal</p>
            <p className="mt-2 text-sm text-ink/60">
              Técnica de espacio reducido, táctica y definición.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-lilac/30 text-3xl">🥅</div>
            <p className="font-display text-lg font-bold">+2.000 Fútbol de Campo</p>
            <p className="mt-2 text-sm text-ink/60">
              Por posición, edad y categoría.
            </p>
          </div>
        </div>
      </section>

      {/* 5. GUÍA NUTRICIONAL */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-sky/40 to-mint/40 p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold">
            La misma alimentación que usan los atletas profesionales
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/70">
            Más de 100 planes de alimentación reales, usados por atletas de
            alto rendimiento para entrenar más fuerte, recuperarse mejor y
            rendir al máximo en cada competencia. Organizados por objetivo:
            energía, recuperación, definición muscular.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-extrabold">
            <span className="rounded-full bg-card px-4 py-2">⚡ Energía</span>
            <span className="rounded-full bg-card px-4 py-2">💪 Recuperación</span>
            <span className="rounded-full bg-card px-4 py-2">🎯 Definición muscular</span>
          </div>
        </div>
      </section>

      {/* 6. CÓMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold">
          Cómo funciona
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl bg-card p-7 shadow-sm">
            <span className="font-display text-4xl font-bold text-coral">01</span>
            <p className="mt-3 font-display text-lg font-bold">
              Accede desde cualquier dispositivo
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Celular, tablet o computadora, 100% online.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-7 shadow-sm">
            <span className="font-display text-4xl font-bold text-coral">02</span>
            <p className="mt-3 font-display text-lg font-bold">
              Elige tu deporte y categoría
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Encuentra el entrenamiento ideal para tu nivel y objetivo.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-7 shadow-sm">
            <span className="font-display text-4xl font-bold text-coral">03</span>
            <p className="mt-3 font-display text-lg font-bold">
              Entrena con el método completo
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Video, plan y progresión, todo organizado para ti.
            </p>
          </div>
        </div>
      </section>

      {/* 7. PAQUETES */}
      <section ref={paquetesRef} className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold sm:text-4xl">
          🔥 Elige tu acceso
        </h2>
        <div className="grid items-center gap-6 lg:grid-cols-2">
          {/* BÁSICO */}
          <div className="rounded-3xl bg-card p-7 shadow-sm">
            <p className="font-display text-xl font-bold">Paquete Básico</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li>✓ +2.000 Ejercicios de Fútbol de Campo</li>
              <li>✓ Acceso de por vida</li>
            </ul>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-bold text-ink/40 line-through">$29,90</span>
              <span className="font-display text-4xl font-bold">$5,50</span>
              <span className="text-sm font-bold text-ink/60">USD</span>
            </div>
            <button
              onClick={() => openModal("basico")}
              className="mt-6 w-full rounded-2xl bg-ink py-3 text-sm font-extrabold text-cream transition-transform hover:-translate-y-0.5"
            >
              Quiero el Paquete Básico
            </button>
          </div>

          {/* COMPLETO — destacado */}
          <div className="relative rounded-[2rem] border-4 border-coral bg-card p-8 shadow-xl lg:scale-[1.04]">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-coral px-4 py-1.5 text-xs font-extrabold text-white">
              ⭐ MÁS ELEGIDO
            </span>
            <p className="font-display text-2xl font-bold">Paquete Completo</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li>✓ +1.000 Entrenamientos de Básquetbol</li>
              <li>✓ +1.000 Entrenamientos de Vóleibol</li>
              <li>✓ +1.000 Entrenamientos de Futsal</li>
              <li>✓ +2.000 Ejercicios de Fútbol de Campo</li>
              <li>✓ Guía Nutricional con +100 planes de alimentación</li>
              <li>🎁 BONO 01: Guía de Planificación Semanal de Entrenamientos</li>
              <li>🎁 BONO 02: Manual de Prevención de Lesiones y Recuperación</li>
              <li>🎁 BONO 03: Comunidad exclusiva + acceso a futuros deportes que se agreguen</li>
              <li>✓ Acceso de por vida</li>
            </ul>
            <div className="mt-5 flex flex-wrap items-baseline gap-2">
              <span className="font-bold text-ink/40 line-through">$74,90</span>
              <span className="font-display text-5xl font-bold text-coral">$10</span>
              <span className="text-sm font-bold text-ink/60">USD</span>
              <span className="rounded-full bg-mint/40 px-2 py-1 text-xs font-extrabold">
                Ahorras 87%
              </span>
            </div>
            <button
              onClick={() => openModal("completo")}
              className="cta-pulse mt-6 w-full rounded-2xl bg-coral py-5 font-display text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Quiero la Plataforma Completa
            </button>
          </div>
        </div>
      </section>

      {/* 8. GARANTÍA */}
      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-lilac/30 p-8 sm:flex-row sm:text-left">
          <div className="grid size-24 shrink-0 place-items-center rounded-full border-4 border-coral font-display text-4xl font-bold text-coral">
            7
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Pruébalo sin riesgo</h2>
            <p className="mt-3 text-ink/70">
              Tienes 7 días para explorar toda la plataforma. Si no es para ti,
              te devolvemos tu dinero completo, sin preguntas.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-border overflow-hidden rounded-3xl bg-card shadow-sm">
          {FAQ_ITEMS.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 font-display text-lg font-bold select-none">
                {item.q}
                <span className="text-2xl leading-none text-coral transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-ink/70">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 10. CIERRE FINAL */}
      <section className="mx-auto max-w-6xl px-6 pb-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl">
          Tu mejor versión empieza hoy
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Asegura tu acceso de por vida con el precio de lanzamiento antes de
          que suba.
        </p>
        <button
          onClick={() => openModal("completo")}
          className="cta-pulse mt-8 rounded-full bg-coral px-10 py-5 font-display text-xl font-bold text-white shadow-xl transition-transform hover:-translate-y-0.5"
        >
          Quiero Acceso Completo Ahora
        </button>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs font-bold text-ink/50">
        Plataforma Multideporte Pro · Pago 100% seguro · Acceso de por vida
      </footer>

      {/* MODAL DE ESCASEZ */}
      {modalPkg && (
        <ScarcityModal pkg={modalPkg} onClose={() => setModalPkg(null)} />
      )}
    </div>
  );
}
