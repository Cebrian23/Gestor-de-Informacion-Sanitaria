import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Med_info, Medication } from "../types/User/Medication.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function ShowMedicine(){
    const [medicine, setMedicine] = useState<Medication>();
    const [showInfo, setShowInfo] = useState(false);
    const [info, setInfo] = useState<Med_info[]>([]);

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

            const medicine_cookie = Cookie.get("ECE_medicine");

            if(!medicine_cookie){
                globalThis.location.href = "/login";
            }

            const url_medicine = `https://ece-ii-back-end.onrender.com/user/medication?id_user=${auth_cookie}&id_medic=${medicine_cookie}`;
            const response_medicine = await fetch(url_medicine, {
                method: "GET",
            });

            if(response_medicine.status !== 200){
                const error = await response_medicine.json();
                alert(error.error);

                globalThis.location.href = "/userPage";
            }

            const data = await response_medicine.json();

            setMedicine(data);
            setInfo(data.info);
        }

        getData();
    }, []);

    const modifyDate = (date: string) => {
        const date_split1 = date.split("/");
        const date_split2 = date.split("-");

        if(date_split1.length > 1){
            return (date_split1[2] + "/" + date_split1[1] + "/" + date_split1[0]);
        }
        else if(date_split2.length > 1){
            return (date_split2[2] + "-" + date_split2[1] + "-" + date_split2[0]);
        }

        return "";
    }

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div className="medicinePage">
                    {
                        medicine !== undefined &&
                        <>
                            <h1>{medicine.name}</h1>
                            <div className="content">
                                <div>
                                    <p><b>Nombre: </b>{medicine.name}</p>
                                    <p><b>Tipo: </b>{medicine.type}</p>
                                </div>
                            </div>
                            <div className="content_button">
                                <button type="button" onClick={() => setShowInfo(!showInfo)}>{showInfo === false ? "Mostrar más" : "Mostrar menos"}</button>
                            </div>
                            {
                                showInfo === true && medicine.info.length > 0 &&
                                <div className={medicine.info.length >= 3 ? "grid_info3" : (medicine.info.length%2 === 0 ? "grid_info2" : "grid_info1")}>
                                    {
                                        info.map((data) => {
                                            let key = data.doctor.id.toString();

                                            let value = data.days_duration;

                                            if(data.amount_times_day !== undefined){
                                                value += (data.amount_times_day * 2.5);
                                            }

                                            const date = data.init_date.split("-");

                                            date.forEach((data_value) => {
                                                value *= Number(data_value);
                                            });

                                            if(data.ml_time){
                                                value /= data.ml_time;
                                            }

                                            key += `-${value*medicine.info.length}`
                                            
                                            return(
                                                <div className="cards" key={key}>
                                                    <p>
                                                        <b>Doctor: </b>
                                                        {
                                                            data.doctor.surname_2 !== undefined && data.doctor.surname_2 !== null &&
                                                            <>{data.doctor.name} {data.doctor.surname_1} {data.doctor.surname_2}</>
                                                        }
                                                        {
                                                            data.doctor.surname_2 === undefined || data.doctor.surname_2 === null &&
                                                            <>{data.doctor.name} {data.doctor.surname_1}</>
                                                        }
                                                    </p>
                                                    <p><b>Fecha de inicio del medicamento: </b>{modifyDate(data.init_date)}</p>
                                                    <p><b>Duración del tratamiento: </b>{data.days_duration} días</p>
                                                    <p>
                                                        {
                                                            medicine.type === "Jarabe" &&
                                                            <b>Cantidad de cucharadas de jarabe al día: </b>
                                                        }
                                                        {
                                                            medicine.type === "Pastillas" &&
                                                            <b>Cantidad de pastillas al día: </b>
                                                        }
                                                        {data.amount_times_day}
                                                        {
                                                            medicine.type === "Jarabe" &&
                                                            <> cucharadas</>
                                                        }
                                                        {
                                                            medicine.type === "Pastillas" &&
                                                            <> pastillas</>
                                                        }
                                                    </p>
                                                    {
                                                        medicine.type === "Jarabe" &&
                                                        <p><b>Mililítros por cucharada: </b>{data.ml_time} ml</p>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                            <div className="content_button">
                                <button type="button" onClick={() => {
                                    Cookie.remove("ECE_medicine");

                                    globalThis.location.href = "/userPage";
                                }}>Volver</button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default ShowMedicine;