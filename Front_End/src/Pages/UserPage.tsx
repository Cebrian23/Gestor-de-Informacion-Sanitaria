import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { User } from "../types/User/User.ts";
import Header from "../Header/Header.tsx";

function UserPage() {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const getUser = async () => {
            Cookie.remove("ECE_medicine");
            Cookie.remove("ECE_analysis");
            Cookie.remove("ECE_table");
            Cookie.remove("ECE_row");

            const auth_cookie = Cookie.get("auth_ECE_II");
            
            if(auth_cookie === undefined){
                globalThis.location.href = "/login";
            }
            
            const url = `https://ece-ii-back-end-api-rest.onrender.com/user/id?id=${auth_cookie}`;
            const response = await fetch(url, {
                method: "GET",
            });

            if(response.status !== 200){
                const error = await response.json();
                alert(error.error);

                globalThis.location.href = "/login";
            }

            const data = await response.json();
            setUser(data);
        }

        getUser();
    },[]);

    const handleLogout = () => {
        Cookie.remove("auth_ECE_II");
        Cookie.remove("ECE_analysis");
        Cookie.remove("ECE_medicine");
        Cookie.remove("ECE_table");
        Cookie.remove("ECE_row");

        globalThis.location.href = "/login";
    }

    return(
        <div className="finalPage">
            <Header/>
            {
                user !== undefined &&
                <div className="userPage">
                    {
                        (user.surname_2 !== undefined && user.surname_2 !== null && user.surname_2 !== "") &&
                        <h1>Hola, {user.name} {user.surname_1} {user.surname_2}</h1>
                    }
                    {
                        (user.surname_2 === undefined || user.surname_2 === null || user.surname_2 === "") &&
                        <h1>Hola, {user.name} {user.surname_1}</h1>
                    }
                    <form>
                        <h2>¿Que deseas hacer?</h2>
                        <div className="display">
                            <div className="columns">
                                <h3>Acciones para los doctores</h3>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/addDoctor"}>Insertar doctor al que asistes</button>
                                <br/>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserDoctors"}>Ver doctores</button>
                            </div>
                            <div className="columns">
                                <h3>Acciones para las citas</h3>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/addAppointment"}>Insertar cita</button>
                                <br/>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserAppointment"}>Ver citas</button>
                            </div>
                            <div className="columns">
                                <h3>Acciones para los medicamentos</h3>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/addMidMedicine"}>Insertar medicamentos</button>
                                <br/>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserMedicines"}>Ver medicamentos</button>
                            </div>
                            <div className="columns">
                                <h3>Acciones para las analíticas</h3>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/addDocument"}>Insertar nueva analítica en PDF</button>
                                <br/>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserBloodTests"}>Ver analiticas</button>
                                <br/>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/tableNameSelection"}>Comparar parámetros de tablas</button>
                            </div>
                            <div className="columns">
                                <h3>Acciones de los datos del usuario</h3>
                                <button type="button" className="button" onClick={() => globalThis.location.href = "/updateUser"}>Actualizar datos de usuario</button>
                            </div>
                        </div>
                        <div className="logout">
                            <button type="button" onClick={handleLogout}>Cerrar sesion</button>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
}

export default UserPage;