import './Sidebar.css'

function Sidebar() {
    return(
        <div className="sidebar">
            <h3>Indice</h3>
            <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver al inicio</button>
            <h4>Acciones para los doctores</h4>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/addDoctor"}>Insertar doctor</button>
            <br/>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserDoctors"}>Ver doctores</button>
            <h4>Acciones para las citas</h4>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/addAppointment"}>Insertar cita</button>
            <br/>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserAppointment"}>Ver citas</button>
            <h4>Acciones para los medicamentos</h4>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/addMidMedicine"}>Insertar medicamentos</button>
            <br/>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserMedicines"}>Ver medicamentos</button>
            <h4>Acciones para las analíticas</h4>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/addDocument"}>Insertar nueva analítica en PDF</button>
            <br/>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/showUserBloodTests"}>Ver analiticas</button>
            <br/>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/tableNameSelection"}>Comparar parámetros de tablas</button>
            <h4>Acciones de los datos del usuario</h4>
            <button type="button" className="button" onClick={() => globalThis.location.href = "/updateUser"}>Actualizar datos de usuario</button>
            <br/>
        </div>
    );
}

export default Sidebar;