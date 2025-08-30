import apiSlice from "./api-slice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === Get all users ===
    getAllUser: builder.query({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.search_query) query.append("search_query", params.search_query);
        if (params?.status) query.append("status", params.status);
        if (params?.order_id) query.append("order_id", params.order_id);
        if (params?.billing_address?.city)
          query.append("billing_address.city", params.billing_address.city);
        if (params?.order_date?.from) query.append("order_date[from]", params.order_date.from);
        if (params?.order_date?.to) query.append("order_date[to]", params.order_date.to);
        if (params?.sortBy) query.append("sortBy", params.sortBy);
        if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
        if (params?.page) query.append("page", params.page);
        if (params?.limit) query.append("limit", params.limit);

        return {
          url: `/user/all?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["USER"],
    }),

    // === Get single user by ID ===
    getSingleUserById: builder.query({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    // === Delete user by ID ===
    deleteSingleUser: builder.mutation({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetSingleUserByIdQuery,
  useDeleteSingleUserMutation,
} = userApi;
