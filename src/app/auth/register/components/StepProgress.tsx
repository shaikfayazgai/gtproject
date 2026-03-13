"use client";

import { CheckCircle } from "lucide-react";
import { REGISTRATION_STEPS } from "../data";

interface Props {
  step: number;
}

export function StepProgress({ step }: Props) {
  return (
    <div className="flex items-start">
      {REGISTRATION_STEPS.map((label, i) => {
        const n       = i + 1;
        const done    = step > n;
        const current = step === n;
        return (
          <div key={n} className="flex items-start flex-1">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-teal-500 text-white"
                    : current
                    ? "bg-brown-600 text-white ring-4 ring-brown-100"
                    : "bg-beige-200 text-beige-400"
                }`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : n}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  current ? "text-brown-700" : done ? "text-teal-600" : "text-beige-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < REGISTRATION_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1.5 mt-4 transition-colors duration-500 ${
                  step > n ? "bg-teal-400" : "bg-beige-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
