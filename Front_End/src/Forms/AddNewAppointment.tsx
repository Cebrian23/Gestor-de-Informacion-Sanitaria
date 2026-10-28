import { useEffect, useState } from "react";
import './Forms.css';
import Cookie from "js-cookie";
import type { Doctor } from "../types/User/Doctor.ts";
import type { Appointment_ins } from "../types/User/Appointment.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function AddAppointment() {
    const [user, setUser] = useState("");
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("12:00");
    const [showDoctors, setShowDoctors] = useState<Doctor[]>([]);
    const [specialty, setSpecialty] = useState("Todos");
    const [publicInfo, setPublicInfo] = useState("Ambos");

    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [doctorError, setDoctorError] = useState("");

    const [buttonAction, setButtonAction] = useState(false);

    useEffect(() => {
        const getData = async () => {
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

            const url_doctors = `https://ece-ii-back-end-api-rest.onrender.com/user/doctors?id=${auth_cookie}`;
            const response_doctors = await fetch(url_doctors, {
                method: "GET",
            });

            if(response_doctors.status !== 200){
                const error_doctors = await response_doctors.json();
                alert(error_doctors.error),
                
                globalThis.location.href = "/login";
            }

            const data_doctors = await response_doctors.json();

            setUser(auth_cookie!);
            setDoctors(data_doctors);
            setShowDoctors(data_doctors);
        }

        getData();
    }, []);

    if(date === ""){
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

        const new_date = date.getFullYear().toString() + "-" + month + "-" + day

        setDate(new_date);
    }

    const handleChangeInfo = (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>, act: string) => {
        const doc_aux1: Doctor[] = [];
        const doc_aux2: Doctor[] = [];

        if(act === "speciality"){
            setSpecialty(e.currentTarget.value);

            doctors.forEach((doctor) => {
                if(e.currentTarget.value === "Todos"){
                    doc_aux1.push(doctor);
                }
                if(e.currentTarget.value !== "Todos" && doctor.specialty === e.currentTarget.value){
                    doc_aux1.push(doctor);
                }

                if(publicInfo === "Ambos"){
                    doc_aux2.push(doctor);
                }
                else if(publicInfo !== "Ambos" && publicInfo === doctor.sector){
                    doc_aux2.push(doctor);
                }
            });
        }
        else if(act === "publicInfo"){
            setPublicInfo(e.currentTarget.value);

            doctors.forEach((doctor) => {
                if(e.currentTarget.value === "Ambos"){
                    doc_aux2.push(doctor);
                }
                if(e.currentTarget.value !== "Ambos" && doctor.sector === e.currentTarget.value){
                    doc_aux2.push(doctor);
                }

                if(specialty === "Todos"){
                    doc_aux1.push(doctor);
                }
                if(specialty !== "Todos" && specialty === doctor.specialty){
                    doc_aux1.push(doctor);
                }
            });
        }
        
        const doc_aux3: Doctor[] = [];

        doc_aux1.forEach((doc1) => {
            doc_aux2.forEach((doc2) => {
                if(doc1.id === doc2.id){
                    doc_aux3.push(doc1);
                }
            });
        });

        setShowDoctors(doc_aux3);
    }
    
    const handleReset = () => {
        setDoctor("");
        setDate("");
        setHour("12:00");

        setDoctorError("");

        setSpecialty("Todos");
        setPublicInfo("Ambos");

        setShowDoctors(doctors);

        setButtonAction(false);
    }

    const handleNewAppointment = async () => {
        setButtonAction(true);

        let error = false;

        if(doctor.trim() === ""){
            setDoctorError("Hay que rellenar este campo");

            error = true;
        }

        if(error === false){
            const doc_info = doctors.find((doc) => {
                if(doc.id === doctor){
                    return doc;
                }
            });

            if(doc_info !== undefined){
                const body: Appointment_ins = {
                    user: user,
                    doctor: doctor,
                    date: date,
                    hour: hour,
                    specialty: doc_info.specialty,
                    sector: doc_info.sector,
                }

                const url = `https://ece-ii-back-end-api-rest.onrender.com/user/appointments`;
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(body),
                });

                if(response.status !== 200){
                    const error_info = await response.json();

                    alert(error_info.error);
                    
                    setButtonAction(false);
                }
                else{
                    const data = await response.json();

                    alert(data.message);

                    globalThis.location.href = "/userPage";
                }
            }
        }
        else{
            setButtonAction(false);
        }
    }

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div className="addAppointment">
                    <form className="addAppointmentForm">
                        <h1>Insertar nueva cita</h1>
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
                            <label htmlFor="public">Público/Privado:</label>
                            <select id="public" name="public" defaultValue="Ambos" onChange={(e) => {
                                setPublicInfo(e.currentTarget.value);
                                handleChangeInfo(e, "publicInfo");
                            }}>
                                <option value="Ambos">Ambos</option>
                                <option key="Público">Público</option>
                                <option key="Privado">Privado</option>
                            </select>
                            <label htmlFor="doctor">Selecciona un doctor:</label>
                            <select id="doctor" name="doctor" defaultValue="" onChange={(e) => {
                                setDoctor(e.currentTarget.value);
                                setDoctorError("");
                            }}>
                                <option value="">Seleccionar doctor</option>
                                {
                                    showDoctors.length > 0 &&
                                    showDoctors.map((doc) => {
                                        if(doc.surname_2 !== undefined && doc.surname_2 !== null && doc.surname_2.trim() !== ""){
                                            return(
                                                <option key={doc.id} value={doc.id}>{doc.name} {doc.surname_1} {doc.surname_2}</option>
                                            )
                                        }
                                        else{
                                            return(
                                                <option key={doc.id} value={doc.id}>{doc.name} {doc.surname_1} </option>
                                            )
                                        }
                                    })
                                }
                            </select>
                            <div className="error">{doctorError}</div>
                        </div>
                        <div className="column">
                            <label htmlFor="date">Fecha:</label>
                            <input id="date" name="date" defaultValue={date} type="date" onChange={(e) => setDate(e.currentTarget.value)}></input>
                        </div>
                        <div className="column">
                            <label htmlFor="hour">Hora:</label>
                            <input id="hour" name="hour" defaultValue={hour} type="time" onChange={(e) => setHour(e.currentTarget.value)}></input>
                        </div>
                        <div className="buttons">
                            <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                            <button type="reset" onClick={handleReset}>Reiniciar campos</button>
                            <button type="button" onClick={handleNewAppointment} disabled={buttonAction}>Enviar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddAppointment;