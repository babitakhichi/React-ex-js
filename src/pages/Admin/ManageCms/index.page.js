import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Breadcrumb, PageHeader, PrivacyPolicyForm } from "../../../components";
import { selectCmsData } from "../../../redux/UserSlice/index.slice";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import { AdminManagePpTcServices } from "../../../services";
import { filterLanguage, logger, modalNotification } from "../../../utils";

function AdminCms() {
  const cmsList = useSelector(selectCmsData);
  const location = useLocation();
  const { pathname } = location;
  const [loading, setLoading] = useState(false);
  const [messages, setMessage] = useState("");
  const [cmsData, setCmsData] = useState([]);
  let path = pathname.replace("/admin/", "");

  let pageData = {
    "privacy-policy": {
      pageKey: "Privacy Policy",
      title: "PRIVACY POLICY",
    },
    "cookies-policy": {
      pageKey: "Cookies policy",
      title: "COOKIES POLICY",
    },
    "end-user-agreement": {
      pageKey: "End user agreement",
      title: "End User Agreement",
    },
  };

  useEffect(() => {
    setMessage("");
    setCmsData(filterLanguage(cmsList, pageData?.[path]?.pageKey));
  }, [pathname]);
  //   path = path === "" ? "home" : path;
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: pageData?.[path]?.title,
    },
  ];

  const onPrivacyPolicySubmit = async (values) => {
    setLoading(true);
    try {
      const bodyData = {
        page_name: cmsData?.[0]?.page_name,
        page_content: values?.message,
      };
      let res = await AdminManagePpTcServices.updateService(
        cmsData?.[0]?.id,
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
      let res = await AdminManagePpTcServices.getService(cmsData?.[0]?.id);
      let { success, data, message } = res;
      if (success === 1) {
        setMessage(data?.page_content);
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
    if (cmsData?.[0]?.id) {
      getUSerList();
    }
  }, [cmsData]);

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={pageData?.[path]?.pageKey}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
        </div>
      </div>
      <div className="nk-block">
        <div className="card">
          <div className="card-inner">
            <PrivacyPolicyForm
              onSubmit={onPrivacyPolicySubmit}
              loading={loading}
              message={messages}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminCms;
