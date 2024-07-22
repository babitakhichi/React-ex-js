import { Form, Formik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Input as TextInput,
  CommonButton,
  AntSelect,
  UploadInput,
} from "../../../index";
import validation from "./validation";
import { AdminMedia } from "../../../../apiEndPoints";
import config from "../../../../config";

function AddEditClientPartnerForm({
  onSubmit,
  hideDocumentTypeModal,
  typeModal,
  loading,
  rowData,
}) {
  const { t } = useTranslation();
  const initialValues = {
    image: rowData?.image_url || "",
    name: rowData?.name || "",
    category: rowData?.category || "",
  };
  const planTypeData = [
    {
      id: "Client",
      name: "Client",
    },
    {
      id: "Partner",
      name: "Partner",
    },
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
                    aspectSlider
                    apiEndPoints={AdminMedia.uploadClientImage}
                    name="image"
                    type="file"
                    defaultImageUrl={
                      rowData?.image_url ||
                      `${config.IMAGE_URL}/profile-img.jpg`
                    }
                    imageButton
                    applyImageCropper={false}
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
                  <label className="form-label" htmlFor="documentType">
                    {t("text.manageTeamMembers.name")}
                  </label>
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
                <div className="form-group">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      Select Category
                    </label>
                    <AntSelect
                      size="large"
                      id="category"
                      name="category"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={planTypeData}
                      setFieldValue={props.handleChange}
                    />
                  </div>
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

export default AddEditClientPartnerForm;
