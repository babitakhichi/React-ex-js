import { t } from "i18next";
import { Form, Formik } from "formik";
import { CommonButton, RippleEffect } from "../../../UiElement";
import { Input as TextInput } from "../../../Antd";
import validation from "./validation";

export default function AssignUserForm({ onSubmit, mail, licenceKey }) {
  const initialValues = {
    email: "",
  };
  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        onSubmit={onSubmit}
        validationSchema={validation()}
        enableReinitialize
      >
        {(props) => {
          return (
            <Form>
              <div className="modalHeader">
                {mail ? (
                  <>
                    <h3>{t("text.planAndSubscription.assignToOther")}</h3>
                    <p className="text-sm mb-0">
                      &quot;{licenceKey}&quot;
                      {t("text.planAndSubscription.thisKeyIsAssigned")}{" "}
                      <span className="text-500 font-bd">
                        &quot;{mail}&quot;
                      </span>
                      , &nbsp;{t("text.planAndSubscription.enterNewEmail")}
                    </p>
                  </>
                ) : (
                  <h3>{t("text.planAndSubscription.assignToUser")}</h3>
                )}
              </div>
              <div className="modalForm">
                <div className="form-group">
                  <label className="form-label">Enter Email ID</label>
                  <div className="form-control-wrap">
                    <TextInput
                      name="email"
                      setFieldValue={props.handleChange}
                      className="form-control"
                      placeholder="Enter Email ID"
                      type="text"
                      defaultValue="johndoe@gmail.com"
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-email" />
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="text-end modalFooter">
                  <RippleEffect>
                    <CommonButton type="submit" variant="primary">
                      {t("text.planAndSubscription.assignNow")}
                    </CommonButton>
                  </RippleEffect>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
