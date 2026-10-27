def process_user_data(user_data):
    table = {}
    
    for i in range(len(user_data)):
        if(i == 0):
            table["table_name"] = user_data[i][0]
        else:
            column_0 = user_data[i][0].lower().split(" ")
            column_join = ""
            for c in range(len(column_0)):
                column_join += column_0[c]

                if(c < len(column_0)-1):
                    column_join += "_"
            table[column_join] = user_data[i][1]
    
    table["type"] = "User_data"

    return table