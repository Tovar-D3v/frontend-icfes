"use client";


export default function QuizLayout({ children }) {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="container max-w-2xl mx-auto flex-1">
        {children}
      </main>
    </div>
  );
}