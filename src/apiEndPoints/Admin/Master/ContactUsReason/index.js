const ContactUsReason = {
  contactReason: {
    url: "/v1.0/admin/contact-reason",
    method: "GET",
  },
  addContactReason: {
    url: "/v1.0/admin/contact-reason",
    method: "POST",
  },
  editContactReason: (id) => ({
    url: `/v1.0/admin/contact-reason/${id}`,
    method: "PUT",
  }),
  updateContactReasonStatus: (id) => ({
    url: `/v1.0/admin/contact-reason/status/${id}`,
    method: "PUT",
  }),
};
export default ContactUsReason;
