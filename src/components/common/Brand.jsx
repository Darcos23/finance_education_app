export default function Brand({ compact = false }) {
  return (
    <div className="logo-row" aria-label="FinPath">
      <img src="/finpath-logo.png" alt="Logo FinPath" />
      {!compact && <span className="logo-word">FinPath</span>}
    </div>
  );
}
