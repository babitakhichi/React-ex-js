import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Slider from "react-slick";
import { GlobalLoader, ImageElement, checkValidData, textFormatter } from "../../../components";
import { logger, modalNotification } from "../../../utils";
import { AdminManageTeamMemberList } from "../../../services";

function OurTeam() {
  const [keyMembers, setkeyMembers] = useState([]);
  const [visionPartners, setVisionPartners] = useState([]);
  const [keyMembersLoading, setkeyMembersLoading] = useState(false);
  const [visionPartnersLoading, setVisionPartnersLoading] = useState(false);

  let teamSlider = {
    dots: true,
    infinite: false,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const getTeamMemberList = async (memberType) => {
    let loader;
    let setter;
    try {
      let queryParams = {
        member_type: memberType ,
        limit:"all"
      };
      if (memberType === 'keyMembers') {
        loader = setkeyMembersLoading;
        setter = setkeyMembers;
      }
      else {
        loader = setVisionPartnersLoading;
        setter = setVisionPartners;
      }
      loader(true);
      const res = await AdminManageTeamMemberList.getTeamMemberListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setter(data?.rows);
        loader(false);
      }
      else {
        loader(false);
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
    getTeamMemberList("keyMembers");
    getTeamMemberList("visionPartners");
  }, []);
  return (
    <>
      <section className="ourTeamSec position-relative py-70">
        <Container>
          <div className="text-center heading mx-auto">
            <h1 className="heading_main">{t("text.ourTeam.title")}</h1>
          </div>
          <Row className="justify-content-center gy-3 gy-lg-4">
            {keyMembersLoading ?
              <div className="d-flex align-items-center justify-content-center h-100">
                <GlobalLoader />
              </div> : keyMembers?.length > 0 ?
                keyMembers?.map((item, index) => {
                  return <Col key={index} md={4} sm={6} xs={12}>
                    <div className="ourTeamSec_card  text-center">
                      <ImageElement previewSource={item?.img_url} alt="team-img" className="img-fluid" />
                      <h2>{textFormatter(item?.name)}</h2>
                      <span className="designation">{textFormatter(item?.position)}</span>
                      <p>{checkValidData( item?.description)}</p>
                    </div>
                  </Col>
                }) : 
                <div className="emptySec text-center w-100">
                {/* <ImageElement
  
                  source="video-conferencing-icon.svg"
  
                  alt="No Data Found"
  
                /> */}
  
                <h2>{t("text.common.noData")}</h2>
{/*   
                <p className="mb-0">
  
                  There are no Pricing Plan to show here right now.
  
                </p> */}
  
              </div>
              }

          </Row>
        </Container>
      </section>
      {<>
        <section className="visionSec py-70 pt-0">
          <Container className="position-relative">
            <h2 className="font-30">{t("text.ourTeam.partners")}</h2>
            <Slider className="innerSlider" {...teamSlider}>
              {visionPartnersLoading ?
                <div className="d-flex align-items-center justify-content-center h-100">
                  <GlobalLoader />
                </div> : visionPartners?.length > 0 ?
                  visionPartners?.map((item, index) => {
                    return <div key={index} className="sliderItem">
                      <div className="sliderItem_head d-flex align-items-center">
                        <div className="sliderItem_imgBox">
                          <ImageElement  previewSource={item?.img_url} alt="partner-img" className="img-fluid" />
                        </div>
                        <div className="sliderItem_infoBox">
                          <h3>{textFormatter (item?.name)}</h3>
                          <p>{textFormatter( item?.position)}</p>
                        </div>
                      </div>
                      <p>{checkValidData (item?.description)}</p>
                    </div>
                  }) :
                  <div className="emptySec text-center w-100">

                    {/* <ImageElement

                      source="video-conferencing-icon.svg"

                      alt="No Data Found"

                    /> */}

                    <h2>{t("text.common.noData")}</h2>
{/* 
                    <p className="mb-0">

                      There are no Pricing Plan to show here right now.

                    </p> */}

                  </div>
              }
            </Slider>
          </Container>
        </section></>
      }
    </>
  )
}

export default OurTeam;
