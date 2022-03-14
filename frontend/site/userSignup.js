const userSignup = function(resolve, reject) {
	getTemplate("userSignup.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',	
                    form : {
                        value :{
                            name:'',
                            email:'',
                            password :''
                        },
                        errors : {
                            name:'',
                            email:'',
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
				handleRegiserSubmit: function () {
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
                        loadFromServer("/auth/admin/register", this.handleRegisterResponse, "POST",
                        this.form.value);
                    }
					
				},
				handleRegisterResponse: function (resp) {
					//console.log(resp);
					this.loading = false;
					if (resp.status == 200) {		                       		

						this.$router.replace({name: "adminLogin"});
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
