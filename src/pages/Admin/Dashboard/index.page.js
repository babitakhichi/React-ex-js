import React, { useEffect, useMemo, useState } from "react";
/* eslint-disable */
import { Card, Col, Row } from "react-bootstrap";
import {
  Charts,
  checkValidCount,
  checkValidPrice,
  DateFilterForm,
  PageHeader,
} from "../../../components";
import { DashboardServices } from "../../../services";
import {
  agoDateTime,
  dateFormatter,
  logger,
  momentDateFormatter,
} from "../../../utils";

export const options = {
  responsive: true,
  elements: {
    point: {
      pointStyle: "circle",
      radius: 6,
      borderWidth: 2,
    },
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
      },
    },
    title: {
      display: false,
    },
  },
};

function Dashboard() {
  const [dateFilter, setDateFilter] = useState("year");
  const [planFilter, setPlanFilter] = useState("all");

  const [donutData, setDonutData] = useState({});
  const [allTotalCount, setAllTotalCount] = useState();
  const [planData, setPlanData] = useState({
    labels: ["Monthly", "Yearly", "Quarterly"],
    datasets: [
      {
        label: "# of Votes",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 0,
      },
    ],
  });

  const getMonthData = useMemo(() => {
    const date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    firstDay = dateFormatter(firstDay, "DD");
    lastDay = dateFormatter(lastDay, "DD");
    const dates = [];
    for (
      let time = momentDateFormatter(`${firstDay}`, "DD-MM-YYYY HH:mm");
      time <= momentDateFormatter(`${lastDay}`, "DD-MM-YYYY HH:mm");
      time.add(1, "day").format("DD-MM-YYYY")
    ) {
      dates.push(dateFormatter(time, "DD MMM"));
    }
    return dates;
  }, []);

  const getWeekDate = useMemo(() => {
    let startDate = new Date().setDate(
      new Date().getDate() - new Date().getDay()
    );
    let endDate = new Date(startDate).setDate(
      new Date(startDate).getDate() + 6
    );
    let weekArray;
    let date;
    for (
      weekArray = [], date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      weekArray.push(agoDateTime(1, "day", "DD MMM YYYY", new Date(date)));
    }

    return weekArray;
  }, []);

  const lineGraphLabels = {
    week: getWeekDate,
    month: getMonthData,
    year: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "November",
      "December",
    ],
  };

  const [lineGraphData, setLineGraphData] = useState({
    labels: lineGraphLabels?.[dateFilter] || [],
    datasets: [
      {
        fill: true,
        label: "Subscribers",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.3,
      },
    ],
  });

  const dateFilterData = [
    {
      id: "year",
      name: "Yearly",
    },
    {
      id: "month",
      name: "Monthly",
    },
    {
      id: "week",
      name: "Weekly",
    },
  ];
  const planFilterData = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "monthly",
      name: "Monthly",
    },
    {
      id: "quarterly",
      name: "Quarterly",
    },
    {
      id: "halfYearly",
      name: "Half Yearly",
    },
    {
      id: "annual",
      name: "Annual",
    },
  ];

  const handleFilter = (values) => {
    setDateFilter(values.dateFilter);
    setPlanFilter(values.planFilter);
  };

  // for donut graph
  useEffect(() => {
    let data = {
      labels: ["Monthly", "Yearly", "Quarterly"],
      datasets: [
        {
          label: "# of Votes",
          data: donutData,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 0,
        },
      ],
    };
    setPlanData(data);
  }, [donutData]);

  const getAllTotalCounts = async () => {
    try {
      const res = await DashboardServices.getAllTotalCounts();
      let { success, data } = res;
      if (success === 1) {
        setAllTotalCount(data);
      }
    } catch (error) {
      logger(error);
    }
  };

  const getDonutGraphData = async () => {
    try {
      const res = await DashboardServices.getDonutGraphData();
      let { success, data } = res;
      if (success === 1) {
        let myArr = [
          data?.total_monthly_subscription,
          data?.total_yearly_subscription,
          data?.total_quaterly_subscription,
        ];
        setDonutData(myArr);
      }
    } catch (error) {
      logger(error);
    }
  };

  const getLineGraphData = async (filter, labels) => {
    try {
      let queryParams;
      if (dateFilter === "custom") {
        let params = {
          fromDate: filter.fromDate,
          toDate: filter.toDate,
        };
        queryParams = params;
      } else {
        let params = {
          type: filter,
        };
        queryParams = params;
      }
      const res = await DashboardServices.getLineGraphData(planFilter, {
        queryParams,
      });
      let { success, data } = res;
      if (success === 1) {
        setLineGraphData({
          labels,
          datasets: [
            {
              fill: true,
              label: "Subscribers",
              data: data?.data,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              tension: 0.3,
            },
          ],
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  useEffect(() => {
    getLineGraphData(dateFilter, lineGraphLabels[dateFilter]);
  }, [dateFilter, planFilter]);

  useEffect(() => {
    getAllTotalCounts();
    getDonutGraphData();
  }, []);

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Dashboard" />
        </div>
      </div>
      <div className="nk-block">
        <div className="dashboardTiles nk-store-statistics">
          <Row className="g-4">
            <Col sm="6" md="4">
              <Card className="overflow-hidden">
                <Card.Body className="border-success">
                  <div className="d-flex align-items-center">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                      {" "}
                      Total Users
                    </p>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mt-xl-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-1 mb-xl-3">
                        {checkValidCount(allTotalCount?.total_user)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <em className="icon icon-lg bg-success-dim ni ni-users" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="4">
              <Card className="overflow-hidden">
                <Card.Body className="border-warning">
                  <div className="d-flex align-items-center">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                      {" "}
                      Total Subscribers
                    </p>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mt-xl-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-1 mb-xl-3">
                        {checkValidCount(allTotalCount?.total_subscriber)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <em className="icon icon-lg bg-warning-dim ni ni-reports-alt" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="4">
              <Card className="overflow-hidden">
                <Card.Body className="border-danger">
                  <div className="d-flex align-items-center">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                      {" "}
                      Total Revenue
                    </p>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mt-xl-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-1 mb-xl-3">
                        {checkValidPrice(allTotalCount?.total_revenue)}
                      </h4>
                    </div>
                    <div className="flex-shrink-0">
                      <em className="icon icon-lg bg-danger-dim ni ni-sign-dollar" />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        <Row className="mt-0 g-4">
          <Col xl="12" xxl="8">
            <div className="card card-full">
              <div className="card-inner">
                <div className="card-title-group flex-wrap flex-lg-nowrap mb-3">
                  <div className="card-title">
                    <h6 className="title">Subscribers</h6>
                  </div>
                  {/* <div className="card-tools d-flex flex-wrap flex-lg-nowrap justify-content-end graphFilter">
                        {dateFilter === "custom" ? 
                        <div className="me-0 me-lg-2 customDate">
                          <label className="form-label mb-0">Select date</label>
                          <div className="d-flex flex-column justify-content-end flex-sm-row">
                            <div className="form-control-wrap">
                              <DatePicker
                                name="fromDate"
                                className="form-control date-picker shadow-none"
                                placeholder="DD/MM/YY"
                              />
                            </div>
                            <div className="align-self-center mx-0 mx-sm-1 my-sm-0 my-1">
                              To
                            </div>
                            <div className="form-control-wrap">
                              <DatePicker
                                name="fromDate"
                                className="form-control date-picker shadow-none"
                                placeholder="DD/MM/YY"
                              />
                            </div>
                          </div>
                        </div> : ''}
                        <div className="form-group mb-0">
                          <label className="form-label mb-0">Date Range</label>
                          <AntSelect
                            size="medium"
                            id="dateFilter"
                            name="dateFilter"
                            disabled={false}
                            variant="standard"
                            placeholder="Select"
                            arrayOfData={dateFilterData}
                            handleChangeSelect={(e) => handleChange(e)}
                            defaultValue="yearly"
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label mb-0">Plan</label>
                          <AntSelect
                            size="medium"
                            id="dateFilter"
                            name="dateFilter"
                            disabled={false}
                            variant="standard"
                            placeholder="Select"
                            arrayOfData={planFilterData}
                            defaultValue="all"
                          />
                        </div>
                    </div> */}
                  <DateFilterForm
                    dateFilter={dateFilter}
                    planFilterData={planFilterData}
                    dateFilterData={dateFilterData}
                    // handleChange={handleChange}
                    handleFilter={handleFilter}
                  />
                </div>
                <div>
                  <Charts type="line" options={options} data={lineGraphData} />
                </div>
              </div>
            </div>
          </Col>
          <Col xl="12" xxl="4">
            <div className="card card-full">
              <div className="card-inner">
                <div className="card-title-group mb-3">
                  <div className="card-title">
                    <h6 className="title">Plan</h6>
                  </div>
                </div>
                <div style={{ maxWidth: "350px", margin: "0 auto" }}>
                  <Charts type="doughnut" data={planData} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
