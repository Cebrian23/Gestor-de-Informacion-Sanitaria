import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { User, User_upt } from "../types/User/User.ts";
import { Validate_Phone } from "../utilities/NinjaValidations/Validate_Phone.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import { Encrypt_Passwords } from "../utilities/Transforms/Transform_Passwords.ts";
import Header from "../Header/Header.tsx";

function UpdateUser() {
    const [user, setUser] = useState<User>();
    const [auth, setAuth] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido1, setApellido1] = useState("");
    const [apellido2, setApellido2] = useState("");
    const [prefix, setPrefix] = useState("+34");
    const [phone, setPhone] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("")

    const [nombreError, setNombreError] = useState("");
    const [apellido1Error, setApellido1Error] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [password1Error, setPassword1Error] = useState("");
    const [passLengthError, setPassLengthError] = useState("");
    const [passCharError, setPassCharError] = useState("");
    const [passNumError, setPassNumError] = useState("");
    const [passSpaceError, setPassSpaceError] = useState("");
    const [password2Error, setPassword2Error] = useState("");

    const [buttonAction, setButtonAction] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const auth_cookie = Cookie.get("auth_ECE_II")

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
            setAuth(auth_cookie!);
            setUser(data);
            setNombre(data.name);
            setApellido1(data.surname_1);

            if(data.surname_2 !== undefined && data.surname_2 !== null){
                setApellido2(data.surname_2);
            }
            else {
                setApellido2("");
            }

            if(data.phone_prefix !== undefined && data.phone_prefix !== null){
                setPrefix(data.phone_prefix);
            }
            else{
                setPrefix("+34");
            }

            if(data.phone_number !== undefined && data.phone_number !== null){
                setPhone(data.phone_number);
            }
            else{
                setPhone("");
            }
        }

        getUser();
    }, []);

    const handleReset = () => {
        if(user !== undefined){
            setNombre(user.name);
            setApellido1(user.surname_1);
            
            if(user.surname_2 !== undefined && user.surname_2 !== null){
                setApellido2(user.surname_2);
            }
            else {
                setApellido2("");
            }

            if(user.phone_prefix !== undefined && user.phone_prefix !== null){
                setPrefix(user.phone_prefix);
            }
            else{
                setPrefix("");
            }
            
            if(user.phone_number !== undefined && user.phone_number !== null){
                setPhone(user.phone_number);
            }
            else{
                setPhone("");
            }

            setButtonAction(false);
        }
    }

    const handleUpdate = async () => {
        setButtonAction(true);

        let error_exists = false;
        
        const nombre_aux = nombre.trim();
        if(nombre_aux === ""){
            setNombreError("Hay que rellenar este campo");
            error_exists = true;
        }
        
        const apellido1_aux = apellido1.trim();
        if(apellido1_aux === ""){
            setApellido1Error("Hay que rellenar este campo");
            error_exists = true;
        }
        
        if(password1.length < 12 && password1.length !== 0){
            setPassLengthError("El tamaño de la contraseña debe tener, al menos, 12 caracteres");
            error_exists = true;
        }
        
        let chars_count: number = 0;
        let nums_count: number = 0;
        let space_count: number = 0;
        
        const Pas_split = password1.trim().split("");
        const Pas_ASCII = Pas_split.map((a) => a.charCodeAt(0));
        
        Pas_ASCII.forEach((a) => {
            if(a>=48 && a<=57){
                nums_count = nums_count+1;
            }
            else if((a>=65 && a<=90) || (a>=97 && a<=122)){
                chars_count = chars_count+1;
            }
            else if(a == 32){
                space_count = space_count+1;
            }
        });
        
        if(chars_count === 0 && password1.length !== 0){
            setPassCharError("Necesitas insertar en la contraseña alguna letra");
            error_exists = true;
        }
        
        if(nums_count === 0 && password1.length !== 0){
            setPassNumError("Necesitas insertar en la contraseña algún número");
            error_exists = true;
        }
        
        if(space_count !== 0 && password1.length !== 0){
            setPassSpaceError("No puede haber espacios en la contraseña");
            error_exists = true;
        }
        
        if((password1 !== password2) && (passCharError === "" && passLengthError === "" && passNumError === "" && passSpaceError === "")){
            setPassword2Error("La password y su verificacion deben ser iguales");
            error_exists = true;
        }
        
        if(phone !== ""){
            const phone_data = await Validate_Phone(prefix, phone);
        
            if(phone_data.status !== 200){
                const error = await phone_data.json();
        
                setPhoneError(error.error);
                error_exists = true;
            }
        }

        const password_cript = Encrypt_Passwords(password1.trim());
        
        if(password_cript === undefined){
            error_exists = true;
        }
        
        if(error_exists === false){
            const URL = `https://ece-ii-back-end-api-rest.onrender.com/user`;
            const body: User_upt = {
                id: auth,
                name: nombre.trim(),
                surname_1: apellido1.trim(),
            }

            if(password_cript !== ""){                
                body.password = password_cript;
            }

            if(apellido2.trim() !== ""){
                body.surname_2 = apellido2.trim();
            }

            if(phone.trim() !== ""){
                body.phone_prefix = prefix;
                body.phone_number = phone;
            }

            const response = await fetch(URL, {
                method: "PUT",
                body: JSON.stringify(body),
            });

            if(response.status !== 200){
                const error = await response.json();

                alert(error.error);

                setButtonAction(false);
            }else{
                const data = await response.json();

                alert(data.message);
            }

            globalThis.location.href = "/userPage";
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
                <div className="uptUser">
                    {
                        user !== undefined &&
                        <form className="updateUserForm">
                            <h1>Actualizacion de los datos</h1>
                            <div className="column">
                                <label htmlFor="nombre">Nombre:</label>
                                <input id="nombre" name="nombre" type="text" value={nombre} placeholder="Nombre" onChange={(e) => {
                                    setNombre(e.currentTarget.value);
                                    setNombreError("");
                                }} required/>
                                <div className="error">{nombreError}</div>
                            </div>
                            <div className="column">
                                <label htmlFor="1er_apellido">1er apellido:</label>
                                <input id="1er_apellido" name="1er_apellido" type="text" value={apellido1} placeholder="1er apellido" onChange={(e) => {
                                    setApellido1(e.currentTarget.value);
                                    setApellido1Error("");
                                }} required/>
                                <div className="error">{apellido1Error}</div>
                            </div>
                            <div className="column">
                                <label htmlFor="2do_apellido">2do apellido:</label>
                                <input id="2do_apellido" name="2do_apellido" type="text" value={apellido2} placeholder="2do apellido" onChange={(e) => setApellido2(e.currentTarget.value)}/>
                            </div>
                            <div className="column">
                                <label htmlFor="phone_number">Número telefónico:</label>
                                <div id="phone_number" className="combo_data">
                                    <select id="prefix" name="prefix" defaultValue={prefix} className="registerPhoneInput"  onChange={(e) => setPrefix(e.currentTarget.value)}>
                                        <option value="+30">+30</option>
                                        <option value="+31">+31</option>
                                        <option value="+32">+32</option>
                                        <option value="+33">+33</option>
                                        <option value="+34">+34</option>
                                        <option value="+39">+39</option>
                                        <option value="+49">+49</option>
                                        <option value="+351">+351</option>
                                    </select>
                                    <input id="phone" name="phone" type="text" value={phone} placeholder="Número telefónico" className="registerPhoneSelect" onChange={(e) => setPhone(e.currentTarget.value)}/>
                                </div>
                                <div className="error">{phoneError}</div>
                            </div>
                            <div className="column">
                                <label htmlFor="password1">Password:</label>
                                <input id="password1" name="password1" type="password" placeholder="Password" onChange={(e) => {
                                    setPassword1(e.currentTarget.value);
                                    setPassword1Error("");
                                    setPassLengthError("");
                                    setPassSpaceError("");
                                    setPassCharError("");
                                    setPassNumError("");
                                }} required/>
                                <div className="error">{password1Error}</div>
                                <div className="error">{passCharError}</div>
                                <div className="error">{passLengthError}</div>
                                <div className="error">{passNumError}</div>
                                <div className="error">{passSpaceError}</div>
                            </div>
                            <div className="column">
                                <label htmlFor="password2">Confirmación de password:</label>
                                <input id="password2" name="password2" type="password" placeholder="Confirmación" onChange={(e) => {
                                    setPassword2(e.currentTarget.value);
                                    setPassword2Error("");
                                }} required/>
                                <div className="error">{password2Error}</div>
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                                <button type="reset" onClick={handleReset}>Reiniciar campos</button>
                                <button type="button" onClick={handleUpdate} disabled={buttonAction}>Actualizar</button>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
}

export default UpdateUser;