const productList = function(resolve, reject) {
	getTemplate("productList.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,		
                    userToken : getToken(),			
					isMobileView: isMobileView(),	
					loadingTitle:'',
                    addModalShow :false,
                    upadateModalShow :false,	
                    productList :[],
                    updateProductId:'',
                    addFrom: {
                        value : {
                            name : '',
                            price : '',
                            desc : '',
                        },
                        errors : {
                            name : '',
                            price : '',
                            desc : '',
                        },
                    },
                    updateFrom: {
                        value : {
                            id : '',
                            name : '',
                            price : '',
                            desc : '',
                        },
                        errors : {
                            name : '',
                            price : '',
                            desc : '',
                        },
                    }
				}
			},
			components: {
				Header
			},			
			mounted: function() {
                loadFromServer("/products/list", this.productListResponse, "POST",
				{ token: this.userToken });

			},
			methods: {
				openaddModal: function () {					
					this.addModalShow =true
				},	
                closeaddModal: function () {					
					this.addModalShow =false
				},	
                openupdateModal: function () {					
					this.upadateModalShow =true
				},	
                closeupdateModal: function () {					
					this.upadateModalShow =false
				},		
                
                productListResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.productList = resp.result						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},

                saveAddProduct: function (resp) {			
					this.loading = true;
                        loadFromServer("/products/create", this.saveAddProductResponse, "POST",
                        this.addFrom.value);
				},

                saveAddProductResponse: function (resp) {					
					this.loading = false;
					if (resp.status == 200) {		                       		

                        alert('Product Added Successfully...')
						this.addModalShow =false
                        loadFromServer("/products/list", this.productListResponse, "POST",
                        { token: this.userToken });

                        
					}
                    else if(resp.status ==400)
                    {
                        console.log(resp)
                        var errors = resp && resp.responseJSON && resp.responseJSON.errors
                        if(errors)
                        {
                            Object.keys(errors).forEach(key => {
                                this.addFrom.errors[key] = errors[key]                    
                            });
                        }

                        console.log(this.addFrom)
                    }
					else {
						alert(resp.msg||'Something Went Wrong..')							
					}
				},
                upadteProduct: function (resp) {			
					this.loading = true;
                        loadFromServer("/products/update", this.upadteProductResponse, "POST",
                        this.updateFrom.value);
				},

                upadteProductResponse: function (resp) {					
					this.loading = false;
					if (resp.status == 200) {		                       		

                        alert('Product Updated Successfully...')
						this.upadateModalShow =false
                        loadFromServer("/products/list", this.productListResponse, "POST",
                        { token: this.userToken });

                        
					}
                    else if(resp.status ==400)
                    {
                        console.log(resp)
                        var errors = resp && resp.responseJSON && resp.responseJSON.errors
                        if(errors)
                        {
                            Object.keys(errors).forEach(key => {
                                this.updateFrom.errors[key] = errors[key]                    
                            });
                        }

                        console.log(this.updateFrom)
                    }
					else {
						alert(resp.msg||'Something Went Wrong..')							
					}
				},
                
                



                getProduct: function (id) {			
					this.loading = true;
                        loadFromServer("/products/details/"+id, this.getProductResponse, "POST",
                        {id:id});
				},

                getProductResponse: function (resp) {					
					this.loading = false;
					if (resp.status == 200) {		                       		
                        this.upadateModalShow =true;
                        this.updateFrom.value.id  = resp.result._id,
                        this.updateFrom.value.name  = resp.result.name,
                        this.updateFrom.value.desc  = resp.result.desc,
                        this.updateFrom.value.price  = resp.result.price
					}
                    else if(resp.status ==400)
                    {
                        console.log(resp)
                        var errors = resp && resp.responseJSON && resp.responseJSON.errors
                        if(errors)
                        {
                            Object.keys(errors).forEach(key => {
                                this.updateFrom.errors[key] = errors[key]                    
                            });
                        }

                        console.log(this.updateFrom)
                    }
					else {
						alert(resp.msg||'Something Went Wrong..')							
					}
				}	



                
                

			}
		});
	}).catch(err => {
		console.log(err);
		alert(err.toString());
	});
}
