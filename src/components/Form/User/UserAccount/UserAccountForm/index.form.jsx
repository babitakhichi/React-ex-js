import { Form, Formik } from "formik";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import config from "../../../../../config";
import {
  dateValidationForDOB,
  getSplittedUsername,
  logger,
  modalNotification,
  momentDateFormatter,
} from "../../../../../utils";
import {
  AntSelect,
  CommonButton,
  Input as TextInput,
  RippleEffect,
  DatePicker,
  ImageElement,
  Checkbox,
} from "../../../../index";
import validation from "./validation";
import { CommonServices } from "../../../../../services";

function UserAccountForm({
  isEdit,
  setIsEdit,
  onSubmit,
  profileData,
  languageDetails,
  loading,
  formRef,
  countryList,
  genderList,

  // setCountryName,
}) {
  const [dob, setDOB] = useState("");

  useEffect(() => {
    if (profileData?.UserProfile?.dob) {
      setDOB(profileData?.UserProfile?.dob);
    } else {
      setDOB("");
    }
  }, [profileData]);

  const disabledDobDate = (current) => {
    return current && current.valueOf() > dateValidationForDOB(365);
  };

  const [first, last] = getSplittedUsername(
    profileData?.UserProfile?.full_name
  );

  const initialValues = {
    type: "businessAccountUpdate",
    first_name: first || "",
    last_name: last || "",
    business_name: profileData?.UserProfile?.business_name || "",
    language: profileData?.UserProfile?.default_lang_title || undefined,

    gender_id: profileData?.UserProfile?.gender_id || undefined,
    dob: "",
    country_id: profileData?.UserProfile?.country_id || "",
    organization_name:
      profileData?.UserBusinessAccount?.organization_name || "",
    gst_number: profileData?.UserBusinessAccount?.gst_number || "",
    address: profileData?.UserBusinessAccount?.address || "",
    city:
      (profileData?.UserBusinessAccount?.city &&
        (!!Number(profileData?.UserBusinessAccount?.city)
          ? Number(profileData?.UserBusinessAccount?.city)
          : profileData?.UserBusinessAccount?.city)) ||
      "",
    postal_code: profileData?.UserBusinessAccount?.postal_code || "",
    state_id:
      (profileData?.UserProfile?.state_id &&
        (!!Number(profileData?.UserProfile?.state_id)
          ? Number(profileData?.UserProfile?.state_id)
          : profileData?.UserProfile?.state_id)) ||
      "",

    state:
      (profileData?.UserBusinessAccount?.state &&
        (!!Number(profileData?.UserBusinessAccount?.state)
          ? Number(profileData?.UserBusinessAccount?.state)
          : profileData?.UserBusinessAccount?.state)) ||
      "",

    business_country_id:
      profileData?.UserBusinessAccount?.business_country_id || "",
    pan_number: profileData?.UserBusinessAccount?.pan_number || "",
    isGST: !profileData?.UserBusinessAccount?.gst_number || false,
    profile_address: profileData?.UserProfile?.profile_address || "",
    zip_code: profileData?.UserProfile?.zip_code || "",
    city_id:
      (profileData?.UserProfile?.city_id &&
        (!!Number(profileData?.UserProfile?.city_id)
          ? Number(profileData?.UserProfile?.city_id)
          : profileData?.UserProfile?.city_id)) ||
      "",
  };
  const [formValue, setFormValue] = useState({ ...initialValues });
  const [stateList, setStateList] = useState([]);
  const [stateProfileList, setStateProfileList] = useState([]);
  const [citiesProfileList, setCitiesProfileList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const getStateList = async (id, type) => {
    try {
      let queryParams = {
        country_id: id,
      };
      let res = await CommonServices.stateList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        if (type === "profile") {
          setStateProfileList(data?.rows);
        } else {
          setStateList(data?.rows);
          if (data?.rows <= 0) setCitiesList([]);
        }
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
  const getCitiesList = async (countryId, stateId, type) => {
    try {
      let queryParams = {
        country_id: countryId,
        state_id: stateId,
      };
      let res = await CommonServices.citiesList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        if (type === "profile") setCitiesProfileList(data?.rows);
        else setCitiesList(data?.rows);
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
    if (profileData?.UserProfile?.country_id) {
      getStateList(profileData?.UserProfile?.country_id, "profile");
    }
    if (profileData?.UserProfile?.state_id)
      getCitiesList(
        profileData?.UserProfile?.country_id,
        profileData?.UserProfile?.state_id,
        "profile"
      );
    if (profileData?.UserBusinessAccount) {
      getStateList(profileData?.UserBusinessAccount?.business_country_id);
      getCitiesList(
        profileData?.UserBusinessAccount?.business_country_id,
        profileData?.UserBusinessAccount?.state
      );
    }
  }, [profileData]);

  // const onChangeState = (val, props) => {
  //   props.setFieldValue("state", val);
  //   props.setFieldValue("city", "");
  // };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(profileData, formValue)}
      innerRef={formRef}
      onSubmit={(values) => {
        let data = { ...values };
        data.dob = dob;
        onSubmit({ ...data });
      }}
      enableReinitialize
      validate={(e) => {
        setFormValue(e);
      }}
    >
      {(props) => {
        let { values } = props;
        return (
          <Form>
            <h2 className="backheading font-eb">
              {t("text.userProfile.profileDetail")}
            </h2>
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
                      placeholder={t("text.userProfile.languagePlaceholder")}
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
                      disabled={!isEdit}
                      className="form-control"
                      placeholder="DD-MM-YY"
                      allowClear={false}
                      onChange={(e) => {
                        setDOB(e);
                      }}
                      value={dob ? momentDateFormatter(dob, "YYYY-MM-DD") : ""}
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
                      disabled={!isEdit}
                      placeholder={t("text.userProfile.genderPlaceholder")}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
                      disabled={!isEdit}
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
            {profileData?.UserBusinessAccount && (
              <>
                <h2 className="backheading font-eb">
                  {" "}
                  {t("text.userProfile.businessDetail")}
                </h2>
                <Row>
                  <Col sm="6">
                    <div className="form-group">
                      <label className="form-label">
                        {" "}
                        {t("text.userProfile.organizationName")}
                      </label>
                      <div className="form-control-wrap">
                        <TextInput
                          className="form-control"
                          placeholder="Enter Organization Name"
                          type="text"
                          icon={
                            <div className="form-icon form-icon-left icon-gradiant">
                              <em className="icon-organization" />
                            </div>
                          }
                          name="organization_name"
                          disabled={!isEdit}
                          setFieldValue={props.handleChange}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="form-group">
                      <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                        <label className="form-label order-2 order-sm-1">
                          GST / VAT Number
                        </label>
                        <Checkbox
                          className="mb-3 mb-sm-2 ms-sm-auto order-1 order-sm-2"
                          name="isGST"
                          checked={values.isGST}
                          onChange={(e) => {
                            props?.setFieldValue("gst_number", "");
                            props?.setFieldValue("isGST", e?.target?.checked);
                          }}
                          disabled={!isEdit}
                        >
                          I do not have GST/VAT detail
                        </Checkbox>
                      </div>
                      <div className="form-control-wrap">
                        <TextInput
                          className="form-control"
                          placeholder="Enter GST / VAT Number"
                          type="text"
                          icon={
                            <div className="form-icon form-icon-left icon-gradiant">
                              <em className="icon-tag" />
                            </div>
                          }
                          name="gst_number"
                          disabled={!isEdit || values.isGST}
                          setFieldValue={props.handleChange}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="form-group">
                      <label className="form-label">
                        {" "}
                        {t("text.userProfile.panNumber")}
                      </label>
                      <div className="form-control-wrap">
                        <TextInput
                          className="form-control"
                          placeholder="Enter PAN Number"
                          type="text"
                          icon={
                            <div className="form-icon form-icon-left icon-gradiant">
                              <em className="icon-location" />
                            </div>
                          }
                          name="pan_number"
                          disabled={!isEdit}
                          setFieldValue={props.handleChange}
                        />
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
                          name="business_country_id"
                          disabled={!isEdit}
                          variant="standard"
                          placeholder="Select"
                          defaultValue={values?.business_country_id}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) => {
                            return (
                              option?.key
                                ?.toLowerCase()
                                .indexOf(input?.toLowerCase()) >= 0 ||
                              option?.title
                                ?.toLowerCase()
                                ?.indexOf(input?.toLowerCase()) >= 0
                            );
                          }}
                          onSelect={(e) => {
                            props?.setFieldValue("business_country_id", e);
                            getStateList(e);
                            props?.setFieldValue("state", "");
                            props?.setFieldValue("city", "");
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
                        {/* {stateList?.length > 0 ? ( */}
                        <AntSelect
                          size="medium"
                          id="state"
                          name="state"
                          variant="standard"
                          disabled={!isEdit}
                          placeholder="Select States "
                          showSearch
                          optionFilterProp="children"
                          onSelect={(e) => {
                            props?.setFieldValue("state", e);
                            getCitiesList(values?.business_country_id, e);
                            props?.setFieldValue("city", "");
                          }}
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
                          {stateList?.length > 0 &&
                            stateList?.map((item, index) => {
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
                            id="state"
                            name="state"
                            disabled={!isEdit}
                            // setFieldValue={(e) => {
                            //   props.handleChange(e);
                            //   console.log("e", e);
                            // }}
                            onChange={(e) => {
                              onChangeState(e.target.value, props);
                            }}
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
                          id="city"
                          name="city"
                          variant="standard"
                          disabled={!isEdit}
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
                          {citiesList?.length > 0 &&
                            citiesList?.map((item) => {
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
                        {" "}
                        {t("text.userProfile.address")}
                      </label>
                      <div className="form-control-wrap">
                        <TextInput
                          className="form-control"
                          placeholder="Enter Address / Street"
                          type="text"
                          icon={
                            <div className="form-icon form-icon-left icon-gradiant">
                              <em className="icon-location" />
                            </div>
                          }
                          name="address"
                          disabled={!isEdit}
                          setFieldValue={props.handleChange}
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
                          icon={
                            <div className="form-icon form-icon-left icon-gradiant">
                              <em className="icon-map-pin" />
                            </div>
                          }
                          name="postal_code"
                          disabled={!isEdit}
                          setFieldValue={props.handleChange}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            )}

            <Col sm="12">
              {isEdit ? (
                <div className="text-end">
                  <RippleEffect>
                    <CommonButton
                      onClick={() => {
                        props.resetForm({ ...profileData });
                        setIsEdit(false);
                        if (profileData?.UserProfile?.state_id) {
                          getStateList(
                            profileData?.UserProfile?.country_id,
                            "profile"
                          );
                        }
                        if (profileData?.UserBusinessAccount) {
                          getStateList(
                            profileData?.UserBusinessAccount
                              ?.business_country_id
                          );
                          getCitiesList(
                            profileData?.UserBusinessAccount
                              ?.business_country_id,
                            profileData?.UserBusinessAccount?.state
                          );
                        }
                      }}
                      variant="info"
                      extraClassName="me-3"
                    >
                      {t("text.common.cancel")}
                    </CommonButton>
                  </RippleEffect>
                  <RippleEffect>
                    <CommonButton
                      loading={loading}
                      htmltype="button"
                      type="submit"
                      variant="primary"
                    >
                      {t("text.userProfile.saveChanges")}
                    </CommonButton>
                  </RippleEffect>
                </div>
              ) : (
                <div className="text-end">
                  <RippleEffect>
                    <CommonButton
                      onClick={() => setIsEdit(true)}
                      variant="primary"
                    >
                      {t("text.userProfile.editProfile")}
                    </CommonButton>
                  </RippleEffect>
                </div>
              )}
            </Col>
          </Form>
        );
      }}
    </Formik>
  );
}
export default React.memo(UserAccountForm);
