// components/logo.tsx
export function Logo({ className = "" }: { className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className={className}
        aria-hidden="true"
      >
        <rect x="20" y="30" width="60" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="4"/>
        <rect x="30" y="20" width="40" height="10" rx="2" fill="currentColor"/>
        <line x1="35" y1="45" x2="65" y2="45" stroke="currentColor" stroke-width="4"/>
        <line x1="35" y1="55" x2="55" y2="55" stroke="currentColor" stroke-width="4"/>
      </svg>
    )
  }