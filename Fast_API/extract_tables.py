import pdfplumber
from process_table_data import process_table_data
from process_user_data import process_user_data

def extract_tables(archivo):
    tables = []
    tables_data = []

    with pdfplumber.open(archivo) as pdf:
        for page in pdf.pages:
            table_settings = {
                "vertical_strategy": "lines",
                "horizontal_strategy": "lines",
            }

            tables_found = page.find_tables(table_settings)

            for t in tables_found:
                tables.append(t.extract())

    for f in tables:
        if(f[0][0] == "Datos usuario"):
            tables_data.append(process_user_data(f))
        else:
            tables_data.append(process_table_data(f))
    
    return tables_data