import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import validation from "./validation";
import { Input as TextInput, CommonButton, AntSelect } from "../../../../index";

function DocumentTypeForm({
  onSubmit,
  loading,
  hideDocumentTypeModal,
  submitButtonText,
  rowData,
}) {
  const { t } = useTranslation();

  const initialValues = {
    document_type: rowData?.document_type || "",
    category: rowData?.category || undefined,
  };
  const categoryData = [
    { id: "sc/st", name: "SC / ST" },
    { id: "obc", name: "OBC" },
    { id: "ews", name: "EWS" },
    { id: "general", name: "General" },
    { id: "dodm", name: "DODM" },
  ];

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <div className="form-group">
              <label className="form-label" htmlFor="documentType">
                {t("text.master.typeName")}
              </label>
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.master.documentTypePlaceholder")}
                name="document_type"
                disabled={false}
                variant="standard"
                type="text"
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="documentType">
                {t("text.master.category")}
              </label>
              <AntSelect
                size="large"
                id="category"
                extraClassName="form-control"
                name="category"
                disabled={false}
                variant="standard"
                placeholder="Select"
                arrayOfData={categoryData}
                setFieldValue={props.handleChange}
              />
            </div>

            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  className="btn btn-lg btn-primary"
                  type="submit"
                  loading={loading}
                >
                  {submitButtonText}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => hideDocumentTypeModal()}
                  className="link link-light"
                >
                  {t("text.common.cancel")}
                </Link>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default DocumentTypeForm;
