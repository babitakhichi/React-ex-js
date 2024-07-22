import React, { useEffect } from "react";
import Swal from "sweetalert2";

function SweetAlert({
  show,
  onConfirmAlert,
  loading,
  setIsAlertVisible,
  iconCustomClass = "",

  ...rest
}) {
  useEffect(() => {
    if (show) {
      Swal.fire({
        ...rest,
        customClass: {
          container: "dark-mode",
          icon: iconCustomClass,
        },
        preConfirm: async (data) => {
          const res = await onConfirmAlert(data);
          if (res) {
            return true;
          }
          return false;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          //   toastr.clear();
          //   NioApp.Toast('User Queries deleted successfully', 'success',{position: 'top-right'});
          setIsAlertVisible(false);
        } else if (result.isDismissed) {
          setIsAlertVisible(false);
        }
      });
    }
  }, [show]);

  return <></>;
}
export default SweetAlert;
