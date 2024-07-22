import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
import { Link } from "react-router-dom";

import {
  Input as TextInput,
  CommonButton,
  AntTextArea,
  // Switch,
} from "../../../index";
import validation from "./validation";

function UpdateReferrals({
  onSubmit,
  hideReferalModal,
  loading,
  referralDeailsData,
}) {
  const initialValues = {
    message: referralDeailsData?.message || "",
    purchase_reward: referralDeailsData?.purchase_reward || "",
    signup_reward: referralDeailsData?.signup_reward || "",
    max_coins_limit: referralDeailsData?.max_coins_limit || "",
    status: referralDeailsData?.status === "active",
  };
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
            <div className="mb-3">
              <label className="form-label">
                {t("text.notification.message")}
              </label>
              <AntTextArea
                className="form-control form-control-lg"
                placeholder="Enter message"
                name="message"
                type="text"
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                {t("text.referralAdmin.enterReward")}
              </label>
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.referralAdmin.rewardPlaceholder")}
                name="signup_reward"
                type="text"
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                {t("text.referralAdmin.firstReward")}
              </label>
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.referralAdmin.rewardPlaceholder")}
                name="purchase_reward"
                type="text"
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                {t("text.referralAdmin.maxReward")}
              </label>
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.referralAdmin.maxRewardPlaceholder")}
                defaultValue="150"
                name="max_coins_limit"
                setFieldValue={props.handleChange}
                type="text"
              />
            </div>
            {/* <div className="mb-3 mt-4">
              <label className="form-label me-3">Activate/Deactivate</label>
              <Switch
                name="status"
                onChange={(e) => props.setFieldValue("status", e)}
                statusValue={props?.values?.status}
              />
            </div> */}
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2 mt-3">
              <div>
                <CommonButton
                  loading={loading}
                  htmltype="button"
                  type="submit"
                  className="btn btn-lg btn-primary"
                >
                  {t("text.common.update")}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => hideReferalModal()}
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

export default UpdateReferrals;
