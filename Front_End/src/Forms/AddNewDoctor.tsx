import { useEffect, useState } from "react";
import './Forms.css';
import Cookie from "js-cookie";
import { Validate_Phone } from "../utilities/NinjaValidations/Validate_Phone.ts";
import type { Doctor_ins } from "../types/User/Doctor.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function AddNewDoctor() {
    const [id_user, setUser] = useState("");
    const [name, setName] = useState("");
    const [surname1, setSurname1] = useState("");
    const [surname2, setSurname2] = useState("");
    const [prefix, setPrefix] = useState("+34");
    const [phone, setPhone] = useState("");
    const [specialty, setSpecialty] = useState("Alergologia");
    const [sector, setSector] = useState("Público");
    const [hospital, setHospital] = useState("");
    const [ubication, setUbication] = useState("");
    const [url_doc, setURL] = useState("");

    const [nameError, setNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [ubicationError, setUbicationError] = useState("");

    const [buttonAction, setButtonAction] = useState(false);
    const [page, setPage] = useState(1);

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

            setUser(auth_cookie!);
        }

        getData();
    }, []);
    
    const handleReset = () => {
        setName("");
        setSurname1("");
        setSurname2("");
        setSpecialty("Medicina familiar");
        setSector("Público")
        setPrefix("+34"),
        setPhone("");
        setURL("");

        setNameError("");
        setSurnameError("");
        setPhoneError("");

        setButtonAction(false);
    }

    const handleNewDoctor = async () => {
        setButtonAction(true);

        let error = false;

        if(name.trim() === ""){
            setNameError("Hay que rellenar este campo");

            error = true;
        }

        if(surname1.trim() === ""){
            setSurnameError("Hay que rellenar este campo");

            error = true;
        }       

        if(phone !== ""){
            const phone_data = await Validate_Phone(prefix, phone);
         
            if(phone_data.status !== 200){
                const error_phone = await phone_data.json();
         
                setPhoneError(error_phone.error);
                error = true;
            }
        }

        /*if(hospital.trim() === ""){
            setUbicationError("Hay que rellenar este campo");

            error = true;
        }*/

        if(error === false){
            const body: Doctor_ins = {
                id_user: id_user,
                name: name,
                surname_1: surname1,
                surname_2: surname2,
                specialty: specialty,
                sector: sector,
                prefix: prefix,
                phone: phone,
                url: url_doc,
            }

            if(ubication.trim() !== ""){
                body.ubication = ubication;
            }

            if(hospital.trim() !== ""){
                body.hospital = hospital;
            }

            const url = "https://ece-ii-back-end.onrender.com/user/doctor";
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
            });

            if(response.status !== 200){
                const error_response = await response.json();

                alert(error_response.error);
                
                setButtonAction(false);
            }
            else{
                const data = await response.json();

                alert(data.message);

                globalThis.location.href = "/userPage"
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
                <div className={page === 1 ? "addDoctor1" : "addDoctor2"}>
                    <form className="addDoctorForm">
                        <h1>Insertar nuevo doctor</h1>
                        {
                            page === 1 &&
                            <>
                                <div className="column">
                                    <label htmlFor="name">Nombre:</label>
                                    <input id="name" name="name" placeholder="Nombre" onChange={(e) => {
                                        setName(e.currentTarget.value);
                                        setNameError("");
                                    }}/>
                                    <div className="error">{nameError}</div>
                                </div>
                                <div className="column">
                                    <label htmlFor="surname_1">1er apellido:</label>
                                    <input id="surname_1" name="surname_1" placeholder="1er apellido" onChange={(e) => {
                                        setSurname1(e.currentTarget.value);
                                        setSurnameError("");
                                    }}/>
                                    <div className="error">{surnameError}</div>
                                </div>
                                <div className="column">
                                    <label htmlFor="surname_2">2do apellido:</label>
                                    <input id="surname_2" name="surname_2" placeholder="2do apellido" onChange={(e) => setSurname2(e.currentTarget.value)}/>
                                </div>
                                <div className="column">
                                    <label htmlFor="specialty">Especialidad:</label>
                                    <select id="specialty" name="specialty" defaultValue="Alergologia" onChange={(e) => setSpecialty(e.currentTarget.value)}>
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
                                    <label htmlFor="sector">Sector:</label>
                                    <select id="sector" name="sector" onChange={(e) => setSector(e.currentTarget.value)}>
                                        <option key="Público">Público</option>
                                        <option key="Privado">Privado</option>
                                    </select>
                                </div>
                            </>
                        }
                        {
                            page === 2 &&
                            <>
                                <div className="column">
                                    <label htmlFor="hospital">Hospital o centro clínico en el que trabaja (si lo hace):</label>
                                    <input id="hospital" name="hospital" placeholder="Centro clínico" onChange={(e) => setHospital(e.currentTarget.value)}/>
                                </div>
                                <div className="column">
                                    <label htmlFor="ubication">Ubicación en la que trabaja:</label>
                                    <input id="ubication" name="ubication" placeholder="Ubicación" onChange={(e) => {
                                        setUbication(e.currentTarget.value);
                                        setUbicationError("");
                                    }}/>
                                    <div className="error">{ubicationError}</div>
                                </div>
                                <div className="column">
                                    <label htmlFor="phone_number">Número telefonico al que poder llamar:</label>
                                    <div id="phone_number" className="combo_data">
                                        <select id="prefix" name="prefix" defaultValue="+34" className="registerPhoneInput"  onChange={(e) => {
                                            setPrefix(e.currentTarget.value);
                                            setPhoneError("");
                                        }}>
                                            <option value="+30">+30</option>
                                            <option value="+31">+31</option>
                                            <option value="+32">+32</option>
                                            <option value="+33">+33</option>
                                            <option value="+34">+34</option>
                                            <option value="+39">+39</option>
                                            <option value="+49">+49</option>
                                            <option value="+351">+351</option>
                                        </select>
                                        <input id="phone" name="phone" type="text" placeholder="Número telefonico" className="registerPhoneSelect" onChange={(e) => {
                                            setPhone(e.currentTarget.value);
                                            setPhoneError("");
                                        }}/>
                                    </div>
                                    <div className="error">{phoneError}</div>
                                </div>
                                <div className="column">
                                    <label htmlFor="url">URL de la pagina para pedir citas:</label>
                                    <input id="url" name="url" placeholder="URL" onChange={(e) => setURL(e.currentTarget.value)}/>
                                </div>
                            </>
                        }
                        <div className="buttons">
                            {
                                page === 1 &&
                                <>
                                    <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                                    <button type="reset" onClick={handleReset}>Vaciar campos</button>
                                    <button type="button" onClick={() => setPage(page+1)}>Página siguiente</button>
                                </>
                            }
                            {
                                page === 2 &&
                                <>
                                    <button type="button" onClick={() => setPage(page-1)}>Página anterior</button>
                                    <button type="reset" onClick={handleReset}>Vaciar campos</button>
                                    <button type="button" onClick={handleNewDoctor} disabled={buttonAction}>Enviar</button>
                                </>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNewDoctor;