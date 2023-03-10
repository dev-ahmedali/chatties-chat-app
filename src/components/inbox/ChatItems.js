import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../features/conversations/conversationApi";
import ChatItem from "./ChatItem";
import Error from "../ui/Error";
import moment from "moment/moment";
import getPartnerInfo from "../../utils/getPartnerInfo";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  const {
    data: isLoading,
    isError,
    error,
    conversations,
  } = useGetConversationsQuery(email);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <li className="m-2 text-center">Loading...</li>;
  } else if (!isLoading && isError) {
    content = (
      <li className="m-2 text-center">
        <Error message={error?.data} />
      </li>
    );
  } else if (!isLoading && !isError && conversations?.length === 0) {
    content = <li className="m-2 text-center">No Conversations found!</li>;
  } else if (!isLoading && !isError && conversations?.length > 0) {
    content = conversations.map((conversation) => {
      const { id, message, timestamp } = conversation;
      const { email } = user || {};
      const partner = getPartnerInfo(conversation.users, email)
      return (
        <li key={id}>
          <ChatItem
            avatar="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
            name="Saad Hasan"
            lastMessage={message}
            lastTime={moment(timestamp).fromNow()}
          />
        </li>
      );
    });
  }
  return (
    <ul>
      {content}
    </ul>
  );
}
