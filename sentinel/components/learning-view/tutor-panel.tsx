import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";

const mockMessages = [
  { 
    id: 1, 
    text: "Alex, you're on a 14-day streak! Don't let Jordan R. catch up—he's only 140 XP behind you. This lesson on frameworks is exactly where you struggled last week.",
    sender: 'sentinel'
  },
];

const promptChips = [
  "Explain this concept",
  "Give me a real-world example",
  "Quiz me before I start"
];

export function TutorPanel() {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newUserMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        text: `Great question. Let's look at ${text.toLowerCase()}. In industrial settings, this is crucial because of high-stakes environments. Ready for a quick drill?`, 
        sender: 'sentinel' 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-zinc-100 dark:border-zinc-800">
      <div className="p-4 border-b bg-[#7F77DD]/5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-white ring-2 ring-[#7F77DD]/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold">Sentinel</span>
          <span className="text-[10px] text-muted-foreground font-medium">Watching your progress</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex flex-col gap-1",
            msg.sender === 'user' ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%]",
              msg.sender === 'user' 
                ? "bg-[#7F77DD] text-white rounded-tr-none" 
                : "bg-zinc-100 dark:bg-zinc-800 rounded-tl-none font-medium"
            )}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 px-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-fit">
            <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce" />
            <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip) => (
            <button 
              key={chip}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border-[0.5px] border-zinc-200 dark:border-zinc-700 rounded-md text-[9px] font-bold text-zinc-600 dark:text-white/70 hover:border-[#7F77DD] hover:text-[#7F77DD] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask Sentinel..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
            className="w-full h-10 px-4 py-2 pr-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-white/35 border-none rounded-[8px] text-[11px] font-medium focus:ring-1 focus:ring-[#7F77DD] outline-none"
          />
          <button 
            onClick={() => handleSend(inputValue)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#7F77DD]"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
