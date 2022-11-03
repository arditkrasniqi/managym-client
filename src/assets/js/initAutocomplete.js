function initAutocomplete() {
    // This example adds a search box to a map, using the Google Place Autocomplete
    // feature. People can enter geographical searches. The search box will return a
    // pick list containing a mix of places and predicted search terms.

    // This example requires the Places library. Include the libraries=places
    // parameter when you first load the API. For example:
    // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
    // Create the search box and link it to the UI element.
    if(document.getElementById('google-input') !== null){
        var input = document.getElementById('google-input');
        input.setAttribute('placeholder','City');
        var searchBox = new google.maps.places.SearchBox(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
    }
}