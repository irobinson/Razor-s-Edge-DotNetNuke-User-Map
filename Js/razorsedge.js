$(document).ready(function(){
  $('#selected-user').change(function(){
      var selectedAddress = $(this).val();
      if (selectedAddress.length > 0) {
        $('#selected-address #address').html(selectedAddress);
        $('#selected-address, #directions').show();
        $('#map_canvas').gmap3(
        {
            action: ':addMarker', 
            args:{
              address: selectedAddress,
              map:{
                center: true,
                zoom: 14
              }
            }
        },
        {action: 'enableScrollWheelZoom'}
        );
      }
    });
    
    $('#get-directions').click(function(e){
      e.preventDefault();
      initialize();
    });
});

var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();

function initialize() {
  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      setUpMap(position.coords.latitude,position.coords.longitude);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  // Try Google Gears Geolocation
  } else if (google.gears) {
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      setUpMap(position.latitude,position.longitude);
    }, function() {
      handleNoGeoLocation(browserSupportFlag);
    });
  // Browser doesn't support Geolocation
  } else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
  
  function setUpMap(latitude,longitude){
    var selectedAddress = $('#selected-user').val();
    console.log(latitude + ', ' + longitude);
    $('#map_canvas').gmap3({ 
      action:':getRoute',
      args:{
        options:{
            origin: latitude + ', ' + longitude,
            destination:selectedAddress,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        },
        callback: function(id, results){
          $('#'+id).gmap3({
            action:':setDirections',
            args:{ directions: results }
          });
        }
      }
    });
  }
  
  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    //map.setCenter(initialLocation);
  }
}