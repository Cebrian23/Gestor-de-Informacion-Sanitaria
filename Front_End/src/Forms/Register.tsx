import { useState } from "react"
import './Forms.css'
import { NavLink } from "react-router-dom";
import Cookie from "js-cookie";
import { Validate_Email } from "../utilities/NinjaValidations/Validate_Email.ts";
import { Validate_Phone } from "../utilities/NinjaValidations/Validate_Phone.ts";
import { Encrypt_Passwords } from "../utilities/Transforms/Transform_Passwords.ts";
import { Encrypt_DNI } from "../utilities/Transforms/Transform_DNI.ts";
import Header from "../Header/Header.tsx";
import { Validate_DNI } from "../utilities/NinjaValidations/Validate_DNI.ts";

function Register() {
    const [nombre, setNombre] = useState("");
    const [apellido1, setApellido1] = useState("");
    const [apellido2, setApellido2] = useState("");
    const [dni, setDni] = useState("");
    const [prefix, setPrefix] = useState("+34");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [nombreError, setNombreError] = useState("");
    const [apellido1Error, setApellido1Error] = useState("");
    const [dniError, setDniError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [password1Error, setPassword1Error] = useState("");
    const [passLengthError, setPassLengthError] = useState("");
    const [passCharError, setPassCharError] = useState("");
    const [passNumError, setPassNumError] = useState("");
    const [passSpaceError, setPassSpaceError] = useState("");
    const [password2Error, setPassword2Error] = useState("");

    const [buttonAction, setButtonAction] = useState(false);

    const handleReset = () => {
        setNombre("");
        setApellido1("");
        setApellido2("");
        setDni("");
        setPrefix("+34");
        setPhone("");
        setEmail("");
        setPassword1("");
        setPassword2("");

        setNombreError("");
        setApellido1Error("");
        setDniError("");
        setEmailError("");
        setPhoneError("");
        setPassCharError("");
        setPassLengthError("");
        setPassNumError("");
        setPassSpaceError("");
        setPassword1Error("");
        setPassword2Error("");

        setButtonAction(false);
    }

    const handleRegister = async  () => {
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

        const dni_aux = dni.trim();
        if(dni_aux === ""){
            setDniError("Hay que rellenar este campo");
            error_exists = true;
        }
        else{
            const dni_data = Validate_DNI(dni);

            if(dni_data.status !== 200){
                const error = await dni_data.json();

                setDniError(error.error);
                error_exists = true;
            }
        }

        const newDNI = Encrypt_DNI(dni);

        if(newDNI === undefined){
            error_exists = true;
        }

        const email_aux = email.trim();
        if(email_aux === ""){
            setEmailError("Hay que rellenar este campo");
            error_exists = true;
        }
        else{
            const email_data = await Validate_Email(email);

            if(email_data.status !== 200){
                const error = await email_data.json();

                setEmailError(error.error);
                error_exists = true;
            }
        }

        const password1_aux = password1.trim();
        if(password1_aux === ""){
            setPassword1Error("Hay que rellenar este campo");
            error_exists = true;
        }

        const password2_aux = password2.trim();
        if(password2_aux === ""){
            setPassword2Error("Hay que rellenar este campo");
            error_exists = true;
        }

        if(password1_aux.length < 12 && password1_aux.length !== 0){
            setPassLengthError("El tamaño de la contraseña debe tener, al menos, 12 caracteres");
            error_exists = true;
        }

        let chars_count: number = 0;
        let nums_count: number = 0;
        let space_count: number = 0;

        const Pas_split = password1.split("");
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

        const password = Encrypt_Passwords(password1);

        if(password === undefined){
            error_exists = true;
        }

        if(error_exists === false){
            const URL = `https://ece-ii-back-end-api-rest.onrender.com/user`;

            const body = {
                name: nombre.trim(),
                surname_1: apellido1.trim(),
                surname_2: apellido2.trim(),
                prefix: prefix.trim(),
                DNI: newDNI,
                phone: phone.trim(),
                email: email.trim(),
                password: password,
                doctors: [],
            }


            const response = await fetch(URL, {
                method: "POST",
                body: JSON.stringify(body),
            });

            if(response.status !== 200){
                const error = await response.json();
                
                alert(error.error);
                
                setButtonAction(false);
            }
            else{
                const data = await response.json();

                Cookie.set("auth_ECE_II", data.id, {expires: 7});

                globalThis.location.href = "/initialInformation";
            }
        }
        else{
            setButtonAction(false);
        }
    }

    return (
        <div className="finalPage">
            <Header/>
            <div className="register">
                <form className="registerForm">
                    <h2>Registro de usuario</h2>
                    <div className="column">
                        <label htmlFor="nombre">Nombre:</label>
                        <input id="nombre" name="nombre" type="text" placeholder="Nombre" onChange={(e) => {
                            setNombre(e.currentTarget.value);
                            setNombreError("");
                        }} required/>
                        <div className="error">{nombreError}</div>
                    </div>
                    <div className="column">
                        <label htmlFor="1er_apellido">1er apellido:</label>
                        <input id="1er_apellido" name="1er_apellido" type="text" placeholder="1er apellido" onChange={(e) => {
                            setApellido1(e.currentTarget.value);
                            setApellido1Error("");
                        }} required/>
                        <div className="error">{apellido1Error}</div>
                    </div>
                    <div className="column">
                        <label htmlFor="2do_apellido">2do apellido:</label>
                        <input id="2do_apellido" name="2do_apellido" type="text" placeholder="2do apellido" onChange={(e) => setApellido2(e.currentTarget.value)}/>
                    </div>
                    <div className="column">
                        <label htmlFor="dni">DNI:</label>
                        <input id="dni" name="dni" type="text" placeholder="DNI" onChange={(e) => setDni(e.currentTarget.value)}/>
                        <div className="error">{dniError}</div>
                    </div>
                    <div className="column">
                        <label htmlFor="phone_number">Número telefónico:</label>
                        <div id="phone_number" className="combo_data">
                            <select id="prefix" name="prefix" defaultValue="+34" className="registerPhoneInput"  onChange={(e) => setPrefix(e.currentTarget.value)}>
                                <option value="+30">+30</option>
                                <option value="+31">+31</option>
                                <option value="+32">+32</option>
                                <option value="+33">+33</option>
                                <option value="+34">+34</option>
                                <option value="+39">+39</option>
                                <option value="+49">+49</option>
                                <option value="+351">+351</option>
                            </select>
                            <input id="phone" name="phone" type="tel" placeholder="Número telefónico" className="registerPhoneSelect" onChange={(e) => setPhone(e.currentTarget.value)}/>
                        </div>
                        <div className="error">{phoneError}</div>
                    </div>
                    <div className="column">
                        <label htmlFor="email">Email:</label>
                        <input id="email" name="email" type="email" placeholder="Email" onChange={(e) => {
                            setEmail(e.currentTarget.value);
                            setEmailError("");
                        }} required/>
                        <div className="error">{emailError}</div>
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
                        <button type="reset" onClick={handleReset}>Vaciar campos</button>
                        <button type="button" onClick={handleRegister} disabled={buttonAction}>Enviar</button>
                    </div>
                </form>
                <br/>
                <div>
                    Si ya tienes cuenta, puedes <NavLink to="/login">iniciar sesion</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Register;