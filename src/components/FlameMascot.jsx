export default function FlameMascot({ className = "h-16 w-16" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="flameOuter" x1="50" y1="6" x2="50" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF9B5C" />
          <stop offset="1" stopColor="#C93E08" />
        </linearGradient>
        <linearGradient id="flameInner" x1="50" y1="30" x2="50" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB627" />
          <stop offset="1" stopColor="#F2540E" />
        </linearGradient>
      </defs>
      <path
        d="M50 6C41 22 26 32 26 52c0 15.5 10.7 28 24 28s24-12.5 24-28c0-9-4-15-8-21 .5 7-2 12-6 14 1-11-4-22-10-39z"
        fill="url(#flameOuter)"
      />
      <path
        d="M50 30c-4.5 10-13 16-13 27.5C37 68 42.8 76 50 76s13-8 13-18.5c0-4.8-1.8-8.2-4.2-11.3.2 3.8-1 6.5-3.2 7.6.8-6-1.6-13-5.6-23.8z"
        fill="url(#flameInner)"
      />
    </svg>
  );
}
