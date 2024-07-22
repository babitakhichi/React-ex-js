import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
} from "redux-state-sync";
import config from "../config";
import logger from "../utils/logger";
import { authSlice, profileSlice } from ".";

const RootReducer = combineReducers({
  auth: authSlice,
  profile: profileSlice,
});

const encryptor = encryptTransform({
  secretKey: `${config.NAME_KEY}-storage`,
  onError: (error) => {
    // Handle the error.
    logger({ error });
  },
});

const persistConfig = {
  key: config.NAME_KEY,
  storage,
  whitelist: ["auth", "profile"],
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const middlewares = [
  createStateSyncMiddleware({
    blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
  }),
];

const defaultMiddleware = getDefaultMiddleware({
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
});

const store = configureStore({
  reducer: persistedReducer,
  // middleware: getDefaultMiddleware({
  //   // https://github.com/rt2zz/redux-persist/issues/988#issuecomment-552242978
  //   serializableCheck: {
  //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //   },
  // }),
  middleware: () => [...defaultMiddleware, ...middlewares],
  devTools: config.NODE_ENV !== "production",
});

initStateWithPrevTab(store);

export default store;

export const Persistor = persistStore(store);
