import React ,{ useState }from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import {AntSelect, CommonButton} from "../../../index";


function ManageClientsPartnersFilter({
  onSubmit,
  t,
  loading,
  filterData,
  onReset, 
 
}) {
  const initialValues = {
    category:filterData?.category 
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const categoryData = [
    {
      id: "client",
      name: "Client",
    },
    {
      id: "partner",
      name: "Partner",
    },
  ];






  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (
      filterData?.category
    )
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
    
      enableReinitialize
      validate={(e) => {
        if (
          e?.category 
        ) {
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
                    {t("text.manageClientsPartners.selectCategory")}                   
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
                    />
                  </div>
                </div>
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
                htmlType="submit"
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

export default withTranslation()(ManageClientsPartnersFilter);
