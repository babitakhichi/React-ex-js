import { Form, Formik } from "formik";
// import { t } from "i18next";
import React, { useState } from "react";

// import { Col, Row } from "react-bootstrap";
import { Radio } from "antd";
// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import { t } from "i18next";
import {
  AffirmativeAction,
  AntRadio,
  // AntSelect,
  //   AntTextArea,
  AntTooltip,
  CommonButton,
  Input as TextInput,
  PaymentModeFrom,
  RippleEffect,
  UserBusinessForm,
} from "../../..";
import validation from "./validation";

export default function PaymentForm({
  onFormSubmit,
  formRef,
  loading,
  planDetails,
  setCheckCoin,
  getPrice,
  availableCoin,
  pageData,
  userData,
  documentType,
  setCategory,
  setDocumentType,
  onVerifyClick,
  handleAddMoblieEmailShow,
  taxes,
  taxesPercentage,
  countryList,
  stateList,
  createBusinessAccount,
  setNoLicenses,
  noLicensesPrice,
  handleCouponShow,
  coupanAmount,
  setCoupanAmount,
  coinsLimit,
  handleStateShow,
}) {
  const paymentType = [
    {
      id: "card",
      label: "Credit & Debit Cards",
    },
    {
      id: "netbanking",
      label: "Internet Banking",
    },
    {
      id: "upi",
      label: "UPI",
    },
  ];

  const initialValues = {
    payment_type: "card",
    description: "",
    category: undefined,
    refund_type: undefined,
    document_type: undefined,
    auto_recurring: false,
    coin: false,
    affirmative: "2",
    image: "",
    no_licenses: 1,
  };
  const [formValue, setFormValue] = useState({ ...initialValues });

  // const codeData = [
  //   {
  //     id: "+91",
  //     name: "+91",
  //   },
  //   {
  //     id: "+14",
  //     name: "+14",
  //   },
  //   {
  //     id: "+41",
  //     name: "+41",
  //   },
  // ];

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(formValue, planDetails)}
      onSubmit={onFormSubmit}
      innerRef={formRef}
      enableReinitialize
      validate={(e) => {
        setCheckCoin(e.coin);
        setCategory(e.category);
        setFormValue(e);
        setNoLicenses(e.no_licenses);
      }}
    >
      {(props) => {
        return (
          <Form className="d-xl-flex">
            <div className="paymentMode_cnt_details">
              <div className="affirmative mt-0">
                <Radio.Group
                  className="mb-3 mb-xl-4"
                  value={props?.values?.payment_type}
                >
                  <ul className="list-unstyled mb-0 d-flex flex-wrap">
                    {paymentType.map((item, key) => {
                      return (
                        <li key={key}>
                          <AntRadio
                            name="payment_type"
                            id="payment_type"
                            value={item.id}
                            onChange={props?.handleChange}
                          >
                            {item.label}
                          </AntRadio>
                        </li>
                      );
                    })}
                  </ul>
                </Radio.Group>
                <div className="mb-3 mb-xl-4 d-flex">
                  {(!userData?.UserProfile?.state_id ||
                    !userData?.UserProfile?.zip_code ||
                    !userData?.UserProfile?.profile_address ||
                    !userData?.UserProfile?.city_id) &&
                    planDetails?.is_corporate === "0" && (
                      <CommonButton
                        extraClassName="btn-md mt-1 me-4"
                        onClick={handleStateShow}
                        variant="primary"
                      >
                        Complete Profile
                      </CommonButton>
                    )}
                  {(!userData?.UserProfile?.email_verified ||
                    !userData?.UserProfile?.phone_verified) && (
                    <>
                      {!userData?.UserProfile?.mobile_no && (
                        <CommonButton
                          extraClassName="btn-md mt-1"
                          onClick={() => handleAddMoblieEmailShow("phone")}
                          variant="primary"
                        >
                          {t("text.userProfile.addPhone")}
                        </CommonButton>
                      )}
                      {!userData?.UserProfile?.email && (
                        <CommonButton
                          extraClassName="btn-md mt-1"
                          onClick={() => handleAddMoblieEmailShow("email")}
                          variant="primary"
                        >
                          {t("text.userProfile.addEmail")}
                        </CommonButton>
                      )}
                    </>
                  )}
                </div>
                {(!userData?.UserProfile?.email_verified ||
                  !userData?.UserProfile?.phone_verified) && (
                  <div className="mb-3 mb-xl-4">
                    {((!userData?.UserProfile?.phone_verified &&
                      userData?.UserProfile?.mobile_no) ||
                      (!userData?.UserProfile?.email_verified &&
                        userData?.UserProfile?.email)) && (
                      <div className="form-group w-100">
                        <label className="form-label d-flex">
                          {!userData?.UserProfile?.phone_verified
                            ? "Phone Number"
                            : "Email Id"}{" "}
                          <AntTooltip promptText="Not Verified">
                            <em className="ms-2 icon-unverify icon-notverified" />
                          </AntTooltip>
                        </label>
                        {!userData?.UserProfile?.phone_verified ? (
                          <>
                            <div className="form-control-wrap numberCode d-flex">
                              <div className="ant-form-item">
                                <input
                                  className="form-control"
                                  value={
                                    userData?.UserProfile?.mobile_country_code
                                  }
                                  disabled
                                />
                              </div>
                              <div className="ant-form-item">
                                <input
                                  className="form-control"
                                  value={userData?.UserProfile?.mobile_no}
                                  disabled
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="form-control-wrap numberCode d-flex">
                              <div className="form-icon form-icon-left icon-gradiant">
                                <em className="icon-email" />
                              </div>
                              <input
                                className="form-control"
                                value={userData?.UserProfile?.email}
                                disabled
                              />
                            </div>
                          </>
                        )}

                        <div className="text-end">
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onVerifyClick(
                                userData?.UserProfile?.phone_verified
                                  ? "email"
                                  : "mobile"
                              );
                            }}
                            className="ft-14 link-primary mt-1 mt-lg-2 d-inline-block font-sb"
                          >
                            Verify{" "}
                            {userData?.UserProfile?.phone_verified
                              ? "Email"
                              : "Phone"}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {planDetails?.is_corporate === "1" && (
                  <>
                    {" "}
                    <h3 className="font-eb mb-3">
                      {t("text.userPayment.numberOfLicenses")}
                    </h3>
                    <div className="form-group w-100">
                      <label className="form-label d-flex">
                        {t("text.userPayment.numberOfLicenses")}
                      </label>
                      <div className="form-control-wrap">
                        <TextInput
                          className="form-control"
                          type="number"
                          min={1}
                          icon={
                            <div className="form-icon form-icon-left icon-gradiant">
                              <em className="icon-receipt" />
                            </div>
                          }
                          name="no_licenses"
                          placeholder="Enter number of licenses"
                          setFieldValue={props.handleChange}
                        />
                      </div>
                    </div>
                    <h3 className="font-eb mb-0">
                      {t("text.userProfile.businessDetail")}
                    </h3>
                    <div className=" mt-2 mt-lg-3 mt-xxl-4 mb-0 ">
                      {!userData?.UserBusinessAccount ? (
                        <RippleEffect>
                          <CommonButton
                            variant="btn btn-primary"
                            onClick={() => createBusinessAccount()}
                          >
                            {t("text.userProfile.createBusinessAccount")}
                          </CommonButton>
                        </RippleEffect>
                      ) : (
                        <UserBusinessForm
                          PaymentForm
                          countryList={countryList}
                          state={stateList}
                          userData={userData}
                        />
                      )}
                    </div>
                  </>
                )}
                {planDetails?.is_corporate === "0" && (
                  <AffirmativeAction
                    formData={props}
                    documentType={documentType}
                    setDocumentType={setDocumentType}
                  />
                )}
              </div>
            </div>
            <PaymentModeFrom
              formData={props}
              loading={loading}
              planDetails={planDetails}
              getPrice={getPrice}
              availableCoin={availableCoin}
              pageData={pageData}
              userData={userData}
              taxes={taxes}
              taxesPercentage={taxesPercentage}
              noLicensesPrice={noLicensesPrice}
              handleCouponShow={handleCouponShow}
              coupanAmount={coupanAmount}
              setCoupanAmount={setCoupanAmount}
              coinsLimit={coinsLimit}
            />
          </Form>
        );
      }}
    </Formik>
  );
}
