import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TickerProps {
  text: string;
  className?: string;
}

const Ticker = ({ text, className }: TickerProps) => {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    // Hide text after animation completes (15 seconds)
    const timer = setTimeout(() => {
      setShowText(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "bg-primary text-primary-foreground py-2 overflow-hidden whitespace-nowrap relative",
      className
    )}>
      {showText && (
        <div className="animate-[scroll-once_15s_ease-in-out_forwards] inline-block">
          <span className="mx-8 font-medium text-sm uppercase tracking-wider">
            {text}
          </span>
        </div>
      )}
    </div>
  );
};

export default Ticker;