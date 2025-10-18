export type SparkleOptions = {
  count?: number;
  spreadMin?: number;
  spreadMax?: number;
  size?: number;
  durationMin?: number;
  durationMax?: number;
};

export function sparklesFromElement(el: HTMLElement, opts: SparkleOptions = {}) {
  const {
    count = 16,
    spreadMin = 16,
    spreadMax = 28,
    size = 5,
    durationMin = 420,
    durationMax = 700,
  } = opts;

  const rect = el.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const distance = spreadMin + Math.random() * (spreadMax - spreadMin);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    p.style.position = 'fixed';
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.borderRadius = '50%';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '9999';
    p.style.background = 'conic-gradient(from 0deg, var(--primary), var(--secondary))';

    document.body.appendChild(p);

    const keyframes: Keyframe[] = [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 },
    ];

    const duration = durationMin + Math.random() * (durationMax - durationMin);
    p.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    }).onfinish = () => p.remove();
  }
}

export default sparklesFromElement;
