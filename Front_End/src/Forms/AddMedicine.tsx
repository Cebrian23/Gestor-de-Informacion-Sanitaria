import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import type { Doctor } from "../types/User/Doctor.ts";
import type { Medication_ins, Medication_Short } from "../types/User/Medication.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function AddMedicine(){
    const [user, setUser] = useState("");
    const [medType, setMedType] = useState("");
    const [idMedicine, setIdMedicine] = useState("");
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState("");
    const [days, setDays] = useState(0);
    const [amountMed, setAmountMed] = useState(0);
    const [mlMed, setMlMed] = useState(0);

    const [medicines, setMedicines] = useState<Medication_Short[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [medicineError, setMedicineError] = useState("");
    const [doctorError, setDoctorError] = useState("");
    const [daysError, setDaysError] = useState("");
    const [amountMedError, setAmountMedError] = useState("");
    const [mlMedError, setMlMedError] = useState("");

    const [buttonAction, setButtonAction] = useState(false);

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

            const url_medications = `https://ece-ii-back-end.onrender.com/user/medications?id=${auth_cookie}`;
            const response_medications = await fetch(url_medications,
                {
                    method: "GET",
                }
            )

            if(response_medications.status !== 200){
                globalThis.location.href = "/userPage";
            }

            const data_medications = await response_medications.json();
            if(data_medications.length === 0){
                alert("Tienes que haber insertado una medicamento");

                globalThis.location.href = "/userPage";
            }
            setMedicines(data_medications);

            const url_doctors = `https://ece-ii-back-end.onrender.com/user/doctors?id=${auth_cookie}`;
            const response_doctors = await fetch(url_doctors, {
                method: "GET",
            });

            if(response_doctors.status !== 200){
                globalThis.location.href = "/userPage";
            }

            const data_doctors = await response_doctors.json();
            setDoctors(data_doctors);
        }

        getData();
    }, []);

    if(date === ""){
        const date = new Date();

        let month;
        let day;

        if(date.getMonth() < 10){

            month = "0" + (date.getMonth()+1).toString();
        }
        else{
            month = date.getMonth().toString();
        }

        if(date.getDate() < 10){
            day = "0" + date.getDate().toString();
        }
        else{
            day = date.getDate().toString();
        }

        const new_date = date.getFullYear().toString() + "-" + month + "-" + day

        setDate(new_date);
    }

    const handleUpdateMedicine = (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
        setMedicineError("");
        if(e.currentTarget.value !== ""){
            const med_exists = medicines.find((med) => {
                if(med.id === e.currentTarget.value){
                    return med;
                }
            });

            if(!med_exists){
                alert("Medicamento no encontrado");
            }
            else{
                setIdMedicine(med_exists.id);
                setMedType(med_exists.type);
            }
        }
        else{
            setIdMedicine("");
            setMedType("");
        }
    }

    const handleReset = () => {
        setMedType("");
        setIdMedicine("");
        setDoctor("");
        
        setMedicineError("");
        setDoctorError("");
        setDaysError("");
        setAmountMedError("");
        setMlMedError("");

        setButtonAction(false);
    }

    const handleCreation = async () => {
        setButtonAction(true);

        let error = false;

        if(idMedicine.trim() === ""){
            setMedicineError("Hay que rellenar este campo");

            error = true;
        }

        if(doctor.trim() === ""){
            setDoctorError("Hay que rellenar este campo");

            error = true;
        }

        if(days <= 0){
            setDaysError("El número de días debe ser superior a 0");

            error = true;
        }

        if(amountMed <= 0){
            if(medType === ""){
                setAmountMedError("El valor debe ser superior a 0");
            }
            else if(medType === "Pastillas"){
                setAmountMedError("El número de pastillas por día debe ser superior a 0");
            }
            else if(medType === "Jarabe"){
                setAmountMedError("El número de cucharadas de jarabe por día debe ser superior a 0");
            }

            error = true;
        }

        if(medType === "Jarabe" && mlMed <= 0){
            setMlMedError("El número de Mililítros por cucharada tiene que ser superior a 0");

            error = true;
        }

        if(error === false){
            const body: Medication_ins = {
                id_user: user,
                id_medicine: idMedicine,
                doctor: doctor,
                init_date: date,
                days_duration: days,
                amount_times_day: amountMed,
            }            

            if(medType === "Jarabe"){
                body.ml_time = mlMed;
            }

            const url = `https://ece-ii-back-end.onrender.com/user/medication`;
            const response = await fetch(url, {
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
                
                alert(data.message);

                globalThis.location.href = "/userPage";
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
                <div className="addMedicine">
                    <form className="addMedicineForm">
                        <h1>Insertar nuevo medicamento</h1>
                        <div className="column">
                            <label htmlFor="medicine">Medicamento:</label>
                            <select id="medicine" name="medicine" value={idMedicine} onChange={(e) => {
                                handleUpdateMedicine(e);
                            }}>
                                <option value="">Seleccionar medicamento:</option>
                                {
                                    medicines.map((medicine) => {
                                        return(
                                            <option key={medicine.id} value={medicine.id}>{medicine.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className="error">{medicineError}</div>
                        </div>
                        <div className="column">
                            <label htmlFor="doctor">Doctor que la ha recetado:</label>
                            <select id="doctor" name="doctor" value={doctor} onChange={(e) => {
                                setDoctor(e.currentTarget.value);
                                setDoctorError("");
                            }}>
                                <option value="">Seleccionar doctor</option>
                                {
                                    doctors.map((doctor) => {
                                        if(doctor.surname_2 !== null && doctor.surname_2 !== undefined && doctor.surname_2.trim() !== ""){
                                            return(
                                                <option key={doctor.id} value={doctor.id}>{doctor.name} {doctor.surname_1} {doctor.surname_2}</option>
                                            )
                                        }
                                        else{
                                            return(
                                                <option key={doctor.id} value={doctor.id}>{doctor.name} {doctor.surname_1}</option>
                                            )
                                        }
                                    })
                                }
                            </select>
                            <div className="error">{doctorError}</div>
                        </div>
                        <div className="column">
                            <label htmlFor="date">Fecha de inicio:</label>
                            <input id="date" name="date" value={date} type="date" onChange={(e) => {
                                setDate(e.currentTarget.value);
                            }}/>
                        </div>
                        <div className="column">
                            <label htmlFor="duration">Días de duración del tratamiento:</label>
                            <input id="duration" name="duration" type="number" min={0} max={1000} value={days} onChange={(e) => {
                                setDays(Number(e.currentTarget.value));
                                setDaysError("");
                            }}/>
                            <div className="error">{daysError}</div>
                        </div>
                        {
                            medType !== "" &&
                            <div className="column">
                                <label htmlFor="amount">{medType === "Pastillas" ? <>Número de pastillas por día:</> : <>Número de cucharadas de jarabe por día:</>}</label>
                                <input id="amount" name="amount" type="number" min={0} max={5} value={amountMed} onChange={(e) => {
                                    setAmountMed(Number(e.currentTarget.value));
                                    setAmountMedError("");
                                }}/>
                                <div className="error">{amountMedError}</div>
                            </div>
                        }
                        {
                            medType === "Jarabe" &&
                            <div className="column">
                                <label htmlFor="ml">Mililítros de jarabe por cucharada:</label>
                                <input id="ml" name="ml" type="number" value={mlMed} min={0} max={1000} onChange={(e) => setMlMed(Number(e.currentTarget.value))}/>
                                <div className="error">{mlMedError}</div>
                            </div>
                        }
                        <div className="buttons">
                            <button type="button" onClick={() => globalThis.location.href = "/addMidMedicine"}>Volver</button>
                            <button type="reset" onClick={handleReset}>Reiniciar campos</button>
                            <button type="button" onClick={handleCreation} disabled={buttonAction}>Enviar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMedicine;