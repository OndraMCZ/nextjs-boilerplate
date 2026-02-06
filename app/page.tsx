"use client";

import { useState } from "react";

export default function PexesoApp() {
  const [tema, setTema] = useState("");
  const [vysledek, setVysledek] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const vytvoritPexeso = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVysledek(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tema }),
      });

      const data = await res.json();
      if (data.success) {
        setVysledek(data.navrhy);
      } else {
        setVysledek("Chyba: " + (data.error || "Něco se nepovedlo"));
      }
    } catch (err) {
      setVysledek("Chyba při komunikaci se serverem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          Pexeso na míru ✨
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Napište téma a AI vám navrhne unikátní kartičky.
        </p>

        <form onSubmit={vytvoritPexeso} className="space-y-4">
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Např. Piráti v hlubokém lese"
            className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-slate-700"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all disabled:bg-slate-300 shadow-lg shadow-blue-200"
          >
            {loading ? "Kouzlíme návrhy..." : "Vygenerovat pexeso"}
          </button>
        </form>

        {vysledek && (
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">Vaše pexeso:</h3>
            <pre className="text-sm text-blue-600 whitespace-pre-wrap font-sans italic">
              {vysledek}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}