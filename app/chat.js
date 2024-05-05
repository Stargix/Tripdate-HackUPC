// Chat GTP place API
// Finds places based on interests


var lloc_glob = "";

function chat_completition(lloc) {

  lloc_glob = lloc;

var prompt = text = "Vull un JSON de llocs a visitar a "+lloc+" amb el format {'llocs': [ ... ]}. De cada lloc, 'nom', 'descripcio_curta', 'descripcio_llarga','preu'(integer) 'tipus ([cultura,historia,ciència,familiar,relax,festa,compres,exterior activitats])'. Vull 5 recomanacions en català.";

var conversation = [
    {
    "role": "system",
    "content": "Ets un assistent en català que retorna JSON."
    },
    {
    "role": "user", 
    "content": text
}];
    

    /*---------------------------------------------------*/
    const apiUrl = "OPEN-AI URL";
    const apiKey = "OPEN-AI KEY";
    /*---------------------------------------------------*/

    const inputPrompt = "";
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-0125",
            "messages": conversation
        })
    }).then(response => {
        if(!response.ok) {
            throw new Error(`Error de generació: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        var msg = data.choices[0].message.content;
        console.log(msg);
        handle_message(msg);
    }).catch(error => {
        console.error('Error:', error);
    });
}


    var places = "";

    function handle_message(response) {

        // Decode JSON and use for recommendations
        places = JSON.parse(response);

        var llocs = places["llocs"];

        document.getElementById("skeleton_cards").style.display = "none";

       for(var place of llocs) {

            var name = place["nom"];
            var desc_curta = place["descripcio_curta"];
            var desc_llarga = place["descripcio_llarga"];
            var preu = place["preu"];

            // Using the image API that we just developed!
            var image_url = "https://timefactories.com/cgi-bin/catalina/internet.cgi/imagefile?query=" + lloc_glob + " " + name;

            // Array with all categories that apply
            var tipus = place["tipus"];

            // Create a card and add it to the list, then make image requests and reset them
            // Make Python return the image directly, as load? Why not?

            var template = `
            <div class="event_row" style="margin-top: 30px;">
            <div class="event_card" onclick="start();">
        
              <div class="image_container">
                <img class="event_image" src="${image_url}" alt="Event image">
        
                <div class="event_users flex mb-5 -space-x-4">
                  <!-- add participants images -->
                </div>
        
              </div>
        
              <div class="event_participants">
                </dv>
        
                <div class="event_details">
        
                  <p class="event_title">${name}</p>
                  <p class="place_description">${desc_curta}</p>
                  
                  <hr>
                  <div style="margin-top:10px;margin-bottom: 5px;display: flex;align-items: center;">
                  <i class="date_icon material-icons-outlined">calendar_month</i>
                  <p class="event_date" style="margin-right: 15px;">12 Sept 2023</p>
                  <i class="time_icon material-icons-outlined">savings</i>
                  <p class="event_date" style="margin-right: 6px;">${preu}€</p>
                </div>
                 
                
                </div>
        
              </div>
            </div>
          </div>`;

          document.getElementById("places_recommender").innerHTML += template;

        }

    }





// IMAGE API (using Bing, developed by MK)
// {NEW!} Just place the query, and the image will come!
// https://timefactories.com/cgi-bin/catalina/internet.cgi/imagefile?query=X [GET]




// Llista amb les ID'S de les persones amb qui ha fet match