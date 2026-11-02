export default function ProgressBar({ value = 0, yellow = false }) {
  const safe = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className="progress-track" aria-label={`Progreso ${Math.round(safe)}%`}>
      <div className={`progress-fill ${yellow ? "progress-yellow" : ""}`} style={{ width: `${safe}%` }} />
    </div>
  );
}
