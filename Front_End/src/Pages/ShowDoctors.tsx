import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import './Pages.css'
import type { Doctor } from "../types/User/Doctor.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function ShowDoctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [showDoctors, setShowDoctors] = useState<Doctor[]>([]);
    const [specialty, setSpecialty] = useState("Todos");
    const [publicInfo, setPublicInfo] = useState("Ambos");

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

            setDoctors(data_doctors);
            setShowDoctors(data_doctors);
        }

        getData();
    }, []);

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
        setSpecialty("Todos");
        setPublicInfo("Ambos");

        setShowDoctors(doctors);
    }

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div>
                    <div className="userContainer">
                        <form className="showDoctorsMenu">
                            <h1>Panel de filtrado de doctores</h1>
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
                        showDoctors.length > 0 &&
                        <div className={showDoctors.length >= 3 ? "grid_doctors3" : (showDoctors.length % 2 === 0 ? "grid_doctors2" : "grid_doctors1")}>
                            {
                                showDoctors.map((doc) => {
                                    if(doc.surname_2 !== undefined && doc.surname_2 !== null && doc.surname_2.trim() !== ""){
                                        return(
                                            <div key={doc.id} className="cards">
                                                <p>{doc.name} {doc.surname_1} {doc.surname_2}</p>
                                                {
                                                    doc.phone !== null && doc.phone !== undefined && doc.phone.trim() !== "" &&
                                                    <p>{doc.prefix} {doc.phone}</p>
                                                }
                                                {
                                                    doc.url !== null && doc.url !== undefined && doc.url.trim() !== "" &&
                                                    <p>{doc.url}</p>
                                                }
                                                <p>{doc.specialty}</p>
                                                {
                                                    doc.ubication !== null && doc.ubication !== undefined && doc.ubication.trim() !== "" &&
                                                    <p>{doc.ubication}</p>
                                                }
                                                {
                                                    doc.hospital !== null && doc.hospital !== undefined && doc.hospital.trim() !== "" &&
                                                    <p>{doc.hospital}</p>
                                                }
                                            </div>
                                        )
                                    }
                                    else{
                                        return(
                                            <div key={doc.id} className="cards">
                                                <p>{doc.name} {doc.surname_1}</p>
                                                {
                                                    doc.phone !== null && doc.phone !== undefined && doc.phone.trim() !== "" &&
                                                    <p>{doc.prefix} {doc.phone}</p>
                                                }
                                                {
                                                    doc.url !== null && doc.url !== undefined && doc.url.trim() !== "" &&
                                                    <p>{doc.url}</p>
                                                }
                                                <p>{doc.specialty}</p>
                                                {
                                                    doc.ubication !== null && doc.ubication !== undefined && doc.ubication.trim() !== "" &&
                                                    <p>{doc.ubication}</p>
                                                }
                                                {
                                                    doc.hospital !== null && doc.hospital !== undefined && doc.hospital.trim() !== "" &&
                                                    <p>{doc.hospital}</p>
                                                }
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    }
                    {
                        showDoctors.length === 0 &&
                        <div className="messageLength0">
                            <h1>No se ha encontrado ningún doctor registrado</h1>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ShowDoctors;