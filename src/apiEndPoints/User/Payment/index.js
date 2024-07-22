const Payment = {
  createOrder: {
    url: "/v1.0/order",
    method: "POST",
  },
  checkSwitch: {
    url: "/v1.0/check-switch",
    method: "POST",
  },
  getActiveOrder: {
    url: "/v1.0/active-plan",
    method: "GET",
  },
  orderCancel: {
    url: "/v1.0/order-cancel",
    method: "POST",
  },
  updatePaymentStatus: {
    url: "/v1.0/order/payment-status",
    method: "POST",
  },
  autoRenewUpdate: {
    url: "/v1.0/cancel-subscription",
    method: "POST",
  },
  downloadInvoice: {
    url: "/v1.0/invoice-generate",
    method: "POST",
  },
};
export default Payment;
