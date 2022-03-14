/* Add2Cart result view */
var MAP_DEST_LAT = 0;
var MAP_DEST_LNG = 0;
var MAP_DRIVER_LAT = 0;
var MAP_DRIVER_LNG = 0;
var MAP_DRIVER_MARKER = null;
var MAP_DRIVER_MARKER_POSITION = null;
var map = null;
var refreshTimeout = 5000;
var MAP_READY = false;

var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;

function transition(result){
    i = 0;
    deltaLat = (result[0] - MAP_DRIVER_MARKER_POSITION[0])/numDeltas;
    deltaLng = (result[1] - MAP_DRIVER_MARKER_POSITION[1])/numDeltas;
    moveMarker();
}

function moveMarker(){
    MAP_DRIVER_MARKER_POSITION[0] += deltaLat;
    MAP_DRIVER_MARKER_POSITION[1] += deltaLng;
    var latlng = new google.maps.LatLng(MAP_DRIVER_MARKER_POSITION[0], MAP_DRIVER_MARKER_POSITION[1]);
    //marker.setTitle("Latitude:"+position[0]+" | Longitude:"+position[1]);
    MAP_DRIVER_MARKER.setPosition(latlng);
    if(i!=numDeltas){
        i++;
        setTimeout(moveMarker, delay);
    }
}

function handleMapReady() {
	var driverPos = {lat: parseFloat(MAP_DRIVER_LAT), lng: parseFloat(MAP_DRIVER_LNG)};
    var destPos = {lat: parseFloat(MAP_DEST_LAT), lng: parseFloat(MAP_DEST_LNG)};
    MAP_DRIVER_MARKER_POSITION = [driverPos.lat, driverPos.lng];
  
    map = new google.maps.Map(document.getElementById('map_holder'), {
      	zoom: 18,
      	center: driverPos
    });          

    var start = new google.maps.LatLng(driverPos.lat, driverPos.lng);
    var end = new google.maps.LatLng(destPos.lat, destPos.lng);

    var directionsDisplay = new google.maps.DirectionsRenderer({
      	suppressMarkers: true,
		polylineOptions: {
      		strokeColor: "red"
    	}      
    });// also, constructor can get "DirectionsRendererOptions" object
    directionsDisplay.setMap(map); // map should be already initialized.

    var request = {
      	origin : start,
      	destination : end,
      	travelMode : google.maps.TravelMode.DRIVING
    };
  
    var directionsService = new google.maps.DirectionsService(); 
    directionsService.route(request, function(response, status) {
      	console.log(response);
      	if (status == google.maps.DirectionsStatus.OK) {
        	directionsDisplay.setDirections(response);
			var leg = response.routes[ 0 ].legs[ 0 ];
  			makeMarker( leg.start_location, map, "Driver", "http://maps.google.com/mapfiles/ms/icons/red-dot.png" );
  			makeMarker( leg.end_location, map, "Destination", "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" );
          	MAP_READY = true;
      	}
    });  
}

function updateCoordPoints(lat, lng) {
  	if(MAP_DRIVER_MARKER != null) {
      	//MAP_DRIVER_MARKER.setPosition( new google.maps.LatLng( lat, lng ) );
      	transition([lat, lng]);
      	//map.panTo( new google.maps.LatLng( lat, lat ) );  
    }
}

// Custom marker
function makeMarker( position, map, title, icon ) {
  	if(title == "Driver") {
        MAP_DRIVER_MARKER = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,      
            title: title
        });
        var driverInfoWindow = new google.maps.InfoWindow({
        	content: "Driver"
        });
      	driverInfoWindow.open(map, MAP_DRIVER_MARKER);
    } else {
        var destMarker = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,      
            title: title
        });
        var destInfoWindow = new google.maps.InfoWindow({
        	content: "Destination"
        });
      	destInfoWindow.open(map, destMarker);      
    }
}

