const adminLogin = function(resolve, reject) {
	getTemplate("adminLogin.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',
                    form : {
                        value :{
                            username:'',                            
                            password :''
                        },
                        errors : {
                            username:'',
                            password :''
                        }
                    }			
				}
			},
			components: {
				Header
			},			
			mounted: function() {
			
			},
			methods: {
				handleLoginSubmit: function () {
                    let isError =false;
                    /*Object.keys(this.form.errors).forEach(key => {
						if(this.form.errors[key]!='')
                        {
                            isError =true;
                        }                        
					});*/
                    if(!isError)
                    {
                        this.loading = true;
                        loadFromServer("/auth/admin/login", this.handleloginResponse, "POST",
                        this.form.value);
                    }
					
				},
				handleloginResponse: function (resp) {
					//console.log(resp);
					this.loading = false;
					if (resp.status == 200) {		
                        setToken(resp.token)
                        loginType ='admin'
                        isLogin = true;
                        loginName =resp.username
						this.$router.replace({name: "productList"});
					}
                    else if(resp.status ==400)
                    {
                        console.log(resp)
                        var errors = resp && resp.responseJSON && resp.responseJSON.errors
                        if(errors)
                        {
                            Object.keys(errors).forEach(key => {
                                this.form.errors[key] = errors[key]                    
                            });
                        }
                        console.log(this.form)
                    }
					else {
						//console.log("yessss");
						alert('Something Went Wrong..')					
					}
				}				
			}
		});
	}).catch(err => {
		console.log(err);
		alert(err.toString());
	});
}
