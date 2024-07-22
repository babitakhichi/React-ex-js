import React, { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import { AccordionComponent, GlobalLoader } from "../../../../components";
import { ManageCmsServices } from "../../../../services";
import { logger, modalNotification } from "../../../../utils";

function FAQs() {
  const [faqData, setFaqData] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const getFAQList = async () => {
    setFaqLoading(true);
    try {
      const res = await ManageCmsServices.userFaqService();
      const { success, data, message } = res;
      if (success === 1) {
        setFaqData(data.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setFaqLoading(false);
  };
  useEffect(() => {
    getFAQList();
  }, []);

  return (
    <>
      <section className="faqPage py-70">
        <Container>
          <div className="heading">
            <h3 className="heading_sub font-ad">FAQ</h3>
            <h1 className="heading_main">Frequently Asked Questions</h1>
            <p>
              Have questions regarding the &quot;Daakia Website&quot; option,
              localization, or any other matter? Check for the answers below.
            </p>
          </div>
          {faqLoading ? (
            <GlobalLoader />
          ) : (
            <AccordionComponent AccordionContent={faqData} />
          )}
        </Container>
      </section>
    </>
  );
}

export default FAQs;
