import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  actionFormatter,
  Breadcrumb,
  checkValidData,
  DataTable,
  DocumentTypeFilter,
  EditFAQSForm,
  ListingHeader,
  ModalComponent,
  PageHeader,
  serialNumberFormatter,
  SweetAlert,
} from "../../../../components";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import { FaqsServices } from "../../../../services";
import {
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../utils";

function FAQs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [faqViewModal, setFaqViewModal] = useState(false);
  const { pathname, search } = location;
  const [faqEditModal, setFaqEditModal] = useState(false);
  const [faqModal, setFaqModal] = useState("");
  const [param, setParam] = useState({});
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  const [faqList, setFaqList] = useState([]);
  const [rowData, setRowData] = useState();
  const [tableLoader, setTableLoader] = useState(false);
  const [faqId, setFaqId] = useState("");
  const [filterData, setFilterData] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [detailFaqData, setDetailFaqData] = useState("");
  const [searchName, setSearchName] = useState("");
  const [visible, setVisible] = useState(false);
  const [alertLoader, setAlertLoader] = useState(false);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "FAQs",
    },
  ];
  useEffect(() => {
    if (search) {
      const data = decodeQueryData(search);
      setParam(data);
      setPage(data?.page ?? 1);
    }
  }, [location]);

  const showFaqViewModal = () => {
    setFaqViewModal(true);
  };
  const hideFaqViewModal = () => {
    setFaqViewModal(false);
  };
  const showFaqAddModal = () => {
    setFaqModal("add");
    setFaqEditModal(true);
  };
  const showFaqEditModal = (data) => {
    setFaqModal("edit");
    setRowData(data);
    setFaqEditModal(true);
  };
  const hideFaqEditModal = () => {
    setFaqEditModal(false);
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
    setFaqList([]);
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

  const onSubmit = (val) => {
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

  const getSearchValue = (val) => {
    setSearchName(val);
    if (val) {
      tableReset();
    }
  };

  const getFaqList = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        ...filterData,
      };
      const res = await FaqsServices.getAllFaqs({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setFaqList(data?.rows);
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

  const faqAdded = async (values) => {
    setLoading(true);
    try {
      setFaqEditModal(false);
      const bodyData = {
        question: values.question,
        answer: values.answer,
      };
      const res = await FaqsServices.addFaq(bodyData);
      const { success, message } = res;
      if (success === 1) {
        getFaqList();
        modalNotification({
          type: "success",
          message,
        });
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

  const faqDetail = async (id) => {
    setLoading(true);
    try {
      setFaqEditModal(false);
      const res = await FaqsServices.FaqDetail(id);
      const { success, data, message } = res;
      if (success === 1) {
        setDetailFaqData(data);
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

  const faqUpdated = async (values) => {
    setLoading(true);
    try {
      setFaqEditModal(false);
      const bodyData = {
        question: values.question,
        answer: values.answer,
      };
      const res = await FaqsServices.UpdateFaq(rowData?.id, bodyData);
      const { success, message } = res;
      if (success === 1) {
        getFaqList();
        modalNotification({
          type: "success",
          message,
        });
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
    setAlertLoader(false);
  };

  const faqDeleted = async (id) => {
    setLoading(true);
    try {
      setFaqEditModal(false);
      const res = await FaqsServices.deleteFaq(id);
      const { success, message } = res;
      if (success === 1) {
        getFaqList();
        modalNotification({
          type: "success",
          message,
        });
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

  const onConfirmAlert = () => {
    faqDeleted(faqId);
    setIsAlertVisible(false);
    return true;
  };

  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      getFaqList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getFaqList();
    }
  }, []);
  const options = (row) => {
    const optionsArr = [
      {
        name: t("text.common.view"),
        icon: "icon ni ni-eye",
        action: "confirm",
        onClickHandle: () => {
          showFaqViewModal();
          document.body.click();
          setFaqId(row?.id);
          faqDetail(row?.id);
        },
      },
      {
        name: t("text.common.edit"),
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {
          showFaqEditModal(row);
          document.body.click();
          setFaqId(row?.id);
        },
      },
      {
        name: t("text.common.delete"),
        icon: "icon ni ni-trash",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          document.body.click();
          setFaqId(row?.id);
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
      dataField: "question",
      text: t("text.faqs.question"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => checkValidData(cell),
    },
    {
      dataField: "action",
      text: t("text.common.status"),
      headerClasses: "nk-tb-col-tools text-end",
      formatter: (cell, row) => actionFormatter(options(row)),
    },
  ];
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="FAQs">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["create"]}
            btnText={t("text.faqs.addFaqs")}
            onHandleShow={showFaqAddModal}
            popover={
              <DocumentTypeFilter
                t={t}
                loading={loading}
                onSubmit={onSubmit}
                onReset={onReset}
                filterData={filterData}
              />
            }
            setVisible={setVisible}
            visible={visible}
          />
        </div>
      </div>
      <DataTable
        hasLimit
        sizePerPage={sizePerPage}
        page={page}
        tableData={faqList}
        tableColumns={columns}
        setSizePerPage={setSizePerView}
        noOfPage={noOfPage}
        count={totalCount}
        param={param}
        defaultSort={defaultSort}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
        // searchPlaceholder={t("text.search.manageCustomers")}
      />
      <ModalComponent
        backdrop
        show={faqViewModal}
        onHandleCancel={hideFaqViewModal}
        title={t("text.faqs.faqsDetails")}
      >
        <div className="faqView">
          <h6 className="title mb-3">{detailFaqData?.question}</h6>
          {/* <p><strong>Type of FAQ :</strong> <span className="badge badge-dim bg-info">Customer</span></p> */}
          <p>{detailFaqData?.answer}</p>
        </div>
      </ModalComponent>
      <ModalComponent
        backdrop
        show={faqEditModal}
        onHandleCancel={hideFaqEditModal}
        title={faqModal === "add" ? "Add FAQs" : "Edit FAQs"}
      >
        <EditFAQSForm
          t={t}
          hideFaqEditModal={hideFaqEditModal}
          faqModal={faqModal}
          onSubmit={faqModal === "add" ? faqAdded : faqUpdated}
          loading={loading}
          rowData={rowData}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={t("text.faqs.deleteDocumentText")}
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        loading={alertLoader}
        onConfirmAlert={onConfirmAlert}
      />
    </>
  );
}

export default FAQs;
