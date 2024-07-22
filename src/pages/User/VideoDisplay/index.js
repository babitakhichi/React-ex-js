import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoConferenceService } from "../../../services";
import { decoder, logger, modalNotification } from "../../../utils";
import { GlobalLoader } from "../../../components";

function VideoDisplay() {
  const param = useParams();
  const [url, setUrl] = useState("");
  const [loader, setLoader] = useState(false);
  const getMeetingDetailId = async () => {
    setLoader(true);
    try {
      let res = await VideoConferenceService.meetingDetailIdService(
        decoder(param?.id)
      );
      const { data, success, message } = res;
      if (success === 1) {
        setUrl(data?.recording_url);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoader(false);
  };
  useEffect(() => {
    getMeetingDetailId();
  }, []);

  return (
    <>
      {loader ? (
        <GlobalLoader />
      ) : (
        <video
          controlsList="nodownload"
          muted
          controls
          className="videoRecord"
          alt="All the devices"
          src={url}
        />
      )}
    </>
  );
}

export default VideoDisplay;
