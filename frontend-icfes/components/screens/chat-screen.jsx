import { useState } from "react";

export function ChatScreen({ onClose }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = () => {
    if (userMessage.trim() === "") return;

    // Simular respuesta de IA
    const aiResponse = `¡Gracias por tu pregunta! Para mejorar en este tema, te recomiendo revisar ejercicios prácticos y conceptos clave.`;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "ai", text: aiResponse },
    ]);
    setUserMessage("");
  };

  return (
    <div
      className="flex flex-col bg-background pb-2"
      style={{ height: "calc(100vh - 125px)" }}
    >

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                ¿En qué puedo ayudarte hoy?
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <button className="p-3 bg-card rounded-lg border border-border text-left text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Que temas debo repasar?
              </button>
              <button className="p-3 bg-card rounded-lg border border-border text-left text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                Cómo mejorar mi rendimiento?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-xs ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border border-border"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border flex-shrink-0 rounded-t-2xl">
        <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-3">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Pregunta sobre tu desempeño..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
          />
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded transition-colors">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded transition-colors">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <button className="p-1 hover:bg-accent hover:text-accent-foreground rounded transition-colors">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!userMessage.trim()}
              className={`p-2 rounded-full transition-colors ${
                userMessage.trim()
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
