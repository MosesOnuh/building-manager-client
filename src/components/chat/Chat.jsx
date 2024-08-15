import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useRef, useState } from "react";
import GeneralBtn from "../utility/buttons/MainBtns";
import useMemberInfo from "../../hooks/useMemberInfo";
import "./Chat.css";
import { GetDateAndTime } from "../../utils/timeUtil";
import { userProfession } from "../../utils/constants";
import { toast } from "react-toastify";
import Loader from "../loading/Loading";
import GetErrorNotification from "../utility/GetErrorNotification";
import useAPI from "../../hooks/useAPI";
import { v4 as uuidv4 } from "uuid";
import { chatApi } from "../../utils/api";

function Chat() {
  //   getOldProductOwnerMessages() {
  //   this.getProductOwnerMessages().subscribe({
  //     next: (response) => {
  //       this.productOwnersMessages = [
  //         ...response,
  //         ...this.productOwnersMessages,
  //       ];
  //     },
  //     error: (error) => {
  //       console.log(error.error.title || error.error.error);
  //     },
  //   });
  // }

  // getProductOwnerMessages(): Observable<any> {
  //   console.log('getting older messages');
  //   return this.httpClient.get<any>(
  //     `${environment.apiUrl}api/Chat/productOwnerMessages`
  //   );
  // }

  let sampledata = [
    {
      id: "385ef0dd-c9dc-41b5-8cc0-5972a6fea823",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content:
        "b1 dfgfdgdf gdfgfdgd dfgdfgdg dfgdfgg dfgdfgdfggdfgdfgdfgdfgdfgdfgdf",
      createdAt: "2024-07-21T10:34:57.0248415+01:00",
    },
    {
      id: "e873d26c-6655-45f0-ab87-84653721b573",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388-",
      from: "moses ichado",
      profession: 2,
      content:
        "b1 dfgfdgdf gdfgfdgd dfgdfgdg dfgdfgg dfgdfgdfggdfgdfgdfgdfgdfgdfgdfb2",
      createdAt: "2024-07-21T10:35:04.157904+01:00",
    },
    {
      id: "29861933-a452-4dea-a493-507908e54969",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content: "b23",
      createdAt: "2024-07-21T10:35:09.4870177+01:00",
    },
    {
      id: "e873d26c-6655-45f0-ab87-84653721b573",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388-",
      from: "moses ichado",
      profession: 2,
      content: "b1 dfgfdgdf gdfgfdgd dfgdfgdg dfgdfgg dfgdfgdfggdfb2",
      createdAt: "2024-07-21T10:35:04.157904+01:00",
    },
    {
      id: "1eb0de13-3721-4112-93f7-8a74860413dd",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content: "a1",
      createdAt: "2024-07-21T10:35:16.2556258+01:00",
    },
    {
      id: "5558b076-0fb1-42c0-9b17-74a3f1eee605",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content: "p1L",
      createdAt: "2024-07-21T10:35:25.0230205+01:00",
    },
    {
      id: "5558b076-0fb1-42c0-9b17-74a3f1eee605",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content: "p1",
      createdAt: "2024-07-21T10:35:25.0230205+01:00",
    },
    {
      id: "5558b076-0fb1-42c0-9b17-74a3f1eee605",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content: "p1",
      createdAt: "2024-07-21T10:35:25.0230205+01:00",
    },
    {
      id: "5558b076-0fb1-42c0-9b17-74a3f1eee605",
      groupId: "4a926ece-3b95-47ad-8883-4e9e60c3f350",
      userId: "e355f768-848b-408a-bc5f-c4afa0b06388",
      from: "moses ichado",
      profession: 2,
      content: "p13",
      createdAt: "2024-07-21T10:35:25.0230205+01:00",
    },
  ];

  const { user } = useMemberInfo();
  let projectId = user?.projectId;

  const [conn, setConnection] = useState();
  // const [err, setErr] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupName] = useState(`New${projectId}Message`);
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  let createChatConnection = async () => {
    // let appConn = new HubConnectionBuilder()
    //   // .withUrl(`${environment.apiUrl}hubs/chat`)
    //   // .withUrl(`https://localhost:7129/hubs/chat`)
    //   .withUrl(`${chatApi}/hubs/chat`)
    //   .withAutomaticReconnect()
    //   .build();
// const chatUrl = `${chatApi}/hubs/chat`

    let appConn = new HubConnectionBuilder()
      // .withUrl(`https://localhost:7129/hubs/chat`)
      // .withUrl(`${chatApi}hubs/chat`, {
      //   skipNegotiation: true,
      //   transport: HttpTransportType.WebSockets,
      // })
      .withUrl(`${chatApi}hubs/chat`)
      .withAutomaticReconnect()
      .build();

    await appConn
      .start()
      .catch(() =>
        toast.error("An error occurred. Kindly refresh the page and try again.")
      );

    await appConn
      .invoke("CreateGroupChat", projectId)
      .catch(() =>
        toast.error("An error occurred. Kindly refresh the page and try again.")
      );

    appConn.on(groupName, (newMessage) => {
      setGroupMessages((prevState) => {
        return [...prevState, newMessage];
      });
    });

    setConnection(appConn);
  };

  useEffect(() => {
    createChatConnection();
  }, []);

  useEffect(() => {
    const lastElement = groupMessages?.at(-1);
    if (lastElement?.id == sentMessage?.id) {
      setMessage("");
      setSentMessage(null);
    }
  }, [sentMessage, groupMessages]);

  const {
    loading: chatMessageLoading,
    error: chatMessageError,
    setErrToNull: chatMessageSetErrToNull,
    get: chatMessageGet,
  } = useAPI();

  useEffect(() => {
    let chatMessageUrl = `/Chat/user/GroupChatMessages/${projectId}`;

    const fetchChatMessageData = async () => {
      try {
        const response = await chatMessageGet(chatMessageUrl);
        setGroupMessages(response?.data || []);
        console.log("logged messages", response);
        chatMessageSetErrToNull();
      } catch (err) {
        setGroupMessages(null);
      }
    };

    fetchChatMessageData();
  }, [projectId]);

  let sendGroupMessage = (content) => {
    const message = {
      id: uuidv4().toString(),
      groupId: projectId,
      userId: user?.userId,
      from: `${user?.firstName} ${user?.lastName}`,
      profession: user?.profession,
      content: content.trim(),
    };

    setSentMessage(message);

    conn
      .invoke("ReceiveGroupChatMessage", message)
      .catch(() =>
        toast.error("An error occurred. Kindly refresh the page and try again.")
      );
  };

  return (
    <>
      {chatMessageLoading && <Loader />}
      {!chatMessageLoading && !chatMessageError && (
        <ChatMessageHistory chatHistory={groupMessages} userInfo={user} />
      )}

      {!chatMessageLoading && !chatMessageError && (
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendGroupMessage}
        />
      )}
      {chatMessageError && !chatMessageLoading && (
        <div className="sm:my-10">
          <GetErrorNotification
            customMessage={chatMessageError?.message}
            message={"Chat Messages"}
          />
        </div>
      )}
    </>
  );
}

