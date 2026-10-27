import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Table_user_data, Table_analysis } from "../types/User/Table.ts";
import type { Doctor } from "../types/User/Doctor.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function AddDocument() {
    const [doctor, setDoctor] = useState("");
    const [ficheroURL, setFicheroURL] = useState("");
    const [dni, setDNI] = useState("");

    const [fileData, setFileData] = useState<FormData>();

    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [fileError, setFileError] = useState("");
    const [doctorError, setDoctorError] = useState("");

    const [buttonAction, setButtonAction] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const auth_cookie = Cookie.get("auth_ECE_II");

            const url_user = `https://ece-ii-back-end.onrender.com/user/id?id=${auth_cookie}`;
            const response_user = await fetch(url_user, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);
                
                globalThis.location.href = "/login";
            }

            const data = await response_user.json();
            setDNI(data.DNI!);

            const url_doctors = `https://ece-ii-back-end.onrender.com/user/doctors?id=${auth_cookie}`;
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
        }

        getData();
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setFileError("");
        const file = e.target.files![0];
        if(file) {
            const fileUrl = URL.createObjectURL(file);
            setFicheroURL(fileUrl);
            
            const formData = new FormData();
            formData.append("file", file);
            setFileData(formData);
        }
    }

    const handleReset = () => {
        setFicheroURL("");
        setFileData(undefined);
        setDoctor("");
        
        setFileError("");
        setDoctorError("");

        setButtonAction(false);
    }

    const handleSend = async () => {
        setButtonAction(true);

        let error_data = false;

        if(fileData === undefined){
            setFileError("Hay que subir un fichero");
            
            error_data = true;
        }

        if(doctor.trim() === ""){
            setDoctorError("Hay que seleccionar un doctor");

            error_data = true;
        }

        if(error_data === false){
            const url = `https://ece-ii-back-end-fast-api.onrender.com/read_document`;
            const response = await fetch(url,
                {
                    method: "POST",
                    body: fileData,
                }
            );

            if(response.status !== 200){
                const error = await response.json();

                alert(error.error);

                setButtonAction(false);
            }
            else{
                const tablas: (Table_user_data | Table_analysis)[] = await response.json();

                const tables: (Table_user_data | Table_analysis)[] = [];

                tablas.forEach((tabla) => {
                    if(tabla.type === "User_data"){
                        const table: Table_user_data = {
                            table_name: tabla.table_name,
                            nombre_completo: tabla.nombre_completo,
                            fecha: tabla.fecha,
                            dni: dni,
                            type: tabla.type,
                        }

                        tables.push(table);
                    }
                    else{
                        tables.push(tabla);
                    }
                });

                if(tablas.length > 0){
                    const body = {
                        "tables": tables,
                        "DNI": dni,
                        "doctor": doctor,
                        "file": fileData,
                    }

                    const url_tables = `https://ece-ii-back-end.onrender.com/user/analysis`;
                    
                    const response_tables = await fetch(url_tables, {
                        method: "POST",
                        body: JSON.stringify(body),
                    });

                    if(response_tables.status !== 200){
                        const error = await response_tables.json();
                        alert(error.error);

                        setButtonAction(false);
                    }
                    else{
                        const data = await response_tables.json();
                        alert(data.message);

                        globalThis.location.href = "/userPage"
                    }
                }
                else{
                    alert("El documento no tiene información en tablas tablas");
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
                    <div>
                        <form className="columns_document">
                        <div className="column">
                            <input id="file" name="file" type="file" accept=".pdf" onChange={(e) => handleInput(e)}/>
                            {
                                fileError.trim() !== "" &&
                                <div className="error">{fileError}</div>
                            }
                        </div>
                        <div className="column">
                            <label htmlFor="doctor">Doctor que envió la analitica:</label>
                            <select id="doctor" name="doctor" defaultValue={doctor} onChange={(e) => {
                                setDoctor(e.currentTarget.value);
                                setDoctorError("");
                            }}>
                                <option value="">Seleccionar doctor</option>
                                {
                                    doctors.map((doc) => {
                                        if(doc.surname_2 !== undefined && doc.surname_2 !== null && doc.surname_2.trim() !== ""){
                                            return(
                                                <option key={doc.id} value={doc.id}>{doc.name} {doc.surname_1} {doc.surname_2}</option>
                                            )
                                        }
                                        else{
                                            return(
                                                <option key={doc.id} value={doc.id}>{doc.name} {doc.surname_1}</option>
                                            )
                                        }
                                    })
                                }
                            </select>
                            <div className="error">{doctorError}</div>
                        </div>
                        <div className="buttons">
                            <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                            <button type="reset" onClick={handleReset}>Reiniciar campos</button>
                            <button type="button" onClick={handleSend} disabled={buttonAction}>Enviar</button>
                        </div>
                    </form>
                    <div className="document">
                        {
                            ficheroURL !== "" &&
                            <>
                                <br/>
                                <embed src={ficheroURL}/>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddDocument;