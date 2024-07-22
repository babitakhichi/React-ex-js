const ManageClientPartner = {
  getClientPartnerList: {
    url: "/v1.0/admin/all-partner",
    method: "GET",
  },

  AddClientPartner: {
    url: "/v1.0/admin/add-partner",
    method: "POST",
  },
  updateClientPartner: (id) => ({
    url: `/v1.0/admin/update-partner/${id}`,
    method: "PUT",
  }),
  deleteClientPartner: (id) => ({
    url: `/v1.0/admin/delete-partner/${id}`,
    method: "DELETE",
  }),
};
export default ManageClientPartner;
