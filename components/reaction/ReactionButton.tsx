import React from "react";

const REACTIONS = ["👍", "🔥", "😍", "👀", "😱", "🙁"];

type Props = {
  setReaction: (reaction: string) => void;
};

const ReactionSelector = ({ setReaction }: Props) => (
  <div
    className="absolute bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-primary-grey-200 bg-primary-black/90 px-2 py-1.5 shadow-xl backdrop-blur"
    onPointerMove={(e) => e.stopPropagation()}
  >
    {REACTIONS.map((reaction) => (
      <ReactionButton
        key={reaction}
        reaction={reaction}
        onSelect={setReaction}
      />
    ))}
    <span className="ml-1 hidden border-l border-primary-grey-200 pl-2 text-[10px] text-primary-grey-300 sm:inline">
      Click + drag to spray
    </span>
  </div>
);

type ReactionButtonProps = {
  reaction: string;
  onSelect: (reaction: string) => void;
};

const ReactionButton = ({ reaction, onSelect }: ReactionButtonProps) => (
  <button
    type="button"
    className="rounded-full p-1.5 text-lg transition-transform hover:scale-125 hover:bg-primary-grey-200 focus:scale-125 focus:outline-none focus:ring-1 focus:ring-primary-green"
    onPointerDown={() => onSelect(reaction)}
    aria-label={`Select reaction ${reaction}`}
  >
    {reaction}
  </button>
);

export default ReactionSelector;
