const NewsletterSubscribers = {
  getNewsletters: {
    url: "/v1.0/admin/get_news_letters",
    method: "GET",
  },
  deleteNews: (id) => ({
    url: `/v1.0/admin/delete_news_letter/${id}`,
    method: "DELETE",
  }),
  sendNewsletter: {
    url: "/v1.0/admin/send_news_letter",
    method: "POST",
  },
};
export default NewsletterSubscribers;
