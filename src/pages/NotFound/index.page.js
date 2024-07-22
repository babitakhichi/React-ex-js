import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/scss/frontend/frontend.scss";
import { useNavigate } from "react-router-dom";
import { CommonButton, ImageElement } from "../../components";
import { modalNotification } from "../../utils";
import userRoutesMap from "../../routeControl/userRoutes";

function NotFound() {
  const navigate = useNavigate();
  const { path } = userRoutesMap.LOGIN;
  useEffect(() => {
    // let paths = path;
    modalNotification({
      type: "error",
      message: "Page Not Found",
    });
    // navigate(paths);
  }, []);

  const redirectPath = () => {
    navigate(path)
  }
  return (
    <>
      <section className="pageNotFound d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <ImageElement className="img-fluid" source="img-404.png" alt="404"/>
          <div className="pageNotFound_cnt ">
            <h1 className="font-bd">Whoops...Page Not Found</h1>
            <p className="font-lt mb-0">Looks like something went wrong and the page <br /> you are looking for can&apos;t be found.</p>
          </div>
          <CommonButton onClick={() => redirectPath()} variant="primary">Take Me Home</CommonButton>
        </div>
      </section>
    </>
  );
}

export default NotFound;
