"use client";

import { useParams, useRouter } from "next/navigation";
import { UnitsScreen } from "@/components/screens/units-screen";
import { useEffect, useState } from "react";
import { getMaterias } from "@/services/subjectsService";
import { getUnitsBySubject } from "@/services/unitsService";

export default function SubjectUnitsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [subject, setSubject] = useState(null);
    const [units, setUnits] = useState([]);

    useEffect(() => {
        async function load() {
            const materias = await getMaterias();
            const found = materias.find((m) => m.id_materia == id);

            if (!found) {
                router.push("/home");
                return;
            }

            setSubject({
                id: found.id_materia,
                name: found.nombre,
                icon: found.icono_url,
                color: found.color_css,
            });

            const unitsResp = await getUnitsBySubject(found.id_materia);

            // Asegurar estructura
            setUnits(unitsResp);
        }

        load();
    }, [id]);

    if (!subject || units.length === 0)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );

    return (
        <UnitsScreen
            subject={subject}
            onStartQuiz={(unit) => console.log("Start quiz:", unit)}
            onBack={() => router.push("/home")}
        />

    );
}
