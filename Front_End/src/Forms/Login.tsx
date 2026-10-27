import { useEffect, useState } from "react";
import './Forms.css';
import { NavLink } from "react-router-dom";
import Cookie from "js-cookie";
import type { User } from "../types/User/User.ts";
import { Validate_Email } from "../utilities/NinjaValidations/Validate_Email.ts";
import { Encrypt_Passwords } from "../utilities/Transforms/Transform_Passwords.ts";
import Header from "../Header/Header.tsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emptyError, setEmptyError] = useState("");
    const [validationError, setValidationError] = useState("");

    const [buttonAction, setButtonAction] = useState(false);

    useEffect(() => {
        const Verify_Id = () => {
            const auth = Cookie.get("auth_ECE_II");

            if(auth !== undefined){
                globalThis.location.href = "/userPage";
            }
        }

        Verify_Id();
    }, []);

    const handleReset = () => {
        setEmail("");
        setPassword("");
        
        setEmailError("");
        setPasswordError("");
        setEmptyError("");
        setValidationError("");
    }

    const handleLogin = async () => {
        setButtonAction(true);

        let error_exists = false;

        const email_aux = email.trim();
        const password_aux = password.trim();
        if(email_aux === "" && password_aux === ""){
            setEmptyError("Hay que rellenar todos los parámetros");
            error_exists = true;
        }
        else if(email_aux === "" && password_aux !== ""){
            setEmailError("Hay que rellenar este parámetro");
            error_exists = true;
        }
        else if(email_aux !== "" && password_aux === ""){
            setPasswordError("Hay que rellenar este parámetro");
            error_exists = true;
        }

        if(email_aux !== ""){
            const validate_email = await Validate_Email(email);

            if(validate_email.status !== 200){
                const objeto = await validate_email.json();
                setValidationError(objeto.error);
                error_exists = true;
            }
        }

        const password_cript = Encrypt_Passwords(password);

        if(password_cript === undefined){
            error_exists = true;
        }

        if(error_exists === false){
            const URL = `https://ece-ii-back-end.onrender.com/login?email=${email}&password=${password_cript}`;
            const response = await fetch(URL, {
                method: "GET",
            });
        
            if(response.status !== 200){
                const error = await response.json();

                alert(error.error);
                
                setButtonAction(false);
            }
            else{
                const data: User = await response.json();

                Cookie.set("auth_ECE_II", data.id, {expires: 7});
                
                globalThis.location.href = "/userPage"
            }
        }
        else{
            setButtonAction(false);
        }
    }
    
    return (
        <div className="finalPage">
            <Header/>
            <div className="login">
                <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
                    <h2>Inicio de sesión</h2>
                    <div className="column">
                        <label htmlFor="email">Email:</label>
                        <input id="email" name="email" type="text" placeholder="Email" onChange={(e) => {
                            setEmail(e.currentTarget.value);
                            setEmptyError("");
                            setEmailError("");
                            setValidationError("");
                        }}/>
                        <div className="error">{emailError}</div>
                        <div className="error">{validationError}</div>
                    </div>
                    <div className="column">
                        <label htmlFor="password">Password:</label>
                        <input id="password" name="password" type="password" placeholder="Password" onChange={(e) => {
                            setPassword(e.currentTarget.value);
                            setPasswordError("");
                            setEmptyError("");
                        }}/>
                        <div className="error">{passwordError}</div>
                    </div>
                    <div className="error">{emptyError}</div>
                    <div className="buttons">
                        <button type="reset" onClick={handleReset}>Vaciar campos</button>
                        <button type="button" onClick={handleLogin} disabled={buttonAction}>Enviar</button>
                    </div>
                </form>
                <br/>
                <div>
                    Si no tienes cuenta, puedes <NavLink to="/register">registrarte</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Login;