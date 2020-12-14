const details = {};

const trip_details_section = document.getElementById('trip-details-page');
const plan_trip = document.getElementById('book-page');

// submit data to the server
function handleSubmit(e) {
    e.preventDefault(); //Prevent default behaviour to stop page reload

    // Getting elements value from DOM
    details['from'] = document.getElementById('from_place').value;
    details['to'] = document.getElementById('to_place').value;
    details['date'] = document.getElementById('travel_date').value;
    details['daystogo'] = date_diff_indays(details['date']);

    try {
        postData(details).then((data) => {
            //Receiving the data from server and updating the UI
            updateUI(data);
        })
    } catch (e) {
        console.log('error', e);
    }

}

// post data to the server
async function postData(details) {
    const response = await fetch('http://localhost:8080/postData', {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(details)
    });

    try {
        return await response.json();
    } catch (e) {
        console.log('error', e);
    }
}

//Updating the UI
function updateUI(data) {
    // make trip details section visable
    trip_details_section.classList.remove('invisible');
    trip_details_section.scrollIntoView({ behavior: "smooth" });

    // Getting elements from DOM
    let destination_details = document.getElementById("destination");
    let boarding_details = document.getElementById("boarding");
    let departure_date = document.getElementById("departing_date");
    let number_of_days = document.getElementById('number_of_days');
    let temperature = document.getElementById('temperature');
    let dest_image = document.getElementById('dest_image');
    let weather = document.getElementById('weather');

    // set data to fields
    destination_details.innerHTML = data.to;
    boarding_details.innerText = data.from;
    departure_date.innerHTML = data.date;

    // if day in past show that
    if (data.daystogo < 0) {
        document.querySelector('#days_to_go_details').innerHTML = 'Seems like you have already been to the trip!';
    } else {
        number_of_days.innerHTML = data.daystogo;
    }
    temperature.innerHTML = data.temperature + '&#8451;';
    if (data.cityImage !== undefined) {
        dest_image.setAttribute('src', data.cityImage);
    }
    // show temperature values
    weather.innerHTML = data.weather_condition;
}

// get difference between some date and today
let date_diff_indays = function (date1) {
    let dt1 = new Date(date1);
    let dt2 = new Date();
    return Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24));
};

// export function
export {
    plan_trip,
    handleSubmit,
    trip_details_section
}