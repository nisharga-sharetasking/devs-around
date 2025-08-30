import apiSlice from "./api-slice";

const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // === Create a new post ===
    createPost: builder.mutation({
      query: ({ payload }) => ({
        url: `/posts`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["POSTS"],
    }),

    // === Seed posts ===
    seedPosts: builder.mutation({
      query: () => ({
        url: `/posts/seed`,
        method: "POST",
      }),
      invalidatesTags: ["POSTS"],
    }),

    // === Get all posts (PUBLIC, no auth needed) ===
    getAllPosts: builder.query({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.title) query.append("title", params.title);
        if (params?.page) query.append("page", params.page);
        if (params?.limit) query.append("limit", params.limit);

        return {
          url: `/posts?${query.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["POSTS"],
    }),

    // === Get current user's posts ===
    getMyPosts: builder.query({
      query: () => ({
        url: `/posts/my/posts`,
        method: "GET",
      }),
      providesTags: ["POSTS"],
    }), 
    
    // === Get current user's posts ===
    getPost: builder.query({
      query: ({id}) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["POSTS"],
    }),

    // === Update post by ID ===
    updatePost: builder.mutation({
      query: ({ postId, payload }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["POSTS"],
    }),

    // === Delete post by ID ===
    deletePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["POSTS"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useSeedPostsMutation,
  useGetAllPostsQuery,
  useGetMyPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostQuery
} = postApi;
