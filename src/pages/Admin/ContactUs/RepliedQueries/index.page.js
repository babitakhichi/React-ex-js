import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  checkValidData,
  // commasFormatter,
  DataTable,
  ListingHeader,
  ModalComponent,
  PageHeader,
  phoneNumberCountryFormatter,
  RepliedQueriesFilter,
  serialNumberFormatter,
  // statusFormatter,
  Tabs,
  textFormatter,
} from "../../../../components";
import moduleRoutesMap from "../../../../routeControl";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import { AdminPendingQueriesServices } from "../../../../services";
import {
  dateFormatter,
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
  readMoreTextShow,
} from "../../../../utils";

function RepliedQueries() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [readData, setReadData] = useState();
  const [showReadMore, setShowReadMore] = useState(false);
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
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(true);
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
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "REPLIED QUERIES",
    },
  ];

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
    //   dataField: "subscriptionPlan",
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
    // },
    {
      dataField: "reply",
      text: t("text.pendingQueries.reply"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => readMoreTextShow(cell, showMoreText),
    },
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
      dataField: "reply_date",
      text: t("text.pendingQueries.replied"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY - hh:mm A"),
    },
    // {
    //   dataField: "action",
    //   text: "Action",
    //   headerClasses: "nk-tb-col-tools text-end",
    //   formatter: (cell, row) => actionFormatter(options(row)),
    // },
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
          Reply: item?.reply,
          "Created Date & Time": dateFormatter(
            item?.createdAt,
            "DD/MM/YYYY - hh:mm A"
          ),
          Replied: dateFormatter(item?.reply_date, "DD/MM/YYYY - hh:mm A"),
        };
      });
      setCsvData(dataCsv);
    }
  };

  const getRepliedQueriesList = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        status: "replied",
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
      getRepliedQueriesList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getRepliedQueriesList();
      tableReset();
    }
  }, [defaultKey]);

  const onRowSelect = (val, isSelect) => {
    let selectedArray = [...selectedRowData];
    if (isSelect === true) {
      selectedArray.push(val?.id);
    } else {
      let removeIndex = selectedArray.findIndex((data) => {
        return data === val?.id;
      });
      selectedArray.splice(removeIndex, 1);
    }
    let unique = [...new Set(selectedArray)];
    if (unique.length > 0) {
      setDeleteLoading(false);
    } else {
      setDeleteLoading(true);
    }
    setSelectedRowData(unique);
  };

  const onRowSelectAll = (isSelect, val) => {
    let selectedArray = [...selectedRowData];
    if (isSelect === true) {
      val.forEach((item) => {
        selectedArray.push(item?.id);
      });
    } else {
      selectedArray = [];
    }
    let unique = [...new Set(selectedArray)];
    if (unique.length > 0) {
      setDeleteLoading(false);
    } else {
      setDeleteLoading(true);
    }
    setSelectedRowData(unique);
  };

  const deleteQuery = async () => {
    try {
      let bodyData = { queyids: selectedRowData };
      const res = await AdminPendingQueriesServices.deleteQueryService(
        bodyData
      );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getRepliedQueriesList();
        setDeleteLoading(true);
        setSelectedRowData([]);
        tableReset();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
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
          selectRow
          selectedRowData={selectedRowData}
          param={param}
          defaultSort={defaultSort}
          setSizePerPage={setSizePerPage}
          tableLoader={tableLoader}
          tableReset={tableReset}
          getSearchValue={getSearchValue}
          onRowSelect={onRowSelect}
          onRowSelectAll={onRowSelectAll}
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
          selectRow
          selectedRowData={selectedRowData}
          param={param}
          defaultSort={defaultSort}
          setSizePerPage={setSizePerPage}
          tableLoader={tableLoader}
          tableReset={tableReset}
          getSearchValue={getSearchValue}
          onRowSelect={onRowSelect}
          onRowSelectAll={onRowSelectAll}
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
      setSelectedRowData([]);
      setDeleteLoading(true);
      navigate(moduleRoutesMap.admin.REPLIED_QUERIES.path);
    }
  };

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Replied Queries">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "csvExport", "extraButton"]}
            extraBtnText="Delete"
            extraBtnClass="btn btn-danger"
            popover={
              <RepliedQueriesFilter
                onSubmit={onSubmitFilter}
                filterData={filterData}
                loading={loading}
                onReset={onReset}
                t={t}
              />
            }
            loading={deleteLoading}
            onExtraButtonHandleShow={deleteQuery}
            setVisible={setVisible}
            visible={visible}
            fileName="Replied-Queries.csv"
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
        modalExtraClass="zoom"
        backdrop
        show={showReadMore}
        onHandleCancel={onCloseDescriptionModal}
        title={t("text.pendingQueries.readMore")}
      >
        <p className="text-break">{readData}</p>
      </ModalComponent>
    </>
  );
}

export default RepliedQueries;
