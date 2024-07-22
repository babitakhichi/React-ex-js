import React from "react";
import config from "../../../config";

function ImageElement({ previewSource = "", source, alt = "image", ...rest }) {
  return (
    <>
      {previewSource ? (
        <img src={previewSource} alt={alt} {...rest} />
      ) : (
        <>
          {source ? (
            <img src={`${config.IMAGE_URL}/${source}`} alt={alt} {...rest} />
          ) : (
            <img
              src={`${config.ADMIN_IMAGE_URL}/profile-img.jpg`}
              alt="userImage"
            />
          )}
        </>
      )}
    </>
  );
}

export default ImageElement;
