import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Input as TextInput, CommonButton, AntSelect, AntTextArea, UploadInput } from "../../../index";
import validation from "./validation";
import { AdminMedia } from "../../../../apiEndPoints";
import config from "../../../../config";

function AddEditTeamMemberForm({
  onSubmit,
  hideDocumentTypeModal,
  typeModal,
  loading,
  rowData,
}) {
  const { t } = useTranslation();
  const initialValues = {
    image: rowData?.img_url || "",
    name: rowData?.name || "",
    position: rowData?.position || "",
    member_type: rowData?.member_type || "",
    
    description: rowData?.description || ""
  };
  const membersTypeData = [
    {
      id: "keyMembers",
      name: "Key members",
    },
    {
      id: "visionPartners",
      name: "Vision Partners",
    }
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
          <div className="row">
            <div className="col-lg-12 mb-3">
              <div className="uploadImgModal">
              <UploadInput
                              apiEndPoints={AdminMedia.uploadTeamImage}
                              name="image"
                              type="file"                                                    
                              defaultImageUrl={
                                rowData?.img_url||
                            `${config.IMAGE_URL}/profile-img.jpg`
                              }
                              imageButton
                              setFieldValue={props.handleChange}
                            >
                              <Link to="#">
                              <p className="ant-upload-drag-icon mb-0">
                              <em className="icon ni ni-camera" />
                  </p>
                  {/* <p className="ant-upload-text">{t("text.userPayment.upload")}</p> */}
                              </Link>
                            </UploadInput>
                
              </div>
            </div>
            <div className="col-lg-6 ">
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="documentType">{t("text.manageTeamMembers.name")}</label>
                <TextInput 
                  className="form-control form-control-lg"
                  placeholder="Enter Name"
                  setFieldValue={props.handleChange}
                  name="name"
                  disabled={false}
                  variant="standard"
                  type="text"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group mb-3">
                <label className="form-label" htmlFor="documentType">{t("text.manageTeamMembers.position")}</label>
                <TextInput 
                  className="form-control form-control-lg"
                  placeholder="Enter Name"
                  setFieldValue={props.handleChange}
                  name="position"
                  disabled={false}
                  variant="standard"
                  type="text"
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group mb-3">
                <div className="mb-3">
                  <label className="form-label" htmlFor="plan"> {t("text.manageTeamMembers.membertype")}</label>
                  <AntSelect
                    size="large"
                    id="planType"
                    name="member_type"
                    disabled={false}
                    variant="standard"
                    placeholder="Select"
                    arrayOfData={membersTypeData}
                    setFieldValue={props.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-label" htmlFor="documentType">{t("text.common.description")}</label>
                <AntTextArea
                  className="form-control"
                  placeholder="Enter Description"
                  name="description"
                  size="large"
                  variant="standard"
                  type="text"
                  setFieldValue={props.handleChange}
                  maxLength={301}
                />
              </div>
            </div>
          </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
               
                  htmltype="button"
                  type="submit"
                >
                  {typeModal === "add"
                    ? t("text.common.add")
                    : t("text.common.update")}
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

export default AddEditTeamMemberForm;
