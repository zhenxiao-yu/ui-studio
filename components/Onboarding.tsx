"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const ONBOARDING_KEY = "ui-studio:onboarded";

const steps = [
  { icon: "⬛", title: "Draw shapes", desc: "Pick a tool from the toolbar and click-drag on the canvas." },
  { icon: "💬", title: "Chat with your team", desc: "Press / to open a chat cursor. Share the URL to collaborate in real-time." },
  { icon: "🎉", title: "React & comment", desc: "Press E for emoji reactions. Click the comment icon to pin notes anywhere." },
];

const quickKeys = ["V Select", "H Pan", "R Rectangle", "T Text", "P Brush"];

const Onboarding = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-end bg-black/30 p-6 backdrop-blur-[2px]">
      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-2xl border border-primary-grey-200 bg-primary-black p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-1">
          <div className="mb-1 flex items-center gap-2 text-primary-green">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              Quick Start
            </span>
          </div>
          <h2 className="text-xl font-semibold">Welcome to UI Studio</h2>
          <p className="text-sm text-primary-grey-300">A real-time collaborative design canvas.</p>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <div key={step.title} className="flex items-start gap-4">
              <span className="text-2xl">{step.icon}</span>
              <div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-xs text-primary-grey-300">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {quickKeys.map((key) => (
            <span
              key={key}
              className="rounded-full border border-primary-grey-200 px-2.5 py-1 text-[10px] font-medium text-primary-grey-300"
            >
              {key}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={dismiss}
            className="w-full rounded-lg bg-primary-green py-2.5 text-sm font-semibold text-primary-black transition-opacity hover:opacity-90"
          >
            Start designing
          </button>
          <button
            onClick={dismiss}
            className="w-full rounded-lg border border-primary-grey-200 py-2.5 text-sm font-medium text-primary-grey-300 transition-colors hover:bg-primary-grey-200 hover:text-white"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
