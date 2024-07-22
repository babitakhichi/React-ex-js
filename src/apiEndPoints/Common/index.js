const Common = {
  /**
   *Common
   */
  countries: {
    url: "v2.0/countries",
    method: "GET",
  },

  singleCountry: (code) => ({
    url: `v2.0/get_country_code/${code}`,
    method: "GET",
  }),
  getAllCms: {
    url: "/v1.0/admin/cms",
    method: "GET",
  },
  subscribe: {
    url: "/v2.0/save_news_letter",
    method: "POST",
  },
  documentType: {
    url: "/v1.0/document",
    method: "GET",
  },
  gender: {
    url: "v2.0/genders",
    method: "GET",
  },
  state: {
    url: "v2.0/states",
    method: "GET",
  },
  cities: {
    url: "v2.0/cities",
    method: "GET",
  },
};

export default Common;
