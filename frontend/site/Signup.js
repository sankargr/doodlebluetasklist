

const Signup = function(resolve, reject) {
	getTemplate("signup.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,
					country_code: "91",
					phone: "",
					email: "",
					name: "",
					password: "",
					subImg: subImg!='' ? 'background:url('+subImg+');background-size: cover;' : 'background:url(https://i.pinimg.com/originals/6e/58/1f/6e581fb70982e576c488457628c72604.jpg);background-size: cover;',
					key: appKey,
					loadingTitle:'',
					brand_logo : logo,
					brand_name : brand_name,
					allCountryCode : countryCodes,
				}
			},
			components: {
				Header
			},			
			mounted: function() {
				console.log(this.allCountryCode)
				/*Object.keys(countryCodes).forEach(key => {
					allCountryCode.push({
						id : countryCodes[key].code,
						name : countryCodes[key].name,
					})
				});*/
				
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
				doLogin: function() {
					this.$router.push({name: "login"});
				},
				goBack: function() {
					this.$router.go(-1);
				},
				handleSignupSubmit: function () {
					this.loading = true;
					loadFromServer("/signup", this.handleSingupResponse, "POST", {
						phone: this.phone,
						email: this.email,
						name: this.name,
						password: this.password,
						country_code: this.country_code,
						key: this.key						
					})
				},
				handleSingupResponse: function (resp) {
					//console.log(resp);
					this.loading = false;
					if (resp.status == 200) {
						setForgotToken(resp.userId);

						setSignInUser(resp.name);

						//setToken(resp.userId);
						//this.activePopWindow = "verify_account";
						this.$router.replace({name: "verify"});
					}
					else
					{						
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
