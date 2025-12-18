"use client";

import { useState } from "react";
import { Mail, KeyRound } from "lucide-react";
import { login } from "@/services/authService";
import { Alert, notification } from "antd"


export function LoginForm({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      onLogin(user);
      
    } catch (error) {
      const detail =
        error?.response?.data?.detail ?? error?.detail ?? error?.message;

      if (
        detail ===
        "No active account found with the given credentials"
      ) {
        notification.error({
          title: "Correo o contraseña incorrecta",
        });
      } else {
        notification.error({
          title: "Error al iniciar sesión. Inténtalo de nuevo.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-full bg-background flex justify-center flex-col">

      {/* Título */}
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        Ingresar
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Correo o usuario"
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-2xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                       transition-colors"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Contraseña"
            className="w-full px-4 py-4 bg-transparent border-2 border-gray-600 rounded-2xl 
                       text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                       transition-colors"
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 text-sm"
          >
            ¿SE TE OLVIDÓ?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl 
                     transition-all active:scale-[0.98] disabled:opacity-50 mt-6"
        >
          {loading ? "CARGANDO..." : "INGRESAR"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-gray-600"></div>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

      {/* Switch to Register */}
      

      {/* Terms and Privacy */}
      <div className="mt-6 text-center text-xs text-gray-400">
        <p>Al registrarte en +500 Icfes, aceptas nuestros <span className="text-blue-400">Términos</span> y <span className="text-blue-400">Política de privacidad</span>.</p>
        <p className="mt-2">Esta página está protegida por reCAPTCHA Enterprise. Aplican tanto la <span className="text-blue-400">política de privacidad</span> como los <span className="text-blue-400">términos del servicio</span> de Google.</p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-white">
          ¿No tienes una cuenta?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            REGÍSTRATE
          </button>
        </p>
      </div>
    </div>
  );
}