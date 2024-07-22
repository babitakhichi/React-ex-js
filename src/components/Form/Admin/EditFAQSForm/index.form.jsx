import { Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import { logger } from "../../../../utils";

import { Input as TextInput, CommonButton, AntTextArea } from "../../../index";
import validation from "./validation";

function EditFAQSForm({
  onSubmit,
  t,
  faqModal,
  hideFaqEditModal,
  loading,
  rowData,
}) {
  logger(rowData);
  const initialValues = {
    question: faqModal === "add" ? "" : rowData?.question,
    answer: faqModal === "add" ? "" : rowData?.answer,
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
            <div className="form-group">
              <label className="form-label" htmlFor="question">
                {t("text.faqs.question")}
              </label>
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.faqs.questionPlaceholder")}
                name="question"
                disabled={false}
                variant="standard"
                type="text"
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="answer">
                {t("text.faqs.answer")}
              </label>
              <AntTextArea
                className="form-control form-control-lg"
                placeholder={t("text.faqs.answerPlaceholder")}
                name="answer"
                setFieldValue={props.handleChange}
              />
              {/* <TextEditor value={faqModal === 'add' ? "" :"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} /> */}
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                {/* {
                  faqModal === 'add' ?
                  <Link href="#" onClick={() => faqAdded()} className="btn btn-lg btn-primary">Add</Link>
                  :
                  <Link href="#" onClick={() => faqUpdated()} className="btn btn-lg btn-primary">Update</Link>
                } */}

                <CommonButton
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
                  htmltype="button"
                  type="submit"
                >
                  {faqModal === "add"
                    ? t("text.common.add")
                    : t("text.common.update")}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => hideFaqEditModal()}
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

export default EditFAQSForm;
