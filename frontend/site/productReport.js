const productReport = function(resolve, reject) {
	getTemplate("productReport.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',
                    addModalShow :false,
                    upadateModalShow :false,	
                    productList:[],
                    reportList :[],	

                    formFilter :{
                        productId :'',
                        from_date :new Date(),
                        to_date :new Date(),
                    }	
				}
			},
			components: {
				Header
			},			
			mounted: function() {
                loadFromServer("/report/details", this.detailsResponse, "POST"); 

                loadFromServer("/report/product-sales-report", this.getProductListResponse, "POST",
				    this.formFilter); 
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
                detailsResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.productList = resp.products						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},		
                
                getProductListResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.reportList = resp.result						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},
                searchForm: function () {					
					loadFromServer("/report/product-sales-report", this.searchFormResponse, "POST",
				    this.formFilter);
				},	
                searchFormResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.reportList = resp.result						
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
