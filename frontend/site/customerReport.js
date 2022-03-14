const customerReport = function(resolve, reject) {
	getTemplate("customerReport.html").then(resp => {
		resolve({
			template: resp,
			data: function() {
				return {
					loading: false,					
					isMobileView: isMobileView(),	
					loadingTitle:'',
                    addModalShow :false,
                    upadateModalShow :false,	
                    userList:[],
                    customerList :[],	

                    formFilter :{
                        userId :'',
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

                loadFromServer("/report/customer-sales-report", this.getCustomerListResponse, "POST",
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

                getCustomerList: function () {					
					loadFromServer("/report/customer-sales-report", this.getCustomerListResponse, "POST",
				    { token: this.userToken });
				},	
                getCustomerListResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.customerList = resp.result						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},
                searchForm: function () {					
					loadFromServer("/report/customer-sales-report", this.searchFormResponse, "POST",
				    this.formFilter);
				},	
                searchFormResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.customerList = resp.result						
					}                   
					else {
						alert('Something Went Wrong..')							
					}
				},
                detailsResponse: function (resp) {			
					if (resp.status == 200) {		                       		
                        this.userList = resp.users						
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
