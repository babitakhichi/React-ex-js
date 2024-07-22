const DiscountRequest = {
  getDiscountRequest: {
    url: "/v2.0/admin/discount-request",
    method: "GET",
  },
  updateDiscountRequestStatus: (id) => ({
    url: `/v2.0/admin/discount-request/update-status/${id}`,
    method: "PUT",
  }),
  discountRefund: {
    url: "/v1.0/admin/discount-refund",
    method: "POST",
  },
};
export default DiscountRequest;
