"use client";

import Image from "next/image";
import gsap from "gsap";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const cleanAssistantMessage = (content: string) =>
  content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/^\s*\d+[.)]\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const QUICK_ACTIONS = [
  "I want a site visit",
  "Tell me about your services",
  "I need a project estimate",
  "I want to talk to a designer",
];

type LeadFormData = {
  name: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  interiorRequirement: string;
  propertySize: string;
  budget: string;
  timeline: string;
  message: string;
};

const EMPTY_LEAD: LeadFormData = {
  name: "",
  phone: "",
  email: "",
  location: "",
  propertyType: "",
  interiorRequirement: "",
  propertySize: "",
  budget: "",
  timeline: "",
  message: "",
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello 👋 I'm Orchid AI, your interior design assistant. How can I help you with your space today?",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    INITIAL_MESSAGE,
  ]);
  const [isClosing, setIsClosing] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadFormData>(EMPTY_LEAD);
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const getMessageId = (suffix: string) =>
    `${++messageIdRef.current}-${suffix}`;

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !panelRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timeline = gsap.timeline();

    if (reduceMotion.matches) {
      timeline.set([overlayRef.current, panelRef.current], { clearProps: "all" });
    } else {
      timeline
        .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "power2.out" })
        .fromTo(
          panelRef.current,
          { autoAlpha: 0, y: 24, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" },
          "<0.02",
        );
    }

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  const closeChat = () => {
    if (isClosing) return;

    if (!overlayRef.current || !panelRef.current) {
      setIsOpen(false);
      return;
    }

    setIsClosing(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      setIsOpen(false);
      setIsClosing(false);
      return;
    }

    gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        setIsClosing(false);
      },
    })
      .to(panelRef.current, { autoAlpha: 0, y: 18, scale: 0.98, duration: 0.24, ease: "power2.in" })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, "<0.04");
  };

  /*
   * Auto scroll whenever messages change.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /*
   * Focus input when chatbot opens.
   */
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 250);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  /*
   * Prevent background scrolling on mobile while
   * the chatbot is open.
   */
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  /*
   * Send message to our Next.js API route.
   */
  const sendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim();

    if (!text || isTyping) return;

    const userMessage: Message = {
      id: getMessageId("user"),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,

          /*
           * Send previous conversation to the API.
           * The current message is also included separately.
           */
          history: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to get a response."
        );
      }

      const assistantMessage: Message = {
        id: getMessageId("assistant"),
        role: "assistant",
        content:
          data?.reply ||
          "I'm sorry, I couldn't generate a response right now.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage: Message = {
        id: getMessageId("error"),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again or contact our design team directly.",
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /*
   * Form submit.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  /*
   * Enter = send
   * Shift + Enter = new line
   */
  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  /*
   * Clear conversation.
   */
  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setShowLeadForm(false);
    setLeadForm(EMPTY_LEAD);
    setLeadStatus("idle");
  };

  const updateLeadField = (field: keyof LeadFormData, value: string) => {
    setLeadForm((current) => ({ ...current, [field]: value }));
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLeadStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });

      if (!response.ok) throw new Error("Lead submission failed");

      setLeadStatus("success");
      setMessages((current) => [
        ...current,
        {
          id: getMessageId("lead"),
          role: "assistant",
          content: "Thank you. Your enquiry is with our design team, and we will contact you shortly.",
        },
      ]);
    } catch (error) {
      console.error("Lead submission error:", error);
      setLeadStatus("error");
    }
  };

  return (
    <>
      {/* =====================================================
          FLOATING CHAT BUTTON
      ====================================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Orchid AI"
          className="
            fixed
            bottom-5
            right-5
            z-[90]
            flex
            items-center
            gap-3
            rounded-full
            bg-black
            px-5
            py-3.5
            text-white
            shadow-2xl
            transition-all
            duration-300
            hover:scale-105
            hover:bg-stone-800
            sm:bottom-7
            sm:right-7
          "
        >
          <span
            className="
              relative
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
            "
          >
            <Image
              src="/images/logo.png"
              alt="Orchid Interiors"
              width={32}
              height={32}
              className="h-6 w-7 object-contain"
            />

            <span
              className="
                absolute
                -right-0.5
                -top-0.5
                h-2
                w-2
                rounded-full
                bg-emerald-500
                ring-2
                ring-black
              "
            />
          </span>

          <span className="hidden text-sm font-medium sm:block">
            Orchid AI
          </span>
        </button>
      )}

      {/* =====================================================
          CHATBOT OVERLAY
      ====================================================== */}

      {isOpen && (
        <div
          ref={overlayRef}
          className="
            fixed
            inset-0
            z-[100]
            bg-black/30
            backdrop-blur-[2px]
            sm:bg-transparent
            sm:backdrop-blur-none
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeChat();
            }
          }}
        >
          {/* =================================================
              CHAT WINDOW
          ================================================== */}

          <div
            ref={panelRef}
            className="
              fixed
              bottom-0
              right-0
              flex
              h-[100dvh]
              w-full
              flex-col
              overflow-hidden
              bg-stone-50
              shadow-2xl
              sm:bottom-6
              sm:right-6
              sm:h-[680px]
              sm:max-h-[calc(100vh-48px)]
              sm:w-[410px]
              sm:rounded-[1.75rem]
              sm:border
              sm:border-stone-200
            "
            role="dialog"
            aria-modal="true"
            aria-label="Orchid AI chat"
          >
            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                bg-black
                px-5
                py-4
                text-white
                sm:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                  "
                >
                  <Image
                    src="/images/logo.png"
                    alt="Orchid Interiors"
                    width={40}
                    height={40}
                    className="h-7 w-8 object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      Orchid AI
                    </p>

                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-emerald-400
                      "
                    />
                  </div>

                  <p className="mt-0.5 text-[10px] text-white/60">
                    Interior design assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset */}

                <button
                  type="button"
                  onClick={resetConversation}
                  aria-label="Start new conversation"
                  title="New conversation"
                  className="
                    rounded-full
                    p-2
                    text-white/60
                    transition-colors
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <MessageCircle className="h-4 w-4" />
                </button>

                {/* Minimize */}

                <button
                  type="button"
                  onClick={closeChat}
                  aria-label="Minimize Orchid AI"
                  className="
                    rounded-full
                    p-2
                    text-white/60
                    transition-colors
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* =================================================
                CHAT CONTENT
            ================================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-4
                py-5
                sm:px-5
              "
            >
              {/* Intro */}

              {messages.length === 1 && (
                <div
                  className="
                    mb-5
                    rounded-2xl
                    border
                    border-stone-200
                    bg-white
                    p-4
                  "
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-stone-700" />

                    <span className="text-xs font-medium text-stone-700">
                      How can I help?
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {QUICK_ACTIONS.map(
                      (action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() =>
                            sendMessage(action)
                          }
                          disabled={isTyping}
                          className="
                            rounded-xl
                            border
                            border-stone-200
                            px-3
                            py-2.5
                            text-left
                            text-xs
                            text-stone-700
                            transition-all
                            duration-200
                            hover:border-black
                            hover:bg-stone-50
                            hover:text-black
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {action}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(true)}
                      disabled={isTyping}
                      className="rounded-xl border border-black bg-black px-3 py-2.5 text-left text-xs text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
                    >
                      Send my project enquiry
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}

              <div className="space-y-4">
                {messages.map((message) => {
                  const isUser =
                    message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={`
                        flex
                        gap-2.5
                        ${
                          isUser
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                    >
                      {/* Assistant Icon */}

                      {!isUser && (
                        <div
                          className="
                            mt-1
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-black
                            text-white
                          "
                        >
                          <Image
                            src="/images/logo.png"
                            alt="Orchid Interiors"
                            width={28}
                            height={28}
                            className="h-5 w-6 object-contain"
                          />
                        </div>
                      )}

                      {/* Message */}

                      <div
                        className={`
                          max-w-[82%]
                          rounded-2xl
                          px-4
                          py-3
                          text-sm
                          leading-6
                          ${
                            isUser
                              ? "rounded-br-md bg-black text-white"
                              : "rounded-bl-md border border-stone-200 bg-white text-stone-700"
                          }
                        `}
                      >
                        {message.role === "assistant"
                          ? cleanAssistantMessage(message.content)
                          : message.content}
                      </div>

                      {/* User Icon */}

                      {isUser && (
                        <div
                          className="
                            mt-1
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-stone-200
                            text-stone-600
                          "
                        >
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* =================================================
                    TYPING INDICATOR
                ================================================== */}

                {isTyping && (
                  <div className="flex gap-2.5">
                    <div
                      className="
                        mt-1
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-black
                        text-white
                      "
                    >
                      <Image
                        src="/images/logo.png"
                        alt="Orchid Interiors"
                        width={28}
                        height={28}
                        className="h-5 w-6 object-contain"
                      />
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-2xl
                        rounded-bl-md
                        border
                        border-stone-200
                        bg-white
                        px-4
                        py-3
                      "
                    >
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* =================================================
                INPUT AREA
            ================================================== */}

            <div
              className="
                shrink-0
                border-t
                border-stone-200
                bg-white
                p-3
                sm:p-4
              "
            >
              {showLeadForm ? (
                <form onSubmit={submitLead} className="grid gap-2">
                  <p className="mb-1 text-xs font-medium text-stone-700">Tell us about your project</p>
                  {([
                    ["name", "Full name", "text"],
                    ["phone", "Mobile number", "tel"],
                    ["email", "Email address", "email"],
                    ["location", "City / location", "text"],
                    ["propertySize", "Approximate property size or BHK", "text"],
                  ] as const).map(([field, placeholder, type]) => (
                    <input
                      key={field}
                      required
                      type={type}
                      value={leadForm[field]}
                      onChange={(event) => updateLeadField(field, event.target.value)}
                      placeholder={placeholder}
                      className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-black outline-none placeholder:text-stone-400 focus:border-stone-500"
                    />
                  ))}
                  <select
                    required
                    value={leadForm.propertyType}
                    onChange={(event) => updateLeadField("propertyType", event.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-700 outline-none focus:border-stone-500"
                  >
                    <option value="">Property type</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Independent House</option>
                    <option>Office</option>
                    <option>Commercial Space</option>
                    <option>Other</option>
                  </select>
                  <select
                    required
                    value={leadForm.interiorRequirement}
                    onChange={(event) => updateLeadField("interiorRequirement", event.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-700 outline-none focus:border-stone-500"
                  >
                    <option value="">Interior requirement</option>
                    <option>Complete Home Interior</option>
                    <option>Modular Kitchen</option>
                    <option>Wardrobe</option>
                    <option>Bedroom Interior</option>
                    <option>Living Room</option>
                    <option>Dining Room</option>
                    <option>TV Unit</option>
                    <option>Office Interior</option>
                    <option>Custom Furniture</option>
                    <option>Other</option>
                  </select>
                  <select
                    required
                    value={leadForm.budget}
                    onChange={(event) => updateLeadField("budget", event.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-700 outline-none focus:border-stone-500"
                  >
                    <option value="">Approximate budget</option>
                    <option>Under ₹5 Lakhs</option>
                    <option>₹5 - ₹10 Lakhs</option>
                    <option>₹10 - ₹25 Lakhs</option>
                    <option>₹25 - ₹50 Lakhs</option>
                    <option>Above ₹50 Lakhs</option>
                    <option>Not sure yet</option>
                  </select>
                  <select
                    required
                    value={leadForm.timeline}
                    onChange={(event) => updateLeadField("timeline", event.target.value)}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-stone-700 outline-none focus:border-stone-500"
                  >
                    <option value="">Preferred project timeline</option>
                    <option>Immediately</option>
                    <option>Within 1 month</option>
                    <option>1 - 3 months</option>
                    <option>3 - 6 months</option>
                    <option>6+ months</option>
                    <option>Not decided</option>
                  </select>
                  <textarea
                    required
                    value={leadForm.message}
                    onChange={(event) => updateLeadField("message", event.target.value)}
                    placeholder="Tell us about your requirements"
                    rows={2}
                    className="resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-black outline-none placeholder:text-stone-400 focus:border-stone-500"
                  />
                  <button
                    type="submit"
                    disabled={leadStatus === "submitting" || leadStatus === "success"}
                    className="mt-1 rounded-xl bg-black px-3 py-3 text-xs font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
                  >
                    {leadStatus === "submitting" ? "Sending..." : leadStatus === "success" ? "Enquiry sent" : "Send enquiry"}
                  </button>
                  {leadStatus === "error" && (
                    <p className="text-center text-[11px] text-red-600">Unable to send right now. Please try again.</p>
                  )}
                </form>
              ) : (
              <form
                onSubmit={handleSubmit}
                className="
                  flex
                  items-end
                  gap-2
                  rounded-2xl
                  border
                  border-stone-200
                  bg-stone-50
                  p-2
                  transition-colors
                  focus-within:border-stone-400
                "
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about your project..."
                  disabled={isTyping}
                  className="
                    max-h-28
                    min-h-[42px]
                    flex-1
                    resize-none
                    bg-transparent
                    px-2
                    py-2.5
                    text-sm
                    text-black
                    outline-none
                    placeholder:text-stone-400
                    disabled:opacity-50
                  "
                />

                <button
                  type="submit"
                  disabled={
                    !input.trim() || isTyping
                  }
                  aria-label="Send message"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-black
                    text-white
                    transition-all
                    duration-200
                    hover:bg-stone-800
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </button>
              </form>
              )}

              <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-stone-400">
                <Sparkles className="h-2.5 w-2.5" />
                Powered by Orchid AI
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}