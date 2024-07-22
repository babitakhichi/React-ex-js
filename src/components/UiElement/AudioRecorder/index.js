import React from "react";
import { Link } from "react-router-dom";
import { logger, modalNotification } from "../../../utils";

const MicRecorder = require("mic-recorder-to-mp3");

const recorder = new MicRecorder({
  bitRate: 128,
});

function AudioRecorder({
  voiceTranslate,
  setVoiceTranslate,
  speechToTextTranslation,
  remainingCount,
  // totalCount,
  // isAudio,
  documentReset,
}) {
  const start = () => {
    recorder
      .start()
      .then(() => {
        setVoiceTranslate(true);
      })
      .catch((e) => {
        logger(e);
      });
  };

  const stop = async () => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, "abc.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });
        documentReset();
        setVoiceTranslate(false);
        speechToTextTranslation(file, remainingCount);
      })
      .catch((e) => {
        modalNotification({
          type: "error",
          message: "We could not retrieve your message",
        });
        logger(e);
      });
  };

  // const [recorder, setRecorder] = useState();

  // function blobToFile(theBlob, fileName) {
  //   return new File([theBlob], fileName, {
  //     lastModified: new Date(),
  //     type: "audio/wav",
  //   });
  // }
  // useEffect(() => {
  //   if (window?.navigator?.mediaDevices?.getUserMedia && isAudio) {
  //     const constraints = { audio: true };
  //     let chunks = [];

  //     let onSuccess = (stream) => {
  //       const mediaRecorder = new MediaRecorder(stream);
  //       setRecorder(mediaRecorder);
  //       mediaRecorder.onstop = () => {
  //         documentReset();
  //         const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
  //         const audioUrl = URL.createObjectURL(blob);
  //         chunks = [];
  //         console.log( blobToFile(audioUrl, "Speechtotext.wav"),blobToFile(blob, "Speechtotext.wav"))
  //         speechToTextTranslation(
  //           blobToFile(blob, "Speechtotext.wav"),
  //           remainingCount
  //         );
  //       };

  //       mediaRecorder.ondataavailable = (e) => {
  //         chunks.push(e.data);
  //       };
  //     };

  //     let onError = (err) => {
  //       modalNotification({
  //         type: "error",
  //         message: err,
  //       });
  //       logger(`The following error occured: ${err}`);
  //     };

  //     window.navigator.mediaDevices
  //       .getUserMedia(constraints)
  //       .then(onSuccess, onError);
  //   }
  // }, [remainingCount, isAudio]);
  // const recordStart = () => {
  //   recorder.start();
  //   setVoiceTranslate(true);
  // };
  // const recordStop = () => {
  //   recorder.stop();
  //   setVoiceTranslate(false);
  // };

  return (
    <>
      {voiceTranslate ? (
        <>
          <Link
            className="pauseBtn d-flex align-items-center justify-content-center rounded-circle"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              stop();
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
              start();
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
