import React from "react";
import MessageHistoryItem from "./MessageHistoryItems";
// import RemoveFromSpaceModal from "./../modal/deletethreadmodal";

interface MessageHistory {
  id: string;
  userMessage: string;
  assistantMessage: string;
  createdDate: string;
  workspaceName: string;
}

interface ThreadsProps {
  messageHistory: MessageHistory[];
  fetchMessageHistory: () => Promise<void>;
}

const Threads = ({ messageHistory, fetchMessageHistory }: ThreadsProps) => {
  return (
    <div className="space-y-4">
      {messageHistory.map((message) => (
        <MessageHistoryItem
          key={message.id}
          id={message.id}
          userMessage={message.userMessage}
          assistantMessage={message.assistantMessage}
          createdDate={message.createdDate}
          workspaceName={message.workspaceName}
          fetchMessageHistory={fetchMessageHistory}
        />
      ))}
    </div>
  );
};

export default Threads;
