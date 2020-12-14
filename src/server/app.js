let tempData = {};

// setup dotenv to hide api keys and sensitive data
const dotenv = require('dotenv');
dotenv.config();

// init express server
const express = require('express');
const app = express();

// init bodyParser 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// init cors 
const cors = require('cors');
app.use(cors());

// set path  
app.use(express.static('dist'));

// get / 
app.get('/', function (req, res){
    res.status(200).sendFile('dist/index.html');
});

// init node fetch & stringfy
var path = require('path')
const fetch = require("node-fetch");
const { stringify } = require('querystring');

// All the resources of APIs
const geoNames_BaseUrl = 'http://api.geonames.org/searchJSON?q=';
const weatherBitForecast_BaseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherBitHistory_BaseUrl = 'https://api.weatherbit.io/v2.0/history/daily?lat=';
const pixabay_BaseUrl = 'https://pixabay.com/api/?key=';

// get apikeys fro dotenv
const apiKeys = {
    weather_bit_key:process.env.WEATHER_BIT_API_KEY,
    pixaba_key:process.env.PIXABAY_API_KEY,
    geo_username:process.env.GEO_USERNAME
}

// log apikeys
// console.log(`weather_bit_key ${apiKeys.weather_bit_key}
// pixaba_key ${apiKeys.pixaba_key}
// geo_username ${apiKeys.geo_username}`
//     );

// post data to server to get required trip details
app.post('/postData', function (req,res){

    let details = {};
    details['to'] = req.body.to;
    details['from'] = req.body.from;
    details['date'] = req.body.date;
    details['daystogo'] = req.body.daystogo;

    // console.log("/postData "+stringify(details) );

    try {
        // Fetching geo details of destination place.
        getGeoDetails(details['to'])
            .then((placeInfo) => {
                // console.log(JSON.stringify(placeInfo));
                //Assigning the fetched value from JSON toInfo
                const placeLat = placeInfo.geonames[0].lat;
                const placeLng = placeInfo.geonames[0].lng;

                //Getting Weather details
                return getWeatherData(placeLat, placeLng, details['date']);
            })
            .then((weatherData) => {
                // console.log(JSON.stringify(weatherData));
                //Storing the weather details
                details['temperature'] = weatherData['data'][0]['temp'];
                details['weather_condition'] = weatherData['data']['0']['weather']['description'];

                //Calling Pixabay API to fetch the img of the city
                return getImage(details['to']);
            })
            .then((imageDetails) => {
                // console.log(JSON.stringify(imageDetails));
                if (imageDetails['hits'].length > 0) {
                    details['cityImage'] = imageDetails['hits'][0]['webformatURL'];
                }
                //send response back to submit function
                res.send(details);
            });

    } catch (e) {
        console.log('error', e);
    }

});

// Function to get Geo stats
async function getGeoDetails(to) {
    const response = await fetch(geoNames_BaseUrl + to + '&maxRows=10&username=' + apiKeys.geo_username);
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

//Function to get weather data
async function getWeatherData(toLat, toLng, date) {

    // Getting the timestamp for the current date and traveling date for upcoming processing.
    const timestamp_trip_date = Math.floor(new Date(date).getTime() / 1000);
    const todayDate = new Date();
    const timestamp_today = Math.floor(new Date(todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()).getTime() / 1000);

    let response;
    // Check if the date is gone and call the appropriate endpoint.
    if (timestamp_trip_date < timestamp_today) {
        let next_date = new Date(date);
        next_date.setDate(next_date.getDate() + 1);
        response = await fetch(weatherBitHistory_BaseUrl + toLat + '&lon=' + toLng + '&start_date=' + date + '&end_date=' + next_date + '&key=' + apiKeys.weather_bit_key)
    } else {
        response = await fetch(weatherBitForecast_BaseUrl + toLat + '&lon=' + toLng + '&key=' + apiKeys.weather_bit_key);
    }

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e)
    }
}

// function to get image
async function getImage(toCity) {
    const response = await fetch(pixabay_BaseUrl + apiKeys.pixaba_key + '&q=' + toCity + ' city&image_type=photo');
    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

module.exports = app;
