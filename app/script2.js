// Codi Javascript de la WebApp de viatges 
// HackUPC 2024



// Set the chat app

function set_chat_height() {

  var chat_height = screen.height - document.getElementById("bottom_bar").offsetHeight;
document.getElementById("chat_iframe").style.height = chat_height + "px";
alert("hello");

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

        document.getElementById("register_image").style.display = "none";

        document.getElementById("register_header").innerHTML = "Què t'agrada?";
        document.getElementById("register_header").style.marginTop = "40px";
        document.getElementById("register_subheader").innerHTML = "Tria les teves preferències";
    
        document.getElementById("register_form_1").style.display = "none";
        document.getElementById("register_form_2").style.display = "block";

    }

    else if (number == 1) {

        document.getElementById("register").style.display = "none";
        document.getElementById("location_search").style.display = "block";

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


function save_dates() {

    document.getElementById("date_selector").style.display = "none";
    document.getElementById("budget_selector").style.display = "block";
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
