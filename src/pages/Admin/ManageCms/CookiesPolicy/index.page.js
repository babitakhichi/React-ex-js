import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Breadcrumb,
  CookiesPolicyForm,
  PageHeader,
} from "../../../../components";
import { selectCmsData } from "../../../../redux/UserSlice/index.slice";
import { AdminManagePpTcServices } from "../../../../services";
import { filterLanguage, logger, modalNotification } from "../../../../utils";

function CookiesPolicy() {
  const cmsList = useSelector(selectCmsData);
  const [loading, setLoading] = useState(false);
  const [messages, setMessage] = useState("");

  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "COOKIES POLICY",
    },
  ];
  let cookiesData = filterLanguage(cmsList, "Cookies policy");
  const onCookiesPolicySubmit = async (values) => {
    setLoading(true);
    try {
      const bodyData = {
        pageName: cookiesData?.[0]?.pageName,
        pageContent: values?.message,
      };
      const res = await AdminManagePpTcServices.updateService(
        cookiesData?.[0]?.id,
        bodyData
      );

      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };
  const getUSerList = async () => {
    setLoading(true);
    try {
      const res = await AdminManagePpTcServices.getService(
        cookiesData?.[0]?.id
      );
      const { success, data, message } = res;
      if (success === 1) {
        setMessage(data?.pageContent);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUSerList();
  }, []);

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Cookies Policy">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
        </div>
      </div>
      <div className="nk-block">
        <div className="card">
          <div className="card-inner">
            <CookiesPolicyForm
              onSubmit={onCookiesPolicySubmit}
              loading={loading}
              message={messages}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CookiesPolicy;
