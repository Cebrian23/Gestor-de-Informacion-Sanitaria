import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import './Pages.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceArea } from 'recharts';
import Sidebar from "../Sidebar/Sidebar.tsx";
import Header from "../Header/Header.tsx";

function DataComparison() {
    const [info, setInfo] = useState<
        {
            "Prueba": string,
            "Valor_minimo": number | null,
            "Valor_maximo": number | null,
            "Unidades": string,
        }
    >();
    
    const [values, setValues] = useState<
        {
            "Fecha": string,
            "Valor": number
            "ValorMin": number | null,
            "ValorMax": number | null,
        }[]
    >([]);

    const [maxData, setMaxData] = useState(0);

    useEffect(() => {
        const getData = async () => {
            const auth_cookie = Cookie.get("auth_ECE_II");

            if(!auth_cookie){
                globalThis.location.href = "/login";
            }

            const url_user = `https://ece-ii-back-end-api-rest.onrender.com/user/id?id=${auth_cookie}`;
            const response_user = await fetch(url_user, {
                method: "GET",
            });

            if(response_user.status !== 200){
                const error = await response_user.json();
                alert(error.error);
                
                globalThis.location.href = "/login";
            }

            const ECE_table = Cookie.get("ECE_table");

            if(!ECE_table){
                globalThis.location.href = "/userPage";
            }

            const ECE_row = Cookie.get("ECE_row");

            if(!ECE_row){
                globalThis.location.href = "/userPage";
            }

            const url_valores = `https://ece-ii-back-end-api-rest.onrender.com/user/parameter_table_analysis?id=${auth_cookie}&table_name=${ECE_table}&data_name=${ECE_row}`;
            const response_valores = await fetch(url_valores, {
                method: "GET",
            });

            if(response_valores.status !== 200){
                const error = await response_valores.json();

                alert(error.error);

                globalThis.location.href = "/userPage";
            }

            const data = await response_valores.json();

            setInfo(
                {
                    "Prueba": data.Prueba,
                    "Unidades": data.Unidades,
                    "Valor_maximo": data.Valor_maximo,
                    "Valor_minimo": data.Valor_minimo,
                }
            );

            const valores: {
                "Fecha": string,
                "Valor": number,
                "ValorMin": number | null,
                "ValorMax": number | null,
            }[] = [];

            let count = 0;

            data.Valores.forEach((valor: {Fecha: string, Valor: number}) => {
                if(data.Valor_maximo === null && count < valor.Valor){
                    count = valor.Valor;

                    const maxValue = (Math.round(count/10))*10;

                    if(maxValue > count){
                        setMaxData(maxValue);
                    }
                    else{
                        setMaxData(maxValue+10);
                    }
                }

                valores.push(
                    {
                        "Fecha": valor.Fecha,
                        "Valor": valor.Valor,
                        "ValorMin": data.Valor_minimo,
                        "ValorMax": data.Valor_maximo,
                    }
                )
            });

            setValues(valores);
        }

        getData();
    }, []);

    return(
        <div className="finalPage">
            <Header/>
            <div className="totalPage">
                <Sidebar/>
                <div>
                    {
                        info !== undefined && values.length !== undefined && values.length === 1 &&
                        <div className="showGraphic">
                            <h1>Solo hay un valor para comparar</h1>
                        </div>
                    }
                    {
                        info !== undefined && values.length !== undefined && values.length > 1 &&
                        <div className="showGraphic">
                            <h1>Evolucion de {info.Prueba.toUpperCase()}</h1>
                            <div className="graphic">
                                <ResponsiveContainer width={750} height={250}>
                                    <LineChart data={values}>
                                        <XAxis dataKey="Fecha"/>
                                        {
                                            maxData > 0 &&
                                            <YAxis domain={[0, maxData]} ticks={[(maxData*25)/100, (maxData*50)/100, (maxData*75)/100, maxData]}/>
                                        }
                                        {
                                            maxData === 0 &&
                                            <YAxis/>
                                        }
                                        <Tooltip/>
                                        <CartesianGrid stroke="lightblue" strokeWidth={2.5} strokeDasharray="5 5"/>
                                        <Legend/>
                                        {
                                            info.Valor_maximo !== null &&
                                            <Line type="monotone" stroke="red" strokeWidth={2} strokeDasharray="15 15" dataKey="ValorMax"/>
                                        }
                                        <Line type="monotone" stroke="black" strokeWidth={2} dataKey="Valor"/>
                                        {
                                            info.Valor_minimo !== null &&
                                            <Line type="monotone" stroke="blue" strokeWidth={2} strokeDasharray="15 15" dataKey="ValorMin"/>
                                        }
                                        {
                                            info.Valor_maximo !== null && info.Valor_minimo !== null &&
                                            <ReferenceArea y1={info.Valor_minimo} y2={info.Valor_maximo} fill="grey" fillOpacity={0.45}/>
                                        }
                                        {
                                            info.Valor_maximo !== null && info.Valor_minimo === null &&
                                            <ReferenceArea y1={0} y2={info.Valor_maximo} fill="grey" fillOpacity={0.45}/>
                                        }
                                        {
                                            info.Valor_maximo === null && info.Valor_minimo !== null &&
                                            <ReferenceArea y1={info.Valor_minimo} y2={maxData} fill="grey" fillOpacity={0.45}/>
                                        }
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    }
                    <div className="buttons">
                        <button type="button" onClick={() => globalThis.location.href = "/tableDataSelection"}>Volver</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataComparison;