"use client";
import {useRouter} from "next/navigation";
import{ useState,useEffect, useRef} from "react";
import {io} from "socket.io-client";

export default function ChatPage() {
    const router = useRouter();

    const [message,setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [username, setUsername] = useState("");
    const [typingUser, setTypingUser] = useState("");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [lastMessages, setLastMessages] = useState<Record<string, string>>({});

 const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null> (null);

   
    const socketRef = useRef<any>(null);
    useEffect(() => {
  socketRef.current = io("https://gracious-possibility-production-7916.up.railway.app", {
  transports: ["websocket", "polling"],
});
  socketRef.current.on("connect", () => {
  console.log("Socket connected:", socketRef.current.id);
});
socketRef.current.on("online-users", (users: string[]) => {
    console.log("Online Users:", users);
    setOnlineUsers(users);
});

  
socketRef.current.on("typing", (data: any) => {
  console.log("Typing received:", data);

  console.log("selectedUser =", selectedUser?.username);
  console.log("username =", username);

  if (
    data.sender === selectedUser?.username &&
    data.receiver === username
  ) {
    console.log("MATCHED!");

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }
});


  return () => {
  socketRef.current?.off("receive-message");
  socketRef.current?.off("typing");
  socketRef.current?.disconnect();
  socketRef.current?.off("online-users");
};
}, []);
   
useEffect(() => {
  const storedUser =
    localStorage.getItem("username");

  if (storedUser) {
    setUsername(storedUser);
    console.log("Stored User:", storedUser);
  }
  
}, []);
useEffect(() => {
  if (socketRef.current && username) {
    console.log("Emitting user-online:", username);

    socketRef.current.emit("user-online", username);
  }
}, [username]);
   const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
  setMessage(e.target.value);

  if (!selectedUser) return;

  console.log("Sending typing event");

  socketRef.current.emit("typing", {
    sender: username,
    receiver: selectedUser.username,
  });
};;

    const handleSend = async () => {
       if (!selectedUser) {
    alert("Please select a user first.");
    return;
  }
      
        if(!message.trim()) return;

       const newMessage = {
  id: Date.now(),
  username,
  receiver: selectedUser?.username,
  text: message,
  sender: "me",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};
try {
  console.log("Selected User:", selectedUser);

console.log({
  username,
  receiver: selectedUser?.username,
  text: message,
});
  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      text: message,
      receiver: selectedUser?.username,
    }),
  });
} catch (error) {
  console.error(error);
}
console.log("socketRef.current =", socketRef.current);

if (!socketRef.current) {
  console.error("Socket is NULL!");
  return;
}



        
        socketRef.current.emit("send-message", newMessage)
        
        setMessage("");
        setLastMessages((prev) => ({
  ...prev,
  [selectedUser.username]: message,
}));

