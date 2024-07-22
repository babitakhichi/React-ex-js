import React, { useState ,useEffect} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { actionFormatter, Breadcrumb, DataTable, logoFormatter, ModalComponent, PageHeader,  ListingHeader, SweetAlert, ManageClientsPartnersFilter, serialNumberFormatter, textFormatter, AddEditClientPartnerForm,  } from "../../../components";
import { decodeQueryData, getSortType, logger, modalNotification, navigateWithParam } from "../../../utils";
import {  AdminManageClientPartner } from "../../../services";

function ManageClientsPartners() {

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState([]);
  const [isAlertVisibleDelete, setIsAlertVisibleDelete] = useState(false);
  const [documentTypeModal, setDocumentTypeModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [param, setParam] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [rowData, setRowData] = useState();
  const [alertLoader, setAlertLoader] = useState(false)
  const [deleteId, setDeleteId] = useState()
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
  const showAddTypeModal = () => {
    setTypeModal("add")
    setDocumentTypeModal(true);
  };
  const showTypeEditModal = (row) => {
    setTypeModal("edit")
    setDocumentTypeModal(true);
    setRowData(row)
  };
  const hideDocumentTypeModal = () => {
    setDocumentTypeModal(false);
    setRowData();
  };

  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: t("text.manageClientsPartners.title"),
    },
  ];

 
  const options = (row) => {
    const optionsArr = [
      {
        name: "Edit",
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {showTypeEditModal(row); document.body.click()},
      },
      {
        name: "Delete",
        icon: "icon ni ni-trash",
        action: "confirm",
        onClickHandle: () => {setIsAlertVisibleDelete(true);setDeleteId(row?.id); document.body.click()},
      }
    ];
    return optionsArr;
  };
  // Pending Request data
 
  const pendingColumns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
      serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "image_url",
      text: "Image",
    
      formatter: (cell, row) => logoFormatter(row?.image_url,"Image"),
    },
    {
      dataField: "name",
      text:t("text.manageTeamMembers.name"),
      sort: true,
      headerSortingClasses,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter:(cell)=>cell?textFormatter(cell):"-"
    },
    {
      dataField: "category",
      text: t("text.manageClientsPartners.category"),
      sort: true,
      headerSortingClasses,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter:(cell)=>cell?textFormatter(cell):"-"
    },
    {
      dataField: "action",
      text: "Action",
      headerClasses: "nk-tb-col-tools text-end",
      formatter: (cell, row) => actionFormatter(options(row)),
    },
  ];
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
  const getClientPartnerList = async () => {
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
      const res = await AdminManageClientPartner.getClientPartnerListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.rows);
        setNoOfPage(
          data?.count > 0
            ? Math.ceil(data?.count / sizePerPage)
            : 1
        );
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
      getClientPartnerList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getClientPartnerList();
    }
  }, [])
  const onSubmitForm = async (values) => {
 
    setLoading(true);
    try {
      const bodyData = { ...values };
      bodyData.image_url=values.image
      delete bodyData.image
      const res = rowData?.id
        ? await AdminManageClientPartner.updateClientPartnerService(
            rowData?.id,
            bodyData
          )
        : await AdminManageClientPartner.AddClientPartnerService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setDocumentTypeModal(false);
        getClientPartnerList();
        setRowData();
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
  const deleteClient = async () => {
    setAlertLoader(true);
    try {
     
      const res = await AdminManageClientPartner.deleteClientPartnerService(
        deleteId,
       
      );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        tableReset();
        getClientPartnerList();
        setDeleteId();
       
        return true;
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setAlertLoader(false);
  };

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={t("text.manageClientsPartners.title")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create"]}
            btnText={t("text.manageClientsPartners.addNew")}
            popover={
              <ManageClientsPartnersFilter
              t={t}
                loading={loading}
                onSubmit={onSubmit}
                onReset={onReset}
                filterData={filterData}
              />
            }
            onHandleShow={showAddTypeModal}
            setVisible={setVisible}
            visible={visible}
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
    
        param={param}
        defaultSort={defaultSort}
        setSizePerPage={setSizePerView}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
         
   
          tableColumns={pendingColumns}
        
        />
      <ModalComponent
        backdrop
        show={documentTypeModal}
        onHandleCancel={hideDocumentTypeModal}
        title={typeModal === 'add' ? t("text.manageClientsPartners.addClient") : t("text.manageClientsPartners.editClient")}
      >
         <AddEditClientPartnerForm typeModal={typeModal} hideDocumentTypeModal={hideDocumentTypeModal} loading={loading}
  rowData={rowData}  onSubmit={onSubmitForm}/>
        
      </ModalComponent>
      <SweetAlert
          title={t('text.common.areYouSure')}
        text={t("text.manageClientsPartners.deleteClient")}
        show={isAlertVisibleDelete}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisibleDelete}
        // showLoaderOnConfirm
        loading={alertLoader}
        onConfirmAlert={deleteClient}
      />
    </>
  );
}

export default ManageClientsPartners;
