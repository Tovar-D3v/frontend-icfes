"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCursosMateriasByProfesor } from "../../services/profesor/cursos-materias";
import CreateAvatar from "@/components/screens/profile/create-avatar";

export default function CreateAvatarPage() {
  return (
    <CreateAvatar />
  );
}
