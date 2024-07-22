import { t } from "i18next";
import React from "react";

import { InternetBankingForm } from "../../../../components";

export default function InternetBanking({
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
}) {
  return (
    <div className="paymentMode_cnt customCard">
      <h3 className="font-eb">{t("text.userPayment.internetBanking")}</h3>
      <div className="paymentSec">
        <InternetBankingForm
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
        />
      </div>
    </div>
  );
}
