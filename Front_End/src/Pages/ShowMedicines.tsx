import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Medication_Short } from "../types/User/Medication.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function ShowMedicines(){
    const [medicines, setMedicines] = useState<Medication_Short[]>([]);
    const [medAux, setMedAux] = useState<Medication_Short[]>([]);

    const [medType, setMedType] = useState("Todos");

    useEffect(() => {
        const getData = async () => {
            Cookie.remove("ECE_medicine");
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

            const url_medicine = `https://ece-ii-back-end-api-rest.onrender.com/user/medications?id=${auth_cookie}`;
            const response_medicine = await fetch(url_medicine, {
                method: "GET",
            });

            if(response_medicine.status !== 200){
                const error = await response_medicine.json();
                alert(error.error);

                globalThis.location.href = "/userPage";
            }

            const data = await response_medicine.json();
            setMedicines(data);
            setMedAux(data);
        }

        getData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
        setMedType(e.currentTarget.value);

        const med_auxiliar: Medication_Short[] = [];

        medicines.forEach((med) => {
            if(med.type === e.currentTarget.value){
                med_auxiliar.push(med);
            }
        });

        setMedAux(med_auxiliar);
    }

    const handleReset = () => {
        setMedAux(medicines);
        setMedType("Todos");
    }
    
    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div>
                    <div className="userContainer">
                        <form className="showMedicinesMenu">
                            <h1>Panel de filtrado de medicamentos</h1>
                            <div className="column">
                                <label htmlFor="medication">Tipo de medicamento:</label>
                                <select id="medication" name="medication" defaultValue={medType} onChange={(e) => handleChange(e)}>
                                    <option value="Todos">Todos</option>
                                    <option value="Pastillas">Pastillas</option>
                                    <option value="Jarabe">Jarabe</option>
                                </select>
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                                <button type="reset" onClick={handleReset}>Reiniciar campo</button>
                            </div>
                        </form>
                    </div>
                    <br/>
                    {
                        medAux.length > 0 &&
                        <div className={medAux.length >= 3 ? "grid_medicines3" : (medAux.length%2 === 0 ? "grid_medicines2" : "grid_medicines1")}>
                            {        
                                medAux.map((med) => {
                                    return(
                                        <div key={med.id} className="cards">
                                            <p>{med.name}</p>
                                            <p><b>Veces recetado: </b>{med.info}</p>
                                            <button type="button" onClick={() => {
                                                Cookie.set("ECE_medicine", med.id, {expires: 7});
                                                
                                                globalThis.location.href = "/showUserMedicine";
                                            }}>Ver medicamento</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    {
                        medAux.length === 0 &&
                        <div className="messageLength0">
                            <h1>No se ha encontrado ningún medicamento registrado</h1>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ShowMedicines;