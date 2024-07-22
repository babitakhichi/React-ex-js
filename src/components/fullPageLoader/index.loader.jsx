import React from "react";
import "./style.scss";
import { HashLoader } from "react-spinners";

function Loader() {
  return (
    <div className="loader-full">
      <HashLoader />
    </div>
  );
}

export default Loader;
