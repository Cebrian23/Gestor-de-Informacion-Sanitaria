import { useEffect } from "react";
import Cookie from "js-cookie";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function AddMidMedicine(){
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
        }

        getData();
    }, []);

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div className="addMidMedicine">
                    <form className="addMidMedicineForm">
                        <h1>¿Que tipo de medicamento deseas insertar?</h1>
                        <div className="buttons">
                            <button type="button" onClick={() => globalThis.location.href = "/addMedicine"}>Medicamento ya existante</button>
                            <button type="button" onClick={() => globalThis.location.href = "/addNewMedicine"}>Medicamento no existente</button>
                            <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMidMedicine;