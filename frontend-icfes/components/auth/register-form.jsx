"use client";

import { useState } from "react";
import { Mail, KeyRound, User } from "lucide-react";
import { register } from "@/services/authService";

export function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const user = await register(name, email, password);
      localStorage.setItem("user", JSON.stringify(user));
      onRegister(email, password, name);
    } catch (error) {
      onRegister(email, password, name);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Título */}
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Regístrate
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-2xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                       transition-colors"
            required
          />
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-2xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                       transition-colors"
            required
          />
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-2xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                       transition-colors"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-2xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                       transition-colors"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl 
                     transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
        >
          {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-gray-600"></div>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

     

      {/* Terms and Privacy */}
      <div className="mt-6 text-center text-xs text-gray-400">
        <p>
          Al registrarte en +500 Icfes, aceptas nuestros{" "}
          <span className="text-blue-400">Términos</span> y{" "}
          <span className="text-blue-400">Política de privacidad</span>.
        </p>
        <p className="mt-2">
          Esta página está protegida por reCAPTCHA Enterprise. Aplican tanto la{" "}
          <span className="text-blue-400">política de privacidad</span> como los{" "}
          <span className="text-blue-400">términos del servicio</span> de
          Google.
        </p>
      </div>

      {/* Switch to Login */}
      <div className="mt-8 text-center">
        <p className="text-white">
          ¿Ya tienes una cuenta?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            INGRESA
          </button>
        </p>
      </div>
    </div>
  );
}
