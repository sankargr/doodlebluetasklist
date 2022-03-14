const Header = function(resolve, reject) {
	getTemplate("header.html").then(resp => {
		resolve({
			template: resp,				
			data: function() {
				return {		
					loading: true,
					
					isLogin :  isLogin,
					loginName :  loginName,
					loginType :  loginType,
				}
			},
			
			mounted: function() {
				
			},
			
			methods: {
				
				gotoProductList: function () {					
					this.$router.push({name: "productList"});
				},	
				gotoProductCreate: function () {					
					this.$router.push({name: "login"});
				},	
				gotoCustomerWiseSales: function () {					
					this.$router.push({name: "customerReport"});
				},	

				gotoProductwiseSales: function () {					
					this.$router.push({name: "productReport"});
				},	
				gotoEcommerce: function () {					
					this.$router.push({name: "ecommerce"});
				},	
				gotoOrderList: function () {					
					this.$router.push({name: "myOrders"});
				},	

				gotoLogout: function () {					
					//logout
					localStorage.removeItem('token');
					isLogin =false;
					loginName ='';
					this.$router.push({name: "userLogin"});
				},	

				gotoAdminSignin: function () {					
					this.$router.push({name: "adminLogin"});
				},	
				gotoAdminSignup: function () {					
					this.$router.push({name: "adminSignup"});
				},
				gotoUserSignin: function () {					
					this.$router.push({name: "userLogin"});
				},
				gotoUserSignup: function () {					
					this.$router.push({name: "userSignup"});
				},
				
			}
		});
	}).catch(err => {
		console.log(err);
		alert(err.toString());
	});
}
