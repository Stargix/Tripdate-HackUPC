# TripDate
TripDate is a dating demo app developped at HackUPC 2024 to meet people while traveling

<img src="/images/14.jpeg" alt="Imagen 14" style="width: 150px; height: auto; margin: 5px;">

# Description
As a team at the Hackathon we developped an app to participate at the TravelPerk challenge.
It consisted on develop something to meet people while traveling, so we designed a date application
inspired by tinder to connect with people that take a flight to the same place.

# Dataset
The dataset provided to us by TravelPerk consisted in thousends of users with their city, 
flight destination, and the dates.

# Options
- User creation

  <img src="/images/1.jpeg" alt="Imagen 1" style="width: 150px; height: auto; margin: 5px;">   <img src="/images/10.jpeg" alt="Imagen 10" style="width: 150px; height: auto; margin: 5px;">    <img src="/images/3.jpeg" alt="Imagen 3" style="width: 150px; height: auto; margin: 5px;">   <img src="/images/7.jpeg" alt="Imagen 7" style="width: 150px; height: auto; margin: 5px;"> <img src="/images/8.jpeg" alt="Imagen 8" style="width: 150px; height: auto; margin: 5px;">
- Recommendation Section

  <img src="/images/9.jpeg" alt="Imagen 9" style="width: 150px; height: auto; margin: 5px;">
- Matching Section

  <img src="/images/13.jpeg" alt="Imagen 13" style="width: 150px; height: auto; margin: 5px;">
  
- Chat (API)
  
  <img src="/images/4.jpeg" alt="Imagen 4" style="width: 150px; height: auto; margin: 5px;">
- Profile (demo)

  <img src="/images/6.jpeg" alt="Imagen 6" style="width: 150px; height: auto; margin: 5px;">

# Matching Section
We developed an algorithm with python which makes the intersection of the city the user is visiting
with other users that are at the same place on the same period of time.
It wasn't an easy task due to the superposition of the users on the dataset but 
finally we coud reach to a good result. 
The python script uses Flask to comunicate with JavaScript and then it uses another
API to generate random profile pictures (demo) as their weren't included initially to the dataset.

<img src="/images/12.jpeg" alt="Imagen 5" style="width: 150px; height: auto; margin: 5px;">   <img src="/images/5.jpeg" alt="Imagen 12" style="width: 150px; height: auto; margin: 5px;">


# Recommendation Section
This section works with a Chat-GPT API that returns in json places to visit on the visited place.
This iconic places of the visited city are used by another API to get images of the site, so we can get
an idea as users of how do they look like. Moreover, thanks to the json returned by Chat-GPT, we were
able to include a orientative price of the experience and a description.

<img src="/images/2.jpeg" alt="Imagen 2" style="width: 150px; height: auto; margin: 5px;">   <img src="/images/11.jpeg" alt="Imagen 11" style="width: 150px; height: auto; margin: 5px;">


 
 
  


