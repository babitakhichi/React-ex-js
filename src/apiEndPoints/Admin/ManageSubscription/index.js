const ManageSubscription = {
  addSubscription: {
    url: "/v1.0/admin/subscription",
    method: "POST",
  },

  editSubscription: (id) => ({
    url: `/v1.0/admin/subscription/${id}`,
    method: "PUT",
  }),
  subscriptionListing: {
    url: "/v1.0/admin/subscription",
    method: "GET",
  },
  updateSubscriptionStatus: (id) => ({
    url: `/v1.0/admin/subscription/status/${id}`,
    method: "PUT",
  }),
};
export default ManageSubscription;
