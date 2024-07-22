const Translate = {
  languageListing: {
    url: "/languages",
    method: "GET",
  },
  translateText: {
    url: "/translate/text",
    method: "POST",
  },
  translateHtml: {
    url: "/translate/html",
    method: "POST",
  },
  translateDocument: {
    url: "/translate/document",
    method: "POST",
  },
  getEncodedDocument: {
    url: "/translate/getDocument",
    method: "GET",
  },
  translateSpeechDocument: {
    url: "/translate/speech",
    method: "POST",
  },
  translateSpeechLanguageList: {
    url: "/speechToTextLanguages",
    method: "GET",
  },
  translateSpeechToText: {
    url: "/translate/speechToText",
    method: "POST",
  },
  translateCount: {
    url: "/v1.0/translation-data-count",
    method: "POST",
  },
};
export default Translate;