setUsers((prev) => {
  const updated = [...prev];
  if (!selectedUser) return prev;

const chatUser = selectedUser?.username;

if (!chatUser) return prev;

const index = updated.findIndex(
  (u) => u.username === chatUser
);

  if (index > -1) {
    const [user] = updated.splice(index, 1);
    updated.unshift(user);
  }

  return updated;
});
        
        
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            
        });
    }, [messages]);
    useEffect(() => {
  const fetchMessages = async () => {
    try {
      if (!selectedUser) return;

const response = await fetch(
  `/api/messages?sender=${username}&receiver=${selectedUser.username}`
);

const data = await response.json();
console.log("Fetched from API:", data);
    

console.log("Fetched:", data);

if (!Array.isArray(data)) {
  console.error("API did not return array");
  return;
}




setMessages(
  data.map((msg: any) => {
    console.log(
      "MSG:",
      msg.username,
      "USER:",
      username,
      "RESULT:",
      msg.username === username
    );

    return {
  id: msg._id,
  text: msg.text,
  username: msg.username,
  receiver: msg.receiver,

      sender:
        msg.username === username
          ? "me"
          : "other",

      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  })
);
if (data.length > 0) {
    setLastMessages((prev) => ({
        ...prev,
        [selectedUser.username]: data[data.length - 1].text,
    }));
}
setLastMessages((prev) => ({
    ...prev,
    [selectedUser.username]:
        data.length > 0
            ? data[data.length - 1].text
            : prev[selectedUser.username],
}));
console.log("✅ Loaded from API");
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUsers = async () => {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  } catch (error) {
    console.error(error);
  }
};
 fetchUsers();

if (!username || !selectedUser) return;

fetchMessages();
}, [selectedUser, username]);
    useEffect(() => {
      console.log("REGISTERING receive-message listener");
  if (!username || !socketRef.current) return;
  socketRef.current?.off("receive-message");

  socketRef.current?.on(
  "receive-message",
  (messageData: any) => {

    console.log("SOCKET RECEIVED:", messageData);
console.log("selectedUser =", selectedUser);
console.log("username =", username);
    const chatUser =
  messageData.username === username
    ? messageData.receiver
    : messageData.username;

console.log("chatUser =", chatUser);
console.log("message =", messageData.text);
    if (
  !selectedUser ||
  !(
    (messageData.username === username &&
      messageData.receiver === selectedUser.username) ||
    (messageData.username === selectedUser.username &&
      messageData.receiver === username)
  )
) {
  return;
}

    setMessages((prev) => [
      ...prev,
      {
        id: messageData._id || Date.now(),
        text: messageData.text,
        receiver: messageData.receiver,
        username: messageData.username,
        
        sender:
          messageData.username === username
            ? "me"
            : "other",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    console.log("chatUser =", chatUser);
console.log("message =", messageData.text);
    setLastMessages((prev) => ({
  ...prev,
  [
    messageData.username === username
      ? messageData.receiver
      : messageData.username
  ]: messageData.text,
}));
setUsers((prev) => {
  const chatUser =
    messageData.username === username
      ? messageData.receiver
      : messageData.username;
      console.log("CHAT USER:", chatUser);
console.log("USERS:", prev.map(u => u.username));

  const updated = [...prev];
  const index = updated.findIndex(
    (u) => u.username === chatUser
  );

  if (index > -1) {
    const [user] = updated.splice(index, 1);
    updated.unshift(user);
  }

  return updated;
});
    console.log("✅ Added from SOCKET");
  }
);

  return () => {
  socketRef.current?.off("receive-message");
  
};
}, [selectedUser, username]);
useEffect(() => {
    if (socketRef.current && username) {
        socketRef.current.emit("user-online", username);
    }
}, [username]);

    const handleLogout = () => {
        router.push("/login");
    };
    const getAvatarColor = (username: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];

  let hash = 0;

  for (let i = 0; i < username.length; i++) {
    hash += username.charCodeAt(i);
  }

  return colors[hash % colors.length];
};
console.log("Selected User:", selectedUser);
console.log("MESSAGES STATE:", messages);
console.log("LAST MESSAGES =", lastMessages);
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
           {users
  .filter((user) => user.username !== username)
  .map((user) => (
    <button
  key={user._id}
  onClick={() => setSelectedUser(user)}
  className={`w-full p-4 rounded-xl text-left transition ${
    selectedUser?._id === user._id
      ? "bg-white text-black"
      : "bg-zinc-900 hover:bg-zinc-800 text-white"
  }`}
>
  <div className="flex items-center justify-between">
    <span>{user.username}</span>

    {onlineUsers.includes(user.username) && (
      <span className="w-3 h-3 rounded-full bg-green-500"></span>
    )}
  </div>
 

<p className="text-sm text-gray-400 truncate mt-1">
    {lastMessages[user.username] || "No messages yet"}
</p>
</button>
))}
        </div>
      </div>
    </aside>

    {/* CHAT SECTION */}
    <section className="flex-1 flex flex-col h-full">

      {/* TOP BAR */}
      <div className="h-16 border-b border-zinc-800 flex flex-col justify-center px-6">

  <div>
  <h2 className="text-xl font-bold">
    {selectedUser?.username || "Select a user"}
  </h2>

  {isTyping && (
    <p className="text-sm text-gray-400 italic">
      typing...
    </p>
  )}
</div>

  

</div>

      {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">

        
        {messages
  .filter(
    (msg) =>
      selectedUser &&
      (
        (msg.username === username &&
          msg.receiver === selectedUser.username) ||
        (msg.username === selectedUser.username &&
          msg.receiver === username)
      )
  )
  .map((msg) => (
            
            <div
            key={msg.id}
            className={`flex items-end gap-3 ${
                msg.username === username
                ? "justify-end"
                : "justify-start"
            }`}
            >

                {/* BOT AVATAR */}
                {msg.username !== username && (
 <div
  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
    msg.username === "bot"
      ? "bg-zinc-700"
      : getAvatarColor(msg.username)
  }`}
>
    {msg.username === "bot"
      ? "🤖"
      : msg.username.charAt(0).toUpperCase()}
  </div>
)}

                {/* MESSAGE BUBBLE */}
                <div
  className={`max-w-md px-4 py-3 rounded-2xl flex flex-col ${
    msg.username === username
      ? "bg-white text-black"
      : "bg-zinc-900 text-white"
  }`}
>

  {msg.username !== username && (
    <p className="text-xs font-semibold text-blue-400 mb-1">
      {msg.username}
    </p>
  )}

  {msg.text}

  <p
    className={`text-xs mt-2 ${
      msg.username === username
        ? "text-gray-700"
        : "text-zinc-400"
    }`}
  >
    {msg.time}
  </p>
</div>
                {/* USER AVATAR */}
                {msg.username === username && (
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
          onChange={handleTyping}
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