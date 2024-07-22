import { Formik, Form } from "formik";

import React, { useState } from "react"; // , { useState }
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AntSelect, CommonButton } from "../../../index";

function DocumentTypeFilter({
  onSubmit,
  t,
  loading,
  filterData,
  onReset,
  type,
}) {
  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const arrayOfData = [
    // { id: "all", name: "All" },
    {
      id: "active",
      name: "Active",
    },
    {
      id: "inactive",
      name: "Inactive",
    },
  ];

  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (filterData?.status || filterData?.category) onReset();
  };
  const categoryData = [
    { id: "sc/st", name: "SC / ST" },
    { id: "obc", name: "OBC" },
    { id: "ews", name: "EWS" },
    { id: "general", name: "General" },
    { id: "dodm", name: "DODM" },
  ];
  const initialValues = {
    status: undefined,
    category: undefined,
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e.status || e.category) {
          setDisableReset(false);
          setDisableSubmit(true);
        } else {
          setDisableReset(true);
          setDisableSubmit(false);
        }
      }}
    >
      {(props) => {
        const { values } = props;
        return (
          <Form>
            <div className="dropdown-body dropdown-body-rg">
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.common.status")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="status"
                      extraClassName="form-control"
                      name="status"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={arrayOfData}
                      setFieldValue={props.handleChange}
                      value={values.status}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    />
                  </div>
                </div>

                {type === "docType" && (
                  <div className="form-group">
                    <label className="overline-title overline-title-alt">
                      {t("text.master.category")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="category"
                      extraClassName="form-control"
                      name="category"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={categoryData}
                      value={values.category}
                      setFieldValue={props.handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="dropdown-foot between">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!disableReset) {
                    onHandleReset(props.resetForm);
                  }
                }}
                type="button"
                className="clickable"
              >
                {t("text.common.reset")}
              </Link>

              <CommonButton
                extraClassName="btn btn-sm btn-primary"
                htmltype="submit"
                loading={loading}
                type="submit"
              >
                {t("text.common.filter")}
              </CommonButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default withTranslation()(DocumentTypeFilter);
