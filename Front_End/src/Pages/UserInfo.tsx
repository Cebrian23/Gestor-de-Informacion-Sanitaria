import { useState, useEffect } from "react"
import Cookie from "js-cookie";
import './Pages.css'
import Header from "../Header/Header.tsx";

function UserInfo() {
    const [name, setName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const auth_cookie = Cookie.get("auth_ECE_II");

            const url_user = `https://ece-ii-back-end-api-rest.onrender.com/user/id?id=${auth_cookie}`;
            const response_user = await fetch(url_user, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);
                
                globalThis.location.href = "/login";
            }

            const data = await response_user.json();

            let fullName = data.name + " " + data.surname_1;

            if(data.surname_2 !== null && data.surname_2 !== undefined && data.surname_2.trim() !== ""){
                fullName += ` ${data.surname_2}`
            }

            setName(fullName)
        }

        getData();
    }, []);

    return(
        <div className="finalPage">
            <Header/>
            {
                name.trim() !== "" &&
                <div className="userInfo">
                    <h1>Bienvenido, {name}</h1>
                    <h2>
                        En esta aplicacion podrás guardar información relativa a los doctores a los que asistes, las citas que tienes con ellos y los medicamentos que te recetan.
                        Tambien podras almacer análisis de sangre y comparar datos de sus tablas.
                    </h2>
                    <div className="divButton">
                        <button type="button" onClick={() => globalThis.location.href = "/userPage" }>Continuar</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserInfo;