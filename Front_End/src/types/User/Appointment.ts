import type { Doctor_Short } from "./Doctor.ts";
import type { User_Short } from "./User.ts";

export type Appointment = {
    id: string,
    date: string,
    hour: string,
    doctor: Doctor_Short,
    user: User_Short,
    hospital?: string,
    ubication?: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
}

export type Appointment_ins = {
    date: string,
    hour: string,
    doctor: string,
    user: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
}