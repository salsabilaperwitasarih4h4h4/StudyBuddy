import React from 'react';
import { PlantCondition } from '../types';

interface PlantSvgProps {
  condition: PlantCondition;
  flowerCount?: number;
  isWatering?: boolean;
  size?: number;
}

export const PlantSvg: React.FC<PlantSvgProps> = ({ 
  condition, 
  flowerCount = 0, 
  isWatering = false,
  size = 190 
}) => {
  // Blossom component with soft petals and gold core
  const renderFlower = (cx: number, cy: number, scale = 1, key = 'flower') => (
    <g key={key} transform={`translate(${cx}, ${cy}) scale(${scale}) translate(-${cx}, -${cy})`}>
      {/* 5 Petals */}
      <circle cx={cx} cy={cy - 6} r="4.5" fill="#FDA4AF" />
      <circle cx={cx + 6} cy={cy - 2} r="4.5" fill="#FB7185" />
      <circle cx={cx + 4} cy={cy + 5} r="4.5" fill="#FDA4AF" />
      <circle cx={cx - 4} cy={cy + 5} r="4.5" fill="#FB7185" />
      <circle cx={cx - 6} cy={cy - 2} r="4.5" fill="#FDA4AF" />
      {/* Flower core */}
      <circle cx={cx} cy={cy} r="3.2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
    </g>
  );

  if (condition === 'subur') {
    return (
      <div className="relative inline-flex items-center justify-center">
        {/* Subtle glow aura */}
        <div className="absolute inset-0 bg-emerald-200/35 rounded-full blur-xl scale-75 animate-pulse" />

        {/* Real-time watering drops animation if isWatering is true */}
        {isWatering && (
          <div className="absolute -top-4 inset-x-0 flex justify-center gap-4 pointer-events-none z-20">
            <span className="text-cyan-500 animate-bounce text-sm" style={{ animationDuration: '0.8s' }}>💧</span>
            <span className="text-cyan-400 animate-bounce text-xs" style={{ animationDuration: '1.1s', animationDelay: '0.2s' }}>💧</span>
            <span className="text-cyan-500 animate-bounce text-sm" style={{ animationDuration: '0.9s', animationDelay: '0.4s' }}>💧</span>
          </div>
        )}

        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-500 hover:scale-105"
        >
          {/* Sparkles / Pollen */}
          {flowerCount > 0 && (
            <>
              <circle cx="100" cy="22" r="2.5" fill="#FACC15" className="animate-ping" style={{ animationDuration: '2.5s' }} />
              <circle cx="155" cy="45" r="2" fill="#F472B6" />
              <circle cx="48" cy="58" r="2" fill="#34D399" />
            </>
          )}

          {/* Plant Stem */}
          <path
            d="M100 135 C100 100, 100 65, 100 45"
            stroke="#1B4D2E"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Top Leaf bud */}
          <ellipse cx="100" cy="42" rx="6" ry="11" fill="#2E7D47" />
          <circle cx="100" cy="34" r="3" fill="#86EFAC" />

          {/* Left Branch & Leaves */}
          <path
            d="M100 95 C85 92, 70 85, 62 75"
            stroke="#1B4D2E"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Leaf 1 (Top Left) */}
          <path
            d="M62 75 C50 68, 48 55, 62 50 C74 54, 76 68, 62 75 Z"
            fill="#2E7D47"
          />
          <path d="M62 75 C60 66, 62 57, 62 50" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />

          {/* Leaf 2 (Mid Left) */}
          <path
            d="M100 115 C82 115, 68 118, 55 125"
            stroke="#1B4D2E"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M55 125 C42 125, 38 110, 52 105 C65 106, 68 118, 55 125 Z"
            fill="#3B9258"
          />

          {/* Right Branch & Leaves */}
          <path
            d="M100 80 C118 78, 132 70, 142 58"
            stroke="#1B4D2E"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M142 58 C155 52, 160 65, 148 72 C135 70, 132 58, 142 58 Z"
            fill="#2E7D47"
          />
          <path d="M142 58 C145 64, 148 68, 148 72" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right Leaf 2 (Mid Right) */}
          <path
            d="M100 110 C120 110, 135 116, 145 125"
            stroke="#1B4D2E"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M145 125 C158 126, 162 112, 148 106 C136 108, 134 120, 145 125 Z"
            fill="#3B9258"
          />

          {/* DYNAMIC FLOWERS BLOOMING BASED ON CONSISTENT POMODORO USE */}
          {flowerCount >= 1 && renderFlower(100, 36, 1.15, 'flower-top')}
          {flowerCount >= 2 && renderFlower(55, 60, 0.95, 'flower-left')}
          {flowerCount >= 3 && renderFlower(148, 62, 0.95, 'flower-right')}
          {flowerCount >= 4 && renderFlower(48, 108, 0.85, 'flower-midleft')}
          {flowerCount >= 5 && renderFlower(150, 110, 0.85, 'flower-midright')}

          {/* Pot Rim */}
          <path
            d="M72 135 H128 C131 135, 133 137, 133 140 C133 143, 131 145, 128 145 H72 C69 145, 67 143, 67 140 C67 137, 69 135, 72 135 Z"
            fill="#9C5D42"
          />
          {/* Pot Body */}
          <path
            d="M74 145 L82 185 C83 189, 86 192, 90 192 H110 C114 192, 117 189, 118 185 L126 145 Z"
            fill="#B96F4E"
          />
          {/* Pot shadow & highlight */}
          <path
            d="M82 185 L74 145 L84 145 L89 185 Z"
            fill="#A35B3B"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  if (condition === 'layu') {
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500"
        >
          {/* Drooping Stem */}
          <path
            d="M100 135 C98 105, 90 85, 76 65"
            stroke="#7C6B38"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Drooping Top */}
          <ellipse cx="73" cy="65" rx="5" ry="9" fill="#998342" transform="rotate(-35 73 65)" />

          {/* Drooping Left Leaf */}
          <path
            d="M93 105 C80 110, 65 118, 54 135"
            stroke="#7C6B38"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M54 135 C42 142, 40 128, 52 120 C62 118, 65 128, 54 135 Z"
            fill="#A8944E"
          />

          {/* Drooping Right Leaf (Yellowing/Dry tips) */}
          <path
            d="M96 90 C112 96, 126 108, 135 125"
            stroke="#7C6B38"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M135 125 C146 132, 148 118, 136 112 C126 111, 124 120, 135 125 Z"
            fill="#B59E50"
          />

          {/* Fallen dry leaf */}
          <ellipse cx="140" cy="180" rx="8" ry="4" fill="#9A7B38" transform="rotate(20 140 180)" />

          {/* Pot Rim */}
          <path
            d="M72 135 H128 C131 135, 133 137, 133 140 C133 143, 131 145, 128 145 H72 C69 145, 67 143, 67 140 C67 137, 69 135, 72 135 Z"
            fill="#8A5843"
          />
          {/* Pot Body */}
          <path
            d="M74 145 L82 185 C83 189, 86 192, 90 192 H110 C114 192, 117 189, 118 185 L126 145 Z"
            fill="#A3674D"
          />
        </svg>
      </div>
    );
  }

  // condition === 'mati'
  return (
    <div className="relative inline-flex items-center justify-center opacity-85">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500"
      >
        {/* Dry Bare Twig 1 */}
        <path
          d="M100 135 L96 110 L88 88 L75 70"
          stroke="#5C473A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M88 88 L96 75"
          stroke="#5C473A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Dry Bare Twig 2 */}
        <path
          d="M96 110 L108 95 L118 80"
          stroke="#5C473A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M108 95 L112 105"
          stroke="#5C473A"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Fallen withered leaves on the ground */}
        <ellipse cx="65" cy="183" rx="7" ry="3" fill="#6A5343" transform="rotate(-15 65 183)" />
        <ellipse cx="135" cy="182" rx="6" ry="2.5" fill="#584335" transform="rotate(25 135 182)" />

        {/* Cracked Pot Rim */}
        <path
          d="M72 135 H128 C131 135, 133 137, 133 140 C133 143, 131 145, 128 145 H72 C69 145, 67 143, 67 140 C67 137, 69 135, 72 135 Z"
          fill="#6F5245"
        />
        {/* Cracked Pot Body */}
        <path
          d="M74 145 L82 185 C83 189, 86 192, 90 192 H110 C114 192, 117 189, 118 185 L126 145 Z"
          fill="#846252"
        />
        {/* Crack lines on pot */}
        <path d="M92 148 L96 165 L92 175" stroke="#483329" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
