import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import './Pages.css'
import type { BloodTest } from "../types/User/BloodTest.ts";
import type { Table_analysis_iterable } from "../types/User/Table.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function ShowBloodTest() {
    const [bloodTest, setBloodTest] = useState<BloodTest>();
    const [tables, setTables] = useState<
    {
        table_name: string,
        indexes: string[],
        data: {
            row: string[],
            index: number,
        }[],
        type: string,
        index: number,
    }[]>([]);

    const [showTables, setShowTables] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const auth_cookie = Cookie.get("auth_ECE_II");

            if(!auth_cookie){
                globalThis.location.href = "/login";
            }

            const url_user = `https://ece-ii-back-end.onrender.com/user/id?id=${auth_cookie}`;
            const response_user = await fetch(url_user, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);
                
                globalThis.location.href = "/login";
            }

            const ECE_analysis = Cookie.get("ECE_analysis");

            if(!ECE_analysis){
                globalThis.location.href = "/userPage";
            }

            const url_analysis = `https://ece-ii-back-end.onrender.com/user/single_analysis?id_user=${auth_cookie}&id_analysis=${ECE_analysis}`;
            const response_analysis = await fetch(url_analysis, {
                method: "GET",
            });

            if(response_analysis.status !== 200){
                const error = await response_analysis.json();
                alert(error.error);
                
                globalThis.location.href = "/userPage";
            }

            const data = await response_analysis.json();

            const tables: {
                table_name: string,
                indexes: string[],
                data: {
                    row: string[],
                    index: number,
                }[],
                type: string,
                index: number,
            }[] = [];

            let table_index = 0;

            data.tables.forEach((table: Table_analysis_iterable) => {
                const newTable: {
                    table_name: string,
                    indexes: string[],
                    data: {
                        row: string[],
                        index: number,
                    }[],
                    type: string,
                    index: number,
                } = {
                    table_name: table.table_name,
                    indexes: table.indexes,
                    data: [],
                    type: table.type,
                    index: table_index,
                }

                let index = 0;
                table.data.forEach((row) => {
                    newTable.data.push(
                        {
                            row: row,
                            index: index,
                        }
                    );

                    index += 1;
                });

                tables.push(newTable);

                table_index += 1;
            });

            setTables(tables);
            setBloodTest(data);
        }

        getData();
    }, []);

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div className="bloodTestPage">
                    {
                        bloodTest != undefined && tables.length !== 0 &&
                        <>
                            <h1>Datos del análisis</h1>
                            <div className="content">
                                <div>
                                    <p>
                                        <b>Doctor que envió la prueba: </b>
                                        {
                                            bloodTest.doctor.surname_2 !== undefined && bloodTest.doctor.surname_2 !== null && bloodTest.doctor.surname_2.trim() !== "" &&
                                            <>{bloodTest.doctor.name} {bloodTest.doctor.surname_1} {bloodTest.doctor.surname_2}</>
                                        }
                                        {
                                            (bloodTest.doctor.surname_2 === undefined || bloodTest.doctor.surname_2 === null || bloodTest.doctor.surname_2.trim() === "") &&
                                            <>{bloodTest.doctor.name} {bloodTest.doctor.surname_1}</>
                                        }
                                    </p>
                                    <p><b>Fecha de realización del análisis: </b>{bloodTest.date}</p>
                                </div>
                                <div className="bloodTestButtons">
                                    <button type="button" onClick={() => setShowTables(!showTables)}>{showTables === false ? "Mostrar tablas" : "Ocultar tablas"}</button>
                                </div>
                                <div>
                                    {
                                        showTables === true && tables.length > 0 &&
                                        tables.map((table) => {
                                            return(
                                                <div key={table.index}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={table.indexes.length}>{table.table_name}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                {
                                                                    table.indexes.map((index) => {
                                                                        return(
                                                                            <td key={index}>{index}</td>
                                                                        )
                                                                    })
                                                                }
                                                            </tr>
                                                            {
                                                                table.data.length > 0 &&
                                                                table.data.map((data) => {
                                                                    return(
                                                                        <tr key={data.index}>
                                                                            {
                                                                                data.row.length > 0 &&
                                                                                data.row.map((dat) => {
                                                                                    return(
                                                                                        <td key={dat}>{dat}</td>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    {
                                                        table.index < (tables.length-1) &&
                                                        <br/>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="bloodTestButtons">
                                <button type="button" onClick={() => globalThis.location.href = "/showUserBloodTests"}>Volver</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}


export default ShowBloodTest;