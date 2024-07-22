// PpTc Privacy policy and Terms and conditions
const ManageForPpTc = {
  get: (id) => ({
    url: `/v1.0/admin/cms/${id}`,
    method: "GET",
  }),
  update: (id) => ({
    url: `/v1.0/admin/cms/${id}`,
    method: "PUT",
  }),
};

export default ManageForPpTc;
