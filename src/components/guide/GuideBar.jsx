import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Compass } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { isUnder, useGuide } from "../../context/GuideContext";

// Busca el elemento destino con reintentos (~1 s), lo centra y lo resalta con .guide-pulse.
function useGuideHighlight(target, enabled, locationKey) {
  useEffect(() => {
    if (!enabled || !target) return undefined;
    let frame = 0, tries = 0, element = null;
    const clear = () => {
      if (element) {
        element.classList.remove("guide-pulse");
        element.removeEventListener("pointerdown", clear);
        element.removeEventListener("click", clear);
      }
    };
    const find = () => {
      const found = document.querySelector(`[data-guide="${target}"]`);
      if (found) {
        element = found;
        found.scrollIntoView({ behavior: "smooth", block: "center" });
        found.classList.add("guide-pulse");
        found.addEventListener("pointerdown", clear, { once: true });
        found.addEventListener("click", clear, { once: true });
        return;
      }
      if (tries++ < 60) frame = requestAnimationFrame(find);
    };
    frame = requestAnimationFrame(find);
    return () => { cancelAnimationFrame(frame); clear(); };
  }, [target, enabled, locationKey]);
}

// Reserva bajo el contenido el alto real que ocupa la barra (compacta o expandida) para que nunca tape botones.
function useReservedSpace(ref, active) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!active || !ref.current) { root.style.removeProperty("--guide-space"); return undefined; }
    const update = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) root.style.setProperty("--guide-space", `${Math.ceil(window.innerHeight - rect.top + 16)}px`);
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(ref.current);
    window.addEventListener("resize", update);
    return () => { observer?.disconnect(); window.removeEventListener("resize", update); root.style.removeProperty("--guide-space"); };
  });
}

export default function GuideBar() {
  const guide = useGuide();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const barRef = useRef(null);
  // collapsed: la persona contrajo la barra en una pantalla que no es destino; vuelve a expandirse al cambiar de paso o de pantalla.
  const [collapsed, setCollapsed] = useState(false);
  const current = guide?.current;
  const visible = Boolean(guide?.barVisible && current);
  const pathname = location.pathname;
  const lessonMode = isUnder(pathname, "/lesson");
  const onDestination = Boolean(current) && isUnder(pathname, current.to);
  // Resaltado solo en la pantalla exacta del paso (la muestra Premium también tiene el contenedor de decisión).
  const highlightHere = Boolean(current) && (pathname === current.to ||
    (current.id === "decide" && pathname === "/premium/demo"));

  useEffect(() => { setExpanded(false); setCollapsed(false); }, [current?.id, pathname]);
  useGuideHighlight(current?.target, visible && highlightHere, location.key);
  useReservedSpace(barRef, visible);

  if (!visible) return null;
  const compact = lessonMode || ((onDestination || collapsed) && !expanded);
  const label = lessonMode && current.id === "lesson" ? "Termina esta lección" : current.title;

  const go = () => {
    setExpanded(false);
    navigate(current.to, { state: { source: "guide" } });
  };

  if (compact) return (
    <div ref={barRef} className="guide-bar compact" role="region" aria-label="Guía de primer uso">
      <button type="button" className="guide-bar-line" disabled={lessonMode}
        onClick={() => setExpanded(true)} aria-expanded="false">
        <Compass size={16} />
        <span><strong>Paso {current.number} de {guide.total}</strong> · {label}</span>
        {!lessonMode && <ChevronUp size={16} style={{ marginLeft: "auto" }} />}
      </button>
    </div>
  );

  return (
    <div ref={barRef} className="guide-bar" role="region" aria-label="Guía de primer uso">
      <div className="guide-bar-head">
        <span className="guide-bar-step"><Compass size={14} /> Paso {current.number} de {guide.total}</span>
        <button type="button" className="guide-bar-icon" aria-label="Contraer guía" onClick={() => { setExpanded(false); setCollapsed(true); }}><ChevronDown size={18} /></button>
      </div>
      <strong className="guide-bar-title">{current.title}</strong>
      <p className="guide-bar-text">{current.text}</p>
      <div className="guide-bar-actions">
        <button type="button" className="btn btn-yellow" onClick={go}>Ir ahora <ArrowRight size={17} /></button>
        <button type="button" className="guide-bar-off" onClick={() => guide.disableGuide("bar", current.id)}>Desactivar guía</button>
      </div>
    </div>
  );
}
