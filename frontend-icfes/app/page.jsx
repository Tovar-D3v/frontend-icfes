"use client";

import { AuthSelection } from "@/components/auth/auth-selection";

export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full min-h-screen">
        <div className="min-h-screen w-full bg-white flex justify-center">
          <AuthSelection />
        </div>
      </div>
    </div>
  );
}
