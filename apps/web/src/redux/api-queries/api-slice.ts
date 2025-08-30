"use client";

import { getAccessToken } from "@/auth/cookies";
import { ENV } from "@/constants/env";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.NEXT_PUBLIC_BASE_SERVER_API,
  // credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }
    return headers;
  },
});

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: ["CLIENT_PROFILE", "USER", "DIGITAL_PRODUCTS", "POSTS" ],
});

export default apiSlice;
