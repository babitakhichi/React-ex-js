import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import { GlobalLoader, ImageElement } from "../../../components";
import { logger, modalNotification } from "../../../utils";
import { AdminManageClientPartner } from "../../../services";

function OurPartners() {
  let partnerSlider = {
    dots: true,
    arrow: true,
    rows: 2,
    infinite: false,
    speed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          arrow: false,
        },
      },
    ],
  };

  const [clients, setClients] = useState([]);
  const [clientsLoader, setClientsloader] = useState(false);
  const [partners, setPartners] = useState([]);
  const [partnersLoader, setPartnersLoader] = useState(false);

  const getClientPartnerList = async (category) => {
    let setter;
    let loader;
    try {
      if (category === "Client") {
        setter = setClients;
        loader = setClientsloader;
      }
      else {
        setter = setPartners;
        loader = setPartnersLoader;
      }
      loader(true);
      let queryParams = {
        category,limit:"all"
      };
      const res = await AdminManageClientPartner.getClientPartnerListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setter(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    loader(false);
  };


  useEffect(() => {
    getClientPartnerList("Client");
    getClientPartnerList("Partner");
  }, []);

  
  return (
    <>
      <section className="ourPartnerSec py-70">
        <Container>
          <div className="text-center heading mx-auto">
            <h3 className="heading_sub font-ad">{t("text.partners.title")}</h3>
            <h1 className="heading_main">{t("text.partners.heading")}</h1>
          </div>
          <div className="partnerSlider mb-3 mb-lg-5 position-relative">
            <h2 className="font-30">{t("text.partners.ourClient")}</h2>
            <Slider className="innerSlider" {...partnerSlider}>
              {clientsLoader ? <GlobalLoader /> :
                clients?.length > 0 ?
                  clients?.map((item, index) => {
                    return (
                      <div key={index} className="partnerSlider_item d-flex justify-content-center align-items-center">
                        <ImageElement previewSource={item?.image_url} alt="hdfc-bank" className="img-fluid" />
                      </div>
                    );
                  }) 
                  :  <div className="emptySec text-center w-100">

                  {/* <ImageElement
    
                    source="video-conferencing-icon.svg"
    
                    alt="No Data Found"
    
                  /> */}
    
                  <h2>{t("text.common.noData")}</h2>
    
              
    
                </div>
              }
            </Slider>
            
          </div>
          <div className="partnerSlider position-relative">
            <h2 className="font-30">{t("text.partners.ourPartners")}</h2>
            <Slider className="innerSlider" {...partnerSlider}>
              {partnersLoader ? <GlobalLoader /> :
                partners?.length > 0 ?
                  partners?.map((item, index) => {
                    return (
                      <div key={index} className="partnerSlider_item d-flex justify-content-center align-items-center">
                        <ImageElement previewSource={item?.image_url} alt="hdfc-bank" className="img-fluid" />
                      </div>
                    );
                  }) : 
                  <div className="emptySec text-center w-100">

                    {/* <ImageElement

                      source="video-conferencing-icon.svg"

                      alt="No Data Found"

                    /> */}

                    <h2>{t("text.common.noData")}</h2>

                    {/* <p className="mb-0">

                      There are no Pricing Plan to show here right now.

                    </p> */}

                  </div>
              }
            </Slider>
          </div>
        </Container>
      </section>
    </>
  )
}

export default OurPartners;
