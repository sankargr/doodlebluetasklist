const Ecommerce = function(resolve, reject) {
	getTemplate("ecommerce.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',
                    addModalShow :false,
                    upadateModalShow :false,	
                    ecommerceProductList : [],
				}
			},
			components: {
				Header
			},			
			mounted: function() {
                loadFromServer("/ecommerce", this.ecommerceResponse, "POST",
				    {});
			},
			methods: {
				ecommerceResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.ecommerceProductList = resp.result						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},	
                buyProduct: function (id,price) {		
                    let data = {
                        product_id : id,
                        qty :1,
                        total : price
                    }	
					loadFromServer("/ecommerce/createOrder", this.buyProductResponse, "POST",
				    data);
				},	
                buyProductResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        alert('Product Buy Successfully..')	
                        this.$router.push({name: "myOrders"});				
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},	
			}
		});
	}).catch(err => {
		console.log(err);
		alert(err.toString());
	});
}
