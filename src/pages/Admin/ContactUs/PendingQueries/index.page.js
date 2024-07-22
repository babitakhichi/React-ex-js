import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  actionFormatter,
  Breadcrumb,
  DataTable,
  ModalComponent,
  PageHeader,
  ListingHeader,
  PendingQueriesFilter,
  SendReplyform,
  serialNumberFormatter,
  checkValidData,
  Tabs,
  textFormatter,
  phoneNumberCountryFormatter,
  // statusFormatter,
  // commasFormatter,
} from "../../../../components";
import {
  dateFormatter,
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
  readMoreTextShow,
} from "../../../../utils";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import { AdminPendingQueriesServices } from "../../../../services";
import moduleRoutesMap from "../../../../routeControl";

function PendingQueries() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [readData, setReadData] = useState();
  const [showReadMore, setShowReadMore] = useState(false);
  const [sendMail, setsendMail] = useState(false);
  const [sendMailLoading, setsendMailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterData, setFilterData] = useState({});
  const [param, setParam] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rowData, setRowData] = useState();
  const [csvData, setCsvData] = useState([]);
  const [defaultKey, setDefaultKey] = useState("registeredUsers");
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

  const showMoreText = (data) => {
    setShowReadMore(true);
    setReadData(data.data);
  };
  const onCloseDescriptionModal = () => {
    setShowReadMore(false);
    setReadData("");
  };
  const showSendMailModal = () => {
    setsendMail(true);
  };
  const hideSendMailModal = () => {
    setsendMail(false);
    setRowData();
  };

  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "PENDING QUERIES",
    },
  ];

  const options = (row) => {
    const optionsArr = [
      {
        name: "Send Reply",
        icon: "icon ni ni-mail",
        action: "confirm",
        onClickHandle: () => {
          showSendMailModal();
          setRowData(row);
          // document.body.click();
        },
      },
    ];
    return optionsArr;
  };

  const columns = [
    {
      dataField: "id",
      text: t("text.common.sno"),
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "full_name",
      text: t("text.pendingQueries.name"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => checkValidData(textFormatter(row?.full_name)),
    },
    {
      dataField: "email",
      text: t("text.pendingQueries.emailId"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => checkValidData(row?.email),
    },
    {
      dataField: "phone_number",
      text: t("text.pendingQueries.phoneNumber"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        phoneNumberCountryFormatter(row?.country_code, row?.phone_number),
    },
    {
      dataField: "country",
      text: t("text.pendingQueries.country"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => checkValidData(row?.Country?.name),
    },
    {
      dataField: "query",
      text: t("text.pendingQueries.userQuery"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => readMoreTextShow(cell, showMoreText),
    },
    {
      dataField: "ContactReason",
      text: t("text.pendingQueries.queryType"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        checkValidData(row?.ContactReason?.contact_reason),
    },
    // {
    //   dataField: "UserContact",
    //   text: t("text.pendingQueries.subscriptionPlan"),
    //   headerClasses: "sorting",
    //   sort: true,
    //   headerSortingClasses,
    //   onSort: (field, order) => {
    //     onSortColumn(field, order);
    //   },
    //   formatter: (cell, row) =>
    //     row?.UserContact?.UserSubscriptions
    //       ? commasFormatter(
    //           row?.UserContact?.UserSubscriptions?.map((item) =>
    //             statusFormatter(item?.Subscription?.plan_type)
    //           )
    //         )
    //       : "-",

    //   // formatter: (cell, row) =>
    //   //   checkValidData(
    //   //     statusFormatter(
    //   //       row?.UserContact?.UserSubscription?.Subscription?.plan_type
    //   //     )
    //   //   ),
    // },
    {
      dataField: "createdAt",
      text: t("text.pendingQueries.createdTime"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY - hh:mm A"),
    },
    {
      dataField: "action",
      text: t("text.pendingQueries.action"),
      headerClasses: "nk-tb-col-tools text-end",
      formatter: (cell, row) => actionFormatter(options(row)),
    },
  ];
  const onSubmitFilter = (val) => {
    setLoading(true);
    try {
      setFilterData(val);
      tableReset();
      const newParams = { ...param };
      newParams.page = 1;
      navigateWithParam(newParams, navigate, pathname);
      setVisible(false);
      setLoading(false);
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
    if (data?.length > 0) {
      const dataCsv = data.map((item) => {
        return {
          Name: item?.full_name || "-",
          Email: `${item?.email}`,
          "Phone Number": item?.country_code
            ? `+${item?.country_code} ${item?.phone_number}`
            : "-",
          Country: item?.Country?.name,
          "User Query": item?.query,
          "Query Type": item?.ContactReason?.contact_reason,
          // "Subscription Plan": item?.UserContact?.UserSubscriptions
          //   ? commasFormatter(
          //       item?.UserContact?.UserSubscriptions?.map((items) =>
          //         statusFormatter(items?.Subscription?.plan_type)
          //       )
          //     )
          //   : "-",
          "Created Date & Time": dateFormatter(
            item?.createdAt,
            "DD/MM/YYYY - hh:mm A"
          ),
        };
      });
      setCsvData(dataCsv);
    }
  };

  const getPendingQueriesList = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        type: defaultKey === "registeredUsers" ? "user" : "guest",
        ...filterData,
      };
      const res = await AdminPendingQueriesServices.getPendingQueriesList({
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
      getPendingQueriesList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getPendingQueriesList();
      tableReset();
    }
  }, [defaultKey]);

  const sendReply = async (value) => {
    setsendMailLoading(true);
    try {
      const bodyData = {
        id: rowData?.id,
        ...value,
      };
      const res = await AdminPendingQueriesServices.sendReplyService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        hideSendMailModal();
        tableReset();
        getPendingQueriesList();
      }
    } catch (error) {
      logger(error);
    }
    sendMailLoading(false);
  };

  const tabContent = [
    {
      name: t("text.pendingQueries.registeredUsers"),
      key: "registeredUsers",
      content: (
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
          // searchPlaceholder={t("text.search.manageCustomers")}
        />
      ),
    },
    {
      name: t("text.pendingQueries.unregisteredUsers"),
      key: "unregisteredUsers",
      content: (
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
          // searchPlaceholder={t("text.search.manageCustomers")}
        />
      ),
    },
  ];

  const onTabChange = (key) => {
    if (defaultKey !== key) {
      setPage(1);
      setSearchName("");
      setFilterData({});
      setSizePerPage(10);
      navigate(moduleRoutesMap.admin.PENDING_QUERIES.path);
    }
  };

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Pending Queries">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "csvExport"]}
            popover={
              <PendingQueriesFilter
                onSubmit={onSubmitFilter}
                filterData={filterData}
                loading={loading}
                onReset={onReset}
                t={t}
              />
            }
            setVisible={setVisible}
            visible={visible}
            fileName="Pending-Queries.csv"
            csvData={csvData}
          />
        </div>
      </div>
      <div className="nk-block">
        <Tabs
          tabContent={tabContent}
          tabsFor="table"
          activeKey={defaultKey}
          setActiveKey={setDefaultKey}
          onTabChange={onTabChange}
        />
      </div>
      <ModalComponent
        backdrop
        modalExtraClass="zoom"
        show={showReadMore}
        onHandleCancel={onCloseDescriptionModal}
        title={t("text.pendingQueries.readMore")}
      >
        <p className="text-break">{readData}</p>
      </ModalComponent>
      <ModalComponent
        modalExtraClass="zoom"
        backdrop
        show={sendMail}
        onHandleCancel={hideSendMailModal}
        title={t("text.pendingQueries.sendReply")}
      >
        <SendReplyform
          sendReply={sendReply}
          t={t}
          hideSendMailModal={hideSendMailModal}
          loading={sendMailLoading}
          rowData={rowData}
        />
      </ModalComponent>
    </>
  );
}

export default PendingQueries;
