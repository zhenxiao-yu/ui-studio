"use client";

import { useEffect, useState } from "react";

const ONBOARDING_KEY = "ui-studio:onboarded";

const steps = [
  { icon: "⬛", title: "Draw shapes", desc: "Pick a tool from the toolbar and click-drag on the canvas." },
  { icon: "💬", title: "Chat with your team", desc: "Press / to open a chat cursor. Share the URL to collaborate in real-time." },
  { icon: "🎉", title: "React & comment", desc: "Press E for emoji reactions. Click the comment icon to pin notes anywhere." },
];

const Onboarding = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex w-[420px] flex-col gap-6 rounded-2xl border border-primary-grey-200 bg-primary-black p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-1">
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

        <button
          onClick={dismiss}
          className="w-full rounded-lg bg-primary-green py-2.5 text-sm font-semibold text-primary-black transition-opacity hover:opacity-90"
        >
          Start designing
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
