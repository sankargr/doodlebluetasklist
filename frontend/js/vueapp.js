// Router setup
const router = new VueRouter({
	routes: [
		{
			path: "/adminLogin",
			name: "adminLogin",
			component: adminLogin
		},
		{
			path: "/adminSignup",
			name: "adminSignup",
			component: adminSignup
		},
		{
			path: "/userLogin",
			name: "userLogin",
			component: userLogin
		},
		{
			path: "/userSignup",
			name: "userSignup",
			component: userSignup
		},
		{
			path: "/productList",
			name: "productList",
			component: productList
		},
		{
			path: "/productReport",
			name: "productReport",
			component: productReport
		},
		{
			path: "/customerReport",
			name: "customerReport",
			component: customerReport
		},
		{
			path: "/ecommerce",
			name: "ecommerce",
			component: Ecommerce
		},
		{
			path: "/myOrders",
			name: "myOrders",
			component: myOrders
		},
	]
});
var app = new Vue({
	el: "#orderingarootpp",
	data: {},
	beforeUpdate: function () {
	},
	mounted: function () {
		common_color = '#417cbc';
		document.documentElement.style.setProperty('--color', common_color);
		if (window.localStorage && window.localStorage.getItem("token"))
		{
			let token = window.localStorage.getItem("token")
			loadFromServer("/auth/checkLoginToken", resp => {						
				if(resp.status == 200) {
					isLogin = true;
					loginName =resp.name 
					if(resp.type =='admin')
					{
						loginType = 'admin';
						this.$router.push({name: "productList"});
					}
					else
					{
						loginType = 'user';
						this.$router.push({name: "ecommerce"});
					}				
				}	
				else if(resp.status == 302)
				{
					this.$router.push({name: "userLogin"});
				}			
			}, "POST", {token: token});
		}
		else
		{
			isLogin = false;
			loginType = '';
		}
			


		
	},
	methods: {
	},
	router
});