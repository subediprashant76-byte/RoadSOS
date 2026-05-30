export const Logo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#FF1C35" />
    <path d="M20 4L36 34H4L20 4Z" fill="white" fillOpacity="0.15" />
    <rect x="18" y="8" width="4" height="4" rx="1" fill="white" />
    <rect x="8" y="24" width="24" height="3" rx="1.5" fill="white" />
    <rect x="8" y="29" width="24" height="3" rx="1.5" fill="white" />
    <circle cx="20" cy="19" r="5" fill="white" />
    <text x="20" y="23" textAnchor="middle" fontSize="7" fontWeight="900" fill="#FF1C35" fontFamily="Arial">SOS</text>
  </svg>
);
