import React from "react";
import { Link } from "react-router-dom";

function AuthLogo() {
  return (
    <>
        <div className="brand-logo pb-4 text-center">
            <Link to="/" className="logo-link">
                <img className="logo-dark logo-img logo-img-xl" src="../assets/images/admin/auth-logo.svg"
                    srcSet="../assets/images/admin/auth-logo.svg" alt="logo-dark"/>
            </Link>
        </div>
    </>
  );
}

export default AuthLogo;