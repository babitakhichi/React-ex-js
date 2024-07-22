const Promotions = {
  getPromoCodeList: {
    url: "/v1.0/admin/all-promo-code",
    method: "GET",
  },
  createPromoCode:{
    url:"/v1.0/admin/add-promo-code",
    method:"POST"
  },
  updatePromoCode:(id)=>{
    return {
      url:`/v1.0/admin/update-promo-code/${id}`,
      method:"PUT"
    }
  },
  deletePromoCode:(id)=>{
    return {
      url:`/v1.0/admin/delete-promo-code/${id}`,
      method:"DELETE"
    }
  },
  updatePromoCodeStatus:(id)=>{
    return {
      url:`/v1.0/admin/update-promo-code-status/${id}`,
      method:"PUT"
    }
  },
  getConsumptionDashboard:{
    url:"/v1.0/admin/consumption-dashboard",
    method:"GET"
  }
};
export default Promotions;
