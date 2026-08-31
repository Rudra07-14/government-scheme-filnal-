import { useTranslations } from "next-intl";

/**
 * Renders the 5-step journey as a bridge span: each step is a pillar,
 * connected by a shallow arc — the visual signature tying "Setu" (bridge)
 * into the product's most important flow. Used once, deliberately.
 *
 * Step content is stored as a raw array in messages/*.json (t.raw("steps"))
 * rather than flat keys, since next-intl doesn't have a first-class way to
 * translate a variable-length list of {title, detail} objects otherwise.
 */
export function BridgeSteps() {
  const t = useTranslations("BridgeSteps");
  const steps = t.raw("steps") as { title: string; detail: string }[];

  const n = steps.length;
  const width = 1000;
  const nodeY = 40;
  const spacing = width / (n - 1);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} 90`}
        className="w-full h-16 sm:h-20"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {steps.slice(0, -1).map((_, i) => {
          const x1 = i * spacing;
          const x2 = (i + 1) * spacing;
          const mid = (x1 + x2) / 2;
          return (
            <path
              key={i}
              d={`M ${x1} ${nodeY} Q ${mid} ${nodeY - 34} ${x2} ${nodeY}`}
              fill="none"
              stroke="var(--color-navy)"
              strokeOpacity="0.35"
              strokeWidth="2"
            />
          );
        })}
        {steps.map((_, i) => (
          <circle
            key={i}
            cx={i * spacing}
            cy={nodeY}
            r="7"
            fill="var(--color-paper)"
            stroke="var(--color-navy)"
            strokeWidth="2"
          />
        ))}
      </svg>

      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-4 mt-2">
        {steps.map((step, i) => (
          <li key={step.title} className="text-center sm:text-left">
            <span className="text-xs font-semibold text-[var(--color-saffron)]">
              {t("stepLabel", { number: i + 1 })}
            </span>
            <p className="font-[family-name:var(--font-display)] font-semibold text-[var(--color-navy)] mt-1">
              {step.title}
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-1">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
