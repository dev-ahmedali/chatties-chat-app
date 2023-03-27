import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATION_PER_PAGE}`,
    }),
    getConversation: builder.query({
      query: ({ usersEmail, participantEmail }) =>
        `/conversations?participants_like=${usersEmail}-${participantEmail}&&participants_like=${participantEmail}-${usersEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({sender, data}) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, {queryFulfilled, dispatch}) {
        const conversation = await queryFulfilled;
        if(conversation?.id) {
          dispatch(messagesApi.endpoints.addMessage.initiate({
            conversationId: conversation?.id,

          }))
        }
      }
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
