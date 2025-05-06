import { cn } from "@/lib/utils";

interface OrgaioLogoProps {
  className?: string;
}

export function OrgaioLogo({ className }: OrgaioLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      className={cn("text-[#7C444F]", className)}
    >
      <defs>
        <linearGradient
          id="orgaio-gradient"
          x1="10"
          y1="10"
          x2="110"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7C444F" />
          <stop offset="0.5" stopColor="#E16A54" />
          <stop offset="1" stopColor="#F39E60" />
        </linearGradient>
      </defs>
      <rect
        x="10"
        y="10"
        width="100"
        height="100"
        rx="20"
        fill="url(#orgaio-gradient)"
      />
      <path
        d="M40 45L50 55L75 30"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="35" y="65" width="50" height="8" rx="4" fill="white" />
      <rect
        x="35"
        y="80"
        width="35"
        height="8"
        rx="4"
        fill="white"
        opacity="0.8"
      />
    </svg>
  );
}
