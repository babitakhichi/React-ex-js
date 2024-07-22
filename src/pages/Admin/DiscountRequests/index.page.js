import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Image } from "antd";
import { t } from "i18next";
import {
  actionFormatter,
  Breadcrumb,
  DataTable,
  logoFormatter,
  ModalComponent,
  PageHeader,
  Tabs,
  ListingHeader,
  DiscountRequestsFilter,
  ReasonRejectForm,
  serialNumberFormatter,
  checkValidData,
  mobileFormatter,
  DiscountAmountForm,
  csvPhoneCountryFormatter,
  textFormatter,
  alltextFormatter,
  // checkValidPrice,
  checkValidDiscount,
  ImageElement,
} from "../../../components";
import {
  dateFormatter,
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  momentTimeFormatter,
  navigateWithParam,
  readMoreTextShow,
} from "../../../utils";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import {
  AdminDiscountRequests,
  AdminDocumentTypeServices,
} from "../../../services";

function DiscountRequests() {
  const formRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [readData, setReadData] = useState();
  const [showReadMore, setShowReadMore] = useState(false);
  const [rejectResonModal, setRejectResonModal] = useState(false);
  // const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [viewDiscountModal, setviewDiscountModal] = useState(false);
  const [acceptDiscountModal, setAcceptDiscountModal] = useState(false);
  // const [rejectDiscountModal, setRejectDiscountModal] = useState(false);
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [viewData, setViewData] = useState();
  const [viewDataModal, setViewDataModal] = useState("");
  const [defaultKey, setDefaultKey] = useState("active");
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [param, setParam] = useState({});
  const [searchName, setSearchName] = useState("");
  const [state, setState] = useState([]);
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
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
      name: "DISCOUNT REQUESTS",
    },
  ];
  const showViewDiscountModal = () => {
    setviewDiscountModal(true);
  };
  const hideDiscountModal = () => {
    setviewDiscountModal(false);
  };
  const showAcceptDiscountModal = () => {
    setAcceptDiscountModal(true);
    setviewDiscountModal(false);
  };
  const hideAcceptDiscountModal = () => {
    setAcceptDiscountModal(false);
  };

  //  const showRejectDiscountModal = () => {
  //   setRejectDiscountModal(true)
  //   setviewDiscountModal(false)
  //  }

  //  const hideRejectDiscountModal = () =>{
  //   setRejectDiscountModal(false)
  //  }

  const showMoreText = (data) => {
    setShowReadMore(true);
    setReadData(data.data);
  };
  const onCloseDescriptionModal = () => {
    setShowReadMore(false);
    setReadData("");
  };
  const onShowRejectModal = () => {
    setviewDiscountModal(false);
    setRejectResonModal(true);
  };
  const onHideRejectModal = () => {
    setRejectResonModal(false);
  };
  // const onConfirmAlert = () =>{
  //   setIsAlertVisible(false)
  //   modalNotification({
  //     type: "success",
  //     message: "Request Accepted Successfully"
  //   });
  //   return true;
  // }
  const pendingOptions = (row) => {
    const optionsArr = [
      {
        name: "View",
        icon: "icon ni ni-eye",
        action: "confirm",
        onClickHandle: () => {
          showViewDiscountModal();
          setViewData(row);
          setViewDataModal(defaultKey);
        },
      },
    ];
    return optionsArr;
  };

  const getColumns = () => {
    const columns = [
      {
        dataField: "id",
        text: t("text.common.sno"),
        headerClasses: "w_70",
        formatter: (cell, row, index) =>
          serialNumberFormatter(page, sizePerPage, index),
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
        dataField: "email",
        text: t("text.common.email"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) => checkValidData(row?.User?.UserProfile?.email),
      },
      {
        dataField: "phone",
        text: t("text.common.phone"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) =>
          mobileFormatter(
            row?.User?.UserProfile?.mobile_country_code,
            row?.User?.UserProfile?.mobile_no
          ),
      },
      {
        dataField: "description",
        text: t("text.common.description"),
        headerClasses: "sorting",
        formatter: (cell) =>
          readMoreTextShow(textFormatter(cell), showMoreText),
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
      },
      {
        dataField: "category",
        text: "Category",
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) =>
          (row?.category === "general" &&
            checkValidData(textFormatter(row?.category))) ||
          alltextFormatter(row?.category),
      },
      {
        dataField: "documentType",
        text: t("text.discountRequest.documentTypeTitle"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell, row) =>
          checkValidData(textFormatter(row?.DocumentType?.document_type)),
      },
      {
        dataField: "documentUploaded",
        text: t("text.discountRequest.documentUploaded"),
        headerClasses: "sorting",
        formatter: (cell, row) => logoFormatter(row?.documentUploaded, "Image"),
      },
      {
        dataField: "createdAt",
        text: t("text.discountRequest.requestDate"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY"),
      },
      {
        dataField: "action",
        text: t("text.common.action"),
        headerClasses: "nk-tb-col-tools text-end",
        formatter: (cell, row) => actionFormatter(pendingOptions(row)),
      },
    ];
    if (defaultKey === "approved") {
      columns.splice(8, 0, {
        dataField: "updatedAt",
        text: t("text.discountRequest.approvalDate"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY"),
      });
    } else if (defaultKey === "rejected") {
      columns.splice(8, 0, {
        dataField: "updatedAt",
        text: t("text.discountRequest.rejectionDate"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => dateFormatter(cell, "DD/MM/YYYY"),
      });
    }

    return columns;
  };

  const columns = getColumns();

  const tabContent = [
    {
      name: "Pending",
      key: "active",
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
      name: "Approved",
      key: "approved",
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
      name: "Rejected",
      key: "rejected",
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
  const handleFilterSubmit = (val) => {
    setLoading(true);
    try {
      // let values = {
      //   document: val.docType,
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
    if (data?.length > 0) {
      const dataCsv = data.map((item) => {
        let obj = {
          Name: checkValidData(
            textFormatter(item?.User?.UserProfile?.full_name)
          ),
          Email: `${checkValidData(item?.User?.UserProfile?.email)}`,
          "Phone Number": csvPhoneCountryFormatter(
            item?.User?.UserProfile?.mobile_country_code,
            item?.User?.UserProfile?.mobile_no
          ),
          Description: checkValidData(item?.description),
          Category: checkValidData(item?.DocumentType?.category),
          "Document Type": checkValidData(item?.DocumentType?.document_type),
          "Request Date": dateFormatter(item?.createdAt, "DD/MM/YYYY"),
        };
        if (defaultKey === "approved") {
          obj["Approval Date"] = dateFormatter(item?.updatedAt, "DD/MM/YYYY");
        } else if (defaultKey === "rejected") {
          obj["Rejection Date"] = dateFormatter(item?.updatedAt, "DD/MM/YYYY");
        }
        return obj;
      });
      setCsvData(dataCsv);
    }
  };

  const getDiscountRequest = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        status: defaultKey,
        document: filterData.docType,
        from: filterData?.startDate,
        to: filterData?.endDate,
        document_type: filterData?.document_type,
        // ...filterData,
      };
      const res = await AdminDiscountRequests.getDiscountRequestsListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.rows);
        setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
        setTotalCount(data?.count);
        getCsvData(data?.rows);
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
      getDiscountRequest();
    }
  }, [param, defaultKey, filterData]);

  useEffect(() => {
    if (!search) {
      getDiscountRequest();
      tableReset();
    }
    setFilterData({});
    tableReset();
    formRef?.current?.resetForm();
  }, [defaultKey]);

  const requestAccept = async (values) => {
    setAcceptLoading(true);
    try {
      let bodyData;
      bodyData = { ...values };
      bodyData.refund_order_id = viewData?.order_id;
      if (viewData?.refund_type === "coin") bodyData.isCoin = true;
      bodyData.username = viewData?.User?.username;

      const res = await AdminDiscountRequests.discountRefundService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getDiscountRequest();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setAcceptDiscountModal(false);
    setAcceptLoading(false);
    // setIsAlertVisible(true)
  };
  const rejectionSubmit = async (values) => {
    setRejectLoading(true);
    try {
      let bodyData;
      bodyData = { ...values };
      bodyData.status = "rejected";

      const res =
        await AdminDiscountRequests.updateDiscountRequestsStatusService(
          viewData?.id,
          bodyData
        );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getDiscountRequest();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }

    setRejectResonModal(false);
    setRejectLoading(false);
  };
  const getDocumentTypeList = async () => {
    // setTableLoader(true);
    try {
      let queryParams = { all: true };
      const res = await AdminDocumentTypeServices.getDocumentTypeList({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setDocumentTypeList(data?.documentData?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    // setTableLoader(false);
  };
  useEffect(() => {
    getDocumentTypeList();
  }, []);

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Discount Requests">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "csvExport"]}
            popover={
              <DiscountRequestsFilter
                onSubmit={handleFilterSubmit}
                loading={loading}
                onReset={onReset}
                filterData={filterData}
                t={t}
                documentTypeList={documentTypeList}
                formRef={formRef}
              />
            }
            setVisible={setVisible}
            visible={visible}
            fileName="Discount-Request.csv"
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
          // onTabChange={onTabChange}
        />
      </div>
      <ModalComponent
        backdrop
        show={showReadMore}
        onHandleCancel={onCloseDescriptionModal}
        title="Read More"
      >
        <p className="text-break">{readData}</p>
      </ModalComponent>

      <ModalComponent
        backdrop
        show={rejectResonModal}
        onHandleCancel={onHideRejectModal}
        title="Reason for rejection"
      >
        <ReasonRejectForm
          onSubmit={rejectionSubmit}
          onHideRejectModal={onHideRejectModal}
          loading={rejectLoading}
        />
      </ModalComponent>

      <ModalComponent
        backdrop
        show={viewDiscountModal}
        onHandleCancel={hideDiscountModal}
        size="lg"
        title="Discount Request"
      >
        <>
          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <span className="sub-text">{t("text.common.name")}:</span>
              <p>
                {checkValidData(
                  textFormatter(viewData?.User?.UserProfile?.full_name)
                )}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <span className="sub-text">{t("text.common.email")}:</span>
              <p>{checkValidData(viewData?.User?.UserProfile?.email)}</p>
            </div>
            <div className="col-12 col-sm-6">
              <span className="sub-text">{t("text.common.phone")}:</span>
              <p>
                {mobileFormatter(
                  viewData?.User?.UserProfile?.mobile_country_code,
                  viewData?.User?.UserProfile?.mobile_no
                )}
              </p>
            </div>
            <div className="col-12 col-sm-6">
              <span className="sub-text">
                {t("text.discountRequest.requestDate")}:
              </span>
              <p>{dateFormatter(viewData?.createdAt, "DD/MM/YYYY")}</p>
            </div>
            {viewDataModal === "approved" && (
              <div className="col-12 col-sm-6">
                <span className="sub-text">
                  {t("text.discountRequest.approvalDate")}:
                </span>
                <p>{dateFormatter(viewData?.updatedAt, "DD/MM/YYYY")}</p>
              </div>
            )}
            {viewDataModal === "rejected" && (
              <div className="col-12 col-sm-6">
                <span className="sub-text">
                  {t("text.discountRequest.rejectionDate")}:
                </span>
                <p>{dateFormatter(viewData?.updatedAt, "DD/MM/YYYY")}</p>
              </div>
            )}
            {viewDataModal === "approved" && (
              <div className="col-12 col-sm-6">
                <span className="sub-text">
                  {t("text.discountRequest.discount")}:
                </span>
                <p>
                  {/* {checkValidPrice(viewData?.amount)} */}
                  {checkValidDiscount(viewData?.amount, viewData?.refund_type)}
                </p>
              </div>
            )}
            <div className="col-12 col-sm-12">
              <span className="sub-text">{t("text.common.description")}:</span>
              <p>{checkValidData(textFormatter(viewData?.description))}</p>
            </div>
            <div className="col-12 col-sm-6">
              <span className="sub-text">
                {t("text.discountRequest.documentTypeTitle")}:{" "}
              </span>{" "}
              <p>
                {checkValidData(
                  textFormatter(viewData?.DocumentType?.document_type)
                )}
              </p>
              {viewData?.document_image &&
              viewData?.document_image.includes(".pdf") ? (
                <div className="uploadDocument_wrap">
                  <Link
                    className="closeIcon"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(viewData?.document_image);
                    }}
                  >
                    <ImageElement source="pdf-file.svg" alt="pdf-file.svg" />
                  </Link>
                </div>
              ) : (
                <Image width={200} src={viewData?.document_image} />
              )}
            </div>
            {viewDataModal === "rejected" && (
              <div className="col-12 col-sm-12">
                <span className="sub-text">
                  {t("text.discountRequest.rejectionReason")}:{" "}
                </span>
                <p> {checkValidData(textFormatter(viewData?.reason))}</p>
              </div>
            )}
          </div>
          {viewDataModal === "active" && (
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2 mt-3">
              {momentTimeFormatter(viewData?.createdAt).add(7, "day") >=
              momentTimeFormatter(new Date()) ? (
                <>
                  <div>
                    <Link
                      href="#"
                      className="btn btn-lg btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        modalNotification({
                          type: "warning",
                          message: `Discount request can only be approved after 7 days of plan purchase date`,
                        });
                      }}
                    >
                      {t("text.common.accept")}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="#"
                      className="btn btn-lg btn-light"
                      onClick={(e) => {
                        e.preventDefault();
                        modalNotification({
                          type: "warning",
                          message: `Discount request can only be approved after 7 days of plan purchase date`,
                        });
                      }}
                    >
                      {t("text.common.reject")}
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Link
                      href="#"
                      className="btn btn-lg btn-primary"
                      onClick={() => showAcceptDiscountModal()}
                    >
                      {t("text.common.accept")}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="#"
                      className="btn btn-lg btn-light"
                      onClick={() => onShowRejectModal()}
                    >
                      {t("text.common.reject")}
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      </ModalComponent>

      <ModalComponent
        backdrop
        show={acceptDiscountModal}
        onHandleCancel={hideAcceptDiscountModal}
        title={
          viewData?.refund_type === "refund"
            ? t("text.discountRequest.discountInr")
            : t("text.discountRequest.discountCoins")
        }
      >
        <DiscountAmountForm onSubmit={requestAccept} loading={acceptLoading} />
      </ModalComponent>
    </>
  );
}

export default DiscountRequests;
