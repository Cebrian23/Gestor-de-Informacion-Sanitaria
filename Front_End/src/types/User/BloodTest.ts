import type { Doctor } from "./Doctor.ts";
import type { Table_analysis, Table_analysis_iterable } from "./Table.ts";
import type { User_Short } from "./User.ts";

export type BloodTest = {
    id: string,
    user: User_Short,
    doctor: Doctor,
    date: string,
    tables: Table_analysis[],
}

export type BloodTest_iterable = {
    id: string,
    user: User_Short,
    doctor: Doctor,
    date: string,
    tables: Table_analysis_iterable[],
}