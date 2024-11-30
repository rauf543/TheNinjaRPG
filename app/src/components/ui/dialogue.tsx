import * as React from "react";
import { Button } from "@/components/ui/button";

export interface DialogueChoice {
  text: string;
  nextId?: string;
  isEnd?: boolean;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices: DialogueChoice[];
}

interface DialogueProps {
  dialogueData: DialogueNode;
  onChoice: (choice: DialogueChoice) => void;
  npcImage?: string;
  onClose?: () => void;
  className?: string;
}

const Dialogue = React.forwardRef<HTMLDivElement, DialogueProps>(
  ({ dialogueData, onChoice, npcImage, onClose }, ref) => {
    const [isTyping, setIsTyping] = React.useState(true);
    const [displayedText, setDisplayedText] = React.useState("");

    React.useEffect(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < dialogueData.text.length) {
          setDisplayedText((prev) => prev + dialogueData.text[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    }, [dialogueData.text]);

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        ref={ref}
      >
        <div className="bg-slate-900 rounded-lg max-w-2xl w-full mx-4 p-4">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-700 pb-4">
            {npcImage && (
              <img
                src={npcImage}
                alt={dialogueData.speaker}
                className="w-12 h-12 rounded-full"
              />
            )}
            <span className="text-xl font-bold text-white">{dialogueData.speaker}</span>
          </div>

          {/* Content */}
          <div className="py-6">
            <p className="text-lg min-h-[4rem] text-white">{displayedText}</p>
          </div>

          {/* Choices */}
          <div className="flex flex-col gap-2 border-t border-slate-700 pt-4">
            {!isTyping &&
              dialogueData.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => onChoice(choice)}
                  variant="outline"
                  className="w-full"
                >
                  {choice.text}
                </Button>
              ))}
            {onClose && (
              <Button onClick={onClose} variant="ghost" className="w-full mt-2">
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Dialogue.displayName = "Dialogue";

export { Dialogue };
