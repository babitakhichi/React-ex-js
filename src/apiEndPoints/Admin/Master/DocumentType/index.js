const DocumentType = {
  documentType: {
    url: "/v1.0/admin/document",
    method: "GET",
  },
  addDocumentType: {
    url: "/v1.0/admin/document",
    method: "POST",
  },
  editDocumentType: (id) => ({
    url: `/v1.0/admin/document/${id}`,
    method: "PUT",
  }),
  updateDocumentTypeStatus: (id) => ({
    url: `/v1.0/admin/document/status/${id}`,
    method: "PUT",
  }),
};
export default DocumentType;
