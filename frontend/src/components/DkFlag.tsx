export default function DkFlag({ className = "w-4 h-3 inline-block rounded-[2px] shadow-sm align-middle mx-1 shrink-0" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 37 28" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bandera de Dinamarca"
      role="img"
    >
      <rect width="37" height="28" fill="#C8102E" />
      <rect x="12" width="4" height="28" fill="#FFFFFF" />
      <rect y="12" width="37" height="4" fill="#FFFFFF" />
    </svg>
  );
}
