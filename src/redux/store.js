import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/api/authApi"; // update alias if needed
import { travelspotApi } from "@/services/api/travelspotApi";
import { spotcategoryApi } from "@/services/api/spotcategoryApi";
import { locationsApi } from "@/services/api/locationsApi";
import { spotImageApi } from "@/services/api/spotImageApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [travelspotApi.reducerPath]: travelspotApi.reducer,
    [spotcategoryApi.reducerPath]: spotcategoryApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [spotImageApi.reducerPath]: spotImageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      travelspotApi.middleware,
      spotcategoryApi.middleware,
      locationsApi.middleware,
      spotImageApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
