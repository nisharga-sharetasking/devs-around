import apiSlice from "./api-slice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === register ===
    register: builder.mutation({
      query: ({ payload }) => ({
        url: `/auth/signup`,
        method: "POST",
        body: payload,
      }),
    }),
    // === login ===
    login: builder.mutation({
      query: ({ payload }) => ({
        url: `/auth/login`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CLIENT_PROFILE"],
    }),
    // === get client profile by token ===
    getCurrentProfile: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
      providesTags: ["CLIENT_PROFILE"],
    }),
    // === verify OTP ===
    verifyOTP: builder.mutation({
      query: ({ payload }) => ({
        url: `/client/verify-otp`,
        method: "PATCH",
        body: payload,
      }),
    }),
    // === resend OTP [not working write now] ===
    resendOTP: builder.mutation({
      query: ({ payload }) => ({
        url: `/auth/client/otp-resend`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentProfileQuery,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = authApi;
