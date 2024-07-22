import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
import { Col } from "react-bootstrap";

import { phoneNumberField } from "../../../../utils";
// import { useSelector } from "react-redux";
// import { selectProfileData } from "../../../../redux/UserSlice/index.slice";
import {
  AntSelect,
  AntTextArea,
  CommonButton,
  Input as TextInput,
  RippleEffect,
  ImageElement,
} from "../../../index";

import validation from "./validation";

function UserContactUsForm({
  onSubmit,
  loading,
  contactReasonData,
  userData,
  formRef,
  countryList,
  profileData,
}) {
  // let profileData = useSelector(selectProfileData);

  // const preferredHelpData = [
  //   {
  //     id: "all",
  //     name: "All",
  //   },
  // ];

  const initialValues = {
    first_name: "",
    last_name: "",
    description: "",
    email: profileData?.UserProfile?.email || "",
    conatct_type_id: undefined,
    country_code: undefined,
    phone_number: "",
    country_id: undefined,
  };
  function handleKey(e) {
    phoneNumberField(e);
  }
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(userData?.jwt)}
      innerRef={formRef}
      onSubmit={(e, { resetForm }) => {
        onSubmit(e, resetForm);
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form className="row">
            {!userData?.jwt && (
              <>
                <Col sm="6" className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.firstName")}{" "}
                  </label>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      name="first_name"
                      type="text"
                      placeholder={t("text.userProfile.enterFirstName")}
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </Col>
                <Col sm="6" className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.lastName")}
                  </label>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      name="last_name"
                      type="text"
                      placeholder={t("text.userProfile.enterLastName")}
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </Col>
                <Col sm="6" className="form-group">
                  <label className="form-label">
                    {t("text.userSignUp.selectCountry")}
                  </label>
                  <div className="form-control-wrap">
                    <AntSelect
                      size="medium"
                      id="status"
                      name="country_id"
                      disabled={false}
                      variant="standard"
                      placeholder="Search countries"
                      // defaultValue={values?.country_id}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        return (
                          option?.key
                            ?.toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0 ||
                          option?.title
                            .toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {countryList?.length > 0 &&
                        countryList?.map((item, index) => {
                          return (
                            <option
                              value={item?.id}
                              title={item?.name}
                              key={index}
                              id={item?.id}
                            >
                              {item?.svg_text ? (
                                <div
                                  className="flagIcon"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.svg_text?.replace(
                                      /^\/|\/$/g,
                                      ""
                                    ),
                                  }}
                                />
                              ) : (
                                <ImageElement
                                  className="flagIcon"
                                  source="flag-default.svg"
                                />
                              )}

                              {item?.name}
                            </option>
                          );
                        })}
                    </AntSelect>
                    {props.touched.country_id && props.errors.country_id ? (
                      <div className="ant-form-item-explain-error">
                        {props.errors.country_id}
                      </div>
                    ) : null}
                  </div>
                </Col>

                <Col sm="6" className="form-group numberCode">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.phoneLabel")}
                  </label>
                  <div className="form-control-wrap numberCode d-flex">
                    {/* <TextInput className="form-control text-center" type="text" placeholder="+91"/>   */}

                    <AntSelect
                      size="medium"
                      id="status"
                      // className="form-control"
                      name="country_code"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      setFieldValue={props.handleChange}
                      showSearch
                      focusNext
                      focusId="phone_number"
                      // arrayOfData={countryList}
                      // value={values.country_code}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    >
                      {countryList.length > 0 &&
                        countryList.map((item, key) => {
                          return (
                            <option key={key} value={`+${item?.phone_code}`}>
                              {`+${item?.phone_code}`}
                            </option>
                          );
                        })}
                    </AntSelect>
                    <TextInput
                      className="form-control"
                      onKeyPress={(e) => handleKey(e)}
                      min="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      placeholder={t("text.userProfile.phonePlaceholder")}
                      setFieldValue={props.handleChange}
                    />
                    {/* <TextInput className="form-control w-100" type="text" placeholder="Please enter a valid phone number"/>     */}
                  </div>
                </Col>
              </>
            )}
            <Col sm="6" className="form-group">
              <label className="form-label">
                {t("text.userProfile.email")}
              </label>
              <div className="form-control-wrap">
                <TextInput
                  className="form-control"
                  name="email"
                  type="email"
                  placeholder={t("text.adminForgetPassword.emailPlaceholder")}
                  setFieldValue={props.handleChange}
                />
              </div>
            </Col>
            <Col sm="6" className="form-group">
              <label className="form-label">
                {" "}
                {t("text.userContactUs.help")}
              </label>
              <div className="form-control-wrap">
                {/* <TextInput className="form-control" type="text" placeholder="Select Anyone"/>     */}
                <AntSelect
                  name="conatct_type_id"
                  placeholder="Select Anyone"
                  arrayOfData={contactReasonData}
                  className=""
                  setFieldValue={props.handleChange}
                />
              </div>
            </Col>
            <Col sm="12" className="form-group mb-0">
              <label className="form-label">
                {t("text.userContactUs.description")}
              </label>
              <div className="form-control-wrap">
                <AntTextArea
                  name="description"
                  className="form-control"
                  placeholder={t("text.userContactUs.descriptionPlaceholder")}
                  setFieldValue={props.handleChange}
                >
                  {" "}
                </AntTextArea>
              </div>
            </Col>
            <Col sm="12" className="text-end">
              <RippleEffect>
                <CommonButton
                  extraClassName="btn-md"
                  loading={loading}
                  variant="primary"
                  htmltype="button"
                  type="submit"
                >
                  {t("text.userLogin.submit")}
                </CommonButton>
              </RippleEffect>
            </Col>
          </Form>
        );
      }}
    </Formik>
  );
}
export default UserContactUsForm;
