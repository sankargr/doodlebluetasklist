var app = new Vue({
    el: '#orderingarootpp',
    data: {
        //baseUrl: "http://localhost:3000/ecomApi",
      
        baseUrl: "//erp.possier.com/ecomApi",
        baseImageUrl: "//erp.possier.com/uploads/menu",
        isMobileView: false,
        showSpinner: false,
        currentPage: "location",
        showLocationPopup: true,
        storeId: null,
        apiToken: OrderingAppConfig.apiToken,
        key: OrderingAppConfig.key,
        key: OrderingAppConfig.key,
        userToken: null,
        lastOrder: null,
        addressfocus:false,
        showTracking: false,
		trackTimer: null,
        availOrderTypes: {},
        chosenOrderType: 1,
        chosenAddressInfoType:1,
        orderSource: 0,
        onLocationFocus: false,
        onCityFocus: false,
        showVegOnly: false,
        showNonVegOnly: false,
        cityList: [],
        areaList: [], /* {}*/
        locations: null,
        onAreaFocus: false,
        inpCitySearch: null,
        inpAreaSearch: null,
        inpMenuSearch: null,
		inpCategorySearch: null,
        selectedCity: null,
        selectedArea: null,
        latitude: null,
        longitude: null,
        showSubStores: false,
        subStores: [],
        map: null,
        selectedOutlet: null,
        orderingStore: null,
        mobilePageTitle: "",
        mobileMenuPageTitle: "",
        mobileBackCallback: null,
        menu: null,
        favouriteItems: [],
        favouriteTitle: null,
        avgTime: 0,
        minOrder: 0,
        activeCat: null,
        activeSubCat: null,
        showCart: false,
        cart: {},
        cartBill: {},
        activePopWindow: null,
        timeSlots: {},
        mob_category: null,
        expand_item:null,
        expand_itemcontent:null,
        account_verify: "",
        fgtpswd_number: "",
        fgtpswd_verify: "",
        existing_address: [],
        order_history: "",
        addAddressForm: {
            address: "",
            doornumber: "",
            area: "",
            postcode: "",
            landmark: "",
            lat: 0,
            lng: 0
        },
        mobileheadervalues: {
            pageTitle:false,
            storelocation:null,
            backArrow:false,
            menuicon:true,
            carticon:false,
            searchicon:false,
            locationicon:false
        },
        headervalues:true,
        resetPasswordForm: {
            password: "",
            newPassword: "",
            user_id: "",
            otp: "",
            // id:""
        },
        loginForm: {
            username: "",
            password: ""
        },
        signupForm: {
            phone: "",
            email: "",
            name: "",
            password: "",
            // restaurant: "",
            key: "",
            // signed_with: 1
        },
        checkout: {
            email: "",
            mobile: "",
            name: "",
            lat: "",
            lng: "",
            terms_condition: 1,
            dd_date: "",
            dd_time: "",
            dd_today_time: "",
            dd_tomorrow_time: "",
            instructions: "",
            landmark: "",
            payment: 2,
            address: "",
            area: "",
            postcode: ""
        },
        thankyou: {
            restaurant_address: "",
            order_id: "",
            dd_date: "",
            dd_time: ""
        },
        vieworders: {
            customer_address: "",
            customer_area: "",
            restaurant_address: "",
            order_id: "",
            dd_date: "",
            dd_time: "",
            menu_items: "",
            packing_charges: "",
            tax: "",
            subtotal: "",
            total: "",
            discount: ""
        },
        mapLatLng: {
            map_dest_lat: "",
            map_dest_ng: "",
            map_driver_lat: "",
            map_driver_lng: ""
        },
        cat: "",
        active_day: "today",
        authorized_user: null,
        cartId: null,
        coupon_code: "",
        error_couponCode: "",
        is_coupon_code: false,
        is_search: false,
        refreshTimeout: 5000,
        map_driver_marker_position: null,
        map_driver_marker: null,
        trackOrderId: '',
        trackorders:{},
        trackcoords:null,
        trackorderresponse:{},
        numDeltas: 100,
        tax: null,
        i: 0,
        delay: 10,
        isClickSubCat: false,
        chekoutData: null,
        orderSource: 0,
        mob_detect: false,
        modify: false,
        modifiers: null,
        modify_item: null,
        modifiers_price: '',
        modifiersAddons:{},
        addonItems: '',
        checked_mod_price: [],
        inpCitySearchMob: null,
        inpAreaSearchMob: null,
        finalTotal: 0,
        retryCart: null
    },
    mounted: function () {
        if ($('#header .user_login').css('display') != 'block')
            this.isMobileView = true;

        this.userToken = window.localStorage.getItem("authToken");
        this.authorized_user = window.localStorage.getItem("authorized_user");
        // Initiate - Load city data
        // this.loadFromServer("/locations?return=json&key="+this.key, this.loadCityData);

		/*window.addEventListener('hashchange', function() {
		  console.log("The hash has changed!" + window.location.hash);
		}, false);*/
		
        // Jquery events
        var self = this;
        $(document).mouseup(function (e) {
            var container = $(".type_to_search");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                self.onCityFocus = false;
                self.onAreaFocus = false;
            }
            
			var container1 = $(".mobile_category_list");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container1.is(e.target) && container1.has(e.target).length === 0) {
                self.mob_category = "";
                self.expand_item="";
                // self.onAreaFocus = false;
            }
			
            var container2 = $(".locations");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container2.is(e.target) && container2.has(e.target).length === 0) {
                self.onLocationFocus = false;
            }
        });

        $(window).scroll(function (e) {
            if (self.isClickSubCat == false) {
                //console.log(self.isClickSubCat);
                var els = $(".sub_cat_header h4");
                Object.keys(els).forEach(function (el) {
                    // console.log(els[el].offsetTop);
                    self.isElementVisible(els[el]);
                    if (self.isElementVisible(els[el]) == true) {
                        self.menu.sub_category[self.cat.id].forEach(function (scat) {
                            if (scat.name == els[el].innerHTML) {
                                // console.log(scat.name);
                                self.activeSubCat = scat.id;
                                // $('html , body').scrollLeft('#scat_' + scat.id);
                                // console.log($('html , body').scrollLeft('#scat_' + scat.id));
                            }
                        });
                    }
                });
            }
            // else{
            //    self.isClickSubCat = false;
            // }
        });
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            this.mob_detect = true;
        }
        else {
            this.mob_detect = false;
        }
        if (this.mob_detect == true) {
            this.orderSource = 4;
        }

        // Check for payment
        var cart = window.localStorage.getItem("cart");
        if (cart) {
            cart = JSON.parse(cart);
            if (cart.id) {
                // Check if payment submitted
                var parser = document.createElement('a');
                parser.href = document.location;
                var hash = parser.hash;
                //console.log(hash);
                if (hash.length > 0) {
                    var hash_params = hash.split('&');
                    ////console.log(hash_params);
                    if (hash_params[0] && (hash_params[0] == '#payment_status=0' || hash_params[0] == '#payment_status=1')) {
                        if (hash_params[0] == '#payment_status=0') {
                            // Failed
                            this.showLocationPopup = false;
                            this.activePopWindow = "payment_failed";
                            this.retryCart = cart;
                        } else {
                            // Payment success
                            this.showLocationPopup = false;
                            this.loadFromServer("/completeOrder?key=" + this.key + "&id=" + cart.id, this.confirmCheckout,
                                "POST", { id: cart.id });
                        }
                    }
                }
            }
        }
    },
    methods: {
        // API request handler
        buildUrl: function (targetUrl) {
            // return this.baseUrl + targetUrl + "?api_token=" + this.apiToken + 
            //     "&store_id=" + this.key;
            return this.baseUrl + targetUrl;/* +  
                "&key=" + this.key;*/
        },
        loadFromServer: function (targetUrl, callback, type, params, hideLoading) {
            this.showSpinner = hideLoading ? false : true;

            var vueApp = this;
            $.ajax({
                method: type ? type : "GET",
                data: params,
                headers: {
                    "Authkey": this.userToken
                },
                url: vueApp.buildUrl(targetUrl),
                success: function (respose) {
                    if (callback) callback(respose);
                },
                complete: function () {
                    vueApp.showSpinner = false;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },
		doSearch: function(evt) {
			this.inpMenuSearch = evt.target.value;
		},
		searchCategory: function(evt) {
			this.inpCategorySearch = evt.target.value;
		},
        filterCity: function (evt) {
            var self = this;
            if (evt.target.value && evt.target.value.length >= 2) {
                /*return this.cityList.filter(item => {
                    return item.text.toLowerCase().includes(this.inpCitySearch.toLowerCase());
                });*/
                this.loadFromServer("/getPlaces", function (resp) {
                    if (resp.status == "OK") {
                        this.cityList = resp.predictions;
                    } else
                        this.cityList = [];
                }.bind(this), "POST", { str: evt.target.value }, true);
            }
            else if (this.inpCitySearchMob && this.inpCitySearchMob.length >= 2) {
                return self.cityList.filter(function (item) {
                    return item.text.toLowerCase().includes(self.inpCitySearchMob.toLowerCase());
                });
            } else
                this.cityList = [];
        },
        onChangeLocation: function () {
            this.mobileheadervalues.backArrow=false;
            this.mobileheadervalues.searchicon=false;
            this.mobileheadervalues.locationicon=false;
            this.mobileheadervalues.storelocation=null;
            this.currentPage = "location";
            this.showLocationPopup = true;
        },
        closeTracking:function(){
            this.showTracking = false;
            window.clearTimeout(this.trackcoords);

        },
        profileDropdown:function(){
            document.getElementById("myDropdown").classList.toggle("show");
            window.onclick = function (event) {
                if (!event.target.matches('.dropbtn')) {
                    var dropdowns = document.getElementsByClassName("dropdown-content");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                        }
                    }
                }
            }
        },
        closeLocationPopup: function () {
            if (this.selectedArea) {
                this.currentPage = "home";
                this.showLocationPopup = false;
            }
        },
        loadCityData: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                if (resp.stores.length > 0) {
					// Routing
					window.location = "#home";
					
                    this.mobileheadervalues.locationicon =true;
                    this.currentPage = "home";
                    this.showLocationPopup = false;

                    // Load order types
                    resp.orderTypes.forEach((ot) => {
                        this.availOrderTypes[ot.type] = ot._id;
                    });
                    //console.log(resp);
					/*Object.keys(resp.city).forEach(key => {
					   this.cityList.push({key: key, text: resp.city[key]}); 
					});*/

                    // Area List
                    //console.log("loadcitydata",resp);
                    this.locations = resp;
					window.setTimeout(() => {
						this.showSpinner = true;
						this.setupMenu(resp.stores[0]);						
					}, 1000);
                    
                    //console.log(this.locations);
					/*Object.keys(resp.area).forEach(cityId => {
						this.areaList[cityId] = {};
						Object.keys(resp.area[cityId]).forEach(orderType => {
							this.areaList[cityId][orderType] = [];
							Object.keys(resp.area[cityId][orderType]).forEach(areaLabel => {
								 this.areaList[cityId][orderType].push({
									text: areaLabel,
									id: resp.area[cityId][orderType][areaLabel].id,
									areaId: resp.area[cityId][orderType][areaLabel].area_id,
									store_id: resp.area[cityId][orderType][areaLabel].store_id
								});
							});
						});
					});*/

                    // Auto detect location
                    // this.showSpinner = true;
                    // this.handleDetectLocation();
                    // if(resp.recent_orders.length > 0) {
                    //     this.lastOrder = resp.recent_orders[0];
                    // }					
                } else {
                    this.selectedCity = null;
                    this.selectedArea = null;
                    this.currentPage = "location";
                    this.showLocationPopup = true;
                    alert("No restaurants are found in your location. Please change your delivery location.");
                }
            } else
                alert("Something went wrong. Please reload.");
        },
        selectCity: function () {
            if (this.orderSource == 0) {
                this.onCityFocus = true;
                this.inpCitySearch = '';
                this.onAreaFocus = false;
            }
            else if (this.orderSource == 4) {
                this.activePopWindow = "mob_select_city";
            }
        },
        selectLocation: function () {
            if (this.orderSource == 0) {
                this.onAreaFocus = true;
                this.inpAreaSearch = ''
            }
            else if (this.orderSource == 4) {
                this.activePopWindow = "mob_select_location";
            }
        },
        onSelectCity: function (item) {
            /*this.selectedCity = item.key;
            this.selectedArea = null;
            this.inpCitySearch = item.text;
            this.inpAreaSearch = null;
            this.onCityFocus = false;
			//console.log(this.locations[item.text]);
            // this.areaList.push(this.locations[item.text])
            if(this.isMobileView) {
                this.activePopWindow = "mob_select_location";
            }
             // Focus on location
            this.$refs.loc_search.focus();*/
            this.loadFromServer("/getPlaceLatLng", function (resp) {
                // console.log("location1",resp);
                this.selectedArea = resp.result.name;
                this.latitude = resp.result.geometry.location.lat;
                this.longitude = resp.result.geometry.location.lng;
                // city
                resp.result.address_components.forEach(item => {
                    item.types.forEach(tp => {
                        if (tp == "locality") {
                            this.selectedCity = item.short_name;
                        }
                    });
                });
                // Load data
                this.loadFromServer("/locations?return=json&key=" + this.key + "&lat=" + this.latitude +
                    "&lng=" + this.longitude, this.loadCityData);
            }.bind(this), "POST", { id: item.place_id });

        },
        onSelectArea: function (item) {
            //console.log(item);
            this.selectedArea = item.text;
            this.inpAreaSearch = item.text;
            this.selectedOutlet = null;
            this.onAreaFocus = false;
            this.showLocationPopup = false;
            if (this.isMobileView) {
                this.activePopWindow = " ";
            }

			/*if(Array.isArray(item.store_id)) {
				// Show store seletion
				this.showSubStores = true;
				this.subStores = item.store_id;
			} else {
				// Now load menu of selected store
				this.renderMenu();
				this.loadFromServer('/venue?return=json&city=' + this.inpCitySearch + '&key=' + this.key + 
					'&location=' + this.selectedArea, this.setupMenu);				
			}*/
        },
        onChangeOrderType: function (orderType) {
            this.chosenOrderType = orderType;
        },
        onChangeAddressInfoType: function (orderType) {
            this.chosenAddressInfoType = orderType;
        },
        onAddressFocus: function () {
            this.addressfocus = true;
            document.getElementById("user-address-focus").focus();
        },
        doLoadMenu: function () {
            // Now load menu of selected store
            this.showSubStores = false;
            this.subStores = [];
            this.renderMenu();
            this.loadFromServer('/venue?return=json&city=' + this.inpCitySearch + '&key=' + this.key +
                '&location=' + this.selectedArea, this.setupMenu);
        },
        doShowTrack: function () {
            //console.log("doShowTrack");
            if (this.lastOrder && this.lastOrder.status == "Waiting for Confirmation") {
                this.showTracking = true;
                // Load map
                var self = this;
                window.setTimeout(function () {
                    self.map = new google.maps.Map(document.getElementById('maps'), {
                        zoom: 18,
                        center: new google.maps.LatLng(13.88, 13.86)
                    });

                }, 100);
            }
        },
        doShowVegItem: function (event) {
			this.showNonVegOnly = false;
            this.showVegOnly = event.target.checked;
			if(this.showVegOnly) {
				window.setTimeout(() => {
					$('.main_group').each(function() {
						if($('.item', this).length == 0) {
							$(this).remove();
						}
					});
				}, 250);				
			}
        },
        doShowNonVegItem: function (event) {
            this.showVegOnly = false; 
			this.showNonVegOnly = event.target.checked;
			if(this.showNonVegOnly) {
				window.setTimeout(() => {
					$('.main_group').each(function() {
						if($('.item', this).length == 0) {
							$(this).remove();
						}
					});
				}, 250);				
			}
        },    
        handleCallDriver:function(trackorders){
            console.log("trackss",trackorders)
            var phone = trackorders.driver.phone;
            var link = "tel:"+phone;
            window.location.href = link;
        },
        doTrackOrder: function (e, item) {
            e.preventDefault();
            
            this.trackorders = item;
            //console.log("trackorders",item);
            var self = this; //elem = Foodon_JQuery(e.currentTarget);
            self.trackOrderId = item.id;//elem.attr('href');
            // var xmlhttp = new Ajax();
            // var target = utils.url('/myaccount/getPos', {'id': config.id, 'order_id': order_id});
            // Ajax
            this.loadFromServer("/getPos?key=" + this.key+"&order_id="+this.trackOrderId, this.doTrackOrderResponse,
                "POST", { order_id: this.trackOrderId, id: this.key });
                // if(this.showTracking){
                //     window.setInterval(() => {
                //         this.loadFromServer("/myaccount/getPos?key=" + this.key, this.doTrackOrderResponse,
                //     "POST", { order_id: this.trackOrderId, id: this.key });
                //       }, 5000)
                //     }
        },
        doTrackOrderResponse: function (resp) {
            //console.log("trackresponse",resp);
            if (resp.status == 200) {
               this.trackorderresponse = resp;
               this.showTracking = true;
                this.mapLatLng.map_dest_lat = resp.dest_lat;
                this.mapLatLng.map_dest_lng = resp.dest_lng;
                this.mapLatLng.map_driver_lat = resp.driver_lat;
                this.mapLatLng.map_driver_lng = resp.driver_lng;
                if(this.showTracking == true){
					this.handleMapReady();
                }
            }
        },
        handleMapReady: function () {
            var driverPos = { lat: parseFloat(this.mapLatLng.map_driver_lat), lng: parseFloat(this.mapLatLng.map_driver_lng) };
            var destPos = { lat: parseFloat(this.mapLatLng.map_dest_lat), lng: parseFloat(this.mapLatLng.map_dest_lng) };
            //console.log(driverPos.lat);
            //console.log(driverPos.lng);
            this.map_driver_marker_position = [parseFloat(driverPos.lat), parseFloat(driverPos.lng)];
            //console.log(this.map_driver_marker_position[0]);
            var self = this;
            this.trackcoords =  window.setTimeout(function () {
                self.map = new google.maps.Map(document.getElementById('maps'), {
                    zoom: 20,
                    center: driverPos
                });
                //console.log(self.map);
                var start = new google.maps.LatLng(driverPos.lat, driverPos.lng);
                var end = new google.maps.LatLng(destPos.lat, destPos.lng);

                var directionsDisplay = new google.maps.DirectionsRenderer({
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "red"
                    }
                });// also, constructor can get "DirectionsRendererOptions" object
                directionsDisplay.setMap(self.map); // map should be already initialized.

                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                var directionsService = new google.maps.DirectionsService();
                directionsService.route(request, function (response, status) {
                    //console.log(response);
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        var leg = response.routes[0].legs[0];
                        //console.log(self.map);
                        self.makeMarker(leg.start_location, self.map, "Driver",'images/driver_marker.png');
                        self.makeMarker(leg.end_location, self.map, "Destination", "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
                        // MAP_READY = true;
                    }
                });
            }, 100);
			
             /*window.setTimeout(function () {
                    self.updateCoords(self.trackOrderId);
                }, self.refreshTimeout);*/			
        },
        makeMarker: function (position, map, title, icon) {
            //console.log("in");
            if (title == "Driver") {
                //console.log(position);
                //console.log(map);
                //console.log(title);
                //console.log(icon);
                this.map_driver_marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: {
						url: icon,
						scaledSize: new google.maps.Size(40, 40)
					}
                    //title: title
                });
                /*var driverInfoWindow = new google.maps.InfoWindow({
                    content: "Driver"
                });
                driverInfoWindow.open(map, this.map_driver_marker);*/
            } else {
                var destMarker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: icon
                    //title: title
                });
                /*var destInfoWindow = new google.maps.InfoWindow({
                    content: "Destination"
                });
                destInfoWindow.open(map, destMarker);*/
            }
        },
        updateCoordPoints: function (lat, lng) {
            //console.log("updateCoordPoints");
            if (this.map_driver_marker != null) {
                //MAP_DRIVER_MARKER.setPosition( new google.maps.LatLng( lat, lng ) );
                this.transition([lat, lng]);
                //map.panTo( new google.maps.LatLng( lat, lat ) );  
            }
        },
        transition: function (result) {
            // console.log("innnnnnnnnnn");
            // console.log(result);
            // console.log(this.map_driver_marker_position[0]);
            // console.log(result[0]);
            // console.log(this.numDeltas);
            this.i = 0;
            deltaLat = (parseFloat(result[0]) - parseFloat(this.map_driver_marker_position[0])) / this.numDeltas;
            deltaLng = (parseFloat(result[1]) - parseFloat(this.map_driver_marker_position[1])) / this.numDeltas;
            // console.log(deltaLat);
            // console.log(deltaLng);
            this.moveMarker(deltaLat, deltaLng);
        },
        moveMarker(deltaLat, deltaLng) {
            this.map_driver_marker_position[0] += deltaLat;
            this.map_driver_marker_position[1] += deltaLng;
            // console.log(this.map_driver_marker_position);
            var latlng = new google.maps.LatLng(this.map_driver_marker_position[0], this.map_driver_marker_position[1]);
            //marker.setTitle("Latitude:"+position[0]+" | Longitude:"+position[1]);
            this.map_driver_marker.setPosition(latlng);
            if (this.i != this.numDeltas) {
                this.i++;
                var self = this;
                setTimeout(function () {
                    self.moveMarker(deltaLat, deltaLng);
                }, this.delay);

            }
        },
        updateCoords: function (order_id) {
            // this.loadFromServer("/myaccount/getPos?key=" + this.key, this.updateCoordsResponse,
            //     "POST", { order_id: order_id, id: this.key }, true);
            this.loadFromServer("/getPos?key=" + this.key+"&order_id="+order_id,this.updateCoordsResponse,
            "POST", { order_id: order_id, id: this.key }, true);
        },
        updateCoordsResponse: function (resp) {
            var self = this;
            console.log("coordinate response",resp);
            if (resp.status == 200) {
                //console.log(this.mapLatLng.map_driver_lat);
                //console.log(resp.driver_lat);
                // if(this.mapLatLng.map_driver_lat != resp.driver_lat || this.mapLatLng.map_driver_lng != resp.driver_lng) {
                //console.log("iam innn");
                // this.map_driver_marker_position[0] = parseFloat(resp.driver_lat);
                // this.map_driver_marker_position[1] = parseFloat(resp.driver_lng);
                self.updateCoordPoints(parseFloat(resp.driver_lat), parseFloat(resp.driver_lng));
                // }
            }
			
            self.trackTimer = window.setTimeout(function () {
                self.updateCoords(self.trackOrderId);
            }, self.refreshTimeout);

        },
        //     xmlhttp.send({
        //         url: target,
        //         success: function(response) {
        //             console.log(response);
        //             var json = Foodon_JQuery.parseJSON(response);
        //             if(json.status == 200)  {
        //                 // Load Map
        //                 MAP_DEST_LAT = json.dest_lat;
        //                 MAP_DEST_LNG = json.dest_lng;
        //                 //MAP_DRIVER_LAT = json.driver_lat;
        //                 //MAP_DRIVER_LNG = json.driver_lng;
        //                 MAP_DRIVER_LAT = "13.0470997";
        //                 MAP_DRIVER_LNG = "80.1791133";                  

        //                 Foodon_JQuery('#map_holder_fixed').show();      
        //                 if (typeof google === 'object' && typeof google.maps === 'object') {
        //                     handleMapReady();
        //                 } else {
        //                     var script = document.createElement("script");
        //                     script.type = "text/javascript";
        //                     script.src = "http://maps.google.com/maps/api/js?key=AIzaSyBNs0Oy7eB0gmCgu-9wE6YjGAAlxTL6FLQ&sensor=false&callback=handleMapReady";
        //                     document.body.appendChild(script);
        //                 }

        //                 // Update Coords
        //                 self.updateTimer = window.setTimeout(function() {
        //                     self.updateCoords(order_id);
        //                 }, refreshTimeout);
        //             }
        //             else
        //                 alert(json.errorMessage);
        //         }
        //     });      
        // },
        renderMenu: function () {
            $('html, body').scrollTop(0);
            //this.currentPage = this.isMobileView ? "mobilecategory" : "menu";
            //this.mobilePageTitle = "Categories";
           
            this.currentPage = "menu";
            
            this.mobilePageTitle = "Menu";
            this.mobileheadervalues.locationicon = true;
            this.mobileheadervalues.searchicon = true;
            //this.mobileBackLink = "location";
            var self = this;
           
            this.mobileBackCallback = function () {
                self.currentPage = "location";
                self.mobilePageTitle = "";
            };
        },
        onClickMobileCart: function () {
            this.showCart = true;

            var self = this,
                oldPageTitle = this.mobilePageTitle,
                oldBackLink = this.mobileBackCallback,
                oldPage = this.currentPage;

            this.mobilePageTitle = "Your Order";
            this.currentPage = "menu";
            this.mobileBackCallback = function () {
                this.showCart = false;
                this.currentPage = oldPage;
                this.mobilePageTitle = oldPageTitle;
                this.mobileBackCallback = oldBackLink;
            }
        },
        handleStarOrdering: function () {
            if (!this.selectedArea) {
                alert("Please choose city & location");
            } else
                this.renderMenu();
        },
        handleBack: function () {
            if (this.mobileBackCallback)
                //console.log(this.mobileBackCallback);
                // window.addEventListener("popstate",e=>{
                //     console.log(e);
                // })
                window.history.onpopstate = function(event) {
                    alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
                  };
                
                this.mobileBackCallback();
        },
        backToLocation: function () {
            this.inpCitySearch = null;
            this.inpAreaSearch = null;
            this.currentPage = 'location';
            this.showLocationPopup = true;
            this.cityList = [];
            this.mobilePageTitle = "";
        },
        onClickBanner: function (item) {
            if (item.is_clickable) {
                this.setupMenu(item.store);
            }
        },
       setupMenu:  function (resp) {
            //console.log("sd",resp);
			// Routing
			window.location = "#menu";
            this.storeId = resp.store_id;
            this.loadFromServer('/menu?return=json&key=' + this.key + '&storeId=' + resp.store_id +
                '&order_type=' + this.availOrderTypes[this.chosenOrderType], this.setupMenuResponse,
                "POST", { userData: this.userToken });
        
            this.orderingStore = [resp.name, resp.area].join(", ");
            this.mobileheadervalues.locationicon=true;
            this.mobileheadervalues.searchicon=true;
            this.mobileheadervalues.backArrow=false;
            this.mobileheadervalues.storelocation=resp.area;


            var self = this,
                oldPageTitle = this.mobilePageTitle,
                oldBackLink = this.mobileBackCallback,
                oldPage = this.currentPage;

            this.mobilePageTitle = "";
            this.currentPage = "home";
            this.mobileBackCallback = function () {
                this.showCart = false;
                this.mobileheadervalues.locationicon=true;
                this.mobileheadervalues.searchicon=false;
                this.mobileheadervalues.backArrow=false;
                this.currentPage = oldPage;
                this.mobilePageTitle = oldPageTitle;
                this.mobileBackCallback = oldBackLink;
            }

            // this.menu = resp.menu;
            // this.checkoutData = resp.checkout;
            // Setup checkout values
            // if(this.userToken) {
            //     this.checkout.name = resp.checkout.user.name;
            //     this.checkout.email = resp.checkout.user.email;
            //     this.checkout.mobile = resp.checkout.user.mobile;
            //     this.checkout.address = resp.checkout.user.address;
            //     this.checkout.area = resp.checkout.user.area;
            //     this.checkout.landmark = resp.checkout.user.landmark;
            //     this.checkout.postcode = resp.checkout.user.postcode;
            // }
        },
        expanditem:  function (resp) {
         
            this.expand_item = "expanded_image";
            this.expand_itemcontent=resp;
           
            // console.log("expandeditem",resp);

           
        },
        setupMenuResponse: function (resp) {
            //alert(JSON.stringify(resp));
            if (resp.status == 400) {
                alert(resp.message);
                return;
            } else if (resp.checkout && resp.checkout.flash_message) {
                alert(resp.checkout.flash_message);
            }

            this.menu = resp;
            this.activeCat = Object.keys(resp.categories)[0];
            this.checkoutData = resp.checkout;
            this.tax = resp.taxes;
            this.modifiers = resp.modifier;
            console.log("menu items",this.menu);
            // self.deliver_time = delivery_time;
            this.avgTime = resp.checkout.avgTime;
            this.minOrder = resp.checkout.minOrder;
            if (this.userToken) {
                this.checkout.name = resp.checkout.userData.name;
                this.checkout.email = resp.checkout.userData.email;
                this.checkout.mobile = resp.checkout.userData.mobile;
                if (resp.checkout.userData.address && resp.checkout.userData.address[0]) {
                    this.checkout.address = resp.checkout.userData.address[0].address;
                    this.checkout.area = resp.checkout.userData.address[0].area;
                    this.checkout.landmark = resp.checkout.userData.address[0].landmark;
                    this.checkout.postcode = resp.checkout.userData.address[0].postcode;
                    this.checkout.lat = resp.checkout.userData.address[0].lat;
                    this.checkout.lng = resp.checkout.userData.address[0].lng;
                }
                this.checkout.userId = this.userToken;
            }
            this.currentPage = "menu";
            $('html,body').scrollTop(0);
        },
        onClickCategory: function (item) {
            // console.log("categoryitem",item);
            // console.log(item_name);
            this.activeCat = item;
            this.activeSubCat = null;
			this.mob_category = null;
			this.inpCategorySearch = "";
            $('html, body').scrollTo('#cat_' + item.id, {}, function () { });
        },
        onClickSubCategory: function (item) {
            this.isClickSubCat = true;
            this.activeSubCat = item.id;
            $('html, body').scrollTo('#cat_' + item.id, {}, function () { });
            var self = this;
            window.setTimeout(function () {
                self.isClickSubCat = false;
            }, 10000);
        },
        onClickMobileCategory: function (item_id, item) {
            $('html, body').scrollTop(0);
            this.cat = item;
            this.currentPage = "menu";
            
     
            this.activeCat = item_id;
            // this.mobilePageTitle = item;
            //console.log(this.cat);
            //console.log(this.activeCat);
            //console.log(this.mobilePageTitle);
            // if(this.menu.sub_category[item.id] && this.menu.sub_category[item.id].length > 0) {
            //     this.activeSubCat = this.menu.sub_category[item.id][0].id;
            //     console.log(this.menu.sub_category[item.id]);
            // }
            var self = this;
            this.mobileBackCallback = function () {
                self.renderMenu();
            }
        },
        modify_close: function () {
            this.modify = false;
        },
        addToCart: function (item) {
            //var cart = JSON.parse(JSON.stringify(this.cart));
            //console.log(item);
            if (this.modifiers[item.id]) {
                //console.log(this.modifiers[item.id]);
                this.modify = true;
                this.modify_item = item;
                this.checked_mod_price = [];

                var mods = [];
                this.modifiers[item.id].forEach(mod => {
                    if (mod.maxSelection == 1) {
                        var prs = [];
                        mod.price.forEach((pr, idx) => {
                            pr.disp_price = parseFloat(pr.price) + parseFloat(item.price);
                            prs.push(pr);
							
							if(idx == 0) {
								this.checked_mod_price.push({
									title: mod.title,
									attribute: pr.attribute,
									price: pr.price								
								});
							}
                        });
                        mod.price = prs;
                    }
                    // console.log("modss", mod)
                    mods.push(mod);
                });

                this.modifiers_price = mods;

                var AddId = this.modifiers_price[0].product;
                var recommendItems = this.menu.addon_items;
                var addarr = [];
                var rarr = recommendItems[AddId];
                if (recommendItems[AddId]) {
                    for (var i = 0; i < rarr.length; i++) {
                        var idsplit = rarr[i].id.split(":");
                        addarr.push({
                            category: rarr[i].category,
                            categoryName: rarr[i].categoryName,
                            desc: rarr[i].desc,
                            ftype: rarr[i].ftype,
                            id: idsplit[0],
                            image: rarr[i].image,
                            itemType: rarr[i].itemType,
                            menuTiming: rarr[i].menuTiming,
                            modifiers: rarr[i].modifiers,
                            name: rarr[i].name,
                            price: rarr[i].price,
                        })
                    }

                }
                this.addonItems = addarr;
            } else {
                var cart_item = {
                    catId: item.category,
                    compId: "",
                    isCompliment: 0,
                    isFromRecommend: 0,
                    itemId: item.id,
                    itemName: item.name,
                    itemPrice: item.price,
                    total: item.price,
                    modifiertotal: 0,
                    itemQty: 1,
                    itemType: item.ftype,
                    unitPrice: item.price
                };
                // console.log("modss", cart_item)

                Vue.set(this.cart, item.id, cart_item);
                // update total
                this.updateTotal();
            }
        },
        addToModifyCart: function (item) {
            //var cart = JSON.parse(JSON.stringify(this.cart));
            //console.log(item);
           
                var cart_item = {
                    catId: item.category,
                    compId: "",
                    isCompliment: 0,
                    isFromRecommend: 0,
                    itemId: item.id,
                    itemName: item.name,
                    itemPrice: item.price,
                    total: item.price,
                    modifiertotal: 0,
                    itemQty: 1,
                    itemType: item.ftype,
                    unitPrice: item.price
                };

                this.modifiersAddons[item.id] = cart_item;
                //  console.log("as",this.modifiersAddons);

                // Vue.set(this.cart, item.id, cart_item);
                // // update total
                // this.updateTotal();
            
        },
		isChecked: function(mod, title) {
			//console.log(mod);
			let isChecked = false;
			if(this.checked_mod_price.length > 0) {
				this.checked_mod_price.forEach(md => {
					//console.log(md);
					if(title == md.title && md.attribute == mod.attribute) {
						isChecked = true;
					}
				});
			}
			return isChecked;
		},		
        check: function (e, mods, mod, single_select) {
            if (e.target.checked) {
                if (single_select) {
                    var new_mods = [];
                    this.checked_mod_price.forEach(function (exmod) {
                        if (exmod.title != mod.title) {
                            new_mods.push(exmod);
                        }
                    });
                    this.checked_mod_price = new_mods;
                }
                this.checked_mod_price.push({
                    title: mod.title,
                    attribute: mods.attribute,
                    price: mods.price
                })
            } else {
                this.checked_mod_price.splice(this.checked_mod_price.indexOf(mods), 1);
                this.checked_mod_price.filter(mod => {
                    //console.log(mod);
                    return mod.attribute != mods.attribute;
                })
                //console.log(this.checked_mod_price);
            }
        },
        add_modify: function () {
            var itm = this.modify_item,
        
                price = 0,
                mod_string = [],
                modifier_price = 0;
            // console.log("modifyys",itm);
            // console.log("addonsmod",this.modifiersAddons);
            if (this.checked_mod_price && this.checked_mod_price.length > 0) {
                if (!this.cart[itm.id]) {
                    var cart_item = {
                        catId: itm.category,
                        compId: "",
                        isCompliment: 0,
                        isFromRecommend: 0,
                        itemId: itm.id,
                        itemName: itm.name,
                        itemPrice: itm.price,
                        total: itm.price,
                        modifiertotal: 0,
                        itemQty: 1,
                        itemType: itm.ftype,
                        unitPrice: itm.price
                    };
                }
                Vue.set(this.cart, itm.id, cart_item);
                if (Object.keys(this.modifiersAddons).length > 0) {
                    Object.keys(this.modifiersAddons).forEach(key => {
                    var cartitem = {
                        catId: this.modifiersAddons[key].category,
                        compId: "",
                        isCompliment: 0,
                        isFromRecommend: 0,
                        itemId: this.modifiersAddons[key].id,
                        itemName: this.modifiersAddons[key].name,
                        itemPrice: this.modifiersAddons[key].price,
                        total: this.modifiersAddons[key].price,
                        modifiertotal: 0,
                        itemQty: 1,
                        itemType: this.modifiersAddons[key].ftype,
                        unitPrice: this.modifiersAddons[key].price
                    };
                    // console.log("key",key);
                    // console.log("ccartitem",this.modifiersAddons[key])
                    Vue.set(this.cart, this.modifiersAddons[key].id, cartitem);
                })
            }

                this.checked_mod_price.forEach(function (mod) {
                    //mod_string.push(mod.title + ": " + mod.attribute + " (" + mod.price + ")"); 
                    mod_string.push(mod.title + ": " + mod.attribute);
                    price += parseFloat(mod.price);
                    total = (itm.price + parseFloat(price)) * itm.show_qty;
                    modifier_price += parseFloat(price);
                });
                this.cart[itm.id].unitPrice = this.cart[itm.id].itemPrice = parseFloat(this.cart[itm.id].unitPrice + price);
                this.cart[itm.id].total = parseFloat(this.cart[itm.id].itemQty) * parseFloat(this.cart[itm.id].unitPrice);
                this.cart[itm.id].modifiertotal = modifier_price;
                this.cart[itm.id].modifierString = mod_string.join(", ");
                //console.log(this.cart[itm.id].itemPrice);
            }
            this.modify = false;
            this.checked_mod_price = [];
            this.modify_item = null;
            this.modifiersAddons=[];
            this.updateTotal();
        },
        addQty: function (item) {
            var item_id = item.id ? item.id : item.itemId;
            this.cart[item_id].itemQty = parseFloat(this.cart[item_id].itemQty) + 1;
            //console.log(this.cart[item_id].itemQty);
            this.cart[item_id].total = parseFloat(this.cart[item_id].itemQty) * parseFloat(this.cart[item_id].unitPrice);
            // update total
            if (this.is_coupon_code == true) {
                this.handleCouponCode();
            }
            else {
                this.updateTotal();
            }
        },
        removeQty: function (item) {
            var item_id = item.id ? item.id : item.itemId;
            this.cart[item_id].itemQty = parseFloat(this.cart[item_id].itemQty) - 1;
            if (this.cart[item_id].itemQty == 0) {
                delete this.cart[item_id];
            } else {
                this.cart[item_id].total = parseFloat(this.cart[item_id].itemQty) *
                    parseFloat(this.cart[item_id].unitPrice);
            }
            // update total
            if (this.is_coupon_code == true && Object.keys(this.cart).length > 0) {
                this.handleCouponCode();
            }
            else {
                this.updateTotal();
            }
            if (Object.keys(this.cart).length == 0) {
                this.is_coupon_code = false;
                this.coupon_code = "";
                this.error_couponCode = "";
            }
        },
        addModifiersQty: function (item) {
            var item_id = item.id ? item.id : item.itemId;
            this.modifiersAddons[item_id].itemQty = parseFloat(this.modifiersAddons[item_id].itemQty) + 1;
            //console.log(this.cart[item_id].itemQty);
            this.modifiersAddons[item_id].total = parseFloat(this.modifiersAddons[item_id].itemQty) * parseFloat(this.modifiersAddons[item_id].unitPrice);
            // update total
            
        },
        removeModifiersQty: function (item) {
            var item_id = item.id ? item.id : item.itemId;
            this.modifiersAddons[item_id].itemQty = parseFloat(this.modifiersAddons[item_id].itemQty) - 1;
            if (this.modifiersAddons[item_id].itemQty == 0) {
                delete this.modifiersAddons[item_id];
            } else {
                this.modifiersAddons[item_id].total = parseFloat(this.modifiersAddons[item_id].itemQty) *
                    parseFloat(this.modifiersAddons[item_id].unitPrice);
            }
           
        },
        updateTotal: function () {
            var self = this;

            //console.log(this.cart);
            Object.keys(this.cart).forEach(function (cart) {
                //console.log(self.cart[cart].itemPrice);
                self.finalTotal += parseFloat(self.cart[cart].itemPrice);
            })
            if (Object.keys(this.cart).length > 0) {
                //console.log(this.storeId);
                //console.log(this.cart);
                this.loadFromServer('/updateTotal?return=json&key=' + this.key + "&coupon_id=" + this.coupon_code,
                    this.updateTotalResponse, "POST", { storeId: this.storeId, cartItem: this.cart });
                // this.loadFromServer('/updateTotal', this.updateTotalResponse,"POST",{storeId:this.storeId,cartItem:this.cart});
            }
        },
        updateTotalResponse: function (resp) {
            //console.log(resp);
            Vue.set(this.cartBill, 'cart', resp);
            //console.log(this.cartBill);
        },
        /*updateTotalData: function(resp) {
            Vue.set(this.cartBill, 'cart', resp.cart);
        },*/
        filterMenu: function (items, item_menu) {
            // console.log(items);
            // console.log(item_menu);
            // var item_menu = {};
            // Object.keys(items.menu).forEach(key => {
            //     Object.keys(items.menu[key]).forEach(keys => {
            //         item_menu[keys] = items.menu[key][keys];
            //         // console.log(item_menu);
            //     });
            // });
            if (this.inpMenuSearch && this.inpMenuSearch.length >= 2) {
                var filterdItems = {};
                /*Object.keys(items).filter(key => {
                    Object.keys(items[key]).filter(keys => {
                        if(items[key][keys].name.toLowerCase().includes(this.inpMenuSearch.toLowerCase())) {
                            filterdItems[keys] = items[key][keys];
                        }
                    });
                });*/
                Object.keys(item_menu).filter(keys => {
                    if (item_menu[keys].name.toLowerCase().includes(this.inpMenuSearch.toLowerCase())) {
                        filterdItems[keys] = item_menu[keys];
                    }
                });
                return filterdItems;
            } else
                //console.log("yes");
                //console.log(item_menu)
                return item_menu;

            // if(this.inpMenuSearch && this.inpMenuSearch.length >= 2) {
            //     console.log(items);
            //     var filterdItems = {};
            //     Object.keys(items).filter(key => {
            //         if(items[key].name.toLowerCase().includes(this.inpMenuSearch.toLowerCase())) {
            //             filterdItems[key] = items[key];
            //         }
            //     });
            //     console.log(filterdItems);
            //     return filterdItems;
            // } else
            //     return items;
        },
        highlight: function (item) {
            var self = this;
            if (self.inpMenuSearch) {
                return item.name.replace(new RegExp(self.inpMenuSearch, "i"), function (match) {
                    return '<span class="highlight">' + match + '</span>'
                });
            }
            else {
                return item.name
            }
        },
        highlightCity: function (item) {
            var self = this;
            //console.log(self.inpCitySearchMob);
            if (self.inpCitySearchMob) {
                //console.log(item);
                return item.replace(new RegExp(self.inpCitySearchMob, "i"), function (match) {
                    return '<span class="highlight">' + match + '</span>'
                });
            }
            else {
                return item
            }
        },
        highlightLocation: function (item) {
            var self = this;
            // //console.log(self.inpCitySearchMob);
            if (self.inpAreaSearchMob) {
                //console.log(item);
                return item.replace(new RegExp(self.inpAreaSearchMob, "i"), function (match) {
                    return '<span class="highlight">' + match + '</span>'
                });
            }
            else {
                return item
            }
        },
        doLogout: function () {
            if (confirm("Do you want to logout?")) {
                this.userToken = null;
                this.authorized_user = null;
                window.localStorage.removeItem("authToken");
                window.localStorage.removeItem("cart");
                window.localStorage.removeItem("authorized_user");
                this.loadFromServer("/authenticate/logout", this.backToLocation, "POST", {});
                //this.backToLocation();
            }
        },
        handleAddNewAddress: function () {
            this.activePopWindow = "add_new_address";
            var self = this;
            var geocoder = new google.maps.Geocoder
            var oldTitle = this.mobilePageTitle,
                oldBackLink = this.mobileBackCallback;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    var latlng = { lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) };
                    geocoder.geocode({ 'location': latlng }, function (results, status) {
                        //console.log(results);
                        //console.log(results[0].formatted_address);
                        self.addAddressForm.lat = position.coords.latitude;
                        self.addAddressForm.lng = position.coords.longitude;
                        self.addAddressForm.address = results[0].formatted_address;
                        results[0].address_components.forEach(function (addr) {
                            addr.types.forEach(function (addr_type) {
                                if (addr_type == "sublocality") {
                                    self.addAddressForm.area = addr.short_name;
                                }
                                else if (addr_type == "sublocality_level_1") {
                                    self.addAddressForm.area = addr.short_name;
                                }
                                if (addr_type == "postal_code") {
                                    self.addAddressForm.postcode = addr.short_name;
                                }
                            });
                        });
                        self.map = new google.maps.Map(document.getElementById('maps'), {
                            zoom: 18,
                            center: new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude))
                        });
                        var icon = {
                            url: 'images/location_marker.png', // url
                            scaledSize: new google.maps.Size(50, 50), // size
                        };
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)),
                            map: self.map,
                            draggable: true,
                            icon: icon
                        });
                        self.markerCoords(marker);
                    });
                }, () => {
                    alert("Please enable location permission to add new address");
                    this.activePopWindow = "";
                });
            }
        },
        handleSaveAddress: function (e) {
            e.preventDefault();
            this.loadFromServer("/saveAddress?key=" + this.key, this.handleSaveAddressResponse,
                "POST", {
                    address: this.addAddressForm.address, userId: this.userToken, store_id: this.key, area: this.addAddressForm.area,
                postcode: this.addAddressForm.postcode, landmark: this.addAddressForm.landmark,
                lat: this.addAddressForm.lat, lng: this.addAddressForm.lng
            })
        },
        handleSaveAddressResponse: function (resp) {
            var self = this;
            //console.log(resp);
            if (resp.status == 200) {
                self.activePopWindow = " ";
            }
        },
        markerCoords: function (marker) {
            var self = this;
            var geocoder = new google.maps.Geocoder;
            google.maps.event.addListener(marker, 'dragend', function (evt) {
                var latlng = { lat: parseFloat(evt.latLng.lat().toFixed(3)), lng: parseFloat(evt.latLng.lng().toFixed(3)) };
                geocoder.geocode({ 'location': latlng }, function (results, status) {
                    self.addAddressForm.address = results[0].formatted_address;
                    results[0].address_components.forEach(function (addr) {
                        addr.types.forEach(function (addr_type) {
                            if (addr_type == "sublocality") {
                                self.addAddressForm.area = addr.short_name;
                            }
                            else if (addr_type == "sublocality_level_1") {
                                self.addAddressForm.area = addr.short_name;
                            }
                            if (addr_type == "postal_code") {
                                self.addAddressForm.postcode = addr.short_name;
                            }
                        });
                    });
                });
            });
        },
        handleUseLocation: function () {
            var self = this;
            
            var address = self.addAddressForm.doornumber + '-' + self.addAddressForm.address;
            this.checkout.address = address;
            this.loadFromServer("/order/ValidateAddress?key=" + this.key, this.handleUseLocationResponse,
                "POST", { address: address, store_id: this.key, outlet_id: this.selectedOutlet })
        },
        handleUseLocationResponse: function (resp, address) {
            if (resp.valid_address == 200) {
                this.activePopWindow = "checkout";
            }
        },
        handleCheckout: function () {
            this.existing_address = [];
            //console.log("in");
            //console.log(this.cart);
            if (Object.keys(this.cart).length > 0 && parseFloat(this.cartBill.cart.total) >= parseFloat(this.minOrder)) {
                if (!this.userToken) {
                    this.activePopWindow = "signup";
                } else {
                    //console.log("inin");
                    if (this.chosenOrderType == 1) {
                        this.mobilePageTitle ="Choose Address";
                        // console.log(this.mobilePageTitle);
                        this.activePopWindow = "my_address";
                        this.loadFromServer("/getSavedAddress?key=" + this.key, this.handleExistingAddressResponse,
                            "POST", { id: this.userToken });
                    } else {
                        // Takeout
                        this.activePopWindow = "checkout";
                    }
                    // this.activePopWindow = "checkout";
                }
            } else
                alert("Minimum order amount of Rs." + this.minOrder + " is required.");
        },
        handleExistingAddressResponse: function (resp) {
            // console.log("existingaddress",resp);
            var self = this;
            self.existing_address = [];
            if (resp.status == 200) {
                Object.keys(resp.addresses).forEach(function (addr) {
                    self.existing_address.push(resp.addresses[addr]);
                });
            }
            else {
                // alert(errMessage);
                this.activePopWindow = "checkout";
            }
        },
        deliverAddressValidation: function (addrs) {
            //console.log(addrs);
            this.checkout.address = addrs.address;
            this.checkout.lat = addrs.lat;
            this.checkout.lng = addrs.lng;
            this.loadFromServer("/validateLatAddress?key=" + this.key, this.deliverAddressValidationResponse,
                "POST", {
                    address: addrs.address, store_id: this.storeId, outlet_id: this.storeId,
                lat: addrs.lat, lng: addrs.lng
            });
        },
        deliverAddressValidationResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                this.activePopWindow = "checkout";
            } else {
                alert("This outlet does not deliver to your location. Please choose another address.");
            }
        },
        cancelLocation: function () {
            this.activePopWindow = "";
            var self = this;
            window.setTimeout(function () {
                self.mobilePageTitle = "My Address";
                self.activePopWindow = "my_address";
            }, 100);
        },
        handleCheckoutSubmit: function () {
            // var post_data = {
            //     area_id: this.selectedArea,
            //     cart_id: "",
            //     compId: 0,
            //     flash_sales: 0,
            //     id: this.selectedOutlet,
            //     store_id: this.key,
            //     isCompliment: 0,
            //     meal_time: 2,
            //     menu_item: "",
            //     menu_0: this.cart,
            //     menu_qty: 1,
            //     modifiers: "", 
            //     showCheckout: 0,
            //     update_item: 0              
            // };
            // this.loadFromServer("/order/add2cart", this.placeOrder, "POST", post_data);
            let sale = {
                bill: {
                    subtotal: this.cartBill.cart.subTotal,
                    taxes: this.cartBill.tax,
                    total: this.cartBill.cart.total,
                    discount: this.cartBill.cart.cart.discounts,
                    taxSplit: this.cartBill.taxSplit
                },
                customer: {
                    name: this.checkout.name,
                    phone: this.checkout.mobile,
                    email: this.checkout.email,
                    userId: this.userToken,
                    address: {
                        street: this.checkout.address,
                        location: this.checkout.area,
                        zip: this.checkout.postcode,
                        landmark: this.checkout.landmark,
                        lat: this.checkout.lat,
                        lng: this.checkout.lng
                    }
                },
                delTime: this.checkout.dd_time,
                delDate: this.checkout.dd_date,
                payment: this.checkout.payment,
                orderType: this.availOrderTypes[this.chosenOrderType],
                items: this.cart,
                order_from: this.isMobileView ? 2 : 1
            };
            this.loadFromServer('/checkout?key=' + this.key, this.confirmCheckout, "POST",
                { key: this.key, sale: sale, storeId: this.storeId, userId: this.userToken })
        },
        /*placeOrder: function(resp) {
            //console.log(resp);
            if(resp.status == 200) {
                this.cartId = resp.cartId;
                this.checkout.cart_id = resp.cartId;
                this.checkout.id = this.selectedOutlet;
                this.checkout.store_id = this.key;
                this.checkout.order_from = this.orderSource;
                this.checkout.type = this.chosenOrderType;
                this.loadFromServer("/order/placeOrder", this.confirmCheckout, "POST", this.checkout);
            } else
                alert(resp.errorMessage);
        },*/
        confirmCheckout: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                if (parseInt(this.checkout.payment) == 2 && resp.paymentUrl) {
                    // Save the state in session
                    window.localStorage.setItem("cart", JSON.stringify({
                        id: resp.order.orderId,
                        selectedCity: this.selectCity,
                        selectedArea: this.selectedArea,
                        lat: this.latitude,
                        lng: this.longitude,
                        paymentUrl: resp.paymentUrl
                    }));

                    var has_www = "no";
                    if (document.location.href.indexOf("www.") >= 0)
                        has_www = "yes";
                    document.location = resp.paymentUrl + "?key=" + this.key + "&id=" +
                        resp.order.orderId + "&www=" + has_www;
                } else {
                    this.cart = {};
                    this.checkout.dd_date = "";
                    this.checkout.dd_time = "";
                    this.thankyou.restaurant_address = resp.order.raddress;
                    this.thankyou.order_id = resp.order.orderId;
                    this.thankyou.dd_date = resp.order.date;
                    this.thankyou.dd_time = resp.order.time;
                    this.activePopWindow = "order_success";
                    // this.currentPage = "location";
                    this.orderResponse = resp;
                    window.localStorage.removeItem("cart");
                    // alert("Your order has been sent for confirmation. Thanks for using Thalappakatti.");					
                }
            } else
                alert(resp.errorMessage);
        },
        retryOnlinePay: function () {
            document.location = this.retryCart.paymentUrl + "?mode=test&key=" + this.key + "&id=" + this.retryCart.id;
        },
        makeCod: function () {
            this.loadFromServer("/completeOrder?key=" + this.key + "&id=" + this.retryCart.id, this.confirmCheckout,
                "POST", { id: this.retryCart.id });
        },
        goHome: function () {
            this.activePopWindow = null;
            this.mobilePageTitle = "";
            this.mobileheadervalues.locationicon=true;
            this.existing_address = [];
            this.currentPage = "home";
        },
        handleLoginSubmit: function () {
            this.loginForm.key = this.key;
            this.loadFromServer("/login?key=" + this.key, this.handleLoginResponse, "POST",
                this.loginForm);
        },
        handleLoginResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                //console.log(resp);
                window.localStorage.setItem("authorized_user", resp.name);
                this.authorized_user = resp.name;
                window.localStorage.setItem("authToken", resp.userId);
                this.userToken = resp.userId;
                this.activePopWindow = null;

                this.checkout.name = resp.name;
                this.checkout.email = resp.email;
                this.checkout.mobile = resp.phone;
                this.checkout.address = resp.address;
                // this.checkout.area = resp.user.area;
                // this.checkout.landmark = resp.user.landmark;
                // this.checkout.postcode = resp.user.postcode;

                this.loginForm = {
                    username: "",
                    password: ""
                }
            }
            else {
                //console.log("yessss");
                alert(resp.message);
            }
        },
        del_times: function (e) {
            e.preventDefault();
            this.active_day = e.target.value;
        },
        forgotPassword: function () {
            this.activePopWindow = "fgtpswd_number";
        },
        mobileCategories: function () {
            this.mob_category = "mobile_category";
        },
        handleMobileCategory: function (cat_id, cat_name) {
            $('html, body').scrollTop(0);
            //console.log(cat_id);
            // this.cat = cat;
            this.mob_category = cat_name;
            this.activeCat = cat_id;
            this.mobilePageTitle = cat_name;
            var self = this;
            if (this.menu.sub_category[cat_id] && this.menu.sub_category[cat.id].length > 0) {
                this.activeSubCat = this.menu.sub_category[cat.id][0].id;
            };
        },
        isElementVisible: function (el) {
            var top = el.offsetTop;
            var left = el.offsetLeft;
            var width = el.offsetWidth;
            var height = el.offsetHeight;

            while (el.offsetParent) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;

            }
            // console.log(el.offsetParent);
            // console.log(top);
            // console.log(left);
            // console.log(window.pageYOffset + window.innerHeight);
            // console.log(window.pageXOffset + window.innerwidth);
            // console.log(height);
            // console.log(width);
            // console.log(top + height);
            // console.log(left + width);
            return (
                // console.log(
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth) &&
                (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset
            );
            // )
        },
        toggleSearch: function () {
            //$("#menu_search").show();
            this.is_search = !(this.is_search);
			if(this.is_search) {
				$('html, body').scrollTo(140);
			}
			
			if(this.is_search) {
				window.setTimeout(() => {
					$(".menu_containers .mob_search #menu_search").focus();
				}, 500);				
			} else {
				this.inpMenuSearch = "";
			}
        },
        handleCouponCode: function () {
            // if(this.cartId == null) {
            /*var post_data = {
                area_id: this.selectedArea,
                cart_id: "",
                compId: 0,
                flash_sales: 0,
                id: this.selectedOutlet,
                store_id: this.key,
                isCompliment: 0,
                meal_time: 2,
                menu_item: "",
                menu_items: this.cart,
                menu_qty: 1,
                modifiers: "", 
                showCheckout: 0,
                update_item: 0              
            };
            this.loadFromServer("/order/add2cart", this.handleCouponCodeCartIdResponse, "POST", post_data);*/
            this.loadFromServer("/applyCoupon?key=" + this.key + "&coupon_code=" + this.coupon_code,
                this.handleCouponCodeResponse, "POST", { id: this.storeId, cart_id: this.cartId });
            // }
            // else{
            //     console.log("coupon");
            //     this.loadFromServer("/order/applyCoupon",this.handleCouponCodeResponse,"POST",
            //     {id:this.selectedOutlet,cart_id:this.cartId , coupon_code:this.coupon_code });
            // }
        },
        handleCouponCodeCartIdResponse: function (resp) {
            //console.log(this.cartBill)
            this.cartId = resp.cartId;
            //console.log(resp)
            this.loadFromServer("/applyCoupon?key=" + this.key + "&coupon_code=" + this.coupon_code,
                this.handleCouponCodeResponse, "POST", { id: this.storeId, cart_id: this.cartId });
        },
        handleCouponCodeResponse: function (resp) {
            //console.log(resp);
            //console.log(this.cart);
            if (resp.status == 200) {
                this.is_coupon_code = true;
                this.error_couponCode = null;
                /*this.cartBill.cart.discPercnt = resp.shoppingCart.discPercnt ;
                this.cartBill.cart.subTotal = resp.shoppingCart.subTotal;
                this.cartBill.cart.tax = resp.shoppingCart.tax;
                this.cartBill.cart.discValue = resp.shoppingCart.discValue;
                this.cartBill.cart.total = resp.shoppingCart.total;
                if(this.error_couponCode) {
                    this.error_couponCode = "";
                }*/
                this.updateTotal();
            }
            else {
                this.is_coupon_code = false;
                this.coupon_code = null;
                this.error_couponCode = resp.responseMessage;
                // alert(resp.responseMessage);
            }
        },
        goToHome: function () {
            //document.location.reload(true);
            if (this.selectedArea)
                this.currentPage = "home";
            else {
                this.currentPage = "location";
                this.showLocationPopup = true;
                this.activePopWindow = null;
            }
        },
        handleOrderDetails: function () {
            //  var self = this,
            //     oldPageTitle = this.mobilePageTitle,
            //     oldBackLink = this.mobileBackCallback,
            //     oldPage = this.currentPage;
            // this.currentPage = "order_details";
            
            console.log("his");
            this.activePopWindow = "";
            this.loadFromServer("/myaccount?key=" + this.key, this.handleOrderDetailsResponse, "POST",
                { id: this.userToken });
        },
        handleOrderDetailsResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                var self = this,
                    oldPageTitle = this.mobilePageTitle,
                    oldBackLink = this.mobileBackCallback,
                    oldPage = this.currentPage;
                //console.log(oldPageTitle);
                // console.log(oldBackLink);
                //console.log(oldPage);
                this.currentPage = "order_details";
                this.activePopWindow = "";
                this.order_history = resp.orders;
                if (this.isMobileView) {
                    this.mobilePageTitle = "Order History";
                    $('#login_menu').stop().animate({ "left": "-100%" }, 300, function () {
                        $('#close_menu').hide();
                        self.mobileBackCallback = function () {
                            self.mobilePageTitle = oldPageTitle;
                            self.currentPage = oldPage;
                            //console.log(self.currentPage);
                            self.mobileBackCallback = oldBackLink;
                        }
                    });
                }
            }
            else
                alert(resp.errorMessage);
        },
        handleViewOrders: function (item) {
            this.showTracking =false;
            console.log(item);
            this.currentPage = "view_orders";
            this.loadFromServer("/viewOrder?key=" + this.key, this.handleViewOrdersResponse, "POST",
                { userId: this.userToken, order_id: item.id });
        },
        handleViewOrdersResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                console.log("vieworders",resp);
                var self = this,
                    oldPageTitle = this.mobilePageTitle,
                    oldBackLink = this.mobileBackCallback,
                    oldPage = this.currentPage;
                console.log(oldPageTitle);
                console.log(oldBackLink);
                console.log(oldPage);
                this.activePopWindow = "";
                this.mobilePageTitle = "Order Details";
                this.currentPage = "view_orders";
                self.mobileBackCallback = function () {
                    self.mobilePageTitle = oldPageTitle;
                    self.currentPage = "order_details";
                    self.mobileBackCallback = oldBackLink;
                }
                this.vieworders.customer_address = resp.guest.address.street;
                this.vieworders.customer_area = resp.guest.area;
                this.vieworders.restaurant_address = resp.order.restaurant;
                this.vieworders.order_id = resp.order.id;
                this.vieworders.dd_date = resp.order.deliveryDate;
                this.vieworders.dd_time = resp.order.deliveryTime;
                this.vieworders.menu_items = resp.menuItems;
                this.vieworders.packing_charges = resp.order.packingCharges;
                this.vieworders.tax = resp.order.taxes;
                this.vieworders.subtotal = resp.order.subTotal;
                this.vieworders.total = resp.order.totalCost;
                this.vieworders.discount = resp.order.discounts;
            }
        },
        handleMyAddress: function () {
            this.loadFromServer("/getSavedAddress?key=" + this.key, this.handleMyAddressResponse, "POST",
                { id: this.userToken });
        },
        handleMyAddressResponse: function (resp) {
            //console.log(resp);
            var self = this;
            this.existing_address = [];
            if (resp.status == 200) {
                if (this.isMobileView) {
                    $('#login_menu').stop().animate({ "left": "-100%" }, 300, function () {
                        $('#close_menu').hide();
                    });
                }
                this.activePopWindow = 'myAddress';
                Object.keys(resp.addresses).forEach(function (addr) {
                    //console.log(addr);
                    self.existing_address.push(resp.addresses[addr]);
                });
            }
            else {
                alert(errorMessage);
            }
        },
        myAccountBack: function () {
            if (this.currentPage == "view_orders") {
                this.currentPage = "order_details";
            }
            else {
                this.currentPage = "location";
            }
            //console.log(this.currentPage);
            //console.log(this.mobilePageTitle);
        },
        handleDetectLocation: function () {
            var self = this;
            //console.log("in");
            //var geocoder = new google.maps.Geocoder
            //console.log(navigator.geolocation);
            if (navigator.geolocation) {
                this.showSpinner = true;
                navigator.geolocation.getCurrentPosition(position => {
                    this.latitude = parseFloat(position.coords.latitude);
                    this.longitude = parseFloat(position.coords.longitude);

                    this.loadFromServer("/getPlaceInfo", resp => {
                        //console.log(resp);
                        if (resp.status == "OK") {
                            resp.results[0].address_components.forEach(ac => {
                                if (ac.types.indexOf("sublocality") >= 0)
                                    this.selectedArea = ac.short_name;
                                if (ac.types.indexOf("locality") >= 0)
                                    this.selectedCity = ac.short_name;
                            });

                            // Get restaurants
                            // Load data
                            this.loadFromServer("/locations?return=json&key=" + this.key + "&lat=" + this.latitude +
                                "&lng=" + this.longitude, this.loadCityData);
                        }
                    }, "POST", {
                        lat: position.coords.latitude, lng: position.coords.longitude,
                        key: this.key
                    });

					/*var latlng = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
					geocoder.geocode({'location': latlng}, function(results, status) {
						console.log(results);
						self.filterCity.forEach(function(cty) {
							if(results[0].formatted_address.toLowerCase().includes(cty.text.toLowerCase()) ) {
								self.inpCitySearch = cty.text;
								self.selectedCity = cty.key;
								if(self.inpCitySearch) {
									self.filterLocation.forEach(function(loc) {
										if(results[0].formatted_address.toLowerCase().includes(loc.text.toLowerCase()) ) {
											self.inpAreaSearch = loc.text;
											self.selectedArea = loc.areaId;
										}
									});
								}
							}
						});
					});*/
                }, () => {
                    this.spinner = false;
                    this.showLocationPopup = true;
                });
            } else {
                this.spinner = false;
                this.showLocationPopup = true;
            }
        },
        handleCloseMenu: function () {
            $('#login_menu').stop().animate({ "left": "-100%" }, 300, function () {
                $('#close_menu').hide();
            });
        },
        handleMobileMenu: function () {
            $('#login_menu').stop().animate({ "left": "0px" }, 300, function () {
                $('#close_menu').show();
            });
        },
        doCheckLocation: function () {
            if (!this.selectedCity || !this.selectedArea)
                this.showLocationPopup = true;
            else {
                this.renderMenu();
                this.loadFromServer('/venue?return=json&city=' + this.inpCitySearch + '&key=' + this.key +
                    '&location=' + this.selectedArea, this.setupMenu);
            }
        },
        handleSignupSubmit: function () {
            // this.signupForm.restaurant = this.key;
            this.signupForm.key = this.key;
            //console.log(this.signupForm);
            this.loadFromServer("/signup", this.handleSingupResponse, "POST", this.signupForm);
        },
        handleSingupResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                this.userToken = resp.userId;
                this.activePopWindow = "verify_account";
            }
            else
                alert(resp.message)
        },
        handleVerifyAccountSubmit: function () {
            this.loadFromServer("/verifyOtp", this.handleVerifyAccountResponse, "POST", { otp: this.account_verify, key: this.key, user_id: this.userToken });
        },
        handleVerifyAccountResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                alert("Your Account Successfully Verified");
                this.activePopWindow = "login";
            }
            else
                alert(resp.errorMessage);
        },
        handleFgtpswdNumberSubmit: function () {
            this.loadFromServer("/forgotPassword", this.handleFgtpswdNumberResponse, "POST",
                { phone: this.fgtpswd_number, key: this.key });

        },
        handleFgtpswdNumberResponse: function (resp) {
            //console.log(resp)
            if (resp.status == 200) {
                this.userToken = resp.userId;
                this.activePopWindow = "fgtpswd_verify";
            }
            else
                alert("Enter valid mobile number.")
        },
        handleFgtpswdVerifyAccountSubmit: function () {
            this.loadFromServer("/verifyForgotOtp", this.handleFgtpswdVerifyAccountResponse, "POST",
                { otp: this.fgtpswd_verify, key: this.key, user_id: this.userToken });

        },
        handleFgtpswdVerifyAccountResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                this.resetPasswordForm.otp = resp.otp;
                // this.resetPasswordForm.userid = resp.userid;
                this.activePopWindow = "resetPasswordForm";
                this.fgtpswd_verify = "";
            }
            else
                alert("Enter correct otp code which sent to your registered mobile number.")
        },
        resetPasswordSubmit: function () {
            this.resetPasswordForm.key = this.key;
            this.resetPasswordForm.user_id = this.userToken;
            if (this.resetPasswordForm.password == this.resetPasswordForm.newPassword) {
                this.loadFromServer("/resetPassword", this.resetPasswordResponse, "POST",
                    this.resetPasswordForm)
            }
            else
                alert("Password mismatch.Enter same password");
        },
        resetPasswordResponse: function (resp) {
            //console.log(resp);
            if (resp.status == 200) {
                this.resetPasswordForm = {
                    password: "",
                    newPassword: "",
                    userid: "",
                    code: "",
                    id: ""
                }
                this.activePopWindow = "login";
                alert("Your Password reseted Successfully");

            }
            else
                alert(resp.errorMessage);
        }
    },
    computed: {
   
        filterLocation: function () {
            var self = this;
            if (this.selectedCity) {
                //console.log(this.areaList);
                //console.log(this.selectedCity);
                if (this.inpAreaSearch && this.inpAreaSearch.length >= 2) {
                    return this.areaList[this.selectedCity][this.chosenOrderType].filter(item => {
                        //console.log(item);
                        return item.toLowerCase().includes(this.inpAreaSearch.toLowerCase());
                    });
                }
                else if (this.inpAreaSearchMob && this.inpAreaSearchMob.length >= 2) {
                    return this.areaList[this.selectedCity][this.chosenOrderType].filter(function (item) {
                        return item.text.toLowerCase().includes(self.inpAreaSearchMob.toLowerCase());
                    });
                } else
                    return this.areaList[this.selectedCity][this.chosenOrderType];
            } else
                return [];
        },
        filterTimings: function () {
            var self = this;
            var timeslots = [];
            var slugs = [];

            //console.log(self.checkoutData.timings);
            if (this.active_day) {
                var dt_key = null;
                Object.keys(self.checkoutData.timings).forEach(key => {
                    if (key == self.active_day) {
                        dt_key = key;
                    }
                });

                if (dt_key) {
                    self.checkout.dd_date = self.checkoutData.timings[dt_key].timestamp;
                    Object.keys(self.checkoutData.timings[dt_key].slots).forEach(function (data) {
                        Object.keys(self.checkoutData.timings[dt_key].slots[data]).forEach(key => {
                            slugs.push({ key: key, time: self.checkoutData.timings[dt_key].slots[data][key] });
                        });
                        /*timeslots.push({
                            title:data,
                            slugs: slugs,
                        });*/
                    })
                }
            }

            if (slugs.length > 0) {
                if (this.chosenOrderType == 1) {
                    this.checkout.dd_time = slugs[0].key;
                    return slugs[0].time;
                } else
                    return slugs;
            } else
                return "Delivery Closed";
            // var delivery_time = [];
            // var self =this;
            // Object.keys(self.checkoutData.timings).forEach(function(key){
            // console.log(self.checkoutData.timings[key]);
            // Object.keys(self.checkoutData.timings[key]).forEach(function(time){
            //     console.log(self.checkoutData.timings[key][time]);
            //     delivery_time.push({
            //         key:time,
            //         time: self.checkoutData.timings[key][time]
            //     })
            // });

            // });
            // return delivery_time;
        },
		getMenuCategories: function() {
			
            if(this.inpCategorySearch && this.inpCategorySearch.length >= 2) {
				let newCats = [];
				this.menu.menus.main_category.forEach(data => {
                    let items = [];
                    data.items.forEach(item=>{
                        if(item.name.toLowerCase().indexOf(this.inpCategorySearch.toLowerCase()) >= 0) {
                            //newCats[key] = this.menu.categories[key];
                            items.push(item);
                         }
                    })
					let dt = JSON.parse(JSON.stringify(data));
					if(items.length>0){
                        dt.items = items;
                        newCats.push(dt);
                    }
				});
				return newCats;
            }
            console.log("main",this.menu.menus.main_category)
            return this.menu.menus.main_category;
        },
        getMainCategories: function () {
            /*if(this.isMobileView) {
                var mainCat = [];
                //console.log(this.menu);
                Object.keys(this.menu.categories).forEach(item => {
                   if(this.activeCat == item)
                       mainCat.push({
                        id:item,
                        name:this.menu.categories[item]
                       });
                }); 
                //console.log(mainCat);               
                return mainCat;
            } else {*/
            var menu = [];
            Object.keys(this.menu.categories).forEach(item => {
                menu.push({
                    id: item,
                    name: this.menu.categories[item]
                });
            });
            return menu;
            //}
        },
        getCartCount: function () {
            var count = 0;
            if (Object.keys(this.cart).length > 0) {
                Object.keys(this.cart).forEach(key => {
                    count += parseFloat(this.cart[key].itemQty);
                });
            }
            return count;
        }
    },

})