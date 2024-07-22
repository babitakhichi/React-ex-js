const translationTypeData = [
  {
    id: "plainText",
    name: "Plain text",
  },
  {
    id: "html",
    name: "HTML",
  },
  {
    id: "document",
    name: "Document",
  },
  {
    id: "audioVideo",
    name: "Audio & Video",
  },
];
const documentTranslationFormatData = [
  {
    id: "txt",
    name: ".txt",
  },
  {
    id: "doc",
    name: ".doc",
  },
  {
    id: "docx",
    name: ".docx",
  },
  {
    id: "ppt",
    name: ".ppt",
  },
  {
    id: "pdf",
    name: ".pdf",
  },
];
const mediaTranslationFormatData = [
  {
    id: "mp3",
    name: ".mp3",
  },
  {
    id: "mp4",
    name: ".mp4",
  },
  {
    id: "wav",
    name: ".wav",
  },
];
export const subscriptionData = {
  videoConferencing: [
    {
      name: "audio_video_conference_checkbox",
      lable: "Audio & video conference (HD)",
      type: "text",
      textName: "audio_video_conference",
    },
    {
      name: "meeting_duration",
      lable: "Maximum meeting duration",
      type: "text",
      textName: "meet_duration",
    },
    {
      name: "international_phone",
      lable: "International dial-in phone numbers",
      type: "checkbox",
    },
    {
      name: "host_meeting_mobile",
      lable: "Host & attend meeting from mobile",
      type: "checkbox",
    },
    {
      name: "conference_chat",
      lable: "In-conference chat",
      type: "checkbox",
    },
    {
      name: "whiteboard",
      lable: "DaakPad (whiteboard)",
      type: "checkbox",
    },
    {
      name: "noise_cancellation",
      lable: "Background noise cancellation",
      type: "checkbox",
    },
    {
      name: "record_meeting",
      lable: "Record Meetings",
      type: "checkbox",
    },
    {
      name: "save_cloud",
      lable: "Save recordings to cloud",
      type: "checkbox",
    },
    {
      name: "storage_value",
      lable: "Secure cloud storage",
      type: "text",
      textName: "cloud_storage",
    },
    {
      name: "poll",
      lable: "Polls",
      type: "checkbox",
    },
    {
      name: "raise_hand",
      lable: "Raise hand",
      type: "checkbox",
    },
    {
      name: "breakout_room",
      lable: "Breakout rooms",
      type: "checkbox",
    },
    {
      name: "screen_sharing",
      lable: "Screen sharing",
      type: "checkbox",
    },
    {
      name: "voice_transcription",
      lable: "Voice transcription",
      type: "checkbox",
    },
    {
      name: "voice_text_translation",
      lable: "Voice & text translation",
      type: "checkbox",
    },
    {
      name: "live_stream",
      lable: "Live stream",
      type: "checkbox",
    },
    {
      name: "share_youtube",
      lable: "Share youtube videos",
      type: "checkbox",
    },
    {
      name: "track_attendance",
      lable: "Track attendance",
      type: "checkbox",
    },
    {
      name: "mute_participant",
      lable: "Mute participants",
      type: "checkbox",
    },
    {
      name: "disable_camera",
      lable: "Disable everyone's camera",
      type: "checkbox",
    },
    {
      name: "compatibility",
      lable: "Calendar compatibility",
      type: "checkbox",
    },
    {
      name: "mobile_support",
      lable: "Mobile device support",
      type: "checkbox",
    },
    {
      name: "encryption",
      lable: "End-to-end encryption",
      type: "checkbox",
    },
    {
      name: "lobby",
      lable: "Lobby mode",
      type: "checkbox",
    },
    {
      name: "protected_meeting",
      lable: "Password protected meetings",
      type: "checkbox",
    },
    {
      name: "spam_protection",
      lable: "Phishing & spam protection",
      type: "checkbox",
    },
  ],
  translation: [
    {
      name: "translationCheckbox",
      selectName: "translationType",
      lable: "Translation type",
      type: "select",
      data: translationTypeData,
    },
    {
      name: "documentTranslationCheckbox",
      selectName: "documentType",
      lable: "Document Translation Format",
      type: "select",
      data: documentTranslationFormatData,
    },
    {
      name: "mediaTranslationCheckbox",
      selectName: "mediaType",
      lable: "Media Translation Format",
      type: "select",
      data: mediaTranslationFormatData,
    },

    {
      name: "voice_transcription",
      lable: "Voice transcription",
      type: "checkbox",
    },
    {
      name: "freeCharacters_checkbox",
      lable: "Free characters",
      type: "checkbox_disable",
      textName: "translation",
    },
  ],

  // bundled: [
  //   {
  //     name: "record_meeting",
  //     lable: "Record Meetings",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "storage_value",
  //     lable: "Secure cloud storage (in GB)",
  //     type: "text",
  //     textName: "cloud_storage",
  //   },
  //   {
  //     name: "meeting_duration",
  //     lable: "Maximum meeting duration (in mins)",
  //     type: "text",
  //     textName: "meet_duration",
  //   },
  //   {
  //     name: "audio_video_conference_checkbox",
  //     lable: "Audio & video conference (in participants)",
  //     type: "text",
  //     textName: "audio_video_conference",
  //   },
  //   {
  //     name: "poll",
  //     lable: "Polls",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "international_phone",
  //     lable: "International dial-in phone numbers",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "host_meeting_mobile",
  //     lable: "Host & attend meeting from mobile",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "conference_chat",
  //     lable: "In-conference chat",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "whiteboard",
  //     lable: "DaakPad (whiteboard)",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "noise_cancellation",
  //     lable: "Background noise cancellation",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "raise_hand",
  //     lable: "Raise hand",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "breakout_room",
  //     lable: "Breakout rooms",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "screen_sharing",
  //     lable: "Screen sharing",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "voice_transcription",
  //     lable: "Voice transcription",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "voice_text_translation",
  //     lable: "Voice & text translation",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "live_stream",
  //     lable: "Live stream",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "share_youtube",
  //     lable: "Share youtube videos",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "track_attendance",
  //     lable: "Track attendance",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "mute_participant",
  //     lable: "Mute participants",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "disable_camera",
  //     lable: "Disable everyone's camera",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "compatibility",
  //     lable: "Compatibility with google & microsoft calendar",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "mobile_support",
  //     lable: "Mobile device support",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "encryption",
  //     lable: "End-to-end encryption",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "lobby",
  //     lable: "Lobby mode",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "protected_meeting",
  //     lable: "Password protected meetings",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "spam_protection",
  //     lable: "Phishing & spam protection upto 99.9%",
  //     type: "checkbox",
  //   },
  //   {
  //     name: "video_translation_checkbox_bundled",
  //     lable: "Translation",
  //     type: "text",
  //     textName: "translation",
  //   },
  //   {
  //     name: "bundled_translation",
  //     lable: "Translation (Video Conferencing)",
  //     type: "text",
  //     textName: "video_translation",
  //   },
  // ],
};
export const subscriptionDatakeys = {
  videoConferencing: [
    "audio_video_conference",
    "meet_duration",
    "international_phone",
    "host_meeting_mobile",
    "conference_chat",
    "whiteboard",
    "noise_cancellation",
    "record_meeting",
    "save_cloud",
    "cloud_storage",
    "poll",
    "raise_hand",
    "breakout_room",
    "screen_sharing",
    "voice_transcription",
    "voice_text_translation",
    "live_stream",
    "share_youtube",
    "track_attendance",
    "mute_participant",
    "disable_camera",
    "compatibility",
    "mobile_support",
    "encryption",
    "lobby",
    "protected_meeting",
    "spam_protection",
  ],
  translation: [
    "translation",

    "translationType",

    "documentType",

    "mediaType",
    "voice_transcription",

    // {
    //   name: "voice_transcription",
    //   lable: "Voice Transcription",
    //   type: "checkbox",
    // },
  ],

  bundled: [
    "audio_video_conference",
    "meet_duration",
    "international_phone",
    "host_meeting_mobile",
    "conference_chat",
    "whiteboard",
    "noise_cancellation",
    "record_meeting",
    "cloud_storage",
    "poll",
    "raise_hand",
    "breakout_room",
    "screen_sharing",
    "voice_transcription",
    "voice_text_translation",
    "live_stream",
    "share_youtube",
    "track_attendance",
    "mute_participant",
    "disable_camera",
    "compatibility",
    "mobile_support",
    "encryption",
    "lobby",
    "protected_meeting",
    "spam_protection",
    "translation",

    "translationType",

    "documentType",

    "mediaType",
  ],
};
export const bundledData = [
  {
    name: "translationCheckbox",
    selectName: "translationType",
    lable: "Translation type",
    type: "select",
    data: translationTypeData,
  },
  {
    name: "documentTranslationCheckbox",
    selectName: "documentType",
    lable: "Document Translation Format",
    type: "select",
    data: documentTranslationFormatData,
  },
  {
    name: "mediaTranslationCheckbox",
    selectName: "mediaType",
    lable: "Media Translation Format",
    type: "select",
    data: mediaTranslationFormatData,
  },

  // {
  //   name: "voice_transcription",
  //   lable: "Voice transcription",
  //   type: "checkbox",
  // },
  {
    name: "freeCharacters_checkbox",
    lable: "Free characters",
    type: "checkbox_disable",
    textName: "translation",
  },
  // ...subscriptionData?.translation,
  ...subscriptionData?.videoConferencing,
];

export const categoryData = [
  {
    value: "0",
    label: "Personal Account",
  },
  {
    value: "1",
    label: "Corporate",
  },
];
