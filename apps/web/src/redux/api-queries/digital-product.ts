import apiSlice from "./api-slice";

const digitalProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === Create digital product ===
    createDigitalProduct: builder.mutation({
      query: ({ payload }) => ({
        url: `/digital-product`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["DIGITAL_PRODUCTS"],
    }),

    // === Get all digital products with query params ===
    getAllDigitalProducts: builder.query({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.search_query) query.append("search_query", params.search_query);
        if (params?.max_price) query.append("max_price", params.max_price);
        if (params?.min_price) query.append("min_price", params.min_price);
        if (params?.is_published !== undefined) query.append("is_published", params.is_published);
        if (params?.search_tags) query.append("search_tags", params.search_tags); // comma-separated
        if (params?.offer_tags) query.append("offer_tags", params.offer_tags);     // comma-separated
        if (params?.page) query.append("page", params.page);
        if (params?.limit) query.append("limit", params.limit);

        return {
          url: `/digital-product?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["DIGITAL_PRODUCTS"],
    }),

    // === Get single digital product by ID ===
    getDigitalProductById: builder.query({
      query: ({ id }) => ({
        url: `/digital-product/${id}`,
        method: "GET",
      }),
      providesTags: ["DIGITAL_PRODUCTS"],
    }),

    // === Get single digital product by slug ===
    getDigitalProductBySlug: builder.query({
      query: ({ slug }) => ({
        url: `/digital-product/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["DIGITAL_PRODUCTS"],
    }),

    // === Update digital product by ID ===
    updateDigitalProduct: builder.mutation({
      query: ({ productId, payload }) => ({
        url: `/digital-product/${productId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["DIGITAL_PRODUCTS"],
    }),

    // === Delete digital product by ID ===
    deleteDigitalProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/digital-product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DIGITAL_PRODUCTS"],
    }),
  }),
});

export const {
  useCreateDigitalProductMutation,
  useGetAllDigitalProductsQuery,
  useGetDigitalProductByIdQuery,
  useGetDigitalProductBySlugQuery,
  useUpdateDigitalProductMutation,
  useDeleteDigitalProductMutation,
} = digitalProductApi;
