import pandas as pd
from datetime import datetime
from flask import Flask, request
import cgitb

cgitb.enable()
print("Content-type: text/html\n\n")
import sys
sys.path.append('/mnt/web305/c1/31/53991431/htdocs/.local/lib/python3.8/site-packages')


app = Flask(__name__)

# Replace 'path_to_csv_file' with the actual path to your CSV file
file_path = './hackupc-travelperk-dataset-extended.csv'

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(file_path)

# Display the DataFrame
def afegir():
    global df
    traveller_name = input("Nom: ")
    departure_date = input("Dia de sortida (dd/mm/yyyy): ")
    return_date = input("Dia de tornada(dd/mm/yyyy): ")
    departure_city = input("Ciutat de partida: ")
    arrival_city = input("Ciutat que viatge: ")
    likes = [like.strip() for like in input("Gustos (separats amb coma): ").split(',')]
    budget = input("El presupost que disposa: ")
    new_row = {'Trip ID': len(df)+1, 'Traveller Name': traveller_name, 'Departure Date': departure_date, 'Return Date': return_date, 'Departure City': departure_city, 'Arrival City': arrival_city, 'Likes': likes, 'Budget': budget}
    df = df._append(new_row, ignore_index=True)
    df.to_csv(file_path, index=False)


def llista_coincidencies(trip_id):

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
                    return True, [max(start1, start2),min(end1, end2)]##
                else:
                    if desti1==sortida2:
                        if start1 < start2 or end1 > end2:
                            return True, [max(start1, start2),min(end1, end2)] ##
                        else:
                            return False, []

                    elif desti2==sortida1:
                        if start1 > start2 or end1 < end2:
                            return False, []
                        else:
                            return False, []
                           
                    else:
                        return False, []
                    
            else:
                if sortida1==desti2:
                    return False, []
                
                elif desti1==sortida2:
                    return True, [start1,end1] ##
                
                else:
                    return False, [] 
    
    llista = []
    llista_data = {}
    si_local = {}

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
    sorted_presu = dict(sorted(presu.items(), key=lambda item: (item[1][1], abs(item[1][2] - df.iloc[trip_id-1,7])),reverse=True)) 


    return sorted_presu

print(llista_coincidencies(1))

"""@app.route('/compatible', methods=['GET'])
def newgroup():

    user_id = request.args.get("id")
    
    return str(llista_coincidencies(int(user_id),False))

if __name__ == "__main__":
    app.run()
"""