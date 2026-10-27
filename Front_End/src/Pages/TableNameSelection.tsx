import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import './Pages.css'
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function TableNameSelection() {
    const [tableNames, setTableNames] = useState<string[]>([]);

    useEffect(() => {
        const getData = async () => {
            Cookie.remove("ECE_table");
            Cookie.remove("ECE_row");

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

            const url_names = `https://ece-ii-back-end.onrender.com/user/table_names_analysis?id=${auth_cookie}`;
            const response_names = await fetch(url_names, {
                method: "GET",
            });

            if(response_names.status !== 200){
                const error = await response_names.json();

                alert(error.error);

                globalThis.location.href = "/userPage";
            }

            const data = await response_names.json();
            setTableNames(data);
        }

        getData();
    }, []);

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div className="userTablesContainer">
                    <form className="showTablesMenu">
                        <div className="column">
                            <h1>Selecciona la tabla</h1>
                            <select defaultValue="" onChange={(e) => {
                                Cookie.set("ECE_table", e.currentTarget.value, {expires: 7});

                                globalThis.location.href = "/tableDataSelection";
                            }}>
                                <option value="">Selecciona una tabla</option>
                                {
                                    tableNames.map((table) => {
                                        return(
                                            <option key={table} value={table}>{table}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="buttons">
                            <button type="button" onClick={() => globalThis.location.href = "/userPage"}>Volver</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TableNameSelection;