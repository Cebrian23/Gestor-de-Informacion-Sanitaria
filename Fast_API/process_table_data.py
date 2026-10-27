def process_table_data(table_data):
    table = {}

    indexes = []
    
    for i in range(len(table_data)):
        if(i == 0):
            table["table_name"] = table_data[i][0]
        elif(i == 1):
            for a in table_data[i]:
                indexes.append(a)
            table["data"] = []
            table["indexes"] = indexes
        else:
            test = {}
            for a in range(len(table_data[i])):
                test[indexes[a]] = table_data[i][a]
            table["data"].append(test)

    table["type"] = "Analysis"
    
    return table