import { Formik, Form } from "formik";
// import moment from "moment";
import React, { useMemo, useState } from "react";

import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AntSelect, CommonButton } from "../../../index";
// import { DatePicker, CommonButton, Select } from "../../..";
// import { classicDateFormat } from "../../../../helpers";
// import { disabledFutureDate } from "../../../../utils";

function ManageUserFilter({
  onSubmit,
  t,
  loading,
  filterData,
  onReset,
  languageDetails,
  // setSelected,
  // selected,
  // countryList,
  countryData,
  formRef,
  genderList,
}) {
  const initialValues = {
    language: filterData?.language || undefined,
    gender_id: filterData?.gender_id || undefined,
    country_id: filterData?.country_id || undefined,
    plan_type: filterData?.plan_type || undefined,
    fromAge: filterData?.fromAge || undefined,
    toAge: filterData?.toAge || undefined,
    status: filterData?.status || undefined,
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const arrayOfData = [
    {
      id: "1",
      name: "Active",
    },
    {
      id: "0",
      name: "Inactive",
    },
  ];
  // const countryData = [
  //   {
  //     id: "usa",
  //     name: "USA",
  //   },
  //   {
  //     id: "india",
  //     name: "India",
  //   },
  //   {
  //     id: "southAfrica",
  //     name: "South Africa",
  //   },
  // ];
  // const preferredLanguageData = [
  //   {
  //     id: "hindi",
  //     name: "Hindi",
  //   },
  //   {
  //     id: "english",
  //     name: "English",
  //   },
  //   {
  //     id: "arabic",
  //     name: "Arabic",
  //   },
  // ];

  const subscriberTypeData = [
    {
      id: "videoConferencing",
      name: "Video Conferencing",
    },
    {
      id: "translation",
      name: "Translation",
    },
    {
      id: "bundled",
      name: "Bundled",
    },
  ];

  const ageData = useMemo(() => {
    let data = [];
    [...new Array(99)].forEach((item, i) => {
      data.push({
        id: i + 1,
        name: i + 1,
      });
    });
    return data;
  }, []);

  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (
      filterData?.language ||
      filterData?.gender_id ||
      filterData?.country_id ||
      filterData?.plan_type ||
      filterData?.fromAge ||
      filterData?.toAge ||
      filterData?.status
    )
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      innerRef={formRef}
      enableReinitialize
      validate={(e) => {
        if (
          e?.language ||
          e?.gender_id ||
          e?.country_id ||
          e?.plan_type ||
          e?.fromAge ||
          e?.toAge ||
          e?.status
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
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {/* {t("text.manageSellers.country")} */}
                      {t("text.userManagement.country")}
                    </label>
                    {/* <ReactFlagsSelect
                      selected={selected}
                      onSelect={(code) => setSelected(code)}
                      selectButtonClassName="form-control"
                      // disabled={email}
                      placeholder="Select"
                      name="country_code"
                      searchPlaceholder="Search countries code"
                      searchable
                      onSelectChange={props.handleChange}
                      className="countryCodeSelect me-2"
                      countries={countryList?.counrty}
                      customLabels={countryList?.label}
                    /> */}
                    <AntSelect
                      size="medium"
                      id="status"
                      extraClassName="form-control"
                      name="country_id"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={countryData}
                      setFieldValue={props.handleChange}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.name?.toString().toLowerCase() ?? "").includes(
                          input
                        )
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.name ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.name ?? "").toLowerCase())
                      }
                      fieldNames={{
                        label: "name",
                        value: "id",
                        options: "options",
                      }}
                      options={countryData}
                      // value={values.country_code}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {/* {t("text.manageSellers.country")} */}
                      {t("text.userManagement.gender")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="gender_id"
                      extraClassName="form-control"
                      name="gender_id"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={genderList}
                      setFieldValue={props.handleChange}
                      value={values.gender_id}
                      fieldNames={{
                        label: "title",
                        value: "id",
                        options: "options",
                      }}
                      options={genderList}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {/* {t("text.manageSellers.country")} */}
                      {t("text.userManagement.language")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="status"
                      extraClassName="form-control"
                      name="language"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      // arrayOfData={languageDetails}
                      setFieldValue={props.handleChange}
                      // value={values.language}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0 ||
                        option.props.value
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {languageDetails?.length > 0 &&
                        languageDetails.map((item, key) => {
                          return (
                            <option value={item?.codeName} key={key}>
                              {item?.codeName}
                            </option>
                          );
                        })}
                    </AntSelect>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {/* {t("text.manageSellers.country")} */}
                      {t("text.userManagement.subscriberType")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="plan_type"
                      extraClassName="form-control"
                      name="plan_type"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={subscriberTypeData}
                      setFieldValue={props.handleChange}
                      value={values.plan_type}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {/* {t("text.manageSellers.country")} */}
                      {t("text.userManagement.age")}
                    </label>
                    <div className="rangeBetween d-flex flex-column flex-sm-row">
                      <div className="form-control-wrap">
                        <AntSelect
                          size="medium"
                          id="ageFrom"
                          extraClassName="form-control"
                          name="fromAge"
                          disabled={false}
                          variant="standard"
                          placeholder="Select"
                          // arrayOfData={ageData}
                          setFieldValue={props.handleChange}
                          // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                          // loading={countryLoader}
                        >
                          {ageData.map((item, key) => {
                            if (values?.toAge <= item?.id) {
                              return (
                                <option value={item?.id} key={key} disabled>
                                  {item?.name}
                                </option>
                              );
                            } else {
                              return (
                                <option value={item?.id} key={key}>
                                  {item?.name}
                                </option>
                              );
                            }
                          })}
                        </AntSelect>
                      </div>
                      <div className="dateBetween align-self-center mx-0 mx-sm-1 my-sm-0 my-1">
                        To
                      </div>
                      <div className="form-control-wrap">
                        <AntSelect
                          size="medium"
                          id="ageTo"
                          extraClassName="form-control"
                          name="toAge"
                          disabled={false}
                          variant="standard"
                          placeholder="Select"
                          // arrayOfData={ageData}
                          setFieldValue={props.handleChange}
                          // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                          // loading={countryLoader}
                        >
                          {ageData.map((item, key) => {
                            if (values?.fromAge > item?.id) {
                              return (
                                <option value={item?.id} key={key} disabled>
                                  {item?.name}
                                </option>
                              );
                            } else {
                              return (
                                <option value={item?.id} key={key}>
                                  {item?.name}
                                </option>
                              );
                            }
                          })}
                        </AntSelect>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {/* {t("text.manageSellers.country")} */}
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

export default withTranslation()(ManageUserFilter);
