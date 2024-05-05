// Codi Javascript de la WebApp de viatges 
// HackUPC 2024



// Set the chat app

function set_chat_height() {

  var chat_height = screen.height - document.getElementById("bottom_bar").offsetHeight - 60;
document.getElementById("chat_iframe").style.height = chat_height + "px";

}

// User data
var user_name = "";
var user_location = "";
var selected_interests = [];

// Trip specific data
var trip_destination = "";

function open_app() {

  document.getElementById("welcome_page").style.display = "none";
  document.getElementById("register").style.display = "block";

}

function register_step(number) {

    if (number == 0) {

        user_name = document.getElementById("register_name").value;
        user_location = document.getElementById("register_location").value;

        if (user_name && user_location) {

        document.getElementById("register_image").style.display = "none";

        document.getElementById("register_header").innerHTML = "Què t'agrada?";
        document.getElementById("register_header").style.marginTop = "40px";
        document.getElementById("register_subheader").innerHTML = "Tria les teves preferències";
    
        document.getElementById("register_form_1").style.display = "none";
        document.getElementById("register_form_2").style.display = "block";

        }

        else {

            show_error();

        }

    }

    else if (number == 1) {

        if (selected_interests.length > 0) {

        document.getElementById("register").style.display = "none";

        // Save user data to display on profile open
        // TODO


        document.getElementById("location_search").style.display = "block";
        document.getElementById("bottom_bar").style.display = "block";

        }

        else {

            show_error();
        }

    }
    
}



function add_interest(number) {

    if (selected_interests.includes(number)) {

        selected_interests.splice(selected_interests.indexOf(number), 1);

        document.getElementById("interest_" + number.toString()).style.backgroundColor = "rgb(249 250 251/var(--tw-bg-opacity))";

        document.getElementById("interest_" + number.toString()).style.color = "rgb(17 24 39/var(--tw-text-opacity))";


    }

    else {

        selected_interests.push(number);

        document.getElementById("interest_" + number.toString()).style.backgroundColor = "rgb(243 244 246/var(--tw-bg-opacity))";

        document.getElementById("interest_" + number.toString()).style.color = "rgb(26 86 219/var(--tw-text-opacity))";

    }

}



// Location search

document.getElementById('city_search').addEventListener('input', function() {
  var inputValue = this.value.trim(); // Trim whitespace
  if (inputValue.length > 3) {
      // Call your function here
      search_token = document.getElementById("city_search").value;
      token_amadeus();
  }
});

var search_token = "";

document.getElementById("location_search_form").addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    search_token = document.getElementById("city_search").value;

    token_amadeus();
});

/* AMADEUS TOKENS REQUEST */

function token_amadeus() {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const parametros = new URLSearchParams();
parametros.append('grant_type', 'client_credentials');
parametros.append('client_id', 'Ose9ob5IIeinc6vUKXX92l9oBZy85TTr');
parametros.append('client_secret', 'kahbv7Nw0zGMq1dt');

const opciones = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: parametros.toString()
};

fetch(url, opciones)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Respuesta:', data["access_token"]);
    // Haz algo con los datos recibidos aquí
    handle_action_amadeus(data["access_token"]);

  })
  .catch(error => {
    console.error('¡Hubo un error!', error);
  });
}


// Once we get the token, make the request!
function handle_action_amadeus(token) {

    // Decide action segons variable global
    get_location(search_token, token);

}



