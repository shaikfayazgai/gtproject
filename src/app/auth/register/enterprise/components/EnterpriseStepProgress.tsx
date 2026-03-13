"use client";

import { CheckCircle } from "lucide-react";

const STEPS = [
  { n: 1, label: "Organisation" },
  { n: 2, label: "Administrator" },
  { n: 3, label: "Security" },
  { n: 4, label: "Agreements" },
] as const;

export function EnterpriseStepProgress({ step }: { step: number }) {
  return (
    <div className="flex items-start">
      {STEPS.map(({ n, label }, i) => {
        const done    = n < step;
        const active  = n === step;
        const pending = n > step;
        return (
          <div key={n} className="flex items-start flex-1">
            {/* Node + label */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                done    ? "bg-brown-600 text-white"
                : active  ? "bg-brown-700 text-white ring-4 ring-brown-200"
                : "bg-beige-200 text-beige-400"
              }`}>
                {done
                  ? <CheckCircle className="w-3.5 h-3.5" />
                  : <span className="text-[11px] font-bold">{n}</span>
                }
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                done || active ? "text-brown-700" : "text-beige-400"
              }`}>{label}</span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className={`h-px w-full mt-3.5 transition-all ${
                n < step ? "bg-brown-400" : "bg-beige-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
