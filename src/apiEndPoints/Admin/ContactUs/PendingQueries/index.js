const PendingQueries = {
  getPendingQueries: {
    url: "/v1.0/get_queries",
    method: "GET",
  },
  sendReply: {
    url: "/v1.0/replied_query",
    method: "POST",
  },
  deleteQuery: {
    url: "/v1.0/delete_query",
    method: "POST",
  },
};
export default PendingQueries;
