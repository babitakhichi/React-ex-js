import { t } from "i18next";
import React from "react";
import { CreditCardForm } from "../../../../components";

function CreditCard({
  onFormSubmit,
  loading,
  formRef,
  planDetails,
  setCheckCoin,
  getPrice,
  availableCoin,
  pageData,
  userData,
  documentType,
  setCategory,
}) {
  return (
    <div className="paymentMode_cnt customCard">
      <h3 className="font-eb">{t("text.userPayment.addCredit")}</h3>
      <div className="paymentSec">
        <CreditCardForm
          onFormSubmit={onFormSubmit}
          loading={loading}
          formRef={formRef}
          planDetails={planDetails}
          setCheckCoin={setCheckCoin}
          getPrice={getPrice}
          availableCoin={availableCoin}
          pageData={pageData}
          userData={userData}
          documentType={documentType}
          setCategory={setCategory}
        />
      </div>
    </div>
  );
}

export default React.memo(CreditCard);
