import React, { useRef, useEffect, ReactNode } from 'react';

//[개별 카드 데이터 인터페이스]
export interface SpotlightCardData {
  id: string;
  hue: number;          // 카드 색상 (HSL의 H 값, 0~360)
  saturation?: number;  // 채도 (기본 90)
  lightness?: number;   // 명도 (기본 55)
  content: ReactNode;   // 카드 안에 들어갈 컨텐츠
}

interface SpotlightCardGroupProps {
  cards: SpotlightCardData[];
  className?: string;       // 컨테이너 추가 클래스
  cardClassName?: string;   // 개별 카드 추가 클래스
  spotlightRadius?: number; // 스포트라이트 반경 (기본 25rem)
}

// [스포트라이트 카드 그룹]
// 마우스 위치에 따라 카드 테두리에 색깔이 떠오르는 인터랙티브 컴포넌트
const SpotlightCardGroup: React.FC<SpotlightCardGroupProps> = ({ 
  cards, 
  className = '',
  cardClassName = '',
  spotlightRadius = 25,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 마우스 무브 핸들러: overlay에 마스크 위치 적용
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      const overlay = overlayRef.current;
      if (!container || !overlay) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      overlay.style.setProperty('--opacity', '1');
      overlay.style.setProperty('--x', `${x}px`);
      overlay.style.setProperty('--y', `${y}px`);
    };

    document.body.addEventListener('pointermove', handlePointerMove);
    return () => {
      document.body.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // 카드 크기 변경 감지 → overlay 카드 크기 동기화
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement);
        if (idx >= 0 && overlayCardRefs.current[idx]) {
          const { width, height } = entry.contentRect;
          const overlayCard = overlayCardRefs.current[idx]!;
          overlayCard.style.width = `${width}px`;
          overlayCard.style.height = `${height}px`;
        }
      });
    });

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [cards]);

  return (
    <div 
      ref={containerRef}
      className={`spotlight-cards relative ${className}`}
      style={{ '--spotlight-radius': `${spotlightRadius}rem` } as React.CSSProperties}
    >
      {/* 실제 카드들 */}
      <div className="spotlight-cards__inner flex items-stretch justify-center gap-10 w-full">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            ref={(el) => { cardRefs.current[idx] = el; }}
            className={`spotlight-card ${cardClassName}`}
            style={{
              '--hue': card.hue,
              '--saturation': `${card.saturation ?? 90}%`,
              '--lightness': `${card.lightness ?? 55}%`,
            } as React.CSSProperties}
          >
            {card.content}
          </div>
        ))}
      </div>

      {/* Overlay (마우스 위치만큼만 보이는 색깔 카드들) */}
      <div 
        ref={overlayRef}
        className="spotlight-overlay flex items-stretch justify-center gap-10"
        aria-hidden="true"
      >
        {cards.map((card, idx) => (
          <div
            key={`overlay-${card.id}`}
            ref={(el) => { overlayCardRefs.current[idx] = el; }}
            className={`spotlight-card spotlight-card--overlay ${cardClassName}`}
            style={{
              '--hue': card.hue,
              '--saturation': `${card.saturation ?? 90}%`,
              '--lightness': `${card.lightness ?? 55}%`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotlightCardGroup;