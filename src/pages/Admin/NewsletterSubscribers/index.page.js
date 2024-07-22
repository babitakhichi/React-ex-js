import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { t } from "i18next";
import {
  actionFormatter,
  Breadcrumb,
  DataTable,
  ListingHeader,
  PageHeader,
  SweetAlert,
  ModalComponent,
  SendNewsletterForm,
  serialNumberFormatter,
  checkValidData,
} from "../../../components";
import { NewsletterSubscribersServices } from "../../../services";
import {
  dateFormatter,
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../utils";
import adminRoutesMap from "../../../routeControl/adminRoutes";

function NewsletterSubscribers() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [sendNewsletterModal, setSendNewsletterModal] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [param, setParam] = useState({});
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  const [newslettersId, setNewslettersId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [newsletterList, setNewsletterLiist] = useState([]);
  const [noOfPage, setNoOfPage] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [nameArray, setNameArray] = useState([]);
  const [hideArray, setRemoveSelectedArray] = useState([]);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(true);

  const showSendNewsletterModal = () => {
    setSendNewsletterModal(true);
  };
  const hideSendNewsletterModal = () => {
    setSendNewsletterModal(false);
  };

  let rowArray = [];
  if (nameArray.length > 0) {
    nameArray.map((item, index) => {
      rowArray.push(item, index);
    });
  }
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "NEWSLETTER SUBSCRIBERS",
    },
  ];

  const options = (row) => {
    const optionsArr = [
      {
        name: "Delete",
        icon: "icon ni ni-trash",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          document.body.click();
          setNewslettersId(row?.id);
        },
      },
    ];
    return optionsArr;
  };

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
    setNewsletterLiist([]);
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
  const rowSelection = (row, isSelect) => {
    let tempArray = [...nameArray];
    let hidesArray = [...hideArray];
    if (isSelect === true) {
      tempArray.push(row?.email);
      hidesArray.push(row?.id);
    } else {
      let removeIndex = tempArray.findIndex((data) => {
        return data === row?.email;
      });
      let removeIndexRow = hidesArray.findIndex((data) => {
        return data === row?.id;
      });
      tempArray.splice(removeIndex, 1);
      hidesArray.splice(removeIndexRow, 1);
    }
    let unique = [...new Set(tempArray)];
    let uniqueArray = [...new Set(hidesArray)];

    if (uniqueArray.length > 0) {
      setButtonLoading(false);
    } else {
      setButtonLoading(true);
    }
    setNameArray(unique);
    setRemoveSelectedArray(uniqueArray);
  };

  const AllRowSelection = (isSelect, rows) => {
    let tempArray = [...nameArray];
    let hidesArray = [...hideArray];
    if (isSelect === true) {
      rows.forEach((item) => {
        tempArray.push(item?.email);
        hidesArray.push(item?.id);
      });
    } else {
      tempArray = [];
      hidesArray = [];
    }
    let unique = [...new Set(tempArray)];
    let uniqueArray = [...new Set(hidesArray)];
    if (uniqueArray.length > 0) {
      setButtonLoading(false);
    } else {
      setButtonLoading(true);
    }
    setNameArray(unique);
    setRemoveSelectedArray(uniqueArray);
  };
  const getNewslettersList = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
      };
      const res = await NewsletterSubscribersServices.getNewsletterservice({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setNewsletterLiist(data?.rows);
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
      getNewslettersList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getNewslettersList();
    }
  }, []);
  const newsDeleted = async (id) => {
    setDeleteLoading(true);
    try {
      const res = await NewsletterSubscribersServices.deleteNews(id);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setIsAlertVisible(false);
        getNewslettersList();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setDeleteLoading(false);
  };
  const onConfirmAlert = () => {
    newsDeleted(newslettersId);
    setIsAlertVisible(false);
    return true;
  };
  const columns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },

    {
      dataField: "email",
      text: "Email",
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => checkValidData(row?.email),
    },
    {
      dataField: "createdAt",
      text: "Created Date",
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
      text: "Action",
      headerClasses: "nk-tb-col-tools text-end",
      formatter: (cell, row) => actionFormatter(options(row)),
    },
  ];

  const sendNewsletter = async (values) => {
    setSendLoading(true);
    try {
      const bodyData = {
        ...values,
      };
      bodyData.emails = nameArray;
      const res = await NewsletterSubscribersServices.sendNewsletter(bodyData);
      const { success, message } = res;
      if (success === 1) {
        // getFaqList();
        modalNotification({
          type: "success",
          message,
        });
        setSendNewsletterModal(false);
        tableReset();
        getNewslettersList();
        setNameArray([]);
        setRemoveSelectedArray([]);
        setButtonLoading(true);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }

    setSendLoading(false);
    setSendNewsletterModal(false);
  };
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Newsletter Subscribers">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["extraButton"]}
            // btnText="Send Newsletter"
            extraBtnText={t("text.newsletterSubscribers.sendLetter")}
            extraBtnClass="btn btn-primary"
            icon={false}
            popover=""
            loading={buttonLoading}
            onExtraButtonHandleShow={showSendNewsletterModal}
            setVisible={setVisible}
            visible={visible}
          />
        </div>
      </div>
      <DataTable
        hasLimit
        sizePerPage={sizePerPage}
        page={page}
        tableData={newsletterList}
        tableColumns={columns}
        selectRow
        setSizePerPage={setSizePerView}
        noOfPage={noOfPage}
        count={totalCount}
        param={param}
        defaultSort={defaultSort}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
        onRowSelect={rowSelection}
        onRowSelectAll={AllRowSelection}
        selectedRowData={hideArray}
        // searchPlaceholder={t("text.search.ManageSubscription")}
      />

      <ModalComponent
        backdrop
        show={sendNewsletterModal}
        size="md"
        onHandleCancel={hideSendNewsletterModal}
        title={t("text.newsletterSubscribers.sendLetter")}
      >
        <SendNewsletterForm
          onSubmit={sendNewsletter}
          hideSendNewsletterModal={hideSendNewsletterModal}
          loading={sendLoading}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.newsletterSubscribers.areSure")}
        text={t("text.newsletterSubscribers.deleteSubscriber")}
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        loading={deleteLoading}
        onConfirmAlert={onConfirmAlert}
      />
    </>
  );
}
export default NewsletterSubscribers;
