import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/api/authApi"; // update alias if needed
import { travelspotApi } from "@/services/api/travelspotApi";
import { spotcategoryApi } from "@/services/api/spotcategoryApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [travelspotApi.reducerPath]: travelspotApi.reducer,
    [spotcategoryApi.reducerPath]: spotcategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      travelspotApi.middleware,
      spotcategoryApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
