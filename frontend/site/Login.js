const Login = function(resolve, reject) {
	getTemplate("login.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',		
				}
			},
			components: {
				Header
			},			
			mounted: function() {
			
			},
			methods: {
				handleCloseMenu: function () {					
					$('#mySidepanel').css('left', '-100%');
				},						
				handleMobileMenu: function () {
					$('#mySidepanel').css('left', '0px');
					
				},
				goBack: function() {
					this.$router.go(-1);
				},
				forgotPassword: function() {
					this.$router.push({name: "forgot"});
				},
				signup: function() {
					this.$router.push({name: "signup"});
				},
				goBack: function() {
					this.$router.go(-1);
				},
				handleLoginSubmit: function () {
					this.loading = true;
					loadFromServer("/login", this.handleLoginResponse, "POST",
						{username: this.username, password: this.password});
				},
				handleLoginResponse: function (resp) {
					//console.log(resp);
					this.loading = false;
					if (resp.status == 200) {
						//console.log(resp);
						//window.localStorage.setItem("authorized_user", resp.name);
						//this.authorized_user = resp.name;
						setUser(resp.name);
						setToken(resp.userId);
						// Home or Checkout redirect
						if(getItem("store") && getItem("orderTypeCode")) {
							// Clear menu
							//removeItem("menu");												
							if(this.$route.params.checkout) 
							{
								if(getItem("orderType") ==1)
								{
									this.$router.replace({name: "choose_address"});
								}
								else
								{
									this.$router.replace({name: "checkout"});
								}															
							}
							else
							{
								this.$router.replace({name: "menu", params: {
									store: getItem("store"),
									orderType: getItem("orderTypeCode")
								}});
							}

							
						} else {
							this.$router.replace({name: "option_page"});							
						}
					}
					else {
						//console.log("yessss");
						$.alert({
							title: null,
							type: 'orange',
							content: resp.message,
						});							
					}
				}				
			}
		});
	}).catch(err => {
		console.log(err);
		alert(err.toString());
	});
}
