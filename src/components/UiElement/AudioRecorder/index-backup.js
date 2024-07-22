import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logger, modalNotification } from "../../../utils";

function AudioRecorder({
  voiceTranslate,
  setVoiceTranslate,
  speechToTextTranslation,
  remainingCount,
  // totalCount,
  isAudio,
  documentReset,
}) {
  const [recorder, setRecorder] = useState();

  function blobToFile(theBlob, fileName) {
    return new File([theBlob], fileName, {
      lastModified: new Date(),
      type: "audio/wav",
    });
  }
  useEffect(() => {
    if (window?.navigator?.mediaDevices?.getUserMedia && isAudio) {
      const constraints = { audio: true };
      let chunks = [];

      let onSuccess = (stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        setRecorder(mediaRecorder);
        mediaRecorder.onstop = () => {
          documentReset();
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          chunks = [];
          speechToTextTranslation(
            blobToFile(blob, "Speechtotext.wav"),
            remainingCount
          );
        };

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
      };

      let onError = (err) => {
        modalNotification({
          type: "error",
          message: err,
        });
        logger(`The following error occured: ${err}`);
      };

      window.navigator.mediaDevices
        .getUserMedia(constraints)
        .then(onSuccess, onError);
    }
  }, [remainingCount, isAudio]);
  const recordStart = () => {
    recorder.start();
    setVoiceTranslate(true);
  };
  const recordStop = () => {
    recorder.stop();
    setVoiceTranslate(false);
  };
  return (
    <>
      {voiceTranslate ? (
        <>
          <Link
            className="pauseBtn d-flex align-items-center justify-content-center rounded-circle"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              recordStop();
            }}
          >
            {" "}
            <em className="icon-pause" />{" "}
          </Link>
          {/* <div className="translateBar_bottom text-end">
            <span className="characterCout">
              {remainingCount}/{totalCount}
            </span>
          </div> */}
        </>
      ) : (
        <>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              recordStart();
            }}
            className="audioBtn d-flex align-items-center justify-content-center rounded-circle "
          >
            {" "}
            <em className="icon-record-fill" />{" "}
          </Link>
          {/* <div className="translateBar_bottom text-end">
            <span className="characterCout">
              {remainingCount}/{totalCount}
            </span>
          </div> */}
        </>
      )}
    </>
  );
}

export default AudioRecorder;
