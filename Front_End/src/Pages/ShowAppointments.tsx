import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Appointment } from "../types/User/Appointment.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function ShowAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showAppointments, setShowAppointments] = useState<Appointment[]>([]);
    const [specialty, setSpecialty] = useState("Todos");
    const [publicInfo, setPublicInfo] = useState("Ambos");

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

            const url_appointments = `https://ece-ii-back-end.onrender.com/user/appointments?id=${auth_cookie}`;
            const response_appointments = await fetch(url_appointments, {
                method: "GET",
            });

            if(response_appointments.status !== 200){
                const error = await response_appointments.json();
                alert(error.error);
                
                globalThis.location.href = "/userPage";
            }

            const data = await response_appointments.json();
            setAppointments(data);
            setShowAppointments(data);
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
    
    const handleChangeInfo = (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>, act: string) => {
        const doc_aux1: Appointment[] = [];
        const doc_aux2: Appointment[] = [];
    
        if(act === "speciality"){
            setSpecialty(e.currentTarget.value);
    
            appointments.forEach((ap) => {
                if(e.currentTarget.value === "Todos"){
                    doc_aux1.push(ap);
                }
                if(e.currentTarget.value !== "Todos" && ap.specialty === e.currentTarget.value){
                    doc_aux1.push(ap);
                }
    
                if(publicInfo === "Ambos"){
                    doc_aux2.push(ap);
                }
                else if(publicInfo !== "Ambos" && publicInfo === ap.sector){
                    doc_aux2.push(ap);
                }
            });
        }
        else if(act === "publicInfo"){
            setPublicInfo(e.currentTarget.value);
    
            appointments.forEach((ap) => {
                if(e.currentTarget.value === "Ambos"){
                    doc_aux2.push(ap);
                }
                if(e.currentTarget.value !== "Ambos" && ap.sector === e.currentTarget.value){
                    doc_aux2.push(ap);
                }
    
                if(specialty === "Todos"){
                    doc_aux1.push(ap);
                }
                if(specialty !== "Todos" && specialty === ap.specialty){
                    doc_aux1.push(ap);
                }
            });
        }
            
        const doc_aux3: Appointment[] = [];
    
        doc_aux1.forEach((doc1) => {
            doc_aux2.forEach((doc2) => {
                if(doc1.id === doc2.id){
                    doc_aux3.push(doc1);
                }
            });
        });

         
        setShowAppointments(doc_aux3);
    }

    const handleReset = () => {
        setSpecialty("Todos");
        setPublicInfo("Ambos");

        setShowAppointments(appointments);
    }

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div>
                    <div className="userContainer">
                        <form className="showAppointmentsMenu">
                            <h1>Panel de filtrado de citas</h1>
                            <div className="column">
                                <label htmlFor="specialty">Especialidad:</label>
                                <select id="specialty" name="specialty" defaultValue="Todos" onChange={(e) => {
                                    handleChangeInfo(e, "speciality");
                                }}>
                                    <option value="Todos">Todos</option>
                                    <option value="Alergologia">Alergologia</option>
                                    <option value="Anestesiologia y reanimacion">Anestesiologia y reanimacion</option>
                                    <option value="Aparato digestivo">Aparato digestivo</option>
                                    <option value="Cardiologia">Cardiologia</option>
                                    <option value="Endocrinologia y nutricion">Endocrinologia y nutricion</option>
                                    <option value="Geriatria">Geriatria</option>
                                    <option value="Hematologia y hemoterapia">Hematologia y hemoterapia</option>
                                    <option value="Medicina intensiva">Medicina intensiva</option>
                                    <option value="Medicina interna">Medicina interna</option>
                                    <option value="Nefrologia">Nefrologia</option>
                                    <option value="Neumologia">Neumologia</option>
                                    <option value="Neurologia">Neurologia</option>
                                    <option value="Oncologia medica">Oncologia medica</option>
                                    <option value="Oncologia radioterapica">Oncologia radioterapica</option>
                                    <option value="Pediatria">Pediatria</option>
                                    <option value="Psiquiatria">Psiquiatria</option>
                                    <option value="Rehabilitacion">Rehabilitacion</option>
                                    <option value="Reumatologia">Reumatologia</option>
                                    <option value="Medicina familiar">Medicina familiar</option>
                                    <option value="Angiologia y cirugia vascular">Angiologia y cirugia vascular</option>
                                    <option value="Dermatologia">Dermatologia </option>
                                    <option value="Estomatologia">Estomatologia</option>
                                    <option value="Obstetricia y ginecologia">Obstetricia y ginecologia</option>
                                    <option value="Oftalmologia">Oftalmologia</option>
                                    <option value="Otorrinolaringologia">Otorrinolaringologia</option>
                                    <option value="Urologia">Urologia</option>
                                </select>
                            </div>
                            <div className="column">
                                <label htmlFor="public">Público/Privado:</label>
                                <select id="public" name="public" defaultValue="Ambos" onChange={(e) => {
                                    setPublicInfo(e.currentTarget.value);
                                    handleChangeInfo(e, "publicInfo");
                                }}>
                                    <option value="Ambos">Ambos</option>
                                    <option key="Público">Público</option>
                                    <option key="Privado">Privado</option>
                                </select>
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                                <button type="reset" onClick={handleReset}>Reiniar campos</button>
                            </div>
                        </form>
                    </div>
                    <br/>
                    {
                        showAppointments.length > 0 &&
                        <div className={showAppointments.length >= 3 ? "grid_appointments3" : (showAppointments.length % 2 === 0 ? "grid_appointments2" : "grid_appointments1")}>
                            {
                                showAppointments.map((ap) => {
                                    let doc_name = "";

                                    if(ap.doctor.surname_2 !== undefined && ap.doctor.surname_2 !== null && ap.doctor.surname_2.trim() !== ""){
                                        doc_name += ap.doctor.name + " " + ap.doctor.surname_1 + " " + ap.doctor.surname_2;
                                    }
                                    else{
                                        doc_name += ap.doctor.name + " " + ap.doctor.surname_1;
                                    }

                                    return(
                                        <div key={ap.id} className="cards">
                                            <p>
                                                <b>Doctor: </b>{doc_name}
                                            </p>
                                            <p><b>Especialidad: </b>{ap.specialty}</p>
                                            <p><b>Sector: </b>{ap.sector}</p>
                                            {
                                                ap.hospital !== undefined && ap.hospital !== null && ap.hospital.trim() !== "" &&
                                                <p><b>Centro médico: </b>{ap.hospital}</p>
                                            }
                                            {
                                                ap.ubication !== undefined && ap.ubication !== null && ap.ubication.trim() !== "" &&
                                                <p><b>Ubicación: </b>{ap.ubication}</p>
                                            }
                                            <p><b>Fecha: </b>{modifyDate(ap.date)}</p>
                                            <p><b>Hora: </b>{ap.hour}</p>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    }
                    {
                        showAppointments.length === 0 &&
                        <div className="messageLength0">
                            <h1>No se ha encontrado ninguna cita registrada</h1>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ShowAppointments;