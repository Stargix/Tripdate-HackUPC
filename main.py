#!/usr/bin/python3

# Initialisation on web server
import cgitb
cgitb.enable()
print("Content-type: text/html\n\n")
import sys
sys.path.append('/mnt/web305/c1/31/53991431/htdocs/.local/lib/python3.11/site-packages/')
sys.path.append('/mnt/web305/c1/31/53991431/htdocs/.local/lib/python3.8/site-packages')
sys.path.append('/opt/RZpython3/lib/python3.11/site-packages')
sys.path.append('/mnt/web305/c1/31/53991431/htdocs/.local/bin')

import pandas as pd
from datetime import datetime
from flask import Flask, request

app = Flask(__name__)

# Replace 'path_to_csv_file' with the actual path to your CSV file
file_path = './hackupc-travelperk-dataset-extended.csv'

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(file_path)


# Display the DataFrame
# Display the DataFrame
def afegir(traveller_name, departure_date, return_date, departure_city, arrival_city, likes, budget):

    global df
    
    user_id = len(df)+1
    
    new_row = {'Trip ID': user_id, 'Traveller Name': traveller_name, 'Departure Date': departure_date, 'Return Date': return_date, 'Departure City': departure_city, 'Arrival City': arrival_city, 'Likes': likes, 'Budget': str(budget)}

    df = df._append(new_row, ignore_index=True)
    df.to_csv(file_path, index=False)

    return user_id
    
    




def coincidencies_orden(trip_id):

    start1 = df.iloc[trip_id-1,2]
    end1 = df.iloc[trip_id-1,3]

    sortida1 = df.iloc[trip_id-1,4]
    desti1 = df.iloc[trip_id-1,5]

    def coincidencia(other):
        start2 = df.iloc[other-1,2]
        end2 = df.iloc[other-1,3]

        sortida2 = df.iloc[other-1,4]
        desti2 = df.iloc[other-1,5]

        if sortida1 == sortida2:
            return False, [] 
        else:
            if max(start1, start2) <= min(end1, end2):
                if desti1==desti2:
                    return True, [max(start1, start2),min(end1, end2)]
                else:
                    if desti1==sortida2:
                        if start1 < start2 or end1 > end2:
                            return True, [max(start1, start2),min(end1, end2)]
                        else:
                            return False, [] 

                    elif desti2==sortida1:
                        if start1 > start2 or end1 < end2:
                            return True, [max(start1, start2),min(end1, end2)]
                        else:
                            return False, [] 
                           
                    else:
                        return False, [] 
                    
            else:
                if sortida1==desti2:
                    return True, [start2, end2]
                
                elif desti1==sortida2:
                    return True, [start1,end1]
                
                else:
                    return False, []  
    
    llista = []
    llista_data = {}

    for i in range(1,len(df)+1):
        if i != trip_id:

            indicador, data = coincidencia(i)

            if indicador:
                llista.append(df.iloc[i-1,0])
                llista_data[i-1]=data

    coin = {}
    
    for gustos in eval(df.iloc[trip_id-1,6]):
        for j in llista:
            
            numero_conincidencias = 0
            
            if gustos in eval(df.iloc[j-1,6]):
                for i in range(len(eval(df.iloc[trip_id-1,6]))):
                    for k in range(len(eval(df.iloc[j-1,6]))):
                        if eval(df.iloc[trip_id-1,6])[i] == eval(df.iloc[j-1,6])[k]:
                            numero_conincidencias += 1
                
                coin[j] = numero_conincidencias
    
    sort_coin = dict(sorted(coin.items(), key=lambda x: x[1], reverse=True))

    presu = {key: [df.iloc[key-1,1],value, df.iloc[key-1,7], llista_data[key-1]] for key, value, in sort_coin.items()}
    
    sorted_presu_coin = dict(sorted(presu.items(), key=lambda item: (item[1][1], -abs(item[1][2] - df.iloc[trip_id-1,7])), reverse=True))
    
    return sorted_presu_coin

@app.route('/compatible', methods=['GET'])
def newgroup():

    user_id = request.args.get("id")
    
    return str(coincidencies_orden(int(user_id)))


@app.route('/persona', methods=['GET'])
def persona():

    traveller_name = request.args.get("traveller-name")
    departure_date = request.args.get("departure-date")
    return_date = request.args.get("return-date")
    departure_city = request.args.get("departure-city")
    arrival_city = request.args.get("arrival-city")
    likes = request.args.get("likes")
    likes = likes.split(",")
    budget = int(request.args.get("budget"))

    # Convertir a bon format de data departure i return time


    # Afegir persona al database i obtenir
    user_id = afegir(traveller_name, departure_date, return_date, departure_city, arrival_city, likes, budget)

    # Llavors, cridar:
    subdiccionario = {k: v for k, v in coincidencies_orden(int(user_id)-1).items()[:15]}
    return str(subdiccionario)




if __name__ == "__main__":
    app.run()
