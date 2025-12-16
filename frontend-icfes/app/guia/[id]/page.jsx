"use client";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuiaLecturaCritica() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <button onClick={() => router.back()} className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-2xl z-10">
        <X className="w-6 h-6 text-gray-400" />
      </button>

      {/* HEADER */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-32 ">
          <img
            src="https://res.cloudinary.com/dulrdwjul/image/upload/v1765248171/Gemini_Generated_Image_vfcaqlvfcaqlvfca_20251208130510_k2ifvu.png"
            alt="owl"
          />
        </div>

        <h1 className="text-3xl font-bold mt-4">Guía de Lectura Crítica</h1>
        <p className="text-gray-300 mt-2 text-lg">
          Explora tips, estrategias y ejemplos clave para esta sección del ICFES
        </p>
      </div>

      {/* SECCIÓN: FRASES CLAVE */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-blue-300">FRASES CLAVE</h2>

        <div className="space-y-6">

          <Card
            title="Idea principal"
            description="Responde a: ¿De qué trata realmente el texto? No es un detalle ni un ejemplo."
            ejemplo="La idea principal resume la intención general del autor sin centrarse en detalles específicos."
          />

          <Card
            title="Inferencia"
            description="Pensar más allá de lo explícito. No está escrito textual, pero sí se deduce."
            ejemplo="Si el texto dice que 'había charcos y bancas mojadas', podemos inferir que llovió."
          />

          <Card
            title="Intención del autor"
            description="Explica por qué se escribió el texto: informar, criticar, persuadir, narrar…"
            ejemplo="‘Es urgente tomar medidas’ indica una intención de advertir."
          />

          <Card
            title="Tono"
            description="La actitud del autor: crítico, sarcástico, neutral, alarmante."
            ejemplo="Si usa palabras fuertes, probablemente el tono es crítico."
          />

        </div>
      </section>

      {/* TRAMPAS */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-blue-300">TIP: Evita las trampas del ICFES</h2>

        <Trap
          title="Respuestas bonitas pero incorrectas"
          text="Suenan inteligentes, pero no responden lo que pide la pregunta o no están en el texto."
        />

        <Trap
          title="Palabras absolutas"
          text="Siempre, nunca, jamás. El 90% de las veces… son falsas porque el texto no habla en extremos."
        />

        <Trap
          title="Confundir opinión con hecho"
          text="Si el autor usa ‘parece’, ‘quizá’, ‘se cree’… no es hecho, es interpretación."
        />
      </section>

      {/* CONSEJOS */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-blue-300">TIP: Responde más rápido y con precisión</h2>

        <Advice
          title="Lee primero la pregunta"
          text="Esto te da una misión antes de leer el texto. Ahorras tiempo y reduces errores."
        />

        <Advice
          title="Marca palabras clave"
          text="Si menciona ‘autor’, ‘propósito’, ‘relación’, cambia el tipo de pensamiento que debes usar."
        />

        <Advice
          title="Elimina antes de elegir"
          text="Descarta opciones que contradicen el texto o agregan información inventada."
        />
      </section>

      {/* EJEMPLOS ICFES */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-4 text-blue-300">EJEMPLOS ICFES</h2>

        <Example
          title="Idea principal"
          text="“El texto critica cómo los jóvenes dejan la lectura por el uso excesivo del celular.”"
          interpret="La tecnología desplaza el hábito de lectura."
        />

        <Example
          title="Inferencia"
          text="“Había charcos y bancas mojadas.”"
          interpret="Llovió recientemente."
        />

        <Example
          title="Intención del autor"
          text="“Es urgente tomar medidas frente al aumento de basuras.”"
          interpret="Advertir y pedir acción."
        />

      </section>

      {/* FINAL TIP */}
      <div className="bg-blue-900/40 p-6 rounded-2xl border border-blue-700">
        <h2 className="text-2xl font-bold mb-3">Método Final en 3 Pasos</h2>
        <ol className="list-decimal ml-5 space-y-2 text-gray-300">
          <li>Lee la pregunta primero.</li>
          <li>Lee solo lo necesario del texto.</li>
          <li>Elimina dos opciones antes de elegir.</li>
        </ol>
      </div>

      <div className="h-20" />
    </div>
  );
}

/* ---------------------------------------------------------
   COMPONENTES REUTILIZABLES
--------------------------------------------------------- */

function Card({ title, description, ejemplo }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700">
      <h3 className="text-lg font-bold text-blue-200">{title}</h3>
      <p className="text-gray-300 mt-1">{description}</p>
      <p className="text-gray-400 italic mt-2">Ejemplo: {ejemplo}</p>
    </div>
  );
}

function Trap({ title, text }) {
  return (
    <div className="bg-[#1e1f2e] p-4 rounded-xl border border-red-700/40 mb-4">
      <h3 className="text-lg font-bold text-red-300">🪤 {title}</h3>
      <p className="text-gray-300 mt-1">{text}</p>
    </div>
  );
}

function Advice({ title, text }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 mb-3">
      <h3 className="text-lg font-bold text-green-300">💡 {title}</h3>
      <p className="text-gray-300 mt-1">{text}</p>
    </div>
  );
}

function Example({ title, text, interpret }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 mb-4">
      <h3 className="text-lg font-bold text-purple-300">{title}</h3>
      <p className="text-gray-300 mt-1">Texto: {text}</p>
      <p className="text-gray-400 italic mt-2">Interpretación correcta: {interpret}</p>
    </div>
  );
}
