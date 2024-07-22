import { Radio } from "antd";

import { t } from "i18next";
import React from "react";
import { Media } from "../../../../apiEndPoints";
import {
  AntRadio,
  AntSelect,
  AntTextArea as TextInput,
  UploadInput,
} from "../../../Antd";
import { textFormatter } from "../../../Formatter";
import { CommonButton, RippleEffect } from "../../../UiElement";

export default function AffirmativeAction({
  formData,
  documentType,
  setDocumentType,
}) {
  const documentOptionData = [
    { id: "sc/st", value: "SC / ST" },
    { id: "obc", value: "OBC" },
    { id: "ews", value: "EWS" },
    { id: "general", value: "General" },
    { id: "dodm", value: "DODM" },
  ];
  const refundOptionData = [
    { id: "coin", value: "Add As Coins To My Profile" },
    { id: "refund", value: "Refund Back To Payment Source" },
  ];

  return (
    <>
      {/* Commented for cashfree dropin */}
      {/* <div className="affirmative"> */}
      <h3 className="font-eb mb-1">{t("text.userPayment.affirmative")}</h3>
      <p>{t("text.userPayment.certificate")}</p>
      <p className="mb-0">{t("text.userPayment.benefit")}</p>
      {/* <Radio.Group
        value={formData?.values?.category}
        onChange={(e) => {
          formData?.setFieldValue("document_type", undefined);
          formData?.handleChange(e);
          setDocumentType([]);
        }}
      >
        <ul className="list-unstyled mt-2 mt-lg-3 mt-xxl-4 mb-0 d-flex flex-wrap">
          {documentOptionData.map(({ value, id }) => {
            return (
              <li>
                <AntRadio
                  
                  value={id}
                  onChange={formData?.handleChange}
                >
                  {value}{" "}
                </AntRadio>
              </li>
            );
          })}
        </ul>
      </Radio.Group> */}
      <Radio.Group
        name="affirmative"
        value={formData?.values?.affirmative}
        onChange={(e) => formData?.handleChange(e)}
      >
        <ul className="list-unstyled mt-2 mt-lg-3 mt-xxl-4 mb-0 d-flex flex-wrap">
          <li>
            <AntRadio
              name="affirmative"
              id="affirmative"
              value="1"
              onChange={formData?.handleChange}
            >
              Yes
            </AntRadio>
          </li>
          <li>
            <AntRadio
              name="affirmative"
              id="affirmative"
              value="2"
              onChange={formData?.handleChange}
            >
              No
            </AntRadio>
          </li>
        </ul>
      </Radio.Group>
      {formData?.values?.affirmative === "1" && (
        <>
          <div className="form-group mt-2 mt-lg-3">
            <AntSelect
              name="category"
              id="category"
              setFieldValue={formData.handleChange}
              placeholder="Select The Category"
              onSelect={(e) => {
                formData?.setFieldValue("document_type", undefined);
                formData?.setFieldValue("category", e);
                formData?.handleChange(e);
                setDocumentType([]);
              }}
            >
              {documentOptionData.map(({ value, id }, key) => {
                return (
                  <option value={id} key={key}>
                    {value}{" "}
                  </option>
                );
              })}
            </AntSelect>
          </div>
          <div className="form-group mt-2 mt-lg-3">
            {/* <label>{t("text.userPayment.documentType")}</label> */}
            <AntSelect
              placeholder="Select The Document Type"
              name="document_type"
              setFieldValue={formData.handleChange}
              disabled={formData?.values?.category === ""}
            >
              {documentType?.map((item, key) => {
                return (
                  <option key={key} value={item?.id}>
                    {textFormatter(item?.document_type)}
                  </option>
                );
              })}
            </AntSelect>
          </div>
          <RippleEffect>
            <UploadInput
              disabled={formData?.values?.category === ""}
              apiEndPoints={Media.documentImage}
              name="image"
              type="file"
              aspect={10 / 5}
              button
              applyImageCropper={false}
              validateFileType={[
                "image/jpeg",
                "image/png",
                "image/jpg",
                "application/pdf",
              ]}
              customMessage="Jpeg, Jpg, Png, Pdf"
            >
              <CommonButton extraClassName="btn-md" variant="secondary">
                <em className="icon-upload icon-left" />
                {t("text.userPayment.upload")}
              </CommonButton>
            </UploadInput>
          </RippleEffect>
          {/* <div className="refundOption">
            <p className="font-bd mb-0">
              {" "}
              {t("text.userPayment.selectRefund")}{" "}
            </p>
            <Radio.Group value={formData?.values?.refund_type}>
              <ul className="list-unstyled mt-1 mt-xl-2 mb-0 d-flex flex-wrap">
                {refundOptionData.map(({ value, id }) => {
                  return (
                    <li>
                      <AntRadio
                        name="refund_type"
                        id="refund_type"
                        value={id}
                        onChange={formData?.handleChange}
                      >
                        {value}{" "}
                      </AntRadio>
                    </li>
                  );
                })}
              </ul>
            </Radio.Group>
          </div> */}
          <div className="form-group mt-2 mt-lg-3">
            <AntSelect
              placeholder="Select Refund Option"
              name="refund_type"
              id="refund_type"
            >
              {refundOptionData.map(({ value, id }) => {
                return <option value={id}>{value} </option>;
              })}
            </AntSelect>
          </div>
          <div className="affirmative mt-0">
            <p>
              <span className="text-black">
                {" "}
                {t("text.userPayment.disclaimer")}{" "}
              </span>
              {t("text.userPayment.selectAffirmative")}
            </p>
            <p className="mb-0">{t("text.userPayment.creditAmount")}</p>
          </div>
          <div className="form-group mt-2 mt-lg-3 mt-xxl-4 mb-0">
            <label className="form-label">
              {t("text.userPayment.description")}
            </label>
            <div className="form-control-wrap">
              <TextInput
                className="form-control form-control-sm bg-gray-dim"
                name="description"
                disabled={formData?.values?.category === ""}
                variant="standard"
                type="text"
                placeholder={t("text.userPayment.description")}
                setFieldValue={formData?.handleChange}
              />
            </div>
          </div>
        </>
      )}
      {/* <div className="form-group mt-2 mt-lg-3">
        <label>{t("text.userPayment.documentType")}</label>
        <AntSelect
          placeholder="Select"
          name="document_type"
          setFieldValue={formData.handleChange}
          disabled={formData?.values?.category === ""}
        >
          {documentType?.map((item, key) => {
            return (
              <option key={key} value={item?.id}>
                {textFormatter(item?.document_type)}
              </option>
            );
          })}
        </AntSelect>
      </div> */}
      {/* </div> */}
    </>
  );
}
