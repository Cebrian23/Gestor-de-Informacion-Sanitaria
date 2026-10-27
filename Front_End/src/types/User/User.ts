import type { Doctor } from "./Doctor.ts";

export type User = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    DNI: string,
    email: string,
    phone_prefix?: string,
    phone_number?: string,
    doctors: Doctor[],
}

export type User_upt = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    password?: string,
    phone_prefix?: string,
    phone_number?: string,
}

export type User_Short = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    DNI: string,
    email: string,
}