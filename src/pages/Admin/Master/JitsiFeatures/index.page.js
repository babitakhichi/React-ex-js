import { t } from "i18next";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  actionFormatter,
  Input as TextInput,
  Breadcrumb,
  DataTable,
  ListingHeader,
  ModalComponent,
  PageHeader,
  statusFormatter,
  SweetAlert,
  DocumentTypeFilter,
} from "../../../../components";
import { logger, modalNotification } from "../../../../utils";

function JitsiFeatures() {
  const [status, setStatus] = useState("active");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisibleDelete, setIsAlertVisibleDelete] = useState(false);
  const [jitsiFeaturesModal, setJitsiFeaturesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [featuresModal, setFeaturesModal] = useState("");
  const [filterData, setFilterData] = useState({});
  const showAddTypeModal = () => {
    setFeaturesModal("add");
    setJitsiFeaturesModal(true);
  };
  const showFeaturesEditModal = () => {
    setFeaturesModal("edit");
    setJitsiFeaturesModal(true);
  };
  const hideJitsiFeaturesModal = () => {
    setJitsiFeaturesModal(false);
  };
  const jitsiFeaturesAdded = () => {
    setJitsiFeaturesModal(false);
    modalNotification({
      type: "success",
      message: "JItsi Features Added Successfully",
    });
  };
  const jitsiFeaturesUpdated = () => {
    setJitsiFeaturesModal(false);
    modalNotification({
      type: "success",
      message: "JItsi Features Updated Successfully",
    });
  };
  const onTypeDeleteConfirmAlert = () => {
    modalNotification({
      type: "success",
      message: "JItsi Features Deleted Successfully",
    });
    setIsAlertVisible(false);
    return true;
  };
  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "JITSI FEATURES",
    },
  ];
  const listData = [
    {
      id: 1,
      name: "Features 1",
      status: "active",
    },
    {
      id: 2,
      name: "	Features 2",
      status: "inactive",
    },
    {
      id: 3,
      name: "Features 1",
      status: "active",
    },
    {
      id: 4,
      name: "Features 2",
      status: "active",
    },
    {
      id: 5,
      name: "Features 2",
      status: "inactive",
    },
    {
      id: 6,
      name: "Features 1",
      status: "inactive",
    },
    {
      id: 7,
      name: "Features 1",
      status: "active",
    },
    {
      id: 8,
      name: "Features 2",
      status: "inactive",
    },
    {
      id: 9,
      name: "Features 2",
      status: "active",
    },
    {
      id: 10,
      name: "Features 1",
      status: "active",
    },
  ];
  const options = (row) => {
    const optionsArr = [
      {
        name: "Edit",
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {
          showFeaturesEditModal();
          document.body.click();
        },
      },
      {
        name: "Delete",
        icon: "icon ni ni-trash",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisibleDelete(true);
          document.body.click();
        },
      },
    ];
    if (row.status === "active") {
      optionsArr.push({
        name: "Deactivate",
        icon: "icon ni ni-cross-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setStatus("inactive");
          document.body.click();
        },
      });
    }
    if (row.status === "inactive") {
      optionsArr.push({
        name: "Activate",
        icon: "icon ni ni-check-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setStatus("active");
          document.body.click();
        },
      });
    }
    return optionsArr;
  };
  const onConfirmAlert = () => {
    setIsAlertVisible(false);
    if (status === "active") {
      modalNotification({
        type: "success",
        message: "JItsi Features Activated Successfully",
      });
    } else {
      modalNotification({
        type: "success",
        message: "JItsi Features Deactivated Successfully",
      });
    }
    return true;
  };
  const columns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
    },
    {
      dataField: "name",
      text: "Name",
      headerClasses: "sorting",
    },
    {
      dataField: "status",
      text: "Status",
      headerClasses: "sorting",
      formatter: statusFormatter,
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
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  const onReset = () => {
    setFilterData({});
  };
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="JItsi Features">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create"]}
            btnText="Add New"
            onHandleShow={showAddTypeModal}
            popover={
              <DocumentTypeFilter
                t={t}
                loading={loading}
                onSubmit={onSubmit}
                onReset={onReset}
                filterData={filterData}
              />
            }
          />
        </div>
      </div>
      <DataTable
        hasLimit
        noOfPage="1"
        sizePerPage="10"
        page="1"
        count="100"
        tableData={listData}
        tableColumns={columns}
        // param={param}
        // defaultSort={defaultSort}
        setSizePerPage=""
        // tableLoader={tableLoader}
        // tableReset={tableReset}
        // getSearchValue={getSearchValue}
        // searchPlaceholder={t("text.search.manageCustomers")}
      />
      <ModalComponent
        backdrop
        show={jitsiFeaturesModal}
        onHandleCancel={hideJitsiFeaturesModal}
        title={
          featuresModal === "add" ? "Add JItsi Features" : "Edit JItsi Features"
        }
      >
        <form>
          <div className="form-group">
            <label className="form-label" htmlFor="documentType">
              Features Name
            </label>
            <TextInput
              className="form-control form-control-lg"
              placeholder="Enter JItsi Features"
              value={featuresModal === "add" ? "" : "Features 1"}
              name="documentType"
              disabled={false}
              variant="standard"
              type="text"
            />
          </div>
          <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
            <div>
              {featuresModal === "add" ? (
                <Link
                  href="#"
                  onClick={() => jitsiFeaturesAdded()}
                  className="btn btn-lg btn-primary"
                >
                  Add
                </Link>
              ) : (
                <Link
                  href="#"
                  onClick={() => jitsiFeaturesUpdated()}
                  className="btn btn-lg btn-primary"
                >
                  Update
                </Link>
              )}
            </div>
            <div>
              <Link
                href="#"
                onClick={() => hideJitsiFeaturesModal()}
                className="link link-light"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </ModalComponent>
      <SweetAlert
        title="Are you sure"
        text={
          status === "active"
            ? "you want to activate this jitsi features?"
            : "you want to deactivate this jitsi features?"
        }
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisible}
        // showLoaderOnConfirm
        // loading={loading}
        onConfirmAlert={onConfirmAlert}
      />
      <SweetAlert
        title="Are you sure"
        text="you want to delete this jitsi features?"
        show={isAlertVisibleDelete}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisibleDelete}
        // showLoaderOnConfirm
        // loading={loading}
        onConfirmAlert={onTypeDeleteConfirmAlert}
      />
    </>
  );
}

export default JitsiFeatures;
