"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BrainCircuit, ImageIcon, SendHorizontal } from "lucide-react";
import { chatInforme } from "../../services/profesor/chat-ia-informe";
import { getListadoInformes } from "@/services/profesor/listado-informes";
import { getMensajesInforme } from "../../services/profesor/mensajes-informe";
import ListadoInformesGeneradosPage from "./listado-informes-generados";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function ChatIAProfesoresPage() {
  const params = useParams();
  const informeId = params?.informeId ?? undefined;
  const [currentInformeId, setCurrentInformeId] = useState(informeId);

  // estado para controlar el panel lateral en móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Al montar, priorizar informe en cache; si no existe, tomar el último informe del listado
  useEffect(() => {
    try {
      const stored = localStorage.getItem("informe_seleccionado");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id) {
          setCurrentInformeId(parsed.id);
          return;
        }
      }
    } catch (e) {
      console.warn("no se pudo leer informe_seleccionado:", e);
    }

    // si no hay informe seleccionado, intentar obtener último informe para la asignación seleccionada
    (async () => {
      try {
        const raw = localStorage.getItem("asignacion_seleccionada");
        if (!raw) return;
        const item = JSON.parse(raw);
        const asignacion_id = item?.asignacion_id ?? item?.asignacion ?? null;
        if (!asignacion_id) return;
        const res = await getListadoInformes(asignacion_id);
        const list = Array.isArray(res) ? res : [];
        if (list.length === 0) return;
        // tomar el más reciente por creado_en
        list.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
        const ultimo = list[0];
        if (ultimo?.id) {
          setCurrentInformeId(ultimo.id);
          try {
            localStorage.setItem(
              "informe_seleccionado",
              JSON.stringify({ id: ultimo.id })
            );
          } catch {}
        }
      } catch (e) {
        console.warn("no se pudo obtener último informe:", e);
      }
    })();
  }, []);

  // Escuchar selección hecha desde el listado
  useEffect(() => {
    const handler = (ev) => {
      const inf = ev?.detail;
      const id = inf?.id ?? inf;
      if (id) {
        setCurrentInformeId(id);
        try {
          localStorage.setItem("informe_seleccionado", JSON.stringify({ id }));
        } catch {}
        // cerrar el panel móvil si estaba abierto
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("informeSeleccionado", handler);
    return () => window.removeEventListener("informeSeleccionado", handler);
  }, []);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Cargar mensajes previos del informe seleccionado
  useEffect(() => {
    if (!currentInformeId) return;
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await getMensajesInforme(currentInformeId);
        const list = Array.isArray(res?.mensajes) ? res.mensajes : [];
        list.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        const mapped = list.flatMap((m) => {
          const items = [];
          if (m.pregunta) {
            items.push({
              id: `${m.id}_q`,
              sender: "user",
              text: m.pregunta,
              creado_en: m.creado_en,
            });
          }
          if (m.respuesta) {
            items.push({
              id: `${m.id}_a`,
              sender: "assistant",
              text: m.respuesta,
              creado_en: m.creado_en,
            });
          }
          return items;
        });

        if (mounted) {
          setMessages(mapped);
          setTimeout(
            () =>
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            50
          );
        }
      } catch (err) {
        console.error("Error al cargar mensajes del informe:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentInformeId]);

  // Normalize markdown text to avoid múltiples párrafos vacíos
  const normalizeMarkdown = (text) => {
    if (!text) return "";
    // unificar newlines
    let t = text.replace(/\r\n/g, "\n");
    // colapsar 3+ newlines a 2 (párrafo)
    t = t.replace(/\n{3,}/g, "\n\n");
    // convertir saltos simples entre líneas en espacio (evita párrafos vacíos no intencionales)
    t = t.replace(/([^\n])\n([^\n])/g, "$1 $2");
    return t.trim();
  };

  const handleSendMessage = async () => {
    const text = (inputValue ?? "").trim();
    if (!text) return;

    const userMsg = { id: Date.now() + "_u", sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const loadingId = Date.now() + "_a";
    const loadingMsg = {
      id: loadingId,
      sender: "assistant",
      text: "",
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    setIsLoading(true);
    try {
      const res = await chatInforme(currentInformeId, text);

      if (res && typeof res === "object" && res.informe_id) {
        setCurrentInformeId(res.informe_id);
        try {
          localStorage.setItem(
            "informe_seleccionado",
            JSON.stringify({ id: res.informe_id })
          );
        } catch {}
      }

      let assistantText = "";
      let images = [];
      if (typeof res === "string") {
        assistantText = res;
      } else if (res && typeof res === "object") {
        assistantText =
          res.respuesta ?? res.text ?? res.message ?? (res.pregunta ? "" : "");
        if (Array.isArray(res.images)) images = res.images;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, text: assistantText, images, isLoading: false }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                text: "Error: no se pudo obtener respuesta. Intenta de nuevo.",
                isLoading: false,
              }
            : m
        )
      );
      console.error("chatInforme error:", err);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="lg:min-h-screen flex lg:items-center justify-center pt-6  lg:pb-6">
      <>
        <div className={`lg:h-full w-full flex flex-col h-[80vh] min-h-0`}>
          {/* Encabezado */}
          <div className="flex items-center justify-between px-5 py-4 border-card rounded-xl">
            <h2 className="text-lg font-semibold">¿En qué puedo ayudarte?</h2>
            {/* botón para móviles */}
            <button
              aria-label="Abrir informes"
              onClick={() => setMobileMenuOpen(true)}
              className="bg-primary text-white py-2 px-4 rounded-sm shadow-lg lg:hidden"
            >
              ☰
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-5 py-4 ">
            {messages.length === 0 ? (
              <div className="text-gray-500 h-full text-sm flex-col justify-center w-full items-center flex text-center">
                <BrainCircuit className="h-14 w-14 mb-4" />
                <p className="w-9/12">
                  ¡Hola! Soy tu Asistente IA para Profesores. Estoy aquí para
                  ayudarte a responder preguntas sobre metodologías de
                  enseñanza, estrategias pedagógicas y recursos educativos. ¿En
                  qué te puedo ayudar hoy?
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex mb-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] text-[15px] leading-relaxed shadow-md ${
                      msg.sender === "user"
                        ? "quiz-option-selected text-white rounded-br-none border"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.images && msg.images.length > 0 && (
                      <div className="mb-2">
                        {msg.images.map((image) => (
                          <div key={image.id} className="mb-2">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="max-w-full h-auto rounded-lg max-h-40 object-contain"
                            />
                            <p className="text-xs opacity-70 mt-1">
                              {image.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {msg.isLoading && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      )}
                      <div className="prose max-w-none text-[15px]">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                        >
                          {normalizeMarkdown(msg.text ?? "")}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className=" border-card rounded-xl">
            <div className="px-4 py-3 ">
              <div className="flex items-center gap-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className={`flex-1 text-[15px] resize-none border-0 focus:outline-none focus:ring-0 focus:border-transparent overflow-auto max-h-40 no-scrollbar ${
                    isLoading ? "opacity-50" : ""
                  }`}
                  disabled={isLoading}
                  placeholder="Escribe tu mensaje..."
                  value={inputValue ?? ""}
                  onChange={(e) => setInputValue(e.target.value ?? "")}
                  onKeyDown={handleKeyPress}
                  onInput={() => {
                    const ta = textareaRef.current;
                    if (!ta) return;
                    ta.style.height = "auto";
                    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
                  }}
                />

                <button
                  disabled={isLoading}
                  className={``}
                  onClick={handleSendMessage}
                >
                  <SendHorizontal />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 py-2">
            La IA puede cometer errores. Verifica las respuestas.
          </p>
        </div>

        {/* PANEL LATERAL MÓVIL */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative w-4/5 max-w-xs bg-background h-full overflow-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Informes</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar"
                  className="px-2 py-1"
                >
                  ×
                </button>
              </div>
              <ListadoInformesGeneradosPage />
            </aside>
          </div>
        )}

        <style jsx>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          /* Ocultar scrollbar pero mantener scroll funcional */
          .no-scrollbar {
            -ms-overflow-style: none; /* IE y Edge */
            scrollbar-width: none; /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
      </>
    </div>
  );
}
