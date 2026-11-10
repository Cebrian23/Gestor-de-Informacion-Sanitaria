# Gestor de Información Sanitaria Personal

Aplicación full stack para que una persona gestione información sanitaria personal: perfil, profesionales, citas, medicación y analíticas. La solución está formada por una SPA React, una API HTTP principal en TypeScript/Deno y un servicio FastAPI especializado en extraer tablas de documentos PDF.

## Índice

- [Resumen](#resumen)
- [Arquitectura](#arquitectura)
- [Frontend — Vite + React](#frontend--vite--react)
- [API REST — TypeScript + Deno](#api-rest--typescript--deno)
- [API de procesamiento — FastAPI + Python](#api-de-procesamiento--fastapi--python)
- [Componentes y módulos principales](#componentes-y-módulos-principales)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Variables de entorno](#variables-de-entorno)
- [Referencia de API](#referencia-de-api)
  - [API TypeScript/Deno](#api-typescriptdeno)
  - [API FastAPI](#api-fastapi)
- [Estructura de proyectos](#estructura-de-proyectos)
- [Despliegue](#despliegue)

## Resumen

El sistema centraliza información personal relacionada con la salud y permite registrar entidades asociadas: doctores, citas, medicamentos y resultados de analíticas. El flujo más distintivo parte de un PDF: el navegador lo entrega a FastAPI, este extrae y normaliza sus tablas, y el navegador envía el resultado a la API TypeScript para validarlo y persistirlo.

| Componente | Responsabilidad verificada | Tecnologías principales |
| --- | --- | --- |
| `Front_End` | Interfaz, formularios, navegación, consulta y visualización de datos | React 19, TypeScript, Vite, React Router, Recharts |
| `API_Rest` | Enrutado HTTP, lectura de parámetros, selección de consultas, transformación de documentos y resolución de entidades relacionadas | Deno, TypeScript, MongoDB, API Ninjas |
| `Fast_API` | Lectura de tablas de PDF | FastAPI, Python, pdfplumber, PyMongo |

Los dos backends no cumplen la misma función. `API_Rest` contiene la lógica para las operaciones para añadir, actualizar y devolver datos, y las comprobaciones del dominio. `Fast_API` se usa desde el frontend como procesador de PDFs.

## Arquitectura

```mermaid
flowchart LR
  U[Usuario] --> FE[Front End:<br/>React + Vite]
  FE -->|Peticiones HTTP| DENO[API Rest:<br/>Deno + TypeScript]
  DENO -->|Envío de datos| DB[(MongoDB)]
  DENO --> |Petición de datos| DB
  DB --> |Devolución de datos| DENO
  DENO --> |Devolución de datos| FE
  DENO -->|Validación email/teléfono| NINJAS[API Ninjas]
  FE -->|Validación email/teléfono| NINJAS[API Ninjas]
  FE -->|PDF| FAST[Fast API:<br/><br/>Python]
  FAST -->|Tablas normalizadas| FE
```

El frontend consume la URL desplegada de `Fast_API` solo para la lectura de PDFs y `API_Rest` para el resto de operaciones.

La persistencia principal está en las colecciones MongoDB `Users`, `Doctors`, `Appointments`, `Medication` y `BloodTests`. Las referencias entre documentos se guardan como `ObjectId`: un usuario contiene IDs de doctores, las citas y analíticas apuntan a usuario y doctor, y los medicamentos a paciente y doctor en cada pauta.

## Frontend — Vite + React

### Funcionalidades y vistas

| Área | Componentes/vistas | Función |
| --- | --- | --- |
| Acceso | `Login`, `Register`, `UpdateUser`, `UserInfo` | Registro, acceso, consulta y modificación del perfil |
| Inicio | `UserPage`, `Header`, `Sidebar` | Inicio y navegación por acciones |
| Doctores | `AddNewDoctor`, `ShowDoctors` | Alta y listado de profesionales asociados |
| Citas | `AddNewAppointment`, `ShowAppointments` | Crear y listar citas |
| Medicación | `AddMidMedicine`, `AddNewMedicine`, `AddMedicine`, `ShowMedicines`, `ShowMedicine` | Elegir alta, crear medicamento, añadir pauta y consultar detalles |
| Analíticas | `AddDocument`, `ShowBloodTests`, `ShowBloodTest` | Cargar PDF, registrar y consultar analíticas |
| Comparativa | `TableNameSelection`, `TableParameterSelection`, `DataComparison` | Seleccionar tabla/parámetro y mostrar evolución con Recharts |

### Formularios y validación

Los formularios conservan estado y errores de campo localmente. El frontend incluye validadores de DNI, correo y teléfono, y transformaciones AES para DNI y contraseña mediante `crypto-js`. Las validaciones de correo/teléfono llaman a API Ninjas desde el navegador; la API TypeScript también las aplica al registrar usuarios y doctores. El PDF se limita por el atributo `accept=".pdf"` antes de enviarse como `FormData`.

## API REST — TypeScript + Deno

`main.ts` implementa un único handler sobre `Deno.serve`. La lógica de rutas está centralizada en él y las transformaciones, validaciones y tipos se extraen a `utilities/` y `types/`.

### Responsabilidades

- Registro, consulta y actualización de usuarios.
- Asociación y consulta de doctores; creación y ordenación de citas.
- Creación de medicamentos y adición de pautas.
- Registro de analíticas procesadas, listado y consulta de valores.
- Validación de DNI, email y teléfono.

### Tecnologías

| Uso | Dependencia/configuración |
| --- | --- |
| Runtime y servidor | Deno, `Deno.serve` |
| Persistencia | `mongodb` npm v7 |
| Cifrado/transformación | `crypto-js` |
| Validación externa | API Ninjas `validateemail` y `validatephone` |
| Desarrollo | `deno task dev` con `--watch`, permisos amplios y carga de entorno |

Las respuestas usan JSON y los códigos observados incluyen `200`, `204` para preflight, `400`, `404`, `406` y `409`. No hay tokens, sesiones de servidor, middleware de autenticación ni comprobación de autorización implementados; el ID se transmite en query/body y el CORS permite `*`.

## API de procesamiento — FastAPI + Python

FastAPI aporta un proceso específico que justifica Python: `pdfplumber` abre el documento, localiza tablas mediante estrategias basadas en líneas y las traduce a estructuras que entiende el flujo de analíticas.

`extract_tables.py` clasifica la tabla cuyo primer valor es `Datos usuario` como `User_data`; las restantes se normalizan como `Analysis`. `process_user_data.py` convierte cabeceras a claves con guion bajo, mientras que `process_table_data.py` construye `indexes` y registros bajo `data`.

| Módulo | Responsabilidad |
| --- | --- |
| `main.py` | Instancia FastAPI y endpoints |
| `extract_tables.py` | Extracción y clasificación de tablas PDF |
| `process_user_data.py` | Normalización de tabla de datos personales |
| `process_table_data.py` | Normalización de tablas analíticas |
| `connection.py` | Cliente PyMongo y acceso a `Gestor_Sanitario` |

## Componentes y módulos principales

### Modelos TypeScript

`User`, `Doctor`, `Appointment`, `Medication`, `BloodTest` y `Table` en `API_Rest/types/Users` definen los tipos de datos para su almacenamiento MongoDB. Los tipos equivalentes del frontend modelan respuestas y cuerpos de inserción. Las tablas de análisis incluyen `table_name`, `indexes`, `data` y `type: "Analysis"`; la tabla personal incluye nombre completo, DNI, fecha.

### Utilidades de API_Rest

- `utilities/Users`: Transforma documentos MongoDB y resuelve referencias para usuarios, doctores, citas, medicamentos y analíticas.
- `utilities/Validations`: Valida formato de DNI y delega correo/teléfono a API Ninjas.
- `utilities/Transforms`: Cifra/descifra DNI y contraseñas con AES, y transforma fechas de analíticas.
- `db/conection.ts`: Inicia el cliente MongoDB y exporta las colecciones tipadas.

## Instalación y ejecución local

### Requisitos

El frontend usa Vite 7, React 19 y TypeScript 5.9; el API Rest usa Deno y la Fast API, las dependencias de `requirements.txt`. Se requiere una instancia de MongoDB para `API_Rest` y para `Fast_API /users`.

### 1. API TypeScript/Deno

```powershell
cd API_Rest
$env:MONGO_URL = "mongodb://usuario:contrasena@host:27017/?authSource=admin"
$env:DNI_KEY = "clave-ficticia-de-cifrado"
$env:API_KEY = "clave-ficticia-api-ninjas"
$env:PORT = "4000"
deno task dev
```

El proceso escucha en `0.0.0.0:4000` si no se define `PORT`.

### 2. FastAPI/Python

```powershell
cd Fast_API
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:MONGO_URL = "mongodb://usuario:contrasena@host:27017/?authSource=admin"
uvicorn main:app --reload
```

Con el comando anterior Uvicorn usa normalmente `http://127.0.0.1:8000`; esa dirección corresponde al comportamiento por defecto de Uvicorn.

### 3. Frontend

```powershell
cd Front_End
npm install
npm run dev
```

Para producción local:

```powershell
npm run build
npm run preview
```

## Variables de entorno

| Servicio | Variable | Obligatoria | Propósito | Ejemplo ficticio |
|---|---|---:|---|---|
| Backend | `MONGO_URL` | Sí | Cadena de conexión MongoDB | `mongodb+srv://usuario:clave@cluster.example/` |
| Backend | `DNI_KEY` | Sí | Clave AES empleada para encriptar DNI y contraseñas | `clave-local-de-desarrollo` |
| Backend | `API_KEY` | Sí | Cabecera `X-Api-Key` de API Ninjas para validación de email y teléfono | `api_ninjas_key_de_ejemplo` |
| Frontend | `DNI_KEY` | Sí | Clave AES empleada para encriptar DNI y contraseñas | `clave-local-de-desarrollo` |
| Frontend | `API_KEY` | Sí | Cabecera `X-Api-Key` de API Ninjas para validación de email y teléfono | `api_ninjas_key_de_ejemplo` |

## Referencia de API

### API TypeScript/Deno

Todas las rutas aceptan preflight `OPTIONS` y devuelven CORS abierto. Las rutas no declaran un esquema OpenAPI. Los cuerpos son JSON. Los IDs son cadenas que se convierten en `ObjectId`.

| Método | Ruta | Entrada obligatoria | Errores relevantes |
| --- | --- | --- | --- |
| GET | `/login` | Query: `email`, `password` | 400, 404 |
| GET | `/user/id` | Query: `id` | 400, 404 |
| GET | `/user/doctors` | Query: `id` | 400, 404 |
| GET | `/user/appointments` | Query: `id` | 400, 404 |
| POST | `/user/appointments` | `user`, `doctor`, `date`, `hour`, `specialty`, `sector` | 400, 404, 406 |
| GET | `/user/medications` | Query: `id` | 400, 404 |
| GET | `/user/medication` | Query: `id_user`, `id_medic` | 400, 404 |
| POST | `/user/medication` | `id_user`, `id_medicine`, `doctor`, `init_date`, `days_duration`, `amount_times_day`; `ml_time` | 400, 404 |
| POST | `/user/new_medication` | `id`, `name`, `type`, `doctor`, `init_date`, `days_duration`, `amount_times_day`; `ml_time` | 400, 404 |
| GET | `/user/all_analysis` | Query: `id` | 400, 404 |
| GET | `/user/single_analysis` | Query: `id_user`, `id_analysis` | 400, 404 |
| GET | `/user/table_names_analysis` | Query: `id` | 400, 404 |
| GET | `/user/table_data_names_analysis` | Query: `id`, `table_name` | 400, 404 |
| GET | `/user/table_analysis` | Query: `id`, `table` | 400, 404 |
| GET | `/user/parameter_table_analysis` | Query: `id`, `table_name`, `data_name` | 400, 404 |
| POST | `/user` | `name`, `surname_1`, `DNI`, `email`, `password`; `surname_2`, `prefix`, `phone` opcionales | 400, 406, 409 |
| PUT | `/user` | `id` y campos a modificar | 400, 404, 409 |
| POST | `/user/doctor` | `id_user`, `name`, `surname_1`, `specialty`, `sector`; resto opcional | 400, 404, 409 |
| POST | `/user/analysis` | `doctor`, `DNI`, `tables` | 400, 404, 406 |

Ejemplo de alta de cita:

```json
{
  "user": "65f000000000000000000001",
  "doctor": "65f000000000000000000002",
  "date": "01/10/2026",
  "hour": "10:30",
  "specialty": "Medicina de familia",
  "sector": "Publico"
}
```

Ejemplo mínimo de analítica ya procesada:

```json
{
  "doctor": "65f000000000000000000002",
  "DNI": "<dni-cifrado>",
  "tables": [
    {"table_name":"Datos usuario","nombre_completo":"Nombre Apellido","dni":"<dni-cifrado>","fecha":"01/10/2026","type":"User_data"},
    {"table_name":"Hemograma","indexes":["Parámetro","Valor"],"data":[{"Parámetro":"Hemoglobina","Valor":"14"}],"type":"Analysis"}
  ]
}
```

### API FastAPI

| Método | Ruta | Entrada | Respuesta | Códigos/observaciones |
| --- | --- | --- | --- | --- |
| POST | `/read_document` | `multipart/form-data`, campo `file` | Array de `User_data`/`Analysis` | 200 si se procesa; FastAPI valida el campo de archivo |

Ejemplo de carga:

```powershell
curl -X POST http://127.0.0.1:8000/read_document -F "file=@analitica.pdf"
```

## Estructura de proyectos

```text
Front_End/
├── src/
│   ├── Forms/                 # Formularios de acceso y altas
│   ├── Pages/                 # Consultas y comparativa de analíticas
│   ├── Header/ y Sidebar/     # Navegación visual
│   ├── types/                 # Tipos de datos
│   └── utilities/             # Validaciones y transformaciones
├── src/App.tsx                # Rutas React
└── package.json

API_Rest/
├── main.ts                    # Manejador HTTP y lógica de rutas
├── db/conection.ts            # Cliente/colecciones MongoDB
├── types/Users/               # Tipos de datos
├── utilities/Transforms/      # Cifrado y fechas
├── utilities/Validations/     # DNI, email y teléfono
├── utilities/Users/           # Transformación de respuestas
├── deno.json                  # Tarea de desarrollo
└── Dockerfile

Fast_API/
├── main.py                    # Aplicación y endpoints FastAPI
├── extract_tables.py          # Extracción PDF
├── process_user_data.py       # Tabla personal → diccionario
├── process_table_data.py      # Tabla analítica → diccionario
├── connection.py              # PyMongo/MONGO_URL
└── requirements.txt
```

## Despliegue

A través de los siguientes enlaces se puede acceder tanto al frontend como al API Rest y a la Fast API, todos desplegados en Render:

- `Front_End`: https://ece-ii-front-end-afcp.onrender.com
- `API_Rest`: https://ece-ii-back-end-api-rest.onrender.com
- `Fast_API`: https://ece-ii-back-end-fast-api-veha.onrender.com