const config = {
  NODE_ENV: process.env.NODE_ENV,
  NAME_KEY: process.env.REACT_APP_NAME_KEY || "Base App",
  NAME_TITLE: process.env.REACT_APP_NAME_TITLE || "app",
  DEFAULT_LANGUAGE: process.env.REACT_APP_DEFAULT_LANGUAGE || "en",
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
  AUTH_API_BASE_URL:
    process.env.REACT_APP_API_AUTH_BASE_URL || "http://localhost:7070/api/v1",
  PAYMENT_API_BASE_URL: process.env.REACT_APP_API_PAYMENT_BASE_URL,
  TRANSLATION_URL: process.env.REACT_APP_TRANSLATION_URL,
  TRANSLATION_KEY: process.env.REACT_APP_TRANSLATION_KEY,
  JITSI_URL: process.env.REACT_APP_JITSI_URL,
  IOS_APP_URL: process.env.REACT_APP_IOS_APP_URL,
  PLAY_STORE_URL: process.env.REACT_APP_PLAY_STORE_URL,
  BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL,
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL,
  IMAGE_URL: process.env.REACT_APP_IMAGE_PATH,
  ADMIN_IMAGE_URL: process.env.REACT_APP_ADMIN_IMAGE_PATH,
  CASHFREE_URL: process.env.REACT_APP_CASHFREE_URL,
  REDIRECTION_LINK: process.env.REACT_APP_REDIRECTION_LINK,
  IMAGE_UPLOAD_SIZE_LIMIT: Number(
    process.env.REACT_APP_IMAGE_UPLOAD_SIZE_LIMIT
  ),
  APP_URL: process.env.REACT_APP_BASE_URL,
  CURRENCY_SYMBOL: "$",
  FB: process.env.FB || "",
  INSTA: process.env.INSTA || "",
  YOUTUBE: process.env.YOUTUBE || "",
  TWITTER: process.env.TWITTER || "",
  MEDIA_STORAGE: process.env.REACT_APP_MEDIA_STORAGE_TYPE || "local",
  DATE_FORMAT: process.env.REACT_APP_DATE_FORMAT,

  // * Session Setting
  SESSION_ICON_SIZE: process.env.REACT_APP_ICON || 100,
  SESSION_VIDEO_SIZE: process.env.REACT_APP_VIDEO_SIZE || 102400,
  SESSION_PDF_SIZE: process.env.REACT_APP_PDF_SIZE || 51200,
  SESSION_PDF_ALLOWED_FORMAT: ".pdf,.html,.ppt,.pptx",

  // File Upload
  REACT_UPLOAD_IMAGE: process.env.REACT_APP_UPLOAD_IMAGE || 11000,
  // Audio file upload
  REACT_UPLOAD_AUDIO_SIZE: process.env.REACT_UPLOAD_AUDIO_SIZE || 50000,
  // Media File upload
  REACT_UPLOAD_MEDIA_FILE: process.env.REACT_APP_UPLOAD_MEDIA_FILE || 50000,

  // * Profile Setting
  PROFILE_PICTURE_SIZE: process.env.REACT_APP_PROFILE_PICTURE || 5120,
};

export default config;
