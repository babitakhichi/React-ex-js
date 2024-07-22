import React, { useState,useEffect } from "react";

import { useTranslation } from "react-i18next";
import {  useLocation, useNavigate } from "react-router-dom";
import { actionFormatter, Breadcrumb, DataTable, logoFormatter, ModalComponent, PageHeader,  ListingHeader, SweetAlert,  AddEditTeamMemberForm,  serialNumberFormatter, textFormatter, ManageTeamMembersFilter } from "../../../components";
import { decodeQueryData, getSortType, logger, modalNotification, navigateWithParam, readMoreTextShow } from "../../../utils";
import { AdminManageTeamMemberList } from "../../../services";

function ManageTeamMembers() {

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState([]);
  const [isAlertVisibleDelete, setIsAlertVisibleDelete] = useState(false);
  const [deleteId, setDeleteId] = useState()
  const [documentTypeModal, setDocumentTypeModal] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [readData, setReadData] = useState();
  const [typeModal, setTypeModal] = useState("");
  const [alertLoader, setAlertLoader] = useState(false)
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
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
const MemberType={
  visionPartners:"Vision partners",
  keyMembers:"Key members"
}
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
  const showAddTypeModal = () => {
    setTypeModal("add")
    setDocumentTypeModal(true);
  };
  const showTypeEditModal = (data) => {
    setTypeModal("edit")
    setRowData(data);
    setDocumentTypeModal(true);
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
      name: t("text.manageTeamMembers.title"),
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
 
  const pendingColumns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
      serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "img_url",
      text: "Image",
      
      formatter: (cell, row) => logoFormatter(row?.img_url,"Image"),
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
      dataField: "position",
      text: t("text.manageTeamMembers.position"),
      sort: true,
      headerClasses: "sorting",
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
    },
    {
      dataField: "description",
      text: t("text.common.description"),
      sort: true,
      headerClasses: "sorting",
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => readMoreTextShow(cell, showMoreText),
    },
    {
      dataField: "member_type",
      text: t("text.manageTeamMembers.membertype"),
      sort: true,
      headerSortingClasses,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter:(cell)=>MemberType?.[cell]
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
  const getTeamMemberList = async () => {
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
      const res = await AdminManageTeamMemberList.getTeamMemberListService({
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
      getTeamMemberList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getTeamMemberList();
    }
  }, [])
  const onSubmitForm = async (values) => {
    setLoading(true);
    try {
      const bodyData = { ...values };
      bodyData.img_url=values.image
      delete bodyData.image
      const res = rowData?.id
        ? await AdminManageTeamMemberList.updateTeamMemberService(
            rowData?.id,
            bodyData
          )
        : await AdminManageTeamMemberList.AddTeamMemberService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setDocumentTypeModal(false);
        getTeamMemberList();
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
  const deleteTeamMember = async () => {
    setAlertLoader(true);
    try {
     
      const res = await AdminManageTeamMemberList.deleteTeamMemberService(
        deleteId,
       
      );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        tableReset();
        getTeamMemberList();
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
          <PageHeader heading={t("text.manageTeamMembers.title")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create"]}
            btnText={t("text.manageTeamMembers.addMember")}
            popover={
              <ManageTeamMembersFilter
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
        
          tableColumns={pendingColumns}
        
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
       
        />
      <ModalComponent
        backdrop
        show={documentTypeModal}
        onHandleCancel={hideDocumentTypeModal}
        title={typeModal === 'add' ? t("text.manageTeamMembers.addMember"):t("text.manageTeamMembers.editMember")}
        
      >
      <AddEditTeamMemberForm typeModal={typeModal} hideDocumentTypeModal={hideDocumentTypeModal}   onSubmit={onSubmitForm}
 
  loading={loading}
  rowData={rowData}/>
       
      </ModalComponent>
      <ModalComponent
        backdrop
        show={showReadMore}
        onHandleCancel={onCloseDescriptionModal}
        title="Read More"
      >
        <p className="text-break">{readData}</p>
      </ModalComponent>
      <SweetAlert
        title={t('text.common.areYouSure')}
        text={t("text.manageTeamMembers.deleteMember")}
        show={isAlertVisibleDelete}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisibleDelete}
        // showLoaderOnConfirm
        loading={alertLoader}
        onConfirmAlert={deleteTeamMember}
      />
    </>
  );
}

export default ManageTeamMembers;
