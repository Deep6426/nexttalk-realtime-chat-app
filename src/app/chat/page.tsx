"use client";
import {useRouter} from "next/navigation";
import{ useState,useEffect, useRef} from "react";
import {io} from "socket.io-client";

export default function ChatPage() {
    const router = useRouter();

    const [message,setMessage] = useState("");
    const [activeChat, setActiveChat] = useState(1);
    const [conversations] = useState([
        {
            id: 1,
            name: "General Chat",
        },
        {
            id: 2,
            name: "Tech Talk",

        },
        {
            id: 3,
            name: "Gaming",

        },
    ]);
    const [messages, setMessages] = useState<any[]>([]);

 const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null> (null);

    const botReplies = [
        "That's interesting 👀",
        "Tell me more 🚀",
        "I understand 👍",
        "Haha 😄",
        "Nice!",
        "Sounds good 🔥",
        "Cool message 😎",
    ];
    const socketRef = useRef<any>(null);
    useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    return () => {
    socketRef.current.disconnect();
   };
   }, []);
    const handleSend =() => {
        if(!message.trim()) return;

        const newMessage = {
       id: Date.now(),
       username: "diptanshu", // temporary
       text: message,
       room: "General Chat",
       sender: "me",
       time: new Date().toLocaleTimeString([], {
       hour: "2-digit",
       minute: "2-digit",
       }),
};
        const updatedMessages = [...messages,newMessage];
        setMessages(updatedMessages);
        socketRef.current.emit("send-message", newMessage)
        setIsTyping(true);
        setTimeout(() => {
            const randomReply =
            botReplies[
                Math.floor(Math.random() * botReplies.length)
            ];
            const botReply ={
                id: Date.now() + 1,
                text: randomReply,
                sender: "other",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            const finalMessages = [...updatedMessages, botReply];

            setMessages(finalMessages);
            setIsTyping(false);

            
        },1000);
        setMessage("");
        
        
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            
        });
    }, [messages]);
    useEffect(() => {
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
     const data = await response.json();

console.log("Fetched:", data);

if (!Array.isArray(data)) {
  console.error("API did not return array");
  return;
}

setMessages(
  data.map((msg: any) => ({
    id: msg._id,
    text: msg.text,
    sender:
      msg.username === "diptanshu"
        ? "me"
        : "other",
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }))
);
    } catch (error) {
      console.log(error);
    }
  };

  fetchMessages();
}, []);
    useEffect(() => {
  socketRef.current?.on(
    "receive-message",
    (messageData: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: messageData._id || Date.now(),
          text: messageData.text,
          sender:
            messageData.username === "diptanshu"
              ? "me"
              : "other",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  );

  return () => {
    socketRef.current?.off("receive-message");
  };
}, []);

    const handleLogout = () => {
        router.push("/login");
    };
    return (
  <main className="h-screen w-screen bg-black text-white flex overflow-hidden">

    {/* SIDEBAR */}
    <aside className="w-72 border-r border-zinc-800 p-4 flex flex-col">
      <h1 className="text-3xl font-bold">
        NexTalk 🚀
      </h1>

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200"
      >
        Logout
      </button>

      <div className="mt-8">
        <p className="text-zinc-400 text-sm mb-4">
          Conversations
        </p>

        <div className="mt-4 space-y-3">
            {conversations.map((chat) => (
                <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 rounded-lg cursor-pointer transition ${
                    activeChat === chat.id
                    ? "bg-white text-black"
                    : "bg-zinc-900 hover:bg-zinc-800"
                }`}
                >
                    {chat.name}
                </div>
            ))}
        </div>
      </div>
    </aside>

    {/* CHAT SECTION */}
    <section className="flex-1 flex flex-col h-full">

      {/* TOP BAR */}
      <div className="h-16 border-b border-zinc-800 flex items-center px-6">
        <h2 className="font-semibold text-xl">
          General Chat
        </h2>
      </div>

      {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">

        {messages.map((msg) =>(
            <div
            key={msg.id}
            className={`flex items-end gap-3 ${
                msg.sender === "me"
                ? "justify-end"
                : "justify-start"
            }`}
            >

                {/* BOT AVATAR */}
                {msg.sender === "other" && (
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
                    🤖
                    </div>
                )}

                {/* MESSAGE BUBBLE */}
                <div
                 className={`max-w-md px-4 py-3 rounded-2xl flex flex-col ${
                 msg.sender === "me"
                  ? "bg-white text-black"
                 : "bg-zinc-900 text-white"
                 }`}
                 >
                   

                 {msg.text}
                 <p
                   className={`text-xs mt-2 ${
                   msg.sender === "me"
                   ? "text-gray-700"
                   : "text-zinc-400"
                   }`}
                   >
                    {msg.time}
                 </p>
                </div>
                {/* USER AVATAR */}
                {msg.sender === "me" && (
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
               You
               </div>
             )}
            </div>
        ))}
        {isTyping && (
            <div className="flex items-end gap-3">

            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
            🤖
           </div>

           <div className="bg-zinc-900 px-4 py-3 rounded-2xl flex gap-1">
           <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
           <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
           <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
           </div>

            </div>
        )}
        <div ref={messagesEndRef} />

     </div>
      

      {/* INPUT AREA */}
      <div className="border-t border-zinc-800 p-4 flex gap-4">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter"){
                handleSend();
            }
          }}
        />

        <button 
        onClick={handleSend}
        disabled={isTyping}
        className={`px-6 py-3 rounded-lg font-semibold transition ${
        isTyping
           ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
           : "bg-white text-black hover:bg-zinc-200"
            }`}>
          Send
        </button>

      </div>
    </section>
  </main>
);
}