function get_location(keyword_user, token_user) {


// Construct the URL with the custom keyword
const url = `https://test.api.amadeus.com/v1/reference-data/locations/cities?max=6&keyword=${encodeURIComponent(keyword_user)}`;

// Make the API request
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token_user}`
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  // Process the response
  console.log(data["data"]); // This will log the cities starting with the custom keyword

  // Create dynamic cards for each result
  create_location_cards(data["data"]);
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});


}




// Dynamically add city selection buttons to the page
function create_location_cards(cities) {

  // Erease previous cards
  document.getElementById("city_search_results").innerHTML = "";
  document.getElementById("location_skeleton").style.display = "none";

  if (cities) {

    document.getElementById("location_notfound").style.display = "none";

    for (var element of cities) {

      var name = element["name"];
      var state = element["address"]["countryCode"];
      var code = element["iataCode"];

      var card = `
      <div onclick="select_destination('${name}');" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white" style="margin-top:15px">
      <img class="flag_icon" src="https://flagsapi.com/${state}/flat/32.png">
      <span style="overflow:hidden;" class="flex-1 ms-3 whitespace-nowrap">${name}</span>
      </div>
      `;

      // Append to city_search_results
      document.getElementById("city_search_results").innerHTML += card;

  }

  }

  else {

    document.getElementById("location_notfound").style.display = "block";

  }

    
}




function select_destination(destination) {

    trip_destination = destination;

    document.getElementById("location_search").style.display = "none";
    document.getElementById("date_selector").style.display = "block";

}


var date_start = "";
var date_end = "";

function save_dates() {

    date_start = document.getElementById("date_start").value;
    date_end = document.getElementById("date_end").value;

    if (date_start && date_end) {

        document.getElementById("date_selector").style.display = "none";
        document.getElementById("budget_selector").style.display = "block";

    }

    else {

        show_error();
    }


}


var currency = "";
var budget = 0;

function select_currency(text) {

    document.getElementById("selected_currency").innerHTML = text;

    document.getElementById("money_usd").style.display = "none";
    document.getElementById("money_eur").style.display = "none";
    document.getElementById("money_cad").style.display = "none";
    document.getElementById("money_gbp").style.display = "none";
    
    if (text == "USD") {

        document.getElementById("money_usd").style.display = "block";
    }

    else if (text == "EUR") {

        document.getElementById("money_eur").style.display = "block";


    }

    else if (text == "CAD") {

        document.getElementById("money_cad").style.display = "block";

    }

    else if (text == "GBP") {

        document.getElementById("money_gbp").style.display = "block";


    }
}


function save_budget() {

    budget = document.getElementById("budget_input").value;

    if (budget) {

        // WEB REQUEST TO FLASK
        // Finish travel plan, send to people

        // Show people skeleton loader
        document.getElementById("budget_selector").style.display = "none";
        document.getElementById("loader_screen").style.display = "block";
        
    }

    else {

        show_error();
    }

}



function convertToEuropeanDate(americanDate) {
    // Split the date string into month, day, and year parts
    var parts = americanDate.split('/');
    
    // Rearrange the parts to European format
    var europeanDate = parts[1] + '/' + parts[0] + '/' + parts[2];
    
    return europeanDate;
}



// TINDER CARDS



var interessos = ["Cultura","Aire lliure","Història","Compres","Ciència","Familiar","Relax","Festa"];

function get_people() {

    var interessos_selected = [];

    for (var item in selected_interests){
        
        interessos_selected.push(interessos[item]);

    } 

    //var data_url = "https://timefactories.com/cgi-bin/hack/main.cgi/persona?traveller-name=" + user_name + "&departure-date=" + convertToEuropeanDate(date_start) + "&return-date=" + convertToEuropeanDate(date_end) + "&departure-city=" + user_location + "&arrival-city=" + trip_destination + "&likes=" + encodeURI(interessos_selected) + "&budget=" + budget;

    var data_url = "https://timefactories.com/cgi-bin/hack/main.cgi/persona?traveller-name=Mark&departure-date=16/05/2024&return-date=24/05/2024&departure-city=Barcelona&arrival-city=Berlin&likes=Cultura,Aire%20lliure,Hist%C3%B2ria&budget=20";

    fetch(data_url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.text(); // Parse the response body as JSON
  })
  .then(data => {

    handle_people(data);

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });


}



// HANDLE PEOPLE

var datayes;

function handle_people(data) {

    datayes = data.toString();

    var data2 = datayes.replace(/[\[\]{}]/g, '');

    var persons = data2.split(":");

    persons.shift();

    for (let i = 0; i < persons.length; i++) {

      var person = persons[i].trim().split(",");

      var name = person[0].replace(/'/g, '');
      var coincidit = "Coincidiu de " + person[3].replace(/'/g, '') + " a " + person[4].replace(/'/g, '');
      var face_image_url = "https://timefactories.com/cgi-bin/catalina/internet.cgi/imagegender?name=" + name;

      // Create the card and add it to the list

      // CREATE CARDS

      var card_template = `
      <div class="tinder--card mt-7 w-80 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style="width: 100%;">

      <div style="align-items:center; display:flex;margin-top: 40px;justify-content: center;">
  
      <img class="mx-2 w-40 h-40 rounded-full centrat" src="${face_image_url}" alt="Rounded avatar">
  
    </div>
  
  <div class="mt-6 flex flex-col items-center pb-10">
      <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">${name}</h5>
      <span class="text-sm text-gray-500 dark:text-gray-400">Demo user</span>
      
      <div class="user_interests" style="display: flex;gap: 15px;margin-top: 30px;">
        <p class="interest_icon">🎉</p>
        <p class="interest_icon">🎡</p>
        <p class="interest_icon">🌞</p>
      </div>
      
      <p style="font-size:18px;text-align: center;margin-top: 30px;" class="mx-4 font-normal text-gray-500 lg:text-xl dark:text-gray-400">${coincidit}</p>
  </div>
  
  </div>`;

  document.getElementById("tinder_cards_area").innerHTML += card_template;

  }


  document.getElementById("tinder").style.display = "flex";




}
// DATA SENDING

/*

user_name = "";
user_location = "";
selected_interests = [];

trip_destination = "";
budget
currency

date_start
date_end

*/


// Bottom bar navigation

function bottom_bar(page) {

    // Show header
    document.getElementById("header").style.display = "flex";
    
    // Hide all screens
    document.getElementById("date_selector").style.display = "none";
    document.getElementById("budget_selector").style.display = "none";
    document.getElementById("location_search").style.display = "none";
    document.getElementById("places_recommender").style.display = "none";
    document.getElementById("individual_place").style.display = "none";
    document.getElementById("chat_screen").style.display = "none";
    document.getElementById("profile_screen").style.display = "none";
    document.getElementById("loader_screen").style.display = "none";
    document.getElementById("tinder").style.display = "none";


    if (page == "home") {

        document.getElementById("location_search").style.display = "block";

    }

    else if (page == "landmarks") {

        document.getElementById("places_recommender").style.display = "block";

    }

    else if (page == "love") {

        document.getElementById("tinder").style.display = "flex";
        
    }

    else if (page == "chat") {

        document.getElementById("header").style.display = "none";
        document.getElementById("chat_screen").style.display = "block";
        
    }

    else if (page == "profile") {

        document.getElementById("profile_screen").style.display = "block";
        
    }

}



function show_error() {

    document.getElementById("error_alert").style.display = "block";

    setTimeout(function() {

        document.getElementById("error_alert").style.display = "none";

    }, 3000);
    
}


'use strict';

var tinderContainer = document.querySelector('.tinder');
var allCards = document.querySelectorAll('.tinder--card');


function initCards(card, index) {
  var newCards = document.querySelectorAll('.tinder--card:not(.removed)');

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
  });
  
  tinderContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on('pan', function (event) {
    el.classList.add('moving');
  });

  hammertime.on('pan', function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
    tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
  });

  hammertime.on('panend', function (event) {
    el.classList.remove('moving');
    tinderContainer.classList.remove('tinder_love');
    tinderContainer.classList.remove('tinder_nope');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle('removed', !keep);

    if (keep) {
      event.target.style.transform = '';
    } else {
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
      initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll('.tinder--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add('removed');

    if (love) {
      card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
    } else {
      card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }

    initCards();

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);
