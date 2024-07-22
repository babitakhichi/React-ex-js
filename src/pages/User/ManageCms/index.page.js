import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { AccordionComponent, GlobalLoader } from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";
import { ManageCmsServices } from "../../../services/User";
import { logger, modalNotification, stringToHTML } from "../../../utils";

function CmsPage() {
  const location = useLocation();
  const { pathname } = location;
  const [cmsData, setCmsData] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(false);
  let path = pathname.replace("/", "");
  path = path === "" ? "home" : path;
  let pageData = {
    "privacy-policy": {
      pageKey: "privacy_policy",
      title: t("text.common.privacy"),
      heading: t("text.privacyPolicy.privacyPolicyDaakia"),
    },
    "cookies-policy": {
      pageKey: "cookies_policy",
      title: t("text.common.cookies"),
      heading: t("text.cookiesPolicy.pageTitle"),
    },
    "end-user-agreement": {
      pageKey: "end_user_agreement",
      title: t("text.common.agreement"),
      heading: t("text.termsAndCondition.endUserAgreement"),
    },
  };

  const getCmsData = async () => {
    setLoading(true);
    try {
      let queryParams = { pageKey: pageData?.[path]?.pageKey };
      const res = !userRoutesMap.FAQS.path.includes(path)
        ? await ManageCmsServices.commonServices({ queryParams })
        : await ManageCmsServices.userFaqService();
      const { success, data, message } = res;
      if (success === 1) {
        if (userRoutesMap.FAQS.path.includes(path)) {
          setFaqData(data?.rows);
        } else {
          setCmsData(data?.page_content);
        }
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
    setCmsData([]);
    setFaqData([]);
    getCmsData();
    setLoading(true);
  }, [pathname]);

  return (
    <>
      {!userRoutesMap.FAQS.path.includes(path) ? (
        <section className="py-70">
          <Container>
            {loading ? (
              <GlobalLoader />
            ) : (
              <>
                <div className="heading">
                  <h3 className="heading_sub font-ad">
                    {" "}
                    {pageData?.[path]?.title}
                  </h3>

                  <h1 className="heading_main">{pageData?.[path]?.heading}</h1>
                </div>
                <div className="cmsPage">
                  {loading ? (
                    <GlobalLoader />
                  ) : cmsData?.length > 0 ? (
                    <p>{stringToHTML(cmsData)}</p>
                  ) : (
                    <p className="text-center noRecord mb-0">
                      {" "}
                      {t("text.common.noRecord")}
                    </p>
                  )}
                </div>
              </>
            )}
          </Container>
        </section>
      ) : (
        <>
          <section className="faqPage py-70">
            <Container>
              <div className="heading">
                <h3 className="heading_sub font-ad">FAQ</h3>
                <h1 className="heading_main">Frequently Asked Questions</h1>
                <p>
                  Have questions regarding the &quot;Daakia Website&quot;
                  option, localization, or any other matter? Check for the
                  answers below.
                </p>
              </div>
              {loading ? (
                <GlobalLoader />
              ) : (
                <AccordionComponent AccordionContent={faqData} />
              )}
            </Container>
          </section>
        </>
      )}
    </>
  );
}

export default CmsPage;
