import React, { useState , useEffect } from "react";

import {
  Breadcrumb,
  HeadquarterForm,
  PageHeader,
} from "../../../../components";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import { logger, modalNotification } from "../../../../utils";
import { AdminHeadquaterServices } from "../../../../services";

function Headquarter() {
  const [loading, setLoading] = useState(false);
  const [headqauter,setHeadqauter] = useState({});
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "Headquarter",
    },
  ];
  const getHedqauterDetails = async () => {
    setLoading(true);
    try {
      let res = await AdminHeadquaterServices.getHeadquaterService();
      let { success, data, message } = res;
      if (success === 1) {
          setHeadqauter(data)
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
  const onSubmit = async (val) => {
    setLoading(true);
    try {
      const bodyData = {
        ...val
      };
      let res = await AdminHeadquaterServices.updateHeadqauterService(
        bodyData
      );
      const { success, message } = res;
      if (success === 1) {
        getHedqauterDetails()
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

  useEffect(()=>{
    getHedqauterDetails();
  },[])
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Headquarter">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
        </div>
      </div>
      <HeadquarterForm onSubmit={onSubmit} formData={headqauter} loading={loading} />
    </>
  );
}

export default Headquarter;
