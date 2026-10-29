import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "@/services/api/authApi"; // update alias if needed
import { travelspotApi } from "@/services/api/travelspotApi";
import { spotcategoryApi } from "@/services/api/spotcategoryApi";
import { locationsApi } from "@/services/api/locationsApi";
import { spotImageApi } from "@/services/api/spotImageApi";
import { portfolioApi } from "@/services/api/portfolioApi";
import { userApi } from "@/services/api/dashboard/account/users/userApi";
import { roleApi } from "@/services/api/dashboard/account/roles/roleApi";
import { statusApi } from "@/services/api/dashboard/account/status/statusApi";
import { otppurposeApi } from "@/services/api/dashboard/account/otppurposes/otppurposeApi";
import { permissionApi } from "@/services/api/dashboard/account/permissions/permissionApi";
import { socialproviderApi } from "@/services/api/dashboard/account/socialproviders/socialproviderApi";
import { socialaccountApi } from "@/services/api/dashboard/account/socialaccounts/socialaccountApi";
import { loginhistoryApi } from "@/services/api/dashboard/account/loginhistory/loginhistoryApi";
import { otpApi } from "@/services/api/dashboard/account/otps/otpApi";
import { usersessionApi } from "@/services/api/dashboard/account/usersessions/usersessionApi";
import { rolepermissionApi } from "@/services/api/dashboard/account/rolepermissions/rolepermissionApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [travelspotApi.reducerPath]: travelspotApi.reducer,
    [spotcategoryApi.reducerPath]: spotcategoryApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [spotImageApi.reducerPath]: spotImageApi.reducer,
    [portfolioApi.reducerPath]: portfolioApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
    [otppurposeApi.reducerPath]: otppurposeApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [socialproviderApi.reducerPath]: socialproviderApi.reducer,
    [socialaccountApi.reducerPath]: socialaccountApi.reducer,
    [loginhistoryApi.reducerPath]: loginhistoryApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [usersessionApi.reducerPath]: usersessionApi.reducer,
    [rolepermissionApi.reducerPath]: rolepermissionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      travelspotApi.middleware,
      spotcategoryApi.middleware,
      locationsApi.middleware,
      spotImageApi.middleware,
      portfolioApi.middleware,
      userApi.middleware,
      roleApi.middleware,
      statusApi.middleware,
      otppurposeApi.middleware,
      permissionApi.middleware,
      socialproviderApi.middleware,
      socialaccountApi.middleware,
      loginhistoryApi.middleware,
      otpApi.middleware,
      usersessionApi.middleware,
      rolepermissionApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
