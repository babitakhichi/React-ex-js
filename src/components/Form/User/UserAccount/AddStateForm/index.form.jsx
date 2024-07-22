import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useState, useEffect } from "react";
// import ReactFlagsSelect from "react-flags-select";
import { Col, Row } from "react-bootstrap";
import {
  AntSelect,
  CommonButton,
  DatePicker,
  RippleEffect,
  Input as TextInput,
} from "../../../../index";
import { validation } from "./validation";
import { ImageElement } from "../../../../UiElement";
import { CommonServices } from "../../../../../services";
import {
  dateValidationForDOB,
  getSplittedUsername,
  logger,
  modalNotification,
  momentDateFormatter,
} from "../../../../../utils";
import config from "../../../../../config";

function AddStateForm({
  onSubmit,
  handleClose,
  languageDetails,
  loading,
  userData,
  formRef,
  countryList,
  genderList,
}) {
  const [first, last] = getSplittedUsername(userData?.UserProfile?.full_name);

  const initialValues = {
    first_name: first || "",
    last_name: last || "",
    business_name: userData?.UserProfile?.business_name || "",
    language: userData?.UserProfile?.default_lang_title || undefined,
    gender_id: userData?.UserProfile?.gender_id || undefined,
    dob: "",
    country_id: userData?.UserProfile?.country_id || "",
    state_id:
      (userData?.UserProfile?.state_id &&
        (!!Number(userData?.UserProfile?.state_id)
          ? Number(userData?.UserProfile?.state_id)
          : userData?.UserProfile?.state_id)) ||
      "",
    profile_address: userData?.UserProfile?.profile_address || "",
    zip_code: userData?.UserProfile?.zip_code || "",
    city_id:
      (userData?.UserProfile?.city_id &&
        (!!Number(userData?.UserProfile?.city_id)
          ? Number(userData?.UserProfile?.city_id)
          : userData?.UserProfile?.city_id)) ||
      "",
    type: "profile",
  };
  const [stateProfileList, setStateProfileList] = useState([]);
  const [citiesProfileList, setCitiesProfileList] = useState([]);
  const [dob, setDOB] = useState("");

  useEffect(() => {
    if (userData?.UserProfile?.dob) {
      setDOB(userData?.UserProfile?.dob);
    } else {
      setDOB("");
    }
  }, [userData]);

  const disabledDobDate = (current) => {
    return current && current.valueOf() > dateValidationForDOB(365);
  };
  const getStateList = async (id) => {
    try {
      let queryParams = {
        country_id: id,
      };
      let res = await CommonServices.stateList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        setStateProfileList(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  const getCitiesList = async (countryId, stateId) => {
    try {
      let queryParams = {
        country_id: countryId,
        state_id: stateId,
      };
      let res = await CommonServices.citiesList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        setCitiesProfileList(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  useEffect(() => {
    if (userData?.UserProfile?.country_id) {
      getStateList(userData?.UserProfile?.country_id);
    }
    if (userData?.UserProfile?.state_id)
      getCitiesList(
        userData?.UserProfile?.country_id,
        userData?.UserProfile?.state_id
      );
  }, []);
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={(values) => {
        let data = { ...values };
        data.dob = dob;
        onSubmit({ ...data });
      }}
      innerRef={formRef}
      enableReinitialize
    >
      {(props) => {
        let { values } = props;
        return (
          <>
            <Form>
              {/* ------------------------ add mobile number modal---------------------- */}

              <>
                <div className="modalHeader">
                  <h3>Complete Profile</h3>
                </div>
                <div className="modalForm">
                  <Row>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {t("text.userProfile.firstName")}
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            className="form-control"
                            type="text"
                            placeholder={t("text.userProfile.enterFirstName")}
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-user" />
                              </div>
                            }
                            name="first_name"
                            setFieldValue={props.handleChange}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {t("text.userProfile.lastName")}
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            name="last_name"
                            className="form-control"
                            type="text"
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-user" />
                              </div>
                            }
                            placeholder={t("text.userProfile.enterLastName")}
                            setFieldValue={props.handleChange}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <div className="form-control-wrap">
                          <TextInput
                            name="business_name"
                            className="form-control"
                            type="text"
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-company" />
                              </div>
                            }
                            placeholder="Enter Company Name"
                            setFieldValue={props.handleChange}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {t("text.userProfile.preferred")}
                        </label>
                        <div className="form-control-wrap">
                          <AntSelect
                            name="language"
                            placeholder={t(
                              "text.userProfile.languagePlaceholder"
                            )}
                            // arrayOfData={languageDetails}
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-language" />
                              </div>
                            }
                            showSearch
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0 ||
                              option.props.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            setFieldValue={props.handleChange}
                          >
                            {languageDetails?.length > 0 &&
                              languageDetails?.map((item, key) => {
                                return (
                                  <option value={item?.codeName} key={key}>
                                    {item?.codeName}
                                  </option>
                                );
                              })}
                          </AntSelect>
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {t("text.userProfile.dob")}
                        </label>
                        <div className="form-control-wrap">
                          <DatePicker
                            className="form-control"
                            placeholder="DD-MM-YY"
                            allowClear={false}
                            onChange={(e) => {
                              setDOB(e);
                            }}
                            value={
                              dob ? momentDateFormatter(dob, "YYYY-MM-DD") : ""
                            }
                            hasEvent
                            dateFormate={config.DATE_FORMAT}
                            suffixIcon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-calendar" />
                              </div>
                            }
                            disabledDate={disabledDobDate}
                            defaultPickerValue={dateValidationForDOB(365)}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {t("text.userProfile.gender")}
                        </label>
                        <div className="form-control-wrap">
                          <AntSelect
                            id="gender_id"
                            name="gender_id"
                            placeholder={t(
                              "text.userProfile.genderPlaceholder"
                            )}
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-gender" />
                              </div>
                            }
                            setFieldValue={props.handleChange}
                          >
                            {" "}
                            {genderList?.length > 0 &&
                              genderList?.map((item) => {
                                return (
                                  <option
                                    value={item?.id}
                                    title={item?.title}
                                    key={item?.title}
                                    id={item?.id}
                                  >
                                    {item?.title}
                                  </option>
                                );
                              })}
                          </AntSelect>
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {" "}
                          {t("text.userProfile.country")}
                        </label>
                        <div className="form-control-wrap">
                          <AntSelect
                            size="medium"
                            id="status"
                            name="country_id"
                            variant="standard"
                            placeholder="Select"
                            // defaultValue={values?.country_id}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                              return (
                                option?.key
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0 ||
                                option?.title
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0
                              );
                            }}
                            onSelect={(e) => {
                              props?.setFieldValue("country_id", e);
                              getStateList(e, "profile");
                              props?.setFieldValue("state_id", "");
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
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {" "}
                          {t("text.userProfile.state")}
                        </label>
                        <div className="form-control-wrap">
                          {/* {stateProfileList?.length > 0 ? ( */}
                          <AntSelect
                            size="medium"
                            id="state_id"
                            name="state_id"
                            variant="standard"
                            placeholder="Select States "
                            showSearch
                            optionFilterProp="children"
                            onSelect={(e) => {
                              props?.setFieldValue("state_id", e);
                              getCitiesList(
                                values?.business_country_id,
                                e,
                                "profile"
                              );
                              props?.setFieldValue("city_id", "");
                            }}
                            filterOption={(input, option) => {
                              return (
                                option?.key
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0 ||
                                option?.title
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0
                              );
                            }}
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-state" />
                              </div>
                            }
                          >
                            {stateProfileList?.length > 0 &&
                              stateProfileList?.map((item, index) => {
                                return (
                                  <option
                                    value={item?.id}
                                    title={item?.name}
                                    key={index}
                                    id={item?.id}
                                  >
                                    {item?.name}
                                  </option>
                                );
                              })}
                          </AntSelect>
                          {/* ) : (
                      <TextInput
                        className="form-control"
                        placeholder="Enter State / Province"
                        type="text"
                        icon={
                          <div className="form-icon form-icon-left icon-gradiant">
                            <em className="icon-state" />
                          </div>
                        }
                        id="state_id"
                        name="state_id"
                        disabled={!isEdit}
                        setFieldValue={props.handleChange}
                      />
                    )} */}
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {" "}
                          {t("text.userProfile.city")}
                        </label>
                        <div className="form-control-wrap">
                          {/* {citiesList?.length > 0 ? ( */}
                          <AntSelect
                            size="medium"
                            id="city_id"
                            name="city_id"
                            variant="standard"
                            placeholder="Select city "
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
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-state" />
                              </div>
                            }
                          >
                            {citiesProfileList?.length > 0 &&
                              citiesProfileList?.map((item) => {
                                return (
                                  <option
                                    value={item?.id}
                                    title={item?.city_name}
                                    key={item?.city_name}
                                    id={item?.id}
                                  >
                                    {item?.city_name}
                                  </option>
                                );
                              })}{" "}
                          </AntSelect>
                          {/* ) : (
                          <TextInput
                            className="form-control"
                            placeholder="Enter City"
                            type="text"
                            name="city"
                            disabled={!isEdit}
                            setFieldValue={props.handleChange}
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-buildings-alt" />
                              </div>
                            }
                          />
                        )} */}
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {t("text.userProfile.address")}
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            className="form-control"
                            placeholder="Enter Address / Street"
                            type="text"
                            name="profile_address"
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-location" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">
                          {" "}
                          {t("text.userProfile.postalCode")}
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            className="form-control"
                            placeholder="Enter Postal Code"
                            type="text"
                            name="zip_code"
                            icon={
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-map-pin" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    {/* <div className="form-group col-sm-6">
                <label className="form-label">Phone Number</label>
                <div className="form-control-wrap numberCode d-flex">
                  <AntSelect disabled={!isEdit} defaultValue="+41" placeholder="Select" arrayOfData={codeData} />
                  <TextInput className="form-control"
                    type="text"
                    value="123 456 7890" disabled={!isEdit} />    
                </div>   
              </div> */}
                    {/* <div className="form-group col-sm-6">
                <label className="form-label">Email Id</label>
                <div className="form-control-wrap">
                  <TextInput className="form-control"
                    type="email"
                    icon={<div className="form-icon form-icon-left icon-gradiant"><em className="icon-email"/></div>}
                    value="johndoe@gmail.com" disabled={!isEdit} />    
                </div>        
              </div> */}
                  </Row>

                  <div className="text-end modalFooter">
                    <RippleEffect extraClassName="me-2 me-sm-3" type="light">
                      <CommonButton
                        onClick={() => handleClose()}
                        variant="info"
                      >
                        {t("text.common.cancel")}
                      </CommonButton>
                    </RippleEffect>
                    <RippleEffect>
                      <CommonButton
                        variant="primary"
                        htmltype="button"
                        loading={loading}
                        type="submit"
                      >
                        {t("text.userProfile.continue")}
                      </CommonButton>
                    </RippleEffect>
                  </div>
                </div>
              </>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
export default AddStateForm;
