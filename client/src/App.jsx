import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header.jsx";
import { ChatWindow } from "./components/ChatWindow.jsx";
import { ChatInput } from "./components/ChatInput.jsx";
import { checkHealth, askQuestion } from "./services/api.js";

function getFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_WELCOME_MESSAGE = {
  id: "msg_init",
  role: "assistant",
  content: "Hello! I am your Department FAQ Assistant. How can I assist you with your academic, admission, course, or campus questions today?",
  timestamp: getFormattedTime(),
  answeredFromKnowledgeBase: true,
  sourceFaqIds: [],
  mode: "retrieval"
};

export default function App() {
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");

  // Health check on startup and poll every 30 seconds
  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      try {
        await checkHealth();
        if (isMounted) setIsConnected(true);
      } catch (err) {
        if (isMounted) setIsConnected(false);
      }
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSendMessage = useCallback(async (questionText) => {
    const trimmed = (questionText || "").trim();
    if (!trimmed || isLoading) return;

    setLastQuestion(trimmed);

    // 1. Append user message
    const userMsg = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: getFormattedTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call backend API
      const result = await askQuestion(trimmed);

      // 3. Append assistant response
      const assistantMsg = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: result.answer,
        timestamp: getFormattedTime(),
        answeredFromKnowledgeBase: result.answeredFromKnowledgeBase,
        sourceFaqIds: result.sourceFaqIds || [],
        mode: result.mode || "retrieval",
        score: result.score
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // 4. Handle error gracefully
      const errorMsg = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content: `Error: ${err.message || "Failed to contact department server."}`,
        timestamp: getFormattedTime(),
        isError: true,
        sourceFaqIds: []
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleClearChat = useCallback(() => {
    setMessages([{
      ...INITIAL_WELCOME_MESSAGE,
      id: `msg_${Date.now()}`,
      timestamp: getFormattedTime()
    }]);
  }, []);

  const handleRetry = useCallback((failedIndex) => {
    if (lastQuestion) {
      // Remove failed error message
      setMessages((prev) => prev.filter((_, idx) => idx !== failedIndex));
      handleSendMessage(lastQuestion);
    }
  }, [lastQuestion, handleSendMessage]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/70 text-slate-800">
      <Header
        onClearChat={handleClearChat}
        isConnected={isConnected}
      />

      <main className="flex-1 flex flex-col justify-between overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSelectSuggestedQuestion={handleSendMessage}
          onRetryMessage={handleRetry}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </main>
    </div>
  );
}
