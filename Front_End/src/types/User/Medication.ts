import type { Doctor } from "./Doctor.ts";
import type { User_Short } from "./User.ts";

export type Medication = {
    id: string,
    name: string,
    patient: User_Short,
    type: "Pastilla" | "Jarabe" | string,
    info: Med_info[],
}

export type Medication_Short = {
    id: string,
    name: string,
    type: "Pastilla" | "Jarabe" | string,
    info: number,
}

export type Med_info = {
   doctor: Doctor,
   init_date: string,
   days_duration: number,
   amount_times_day?: number,
   ml_time?: number,
}

export type Medication_ins = {
    id_user: string,
    id_medicine: string,
    doctor: string,
    init_date: string,
    days_duration: number,
    amount_times_day: number,
    ml_time?: number,
}

export type Medication_ins_new = {
    id: string,
    name: string,
    type: string,
    doctor: string,
    init_date: string,
    days_duration: number,
    amount_times_day: number,
    ml_time?: number,
}