const Faqs = {
  getAllFaqs: {
    url: `/v1.0/admin/faq`,
    method: "GET",
  },
  addFaq: {
    url: "/v1.0/admin/faq",
    method: "POST",
  },
  faqDetail: (id) => ({
    url: `/v1.0/admin/faq/${id}`,
    method: "GET",
  }),
  updateFaq: (id) => ({
    url: `/v1.0/admin/faq/${id}`,
    method: "PUT",
  }),
  deleteFaq: (id) => ({
    url: `/v1.0/admin/faq/${id}`,
    method: "DELETE",
  }),
};

export default Faqs;
