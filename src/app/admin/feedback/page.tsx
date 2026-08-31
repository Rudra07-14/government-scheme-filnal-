import type { Metadata } from "next";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { getFeedbackList } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Feedback",
};

export default async function AdminFeedbackPage() {
  const feedback = await getFeedbackList();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-navy)]">
          Feedback
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          {feedback.length} response{feedback.length === 1 ? "" : "s"} from citizens.
        </p>
      </div>

      <div className="space-y-3">
        {feedback.map((f) => (
          <div key={f.id} className="border border-[var(--color-border)] rounded-lg bg-white p-4">
            <div className="flex items-center gap-3">
              {f.helpful ? (
                <ThumbsUp size={16} className="text-[var(--color-green)]" aria-hidden="true" />
              ) : (
                <ThumbsDown size={16} className="text-red-500" aria-hidden="true" />
              )}
              <span className="font-semibold text-[var(--color-ink)] text-sm">
                {f.schemeName ?? "General feedback"}
              </span>
              <span className="text-xs text-[var(--color-muted)] ml-auto">
                {new Date(f.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
            {f.comment && (
              <p className="text-sm text-[var(--color-ink)] mt-2 leading-relaxed">{f.comment}</p>
            )}
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-lg">
            <p className="text-[var(--color-muted)]">No feedback submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
