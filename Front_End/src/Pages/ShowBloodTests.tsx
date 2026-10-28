import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import './Pages.css'
import type { BloodTest } from "../types/User/BloodTest.ts";
import type { Doctor } from "../types/User/Doctor.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function ShowBloodTests() {
    const [bloodTests, setBloodTests] = useState<BloodTest[]>([]);
    const [showBloodTests, setShowBloodTests] = useState<BloodTest[]>([]);

    const [doctor, setDoctor] = useState("Todos");
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [initDate, setInitDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const getData = async () => {
            Cookie.remove("ECE_analysis");

            const auth_cookie = Cookie.get("auth_ECE_II");

            if(!auth_cookie){
                globalThis.location.href = "/login";
            }

            const url_user = `https://ece-ii-back-end-api-rest.onrender.com/user/id?id=${auth_cookie}`;
            const response_user = await fetch(url_user, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);
                
                globalThis.location.href = "/login";
            }

            const url_analysis = `https://ece-ii-back-end-api-rest.onrender.com/user/all_analysis?id=${auth_cookie}`;
            const response_analysis = await fetch(url_analysis, {
                method: "GET",
            });

            if(response_analysis.status !== 200){
                const error = await response_analysis.json();
                alert(error.error);

                globalThis.location.href = "/userPage";
            }

            const data_analysis = await response_analysis.json();
            
            const data_analysis_aux: BloodTest[] = [];

            data_analysis.forEach((data: BloodTest) => {
                data_analysis_aux.push(
                    {
                        id: data.id,
                        user: data.user,
                        doctor: data.doctor,
                        date: modifyDate(data.date),
                        tables: data.tables,
                    }
                );
            });

            setBloodTests(data_analysis_aux);
            setShowBloodTests(data_analysis_aux);
            
            const doctors_aux: Doctor[] = [];
            data_analysis.forEach((analysis: BloodTest) => {
                const doctorFound = doctors_aux.find((doctor) => {
                    if(doctor.id === analysis.doctor.id){
                        return doctor;
                    }
                });

                if(doctorFound === undefined){
                    doctors_aux.push(analysis.doctor);
                }
            });

            setDoctors(doctors_aux);
        }

        getData();
    }, []);

    if(initDate === "" || endDate === ""){
        const date = new Date();

        let month;
        let day;

        if(date.getMonth() < 10){

            month = "0" + (date.getMonth()+1).toString();
        }
        else{
            month = date.getMonth().toString();
        }

        if(date.getDate() < 10){
            day = "0" + date.getDate().toString();
        }
        else{
            day = date.getDate().toString();
        }

        const new_init_date = (date.getFullYear() - 20).toString() + "-01-01";
        const new_end_date = date.getFullYear().toString() + "-" + month + "-" + day;

        setInitDate(new_init_date);
        setEndDate(new_end_date)
    }

    const handleReset = () => {
        setShowBloodTests(bloodTests);
        
        setDoctor("Todos");
        setInitDate("");
        setEndDate("");
    }

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

    const handleChangeInfo = (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement> | React.ChangeEvent<HTMLInputElement, HTMLInputElement>, act: string) => {
        const doctors_aux: BloodTest[] = [];
        const date_aux: BloodTest[] = [];
        const final_data: BloodTest[] = [];

        if(act === "doctor"){
            setDoctor(e.currentTarget.value);

            bloodTests.forEach((analysis) => {
                if(e.currentTarget.value !== "Todos" && analysis.doctor.id === e.currentTarget.value){
                    doctors_aux.push(analysis);
                }
                else if(e.currentTarget.value === "Todos"){
                    doctors_aux.push(analysis);
                }

                if(new Date(analysis.date) >= new Date(initDate) && new Date(analysis.date) <= new Date(endDate)){
                    date_aux.push(analysis);
                }
            });
        }
        else if(act === "initDate"){
            setInitDate(e.currentTarget.value);

            bloodTests.forEach((analysis) => {
                if(doctor !== "Todos" && analysis.doctor.id === doctor){
                    doctors_aux.push(analysis);
                }
                else if(doctor === "Todos"){
                    doctors_aux.push(analysis);
                }

                if(new Date(analysis.date) >= new Date(e.currentTarget.value) && new Date(analysis.date) <= new Date(endDate)){
                    date_aux.push(analysis);
                }
            });
        }
        else if(act === "endDate"){
            setEndDate(e.currentTarget.value);

            bloodTests.forEach((analysis) => {
                if(doctor !== "Todos" && analysis.doctor.id === doctor){
                    doctors_aux.push(analysis);
                }
                else if(doctor === "Todos"){
                    doctors_aux.push(analysis);
                }

                if(new Date(analysis.date) >= new Date(initDate) && new Date(analysis.date) <= new Date(e.currentTarget.value)){
                    date_aux.push(analysis);
                }
            });
        }

        doctors_aux.forEach((analysis1) => {
            date_aux.forEach((analysis2) => {
                if(analysis1.id === analysis2.id){
                    final_data.push(analysis1);
                }
            });
        });

        setShowBloodTests(final_data);
    }

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div>
                    <div className="userContainerBloodTest">
                        <form className="showAnalysisMenu">
                            <h1>Panel de filtrado de análisis</h1>
                            <div className="column">
                                <label>Doctor:</label>
                                <select defaultValue={doctor} onChange={(e) => handleChangeInfo(e, "doctor")}>
                                    <option value="Todos">Todos</option>
                                    {
                                        doctors.map((doctor) => {
                                            if(doctor.surname_2 !== null && doctor.surname_2 !== undefined && doctor.surname_2.trim() !== ""){
                                                return(
                                                    <option key={doctor.id} value={doctor.id}>{doctor.name} {doctor.surname_1} {doctor.surname_2}</option>
                                                )
                                            }
                                            else{
                                                return(
                                                    <option key={doctor.id} value={doctor.id}>{doctor.name} {doctor.surname_1}</option>
                                                )
                                            }
                                        })
                                    }
                                </select>
                            </div>
                            <div className="column">
                                <label>Fecha límite inicial:</label>
                                <input type="date" defaultValue={initDate} onChange={(e) => handleChangeInfo(e, "initDate")}/>
                            </div>
                            <div className="column">
                                <label>Fecha límite final:</label>
                                <input type="date" defaultValue={endDate} onChange={(e) => handleChangeInfo(e, "endDate")}/>
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                                <button type="reset" onClick={handleReset}>Reiniciar campos</button>
                            </div>
                        </form>
                    </div>
                    <br/>
                    {
                        showBloodTests.length > 0 &&
                        <div className={showBloodTests.length >= 3 ? "grid_analysis3" : (showBloodTests.length%2 === 0 ? "grid_analysis2": "grid_analysis1")}>
                            {
                                showBloodTests.map((bloodTest) => {
                                    return(
                                        <div key={bloodTest.id} className="cards">
                                            <p>
                                                <b>Doctor: </b>
                                                {
                                                    bloodTest.doctor.surname_2 !== null && bloodTest.doctor.surname_2 !== undefined && bloodTest.doctor.surname_2.trim() !== "" &&
                                                    <>{bloodTest.doctor.name} {bloodTest.doctor.surname_1} {bloodTest.doctor.surname_2}</>
                                                }
                                                {
                                                    (bloodTest.doctor.surname_2 === null || bloodTest.doctor.surname_2 === undefined || bloodTest.doctor.surname_2.trim() === "") &&
                                                    <>{bloodTest.doctor.name} {bloodTest.doctor.surname_1}</>
                                                }
                                            </p>
                                            <p><b>Fecha de análisis: </b>{modifyDate(bloodTest.date)}</p>
                                            <button type="button" onClick={() => {
                                                Cookie.set("ECE_analysis", bloodTest.id, {expires: 7});

                                                globalThis.location.href = "/showUserBloodTest" 
                                            }}>Ver datos analitica</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    {
                        showBloodTests.length === 0 &&
                        <div className="messageLength0">
                            <h1>Análisis de sangre no encontrados</h1>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ShowBloodTests;