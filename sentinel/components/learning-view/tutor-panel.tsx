import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Sparkles } from "lucide-react";

type Sender = "sentinel" | "user";
type Message = { id: number; text: string; sender: Sender };

type QuizState = {
  id: string;
  question: string;
  choices: { key: "A" | "B" | "C"; text: string }[];
  correct: "A" | "B" | "C";
  explanation: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text:
      "Almira, you're on a 14-day streak! Don't let Jordan R. catch up—he's only 140 XP behind you.\n\nTap “Quiz me before I start” for a quick drill.",
    sender: "sentinel",
  },
];

const promptChips = ["Explain this concept", "Give me a real-world example", "Quiz me before I start"];

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function buildQuiz(topic: "risk" | "incident" | "consent"): QuizState {
  if (topic === "incident") {
    return {
      id: "quiz-incident-1",
      question: "You suspect a phishing email was opened. What’s the best FIRST action?",
      choices: [
        { key: "A", text: "Immediately delete the email and move on." },
        { key: "B", text: "Contain and preserve evidence, then notify IR." },
        { key: "C", text: "Publicly warn everyone on social media." },
      ],
      correct: "B",
      explanation:
        "Containment + evidence preservation lets you stop spread and investigate safely. Then follow your incident response (IR) process.",
    };
  }

  if (topic === "consent") {
    return {
      id: "quiz-consent-1",
      question: "For user consent, which statement is most accurate?",
      choices: [
        { key: "A", text: "Consent is optional if it’s convenient." },
        { key: "B", text: "Consent should be specific, informed, and revocable." },
        { key: "C", text: "Consent can’t be changed once given." },
      ],
      correct: "B",
      explanation: "Good consent is informed and granular, and users must be able to withdraw it.",
    };
  }

  return {
    id: "quiz-risk-1",
    question: "In a simple risk model, risk is best described as…",
    choices: [
      { key: "A", text: "Likelihood × Impact." },
      { key: "B", text: "Budget ÷ Headcount." },
      { key: "C", text: "Number of policies written." },
    ],
    correct: "A",
    explanation:
      "Most introductory frameworks define risk as a combination of likelihood and impact (sometimes with exposure/severity variants).",
  };
}

