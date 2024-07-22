import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
// import ReactFlagsSelect from "react-flags-select";

import { phoneNumberField } from "../../../../../../utils";
import {
  AntSelect,
  CommonButton,
  Input as TextInput,
  RippleEffect,
} from "../../../../../index";
import { Emailvalidation, Phonevalidation } from "./validation";

function AddEmailForm({
  onSubmit,
  handleClose,
  addChangeEmailPhoneCheck,
  loading,

  formRef,
  countryList,
}) {
  const initialValues = {
    email: "",
    phone_number: "",
    country_code: undefined,
  };

  function handleKey(e) {
    phoneNumberField(e);
  }
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={
        addChangeEmailPhoneCheck?.type === "email"
          ? Emailvalidation()
          : Phonevalidation()
      }
      onSubmit={onSubmit}
      innerRef={formRef}
      enableReinitialize
    >
      {(props) => {
        return (
          <>
            <Form>
              {/* ------------------------ add mobile number modal---------------------- */}

              <>
                <div className="modalHeader">
                  <h3>
                    {addChangeEmailPhoneCheck?.type === "email"
                      ? t("text.userProfile.addEmail")
                      : t("text.userProfile.addPhone")}
                  </h3>
                </div>
                <div className="modalForm">
                  {addChangeEmailPhoneCheck?.type === "email" ? (
                    <div className="form-group w-100">
                      <label className="form-label">
                        {t("text.userProfile.email")}
                      </label>
                      <div className="form-control-wrap">
                        <TextInput
                          name="email"
                          className="form-control"
                          type="text"
                          placeholder={t("text.userProfile.emailPlaceholder")}
                          setFieldValue={props.handleChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group w-100">
                      <label className="form-label">
                        {" "}
                        {t("text.userProfile.phoneLabel")}
                      </label>
                      <div className="form-control-wrap numberCode d-flex">
                        <AntSelect
                          size="medium"
                          id="status"
                          extraClassName="form-control"
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
                                <option
                                  key={key}
                                  value={`+${item?.phone_code}`}
                                >
                                  {`+${item?.phone_code}`}
                                </option>
                              );
                            })}
                        </AntSelect>
                        <TextInput
                          name="phone_number"
                          id="phone_number"
                          className="form-control"
                          type="text"
                          placeholder={t("text.userProfile.phonePlaceholder")}
                          setFieldValue={props.handleChange}
                          onKeyPress={(e) => handleKey(e)}
                          min="0"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </div>
                    </div>
                  )}
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
export default AddEmailForm;
