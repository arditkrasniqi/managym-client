export default function googleSearch(){
    $('script').last().remove();
    $('.pac-container').remove();
    $('script').last().after('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDlY746TcB8H0Wg3lQcBuH-LwQs8qr3r0&libraries=places&callback=initAutocomplete"\n' +
        'async defer></script>');
    // setTimeout(console.clear,200);
}