function getHardcodedResponse(userText: string, quizState: QuizState | null) {
  const text = normalize(userText);
  const answerKey = text.toUpperCase();

  if (quizState && (answerKey === "A" || answerKey === "B" || answerKey === "C")) {
    const correct = answerKey === quizState.correct;
    return {
      reply:
        `${correct ? "Correct." : "Not quite."}\n\n` +
        `Answer: ${quizState.correct}\n` +
        `${quizState.explanation}\n\n` +
        `Want another? Say “Quiz me before I start”.`,
      nextQuiz: null as QuizState | null,
    };
  }

  if (text.includes("quiz")) {
    const topic: "risk" | "incident" | "consent" =
      text.includes("incident") || text.includes("phishing")
        ? "incident"
        : text.includes("consent")
          ? "consent"
          : "risk";

    const quiz = buildQuiz(topic);
    return {
      reply:
        `Quick quiz:\n${quiz.question}\n\n` +
        quiz.choices.map((c) => `${c.key}) ${c.text}`).join("\n") +
        `\n\nReply with A, B, or C.`,
      nextQuiz: quiz,
    };
  }

  if (text.includes("example") || text.includes("real world") || text.includes("real-world")) {
    return {
      reply:
        "Real-world example (risk assessment):\n\n" +
        "Scenario: A maintenance tablet is used on the factory floor and also connects to email.\n\n" +
        "1) Asset: the tablet + production network access\n" +
        "2) Threat: phishing → credential theft\n" +
        "3) Vulnerability: no MFA + shared accounts\n" +
        "4) Likelihood: medium\n" +
        "5) Impact: high (disruption + data exposure)\n\n" +
        "Controls: MFA, least privilege, device management, and an incident response runbook.",
      nextQuiz: null,
    };
  }

  if (text.includes("explain")) {
    return {
      reply:
        "A “framework” is a repeatable way to make good decisions under uncertainty.\n\n" +
        "For risk assessment, most frameworks follow the same flow:\n" +
        "- Identify assets, threats, and vulnerabilities\n" +
        "- Estimate likelihood and impact\n" +
        "- Prioritize risks (highest first)\n" +
        "- Choose controls (prevent / detect / respond)\n" +
        "- Reassess after changes\n\n" +
        "Tell me the context (IT, safety, privacy) and I’ll tailor it.",
      nextQuiz: null,
    };
  }

  if (text.includes("incident") || text.includes("phishing")) {
    return {
      reply:
        "Incident response in one line: detect → contain → eradicate → recover → learn.\n\n" +
        "If it might be phishing:\n" +
        "1) Contain (disconnect/isolate)\n" +
        "2) Preserve evidence (don’t wipe everything)\n" +
        "3) Notify IR / security channel\n" +
        "4) Reset credentials + review access logs\n\n" +
        "Want a quiz? Say “Quiz me before I start”.",
      nextQuiz: null,
    };
  }

  if (text.includes("consent")) {
    return {
      reply:
        "Consent management basics:\n\n" +
        "- Be specific: separate toggles for separate purposes\n" +
        "- Be informed: explain what data is used and why\n" +
        "- Be revocable: users can withdraw any time\n" +
        "- Be auditable: store who/what/when (and collection point)\n\n" +
        "Tip: log changes, not just the latest state.",
      nextQuiz: null,
    };
  }

  if (text === "hi" || text === "hello" || text.includes("hey")) {
    return {
      reply: "Hi. Use the chips below, or ask about risk / incident response / consent.",
      nextQuiz: null,
    };
  }

  return {
    reply:
      "For this demo I’m using hard-coded answers.\n\nTry:\n- Explain this concept\n- Give me a real-world example\n- Quiz me before I start",
    nextQuiz: null,
  };
}

export function TutorPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const chips = useMemo(() => promptChips, []);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = { id: Date.now(), text, sender: "user" };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    const { reply, nextQuiz } = getHardcodedResponse(text, quizState);
    setQuizState(nextQuiz);

    setTimeout(() => {
      const aiResponse: Message = { id: Date.now() + 1, text: reply, sender: "sentinel" };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-white/10 bg-[#7F77DD]/5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[#7F77DD] flex items-center justify-center text-white ring-2 ring-[#7F77DD]/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white/90">Sentinel</span>
          <span className="text-[10px] text-white/55 font-medium">Hard-coded assistant (demo)</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex flex-col gap-1", msg.sender === "user" ? "items-end" : "items-start")}
          >
            <div
              className={cn(
                "p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%] whitespace-pre-wrap",
                msg.sender === "user"
                  ? "bg-[#7F77DD] text-white rounded-tr-none"
                  : "bg-white/[0.06] border border-white/10 rounded-tl-none font-medium text-white/90"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 px-3 bg-white/[0.06] border border-white/10 rounded-full w-fit">
            <span className="h-1 w-1 bg-white/50 rounded-full animate-bounce" />
            <span className="h-1 w-1 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="h-1 w-1 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-4 pt-0 space-y-3 border-t border-white/10">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1.5 bg-white/[0.03] border border-white/10 rounded-md text-[9px] font-black text-white/70 hover:border-[#7F77DD]/60 hover:text-white transition-colors"
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
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
            className="w-full h-10 px-4 py-2 pr-10 bg-white/[0.06] border border-white/10 text-white/90 placeholder:text-white/35 rounded-[10px] text-[11px] font-medium focus:ring-2 focus:ring-[#7F77DD]/40 outline-none"
          />
          <button
            onClick={() => handleSend(inputValue)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#7F77DD]"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
