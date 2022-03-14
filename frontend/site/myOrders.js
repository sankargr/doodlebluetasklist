const myOrders = function(resolve, reject) {
	getTemplate("myOrders.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',
                    myOrdersList : [],

				}
			},
			components: {
				Header
			},			
			mounted: function() {
                loadFromServer("/user/orders", this.ordersResponse, "POST",
				    {});
			},
			methods: {
				ordersResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.myOrdersList = resp.result						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},	
                updateCancel: function (id) {			
					if(confirm('are you sure Cancel this Orders'))
                    {
                        loadFromServer("/user/cancelOrder", this.cancelOrderResponse, "POST",
				            {order_id : id});
                    }
				},	
                cancelOrderResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        alert(resp.msg || 'Order Cancel Successfully..')	
                        loadFromServer("/user/orders", this.ordersResponse, "POST",
                        {});				
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
