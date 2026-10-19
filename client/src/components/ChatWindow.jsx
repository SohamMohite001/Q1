import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage.jsx";
import { LoadingIndicator } from "./LoadingIndicator.jsx";
import { WelcomeSection } from "./WelcomeSection.jsx";
import { SuggestedQuestions } from "./SuggestedQuestions.jsx";

export function ChatWindow({
  messages,
  isLoading,
  onSelectSuggestedQuestion,
  onRetryMessage
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
      {/* Welcome & Overview Card */}
      <WelcomeSection />

      {/* Suggested Questions Quick Chips */}
      <SuggestedQuestions
        onSelectQuestion={onSelectSuggestedQuestion}
        disabled={isLoading}
      />

      {/* Messages Stream */}
      <div className="space-y-1 mt-6">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            message={msg}
            onRetry={msg.isError ? () => onRetryMessage(index) : undefined}
          />
        ))}

        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
