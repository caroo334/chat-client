import "./App.css";
import io from "socket.io-client"; //Con esto ya me puedo comunicar al backend
import { useState, useEffect } from "react";

const socket = io(process.env.PORT || "http://localhost:4000"); //con esto vamos a poder escuchar eventos y enviar eventos
function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "me",
    };
    setMessage("");
    setMessages([newMessage, ...messages]);
  };

  useEffect(() => {
    const reciveMessage = (message) => {
      setMessages([
        message,
        ...messages,
        // {
        // body: message.body,
        // from: message.from es lo mismo que hacer lo de arriba
        // }
      ]);
    };
    socket.on("message", reciveMessage); //cuando escuches tal evento hace esto otro

    return () => {
      socket.off("message", reciveMessage);
    };
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="border-2 border-zinc-500 p-2 text-black w-full"
        />
        {/* <button className="bg-blue-500">Send</button> */}
        <ul className="h-80 overflow-y-auto">
          {messages.map((message, i) => (
            <li key={i} className={`p-2 my-2 table text-sm rounded-md ${message.from === 'me' ? 'bg-sky-700 ml-auto' : 'bg-black' }`}>
              <p>
                {message.from} : {message.body}
              </p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
