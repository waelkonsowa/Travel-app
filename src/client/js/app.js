import  {handleSubmit} from "./handleSubmit";

// register remove trip btn
const remove_trip = document.getElementById('remove_trip').addEventListener('click', function (e) {
    document.getElementById('trip_data_form').reset();
    // trip_details_section.classList.add('invisible');
    document.getElementById('trip-details-page').classList.add('invisible');
    // location.reload();
});

// register get data btn
// document.getElementById("trip_data_submit").addEventListener("click", handleSubmit);
document.getElementById("trip_data_form").addEventListener("submit", handleSubmit);

// export remove trip
export {
    remove_trip,
}