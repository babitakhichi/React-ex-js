import React,{ useState } from "react";
import { withTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import {AntSelect, CommonButton} from "../../../index";


function ManageTeamMembersFilter({
  onSubmit,
  t,
  loading,
  filterData,
  onReset, 
 
}) {
  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (filterData?.member_type ) onReset();  };
 
  const initialValues = {
    member_type:undefined
  };
  
  const memberData = [
    {
      id: "visionPartners",
      name: "Vision partners",
    },
    {
      id: "keyMembers",
      name: "Key Members",
    },
  ];
  return (
    <Formik
       initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e.member_type ) {
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
                    {t("text.manageTeamMembers.membertype")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="member_type"
                      extraClassName="form-control"
                      name="member_type"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={memberData}
                  
                      value={values.member_type}
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

export default withTranslation()(ManageTeamMembersFilter);
