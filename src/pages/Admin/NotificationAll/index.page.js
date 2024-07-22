import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";

import { t } from "i18next";

import {
  Breadcrumb,
  DataTable,
  notificationFormatter,
  PageHeader,
  serialNumberFormatter,
} from "../../../components";
import { NotificationServices } from "../../../services";
import {
  dateFormatter,
  decodeQueryData,
  // decodeQueryData,
  // getSortType,
  logger,
  modalNotification,
  // navigateWithParam,
  // totalTimeDifference,
} from "../../../utils";
import adminRoutesMap from "../../../routeControl/adminRoutes";

function NotificationAll() {
  const [notificationList, setNotificationList] = useState([]);

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  // const navigate = useNavigate();
  const { search } = location;

  const [param, setParam] = useState({});
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  // const [searchName, setSearchName] = useState("");

  // const [defaultSort, setDefaultSort] = useState([
  //   {
  //     dataField: "",
  //     order: "",
  //   },
  // ]);
  const [noOfPage, setNoOfPage] = useState();
  const [totalCount, setTotalCount] = useState(0);

  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "Notifications",
    },
  ];

  const handlenotificationList = async () => {
    setLoading(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        // sortBy: param?.sortBy,
        // sortType: param?.sortType,
        // search: searchName,
        type: "admin",
      };
      const res = await NotificationServices.getNotificationListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setNotificationList(data?.rows);
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
    setLoading(false);
  };
  useEffect(() => {
    handlenotificationList();
  }, [param]);

  useEffect(() => {
    if (search) {
      const data = decodeQueryData(search);
      setParam(data);
      setPage(data?.page ?? 1);
      // setSearchName(data?.name ?? "");
      // if (data?.sortType) {
      //   const sortData = [
      //     {
      //       order: getSortType(data?.sortType),
      //       dataField: data?.sortBy,
      //     },
      //   ];
      //   setDefaultSort(sortData);
      // } else {
      //   setDefaultSort({
      //     dataField: "",
      //     order: "",
      //   });
      // }
    }
  }, [location]);
  const tableReset = () => {
    setLoading(true);
    setNotificationList([]);
    setNoOfPage(0);
    setTotalCount(0);
  };
  // const onSortColumn = (field, order) => {
  //   const data = { ...param };
  //   data.sortBy = field;
  //   data.sortType = order === "asc" ? "ASC" : "DESC";
  //   navigateWithParam(data, navigate, pathname);
  //   tableReset();
  // };
  // const headerSortingClasses = (column, sortOrder) => {
  //   return sortOrder === "asc" ? "sorting_asc" : "sorting_desc";
  // };
  // const getSearchValue = (val) => {
  //   setSearchName(val);
  //   if (val) {
  //     tableReset();
  //   }
  // };
  const columns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },

    {
      dataField: "title",
      text: t("text.adminHeader.notification"),
      // headerClasses: "sorting",
      // sort: false,
      // headerSortingClasses,
      // onSort: (field, order) => {
      //   onSortColumn(field, order);
      // },
      formatter: (cell, row) => notificationFormatter(row),
    },
    {
      dataField: "createdAt",
      text: "Created Date",
      // headerClasses: "sorting",
      // sort: true,
      // headerSortingClasses,
      // onSort: (field, order) => {
      //   onSortColumn(field, order);
      // },
      formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY - hh:mm A"),
    },
  ];
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={t("text.adminHeader.notification")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
        </div>
      </div>
      <DataTable
        hasLimit
        sizePerPage={sizePerPage}
        page={page}
        tableData={notificationList}
        tableColumns={columns}
        searchShow={false}
        // selectRow
        setSizePerPage={setSizePerView}
        noOfPage={noOfPage}
        count={totalCount}
        param={param}
        // defaultSort={defaultSort}
        tableLoader={loading}
        tableReset={tableReset}
        // getSearchValue={getSearchValue}
        // onRowSelect={rowSelection}
        // onRowSelectAll={AllRowSelection}
        // selectedRowData={hideArray}
        // searchPlaceholder={t("text.search.ManageSubscription")}
      />
      {/* <div className="nk-notification">
        {notificationList.length > 0 ? (
          notificationList.map((item) => {
            return (
              <Link
                to="#"
                className="d-flex align-items-stretch justify-content-start"
                // onClick={(e) => {
                //   e.preventDefault();
                //   handleRead();
                //   navigate(
                //     moduleRoutesMap?.[userData?.user_type]
                //       ?.Notification.path
                //   );
                // }}
              >
                <div className="nk-notification-item dropdown-inner">
                  <div className="nk-notification-icon">
                    <em className="icon icon-circle bg-warning-dim ni ni-curve-down-right" />
                  </div>
                  <div className="nk-notification-content">
                    <div className="nk-notification-text">{item?.title}</div>
                    <div className="nk-notification-time">
                      {totalTimeDifference(item?.created_at, new Date())}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="emptySec text-center w-100">
          
            <h2>{t("text.common.noData")}</h2>
           
          </div>
        )}
      </div> */}
    </>
  );
}
export default NotificationAll;
