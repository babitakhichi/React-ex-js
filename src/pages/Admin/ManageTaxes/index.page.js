import React, { useEffect, useState } from "react";

import { t } from "i18next";

import { Breadcrumb, ManageTaxesForm, PageHeader } from "../../../components";
import { logger, modalNotification } from "../../../utils";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import { AdminManageTaxes } from "../../../services";

function ManageTaxes() {
  const [loader, setLoader] = useState(false);
  const [taxData, setTaxData] = useState({});
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: t("text.manageTaxes.title"),
    },
  ];
  const getTaxesList = async () => {
    try {
      let res = await AdminManageTaxes.getTaxesListService();
      const { data, success, message } = res;
      if (success === 1) {
        setTaxData(data?.taxesData?.rows?.[0]);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  useEffect(() => {
    getTaxesList();
  }, []);

  const onSubmitForm = async (val) => {
    setLoader(true);
    try {
      let res = await AdminManageTaxes.updateTaxesService(val);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getTaxesList();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoader(false);
  };
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={t("text.manageTaxes.title")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
        </div>
      </div>
      <ManageTaxesForm
        onSubmit={onSubmitForm}
        loading={loader}
        taxData={taxData}
      />
    </>
  );
}

export default ManageTaxes;
