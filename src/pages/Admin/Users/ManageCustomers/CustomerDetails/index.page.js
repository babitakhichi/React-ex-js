import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SimpleBar from "simplebar-react";
import {
  Breadcrumb,
  checkValidCount,
  checkValidData,
  checkValidDiscount,
  checkValidInvoice,
  checkValidPrice,
  DataTable,
  GlobalLoader,
  ImageElement,
  ListingHeader,
  PageHeader,
  phoneNumberFormatter,
  serialNumberFormatter,
  statusFormatter,
  // statusFormatter,
  Tabs,
  textFormatter,
  TransactionHistoryFilter,
} from "../../../../../components";
import { classicDataTimeFormate } from "../../../../../helpers";
import adminRoutesMap from "../../../../../routeControl/adminRoutes";
import {
  AdminManageSubscriptionServices,
  TransactionHistoryServices,
  UsersServices,
} from "../../../../../services";
import {
  dateFormatter,
  decodeQueryData,
  decoder,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../../utils";

function CustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultKey, setDefaultKey] = useState("individual");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState([]);
  const [filterData, setFilterData] = useState({});
  const { pathname, search } = location;
  const params = useParams();
  const [customerData, setCustomerData] = useState();
  const [searchName, setSearchName] = useState("");
  const [param, setParam] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [planData, setPlanData] = useState([]);
  // const [rowData, setRowData] = useState();
  const [csvData, setCsvData] = useState([]);
  // const [alertLoader, setAlertLoader] = useState(false);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
  const getUSerList = async (id) => {
    setLoading(true);
    try {
      const { success, data, message } =
        await UsersServices.getUserDetailsService(decoder(id));
      if (success === 1 && data) {
        setCustomerData(data);
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
    if (params?.id) {
      getUSerList(params?.id);
    }
  }, []);
  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: `${adminRoutesMap.MANAGE_CUSTOMERS.path}`,
      name: "USERS",
    },
    {
      path: "#",
      name: "USERS DETAILS",
    },
  ];

  useEffect(() => {
    if (search) {
      const data = decodeQueryData(search);
      setParam(data);
      setPage(data?.page ?? 1);
      // setSearchName(data?.name ?? "");
      if (data?.sortType) {
        const sortData = [
          {
            order: getSortType(data?.sortType),
            dataField: data?.sortBy,
          },
        ];
        setDefaultSort(sortData);
      } else {
        setDefaultSort({
          dataField: "",
          order: "",
        });
      }
    }
  }, [location]);

  const tableReset = () => {
    setTableLoader(true);
    setState([]);
    setNoOfPage(0);
    setTotalCount(0);
  };

  const onSortColumn = (field, order) => {
    const data = { ...param };
    data.sortBy = field;
    data.sortType = order === "asc" ? "ASC" : "DESC";
    navigateWithParam(data, navigate, pathname);
    tableReset();
  };

  const headerSortingClasses = (column, sortOrder) => {
    return sortOrder === "asc" ? "sorting_asc" : "sorting_desc";
  };

  const getSearchValue = (val) => {
    setSearchName(val);
    if (val) {
      tableReset();
    }
  };
  const getColumns = () => {
    const arr = [
      {
        dataField: "id",
        text: t("text.common.sno"),
        headerClasses: "w_70",
        formatter: (cell, row, index) =>
          serialNumberFormatter(page, sizePerPage, index),
      },
      {
        dataField: "order_id",
        text: "Transaction Reference",
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => checkValidInvoice(cell),
      },
      {
        dataField: "name",
        text: t("text.common.name"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) =>
          checkValidData(textFormatter(row?.User?.UserProfile?.full_name)),
      },
      {
        dataField: "createdAt",
        text: t("text.common.date"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY"),
      },
      {
        dataField: "subscriptionPlan",
        text: t("text.transactionHistory.subscriptionPlan"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) =>
          checkValidData(
            ` ${statusFormatter(row?.Subscription?.plan_type)} /
             ${textFormatter(row?.Subscription?.name)} /
             ${statusFormatter(row?.plan_duration)}`
          ),
      },
      {
        dataField: "order_amount",
        text: t("text.transactionHistory.amountPaid"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => checkValidPrice(cell),
      },
      {
        dataField: "total_subscription_amount",
        text: t("text.transactionHistory.subscriptionPrice"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => checkValidPrice(cell),
      },
      // {
      //   dataField: "status",
      //   text: t("text.common.status"),
      //   headerClasses: "sorting",
      //   formatter: statusFormatter,
      // },
    ];
    if (defaultKey === "individual") {
      arr.splice(5, 0, {
        dataField: "previous_adjusted",
        text: t("text.transactionHistory.previousAdjusted"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => checkValidPrice(cell),
      });
      arr.splice(7, 0, {
        dataField: "coins",
        text: t("text.transactionHistory.coinsApplied"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => checkValidCount(cell),
      });
      arr.splice(9, 0, {
        dataField: "refund_amount",
        text: t("text.transactionHistory.refund"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => checkValidPrice(cell),
      });
      arr.splice(10, 0, {
        dataField: "discount_amount",
        text: "Discount",
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) => checkValidDiscount(cell, row?.discount_type),
      });
    }
    return arr;
  };
  const columns = getColumns();
  const [asideView, setAsideView] = useState(false);
  const asideToggle = () => {
    setAsideView(!asideView);
  };
  if (asideView) {
    document.querySelector("body").classList.add("toggle-shown");
  } else {
    document.querySelector("body").classList.remove("toggle-shown");
  }
  const handleFilterSubmit = (val) => {
    setLoading(true);
    try {
      // let values = {
      //   plan: val?.subscription,
      //   from: val?.startDate,
      //   to: val?.endDate,
      // };

      setFilterData(val);
      tableReset();
      const newParams = { ...param };
      newParams.page = 1;
      navigateWithParam(newParams, navigate, pathname);
      setVisible(false);
    } catch (error) {
      logger(error);
    }

    setLoading(false);
  };

  const onReset = () => {
    setFilterData({});
    tableReset();
    setVisible(false);
    const newParams = { ...param };
    newParams.page = 1;
    navigateWithParam(newParams, navigate, pathname);
  };
  const getCsvData = (data) => {
    const dataCsv = data.map((item) => {
      return {
        "	Invoice ID": item?.order_id,
        Name: checkValidData(textFormatter(item?.User?.UserProfile?.full_name)),

        Date: dateFormatter(item?.createdAt, "DD/MM/YYYY"),
        "Subscription Plan": ` ${statusFormatter(
          item?.Subscription?.plan_type
        )} / ${textFormatter(item?.Subscription?.name)} / ${statusFormatter(
          item?.plan_duration
        )}`,
        "Previous Adjusted": checkValidPrice(item?.previous_adjusted),

        "Amount Paid": checkValidPrice(item?.order_amount),
        "Coins Applied": checkValidCount(item?.coins),
        "Subscription Price": checkValidPrice(item?.total_subscription_amount),

        Refund: checkValidPrice(item?.refund_amount),
        Discount: checkValidDiscount(
          item?.discount_amount,
          item?.discount_type
        ),
      };
    });

    setCsvData(dataCsv);
  };
  const getTransactionHistoryList = async (key, pageNo) => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: pageNo === undefined ? (page - 1) * sizePerPage : pageNo,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        user: decoder(params?.id),
        plan: filterData?.subscription,
        from: filterData?.startDate,
        to: filterData?.endDate,
        is_corporate: key === "corporate" ? "true" : "false",
        // ...filterData,
      };
      const res =
        await TransactionHistoryServices.getTransactionHistoryListService({
          queryParams,
        });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.rows);
        getCsvData(data?.rows);
        setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
        setTotalCount(data?.count);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setTableLoader(false);
  };
  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      getTransactionHistoryList(defaultKey);
    }
  }, [param]);
  useEffect(() => {
    if (!search) {
      setPage(1);
      getTransactionHistoryList(defaultKey);
    }
  }, [defaultKey]);
  const getSubscriptionList = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        scope: true,
        typeList: "checked",
        is_corporate: defaultKey === "corporate" ? "1" : "0",
      };
      const res =
        await AdminManageSubscriptionServices.subscriptionListingService({
          queryParams,
        });
      const { success, data, message } = res;
      if (success === 1) {
        setPlanData(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setTableLoader(false);
  };
  useEffect(() => {
    getSubscriptionList();
  }, [defaultKey]);
  const onTabChange = (key) => {
    setPage(1);
    onReset();
    getTransactionHistoryList(key, 0);
  };
  const content = (
    <>
      <div className="card-inner pb-0 position-relative">
        <div className="nk-block-between justify-content-end">
          <ListingHeader
            btnArray={["filter", "csvExport"]}
            popover={
              <TransactionHistoryFilter
                onSubmit={handleFilterSubmit}
                loading={loading}
                onReset={onReset}
                filterData={filterData}
                planData={planData}
                t={t}
              />
            }
            setVisible={setVisible}
            visible={visible}
            fileName="Transaction-History.csv"
            csvData={csvData}
          />
        </div>
      </div>
      <DataTable
        hasLimit
        noOfPage={noOfPage}
        sizePerPage={sizePerPage}
        page={page}
        count={totalCount}
        tableData={state}
        tableColumns={columns}
        param={param}
        defaultSort={defaultSort}
        setSizePerPage={setSizePerPage}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
        isCard={false}
        // searchPlaceholder={t("text.search.ManageSubscription")}
      />
    </>
  );
  const historyData = [
    {
      name: "Personal Account",
      key: "individual",
      content,
    },
    {
      name: "Corporate",
      key: "corporate",
      content,
    },
  ];
  const tabContent = [
    {
      name: "Transaction History",
      key: "transactionHistory",
      icon: "icon ni ni-repeat",
      content: (
        <Tabs
          tabContent={historyData}
          tabsFor="table"
          activeKey={defaultKey}
          setActiveKey={setDefaultKey}
          onTabChange={onTabChange}
        />
      ),
    },
  ];

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Users Details">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
        </div>
      </div>
      <div className="nk-block">
        <div className="card">
          <div className="card-aside-wrap d-block d-lg-flex">
            <div
              className={`min-vh-auto card-aside card-aside-left user-aside toggle-slide toggle-slide-right toggle-break-lg ${
                asideView ? "content-active" : ""
              }`}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <GlobalLoader />
                </div>
              ) : (
                <SimpleBar
                  className="card-inner-group"
                  forceVisible="y"
                  autoHide
                >
                  <div className="card-inner">
                    <div className="user-card user-card-s2">
                      <div className="user-avatar lg bg-primary">
                        <ImageElement
                          previewSource={
                            customerData?.UserProfile?.profile_img_url_full
                          }
                          alt=""
                        />
                      </div>
                      <div className="user-info">
                        <h5>
                          {checkValidData(
                            textFormatter(
                              customerData?.UserProfile?.full_name || ""
                            )
                          )}
                        </h5>
                        <span className="sub-text">
                          {checkValidData(customerData?.UserProfile?.email)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <h6 className="overline-title-alt mb-2">
                      {t("text.userManagement.additional")}
                    </h6>
                    <div className="row g-3">
                      <div className="col-6">
                        <span className="sub-text">
                          {t("text.userManagement.phone")}:
                        </span>
                        <span>
                          {phoneNumberFormatter(
                            customerData?.UserProfile?.mobile_country_code,
                            customerData?.UserProfile?.mobile_no
                          )}
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="sub-text">
                          {t("text.userManagement.country")}:
                        </span>
                        <span>
                          {checkValidData(
                            customerData?.UserProfile?.Country?.name
                          )}
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="sub-text">
                          {t("text.userManagement.language")}:
                        </span>
                        <span>
                          {checkValidData(
                            customerData?.UserProfile?.default_lang_title
                          )}
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="sub-text">
                          {t("text.common.status")}:
                        </span>
                        <span
                          className={`lead-text text-${
                            customerData?.is_active ? "success" : "danger"
                          }`}
                        >
                          {checkValidData(
                            textFormatter(
                              customerData?.is_active ? "active" : "inactive"
                            )
                          )}
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="sub-text">
                          {t("text.userManagement.created")}:
                        </span>
                        <span>
                          {dateFormatter(
                            customerData?.created_at,
                            classicDataTimeFormate
                          )}
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="sub-text">
                          {t("text.userManagement.lastLogin")}:
                        </span>
                        <span>
                          {dateFormatter(
                            customerData?.last_login_datetime,
                            classicDataTimeFormate
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </SimpleBar>
              )}
            </div>
            <div className="card-content overflow-hidden">
              <Tabs
                tabContent={tabContent}
                activeKey={"transactionHistory"}
                setActiveKey={setDefaultKey}
                tabWithToggle="nav-item-trigger d-lg-none"
                asideToggle={asideToggle}
                asideView={asideView}
              />
            </div>
          </div>
          {asideView ? (
            <div onClick={() => asideToggle()} className="toggle-overlay" />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default CustomerDetails;
