import { t } from "i18next";
import React from "react";
import { SaveOptionForm } from "../../../../components";

function SavedPayment({
  formRef,
  onFormSubmit,
  loading,
  planDetails,
  setCheckCoin,
  getPrice,
  availableCoin,
  pageData,
  userData,
  documentType,
}) {
  return (
    <div className="paymentMode_cnt customCard">
      <h3 className="font-eb">{t("text.userPayment.saveCards")}</h3>
      <div className="paymentSec">
        <SaveOptionForm
          onFormSubmit={onFormSubmit}
          formRef={formRef}
          loading={loading}
          planDetails={planDetails}
          setCheckCoin={setCheckCoin}
          getPrice={getPrice}
          availableCoin={availableCoin}
          pageData={pageData}
          userData={userData}
          documentType={documentType}
        />
      </div>
    </div>
  );
}

export default React.memo(SavedPayment);
