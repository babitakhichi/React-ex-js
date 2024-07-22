import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppLayout from "../Auth/index.layout";
// import { Footer, Header } from "../../components";
// import { moduleRoutesList } from "../../routes";
// import AppLayout from "../Auth/index.layout";

function PublicLayout() {
  // const getmoduleRoutesList = moduleRoutesList();
  // let user = "user";

  // let userRole = userData?.user_type ?? user;
  const navigate = useNavigate();
  const [redirectpath, setRedirectPath] = useState("");

  useEffect(() => {
    if (redirectpath) {
      navigate(redirectpath);
    }
  }, [redirectpath]);
  return (
    <AppLayout setRedirectPath={setRedirectPath}>
      <Outlet />
    </AppLayout>
  );
}

export default PublicLayout;
