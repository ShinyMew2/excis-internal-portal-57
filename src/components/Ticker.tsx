import { cn } from "@/lib/utils";

interface TickerProps {
  text: string;
  className?: string;
}

const Ticker = ({ text, className }: TickerProps) => {
  return (
    <div className={cn(
      "bg-primary text-primary-foreground py-2 overflow-hidden whitespace-nowrap relative",
      className
    )}>
      <div className="animate-[scroll_15s_linear_infinite] inline-block">
        <span className="mx-8 font-medium text-sm uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-8 font-medium text-sm uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-8 font-medium text-sm uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-8 font-medium text-sm uppercase tracking-wider">
          {text}
        </span>
        <span className="mx-8 font-medium text-sm uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Ticker;