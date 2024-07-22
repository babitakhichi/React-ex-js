import { t } from "i18next";
import { Container, Col, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CommonButton, CsvExport, GlobalLoader, Pagination, RippleEffect, textFormatter } from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";
import { RefferalService } from "../../../services";
import { dateFormatter, logger, modalNotification } from "../../../utils";

function ReferralRewards() {
  const [refferals, setRefferals] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const sizePerPage = 10;
  const [noOfPage, setNoOfPage] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const goToPage = (pageNo) => {
    setPage(pageNo);
  }
  const getCsvData = (data) => {
    if (data?.length > 0) {
      const dataCsv = data.map((item) => {
        return {
          "Referred to": item?.redeemedBy?.UserProfile?.full_name || "-",
          "Date of Sign Up": `${dateFormatter(item?.createdAt) || "-"}`,
          "Coins Credited": item?.signup_earned || "-",
          "Referee Purchased?": item?.referee_purchased ? "Yes" : "No",
          "Coins Credited ": item?.referee_earned || '-',
        };
      });
      setCsvData(dataCsv);
    }
  };
  const fetchReffers = async () => {
    setIsLoading(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
      };
      const res = await RefferalService.getReffralsService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setCount(data?.count)
        setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1)
        setTotalCoins(data?.rows?.[0]?.totalrewards || 0);
        getCsvData(data?.rows);
        setRefferals(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchReffers();
  }, [page])
  return (
    <>
      <section className="referralRewards py-70">
        <Container>
          <Row className="justify-content-center">
            <Col xl={10}>
              <h1 className="backheading font-eb">
                <Link to={userRoutesMap.REFER_FRIEND.path}>
                  <em className="icon-arrow-back" />
                </Link>
                {t("text.referralRewards.referralRewards")}
              </h1>
              {isLoading ? <GlobalLoader/> :( refferals?.length > 0 ? <div className="referralRewards_list customCard">
                <div className="tableHead d-sm-flex justify-content-sm-between">
                  <h3 className="title mb-sm-0 d-flex align-items-center">
                    <em className="icon-coins" />
                    {t("text.referralRewards.totalCoinsEarned")}:
                    <span className="text-500">&nbsp; {totalCoins}</span>{" "}
                  </h3>
                  <div>
                    <span className="count">{t("text.referFriend.coin1")}</span>
                    <CsvExport
                      data={csvData}
                      fileName={"Refferals"}
                    >
                      <RippleEffect>
                        <CommonButton extraClassName="btn-md" variant="primary">
                          {" "}
                          <em className="icon-download icon-left" />
                          Download
                        </CommonButton>
                      </RippleEffect>
                    </CsvExport>
                  </div>
                </div>
                <div className="commonTable">
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>S. No.</th>
                        <th> {t("text.referralRewards.referredto")}</th>
                        <th>{t("text.referralRewards.dateofReferral")}</th>
                        {/* <th>{t("text.referralRewards.signedUp")}?</th> */}
                        <th>{t("text.referralRewards.coinsCredited")}</th>
                        <th>{t("text.referralRewards.refereePurchased")}?</th>
                        <th>{t("text.referralRewards.coinsCredited")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        refferals?.map((ref, index) => <>
                          <tr key={index}>
                            <td>{index + 1 + (page -1) * sizePerPage}</td>
                            <td>
                              <b>{textFormatter(ref?.redeemedBy?.UserProfile?.full_name)}</b>
                            </td>
                            <td>{dateFormatter(ref?.createdAt, 'DD-MM-YYYY')}</td>

                            <td className="text-center">{ref?.signup_earned || '-'}</td>
                            <td>{ref?.referee_purchased ? t("text.common.yes") : t("text.common.no")}</td>
                            <td className="text-center">{ref?.referee_earned || '0'} {t("text.userPayment.coins")}</td>
                          </tr>
                        </>)
                      }
                    </tbody>
                  </Table>
                  <Pagination
                    page={page}
                    noOfPage={noOfPage}
                    count={count}
                    sizePerPage={sizePerPage}
                    goToPage={goToPage}
                  />
                </div>
              </div>
              : 
              <div className="emptySec text-center w-100">
                <h6>{t("text.common.noData")}</h6>
              </div>)
              }
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ReferralRewards;
