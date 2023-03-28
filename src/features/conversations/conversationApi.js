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
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;

        if (conversation?.data?.id) {
          const users = arg.data.users;
          const senderUsers = users.find((user) => user.email === arg.sender);
          const receiverUsers = users.find((user) => user.email !== arg.sender);
          dispatch(
            messagesApi.endpoints.addMessage.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUsers,
              receiver: receiverUsers,
              message: arg.data.message,
              timestamp: arg.data.timestamp,
            }),
          );
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;
        console.log(conversation);

        if (conversation?.data?.id) {
          const users = arg.data.users;
          const senderUsers = users.find((user) => user.email === arg.sender);
          const receiverUsers = users.find((user) => user.email !== arg.sender);
          dispatch(
            messagesApi.endpoints.addMessage.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUsers,
              receiver: receiverUsers,
              message: arg.data.message,
              timestamp: arg.data.timestamp,
            }),
          );
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
