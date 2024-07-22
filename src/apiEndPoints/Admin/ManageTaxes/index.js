const ManageTaxes = {
  getTaxesList: {
    url: "/v1.0/admin/taxes",
    method: "GET",
  },

  updateTaxes: {
    url: "/v1.0/admin/update-tax",
    method: "PUT",
  },
};
export default ManageTaxes;
