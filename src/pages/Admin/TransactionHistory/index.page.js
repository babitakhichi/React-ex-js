import { t } from "i18next";
import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  checkValidCount,
  checkValidData,
  checkValidDiscount,
  checkValidInvoice,
  checkValidPrice,
  DataTable,
  ListingHeader,
  PageHeader,
  serialNumberFormatter,
  statusFormatter,
  Tabs,
  textFormatter,
  // statusFormatter,
  TransactionHistoryFilter,
} from "../../../components";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import {
  AdminManageSubscriptionServices,
  TransactionHistoryServices,
} from "../../../services";
import {
  dateFormatter,
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../utils";

function TransactionHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState([]);
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
  const [defaultKey, setDefaultKey] = useState("individual");
  // const [alertLoader, setAlertLoader] = useState(false);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);

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
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "TRANSACTION HISTORY",
    },
  ];
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
      arr.splice(
        9,
        0,
        {
          dataField: "refund_amount",
          text: t("text.transactionHistory.refund"),
          headerClasses: "sorting",
          sort: true,
          headerSortingClasses,
          onSort: (field, order) => {
            onSortColumn(field, order);
          },
          formatter: (cell, row) =>
            row?.second_refund_amount
              ? checkValidPrice(
                  Number(row?.refund_amount) + Number(row?.second_refund_amount)
                )
              : checkValidPrice(row?.refund_amount),
        },
        {
          dataField: "discount_amount",
          text: "Discount",
          headerClasses: "sorting",
          sort: true,
          headerSortingClasses,
          onSort: (field, order) => {
            onSortColumn(field, order);
          },
          formatter: (cell, row) =>
            checkValidDiscount(cell, row?.discount_type),
        }
      );
    }
    return arr;
  };
  const columns = getColumns();
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
        Name: item?.User?.UserProfile?.full_name || "-",
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
  const dataTable = (
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
      // searchPlaceholder={t("text.search.ManageSubscription")}
    />
  );
  const tabContent = [
    {
      name: "Personal Account",
      key: "individual",
      content: dataTable,
    },
    {
      name: "Corporate",
      key: "corporate",
      content: dataTable,
    },
  ];
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Transaction History">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
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
      <Tabs
        tabContent={tabContent}
        tabsFor="table"
        activeKey={defaultKey}
        setActiveKey={setDefaultKey}
        onTabChange={onTabChange}
      />
    </>
  );
}
export default TransactionHistory;