window.MyaccountView = Backbone.View.extend({
	
    //el: Foodon_JQuery('<div></div>').attr('class', 'myaccount'),
    el: '#menu',
    holder: Foodon_JQuery('<div></div>'),
	back2Menu: true,
  	updateTimer: null,
    
    /*events: {
        'click .view_order' : 'doViewOrder',
        'click .cancel_order' : 'doCancelOrder',
        'click #recent_order' : 'doShowRecentOrder',
        'click #back_to_menu' : 'takeUserToMenu'
    },*/
    
	// Render home
	renderHome: function(json)	{
		var self = this;
		
        // Load template
        utils.loadTemplate('MyaccountHome.html', json, function(html)	{
            self.$el.html(html);
			Foodon_JQuery('#map_holder_fixed').hide();
			// Attach events
			Foodon_JQuery('.view_order').click(function(e) {
				self.doViewOrder(e);
			});
			Foodon_JQuery('.cancel_order').click(function(e) {
				self.doCancelOrder(e);
			});
			Foodon_JQuery('.track_order').click(function(e) {
				self.doTrackOrder(e);
			});
			Foodon_JQuery('#recent_order').click(function(e) {
				self.doShowRecentOrder(e);
			});
			Foodon_JQuery('#back_to_menu').click(function(e) {
				self.takeUserToMenu(e);
			});
			Foodon_JQuery('#map_holder_close').click(function(e) {
              	Foodon_JQuery('#map_holder').html('');
				Foodon_JQuery('#map_holder_fixed').hide();
              	if(self.updateTimer != null)
                  	window.clearTimeout(self.updateTimer);
			});
        });		
	},
    
    // Render order
    renderOrder: function(json) {
        var self = this;
        
        // Load template
        utils.loadTemplate('MyaccountViewOrder.html', json, function(html)	{
            Foodon_JQuery('#myaccount_content').html(self.holder.html(html));
        });		
    },
    
    // View order
    doViewOrder: function(e) {
        e.preventDefault();
		
		// Back to myaccount
		this.back2Menu = false;
		
        var self = Foodon_JQuery(e.currentTarget);
        var myac = new MyAccount();
        myac.viewOrder(self.attr('href'));
    },
  
	// View order
    doTrackOrder: function(e) {
        e.preventDefault();
      	var self = this, elem = Foodon_JQuery(e.currentTarget);
      	var order_id = elem.attr('href');
        var xmlhttp = new Ajax();
        var target = utils.url('/myaccount/getPos', {'id': config.id, 'order_id': order_id});
        // Ajax
        xmlhttp.send({
            url: target,
            success: function(response)	{
                var json = Foodon_JQuery.parseJSON(response);
                if(json.status == 200)	{
                  	// Load Map
                    MAP_DEST_LAT = json.dest_lat;
                    MAP_DEST_LNG = json.dest_lng;
                    //MAP_DRIVER_LAT = json.driver_lat;
                    //MAP_DRIVER_LNG = json.driver_lng;
                  	MAP_DRIVER_LAT = "13.0470997";
                  	MAP_DRIVER_LNG = "80.1791133";                  
                  
                    Foodon_JQuery('#map_holder_fixed').show();      
                    if (typeof google === 'object' && typeof google.maps === 'object') {
                        handleMapReady();
                    } else {
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = "http://maps.google.com/maps/api/js?key=AIzaSyBNs0Oy7eB0gmCgu-9wE6YjGAAlxTL6FLQ&sensor=false&callback=handleMapReady";
                        document.body.appendChild(script);
                    }
                  
                  	// Update Coords
                  	self.updateTimer = window.setTimeout(function() {
                      	self.updateCoords(order_id);
                    }, refreshTimeout);
                }
                else
                  	alert(json.errorMessage);
            }
        });      
    },
  
  	updateCoords: function(order_id) {
      	var self = this;
        var xmlhttp = new Ajax();
        var target = utils.url('/myaccount/getPos', {'id': config.id, 'order_id': order_id});
      
      	if(!MAP_READY) {
          	return;
            // Do it again
            self.updateTimer = window.setTimeout(function() {
              self.updateCoords(order_id);
            }, refreshTimeout);              	
        }
      
        // Ajax
        xmlhttp.send({
            url: target,
          	animate: false,
            success: function(response)	{
                var json = Foodon_JQuery.parseJSON(response);
                if(json.status == 200)	{
                  	// Load Map
                  	if(MAP_DRIVER_LAT != json.driver_lat || MAP_DRIVER_LNG != json.driver_lng) {
                        MAP_DRIVER_LAT = json.driver_lat;
                        MAP_DRIVER_LNG = json.driver_lng;
                      	updateCoordPoints(MAP_DRIVER_LAT, MAP_DRIVER_LNG);
                    }
                }
              	// Do it again
                self.updateTimer = window.setTimeout(function() {
                  self.updateCoords(order_id);
                }, refreshTimeout);              	
            }
        });
    },
    
    // Cancel order
    doCancelOrder: function(e) {
        e.preventDefault();
        var self = Foodon_JQuery(e.currentTarget);
        if(confirm('Are you sure you want to cancel this order?')) {
            var myac = new MyAccount();
            myac.cancelOrder(self.attr('href'));
        }
    }, 
    
    
    // Recent order
    doShowRecentOrder: function(e) {
        e.preventDefault();
        var myac = new MyAccount();
        myac.showHome();
    },    
	
    // Recent order
    takeUserToMenu: function(e) {
        e.preventDefault();
		
		if(this.back2Menu) {
			this.back2Menu = !(this.back2Menu);
			if(config.id != null) {
				var menu = new Menu();
				menu.getMenu();
			}
			else {
				var storelocate = new StoreLocate();
				storelocate.getCity();            
			}
		}
		else {
			this.back2Menu = !(this.back2Menu);
			Foodon_JQuery('#myaccount').trigger('click');
		}		
    }
});