const ChatMessageHistory = ({ chatHistory, userInfo }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [chatHistory]);

  return (
    <div
      ref={scrollContainerRef}
      class="chat-history-wrapper overflow-y-auto py-2 bg-gray-100"
    >
      {chatHistory?.length > 0 &&
        chatHistory.map((message) => {
          return (
            <div key={message?.id}>
              {message?.userId != userInfo?.userId && (
                <div className="w-full mb-4">
                  <div className="flex gap-x-2 ml-4">
                    <p className="bg-blue-100 p-2 h-fit rounded-full ">
                      {message?.from
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </p>
                    <div className="p-2 w-fit bg-blue-100 message-container rounded-lg">
                      <p className="text-right text-gray-500 text-xxs md:text-xs lg:text-sm">
                        {message?.from.charAt(0).toUpperCase() +
                          message?.from.slice(1)}
                        <br />
                        <span>
                          <small>{userProfession[message?.profession]}</small>
                        </span>
                      </p>
                      <p className="text-xs md:text-sm mt-1">
                        {message?.content}
                      </p>
                      {/* <p className="text-right text-gray-500 text-xxs md:text-xs lg:text-sm mt-1"> */}
                      <p className="text-right text-gray-500 text-xxs md:text-xs mt-1">
                        {GetDateAndTime(message?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {message?.userId == userInfo?.userId && (
                <div class="w-full flex justify-end mb-4">
                  <div class="message-container ml-8 p-2 w-fit bg-yellow-100 rounded-lg mr-4 max-w-50">
                    <p className="text-xs md:text-sm">{message?.content}</p>
                    <p className="text-right text-gray-500 text-xxs md:text-xs mt-1">
                      {GetDateAndTime(message?.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

const ChatInput = ({ message, setMessage, sendMessage }) => {
  const handleFormErrors = () => {
    if (!message) {
      toast.error("message must not be empty");
      return true;
    }

    if (message.length > 500) {
      toast.error(
        "message cannot have morethan 500 characters. Maximum words exceeded"
      );
      return true;
    }
  };

  const handleSubmit = async () => {
    const errors = handleFormErrors();
    if (errors) {
      return;
    }
    sendMessage(message);
  };

  let handleChange = (e) => {
    // if (message.length > 5) {
    //   toast.error(
    //     "message cannot have morethan 500 characters. Maximum words exceeded"
    //   );
    //   return;
    // }

    setMessage(e.target.value);
  };

  return (
    <div class="flex py-2 mt-3 border-2 border-gray-500 rounded-full ">
      <input
        className="rounded-full w-full pl-5 outline-none"
        type="text"
        name="message"
        value={message}
        onChange={handleChange}
        placeholder="Type Message"
      />
      {/* <div className="ml-1 mb-3"> */}
      <div className="ml-2 mr-3">
        <GeneralBtn OnClick={handleSubmit}>Send</GeneralBtn>
      </div>
    </div>
  );
};

export default Chat;
