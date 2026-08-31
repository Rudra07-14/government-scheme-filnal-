import { Check } from "lucide-react";

const STEP_LABELS = ["About You", "Work & Income", "Category", "Support Needed"];

interface ProgressStepsProps {
  currentStep: number; // 0-indexed
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <ol className="flex items-start" aria-label="Questionnaire progress">
      {STEP_LABELS.map((label, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;
        const isLast = i === STEP_LABELS.length - 1;

        return (
          <li key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors ${
                  isComplete
                    ? "bg-[var(--color-navy)] border-[var(--color-navy)] text-white"
                    : isCurrent
                      ? "border-[var(--color-navy)] text-[var(--color-navy)] bg-white"
                      : "border-[var(--color-border)] text-[var(--color-muted)] bg-white"
                }`}
              >
                {isComplete ? <Check size={14} aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={`hidden sm:block text-xs font-medium text-center max-w-20 ${
                  isCurrent ? "text-[var(--color-navy)]" : "text-[var(--color-muted)]"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-0.5 flex-1 mx-1 sm:mx-2 mb-4 sm:mb-5 transition-colors ${
                  isComplete ? "bg-[var(--color-navy)]" : "bg-[var(--color-border)]"
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
