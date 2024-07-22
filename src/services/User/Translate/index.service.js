import { Translate } from "../../../apiEndPoints";
import config from "../../../config";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

const translationBaseUrl = config.TRANSLATION_URL;
// const translationToken = config.TRANSLATION_KEY;
export const TranslateServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  languageListingService: async ({ queryParams }) => {
    try {
      const payload = {
        ...Translate.languageListing,
        queryParams,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  translateTextService: async (bodyData) => {
    try {
      const payload = {
        ...Translate.translateText,
        bodyData,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  translateHtmlService: async (bodyData) => {
    try {
      const payload = {
        ...Translate.translateHtml,
        bodyData,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  translateDocumentService: async (bodyData, formHeaders) => {
    try {
      const payload = {
        ...Translate.translateDocument,
        bodyData,
        formHeaders,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  translateMediaService: async (bodyData, formHeaders) => {
    try {
      const payload = {
        ...Translate.translateSpeechDocument,
        bodyData,
        formHeaders,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getTranslateDocumentService: async ({ queryParams }) => {
    try {
      const payload = {
        ...Translate.getEncodedDocument,
        queryParams,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getSpeechLanguageService: async () => {
    try {
      const payload = {
        ...Translate.translateSpeechLanguageList,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  translateSpeechToTextService: async (bodyData, formHeaders) => {
    try {
      const payload = {
        ...Translate.translateSpeechToText,
        bodyData,
        formHeaders,
        baseURL: translationBaseUrl,
        // token: translationToken,
        token: null,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getTranslateRemainingCountService: async (bodyData) => {
    try {
      const payload = {
        ...Translate.translateCount,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
