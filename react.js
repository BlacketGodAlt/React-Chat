import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const socket = io("http://localhost:4000");

export default function MultiPersonChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (input.trim() === "" || username.trim() === "") return;
    const message = { user: username, text: input };
    socket.emit("message", message);
    setInput("");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <Card>
        <CardContent>
          <ScrollArea className="h-64 p-2 border rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.user}: </strong>
                <span>{msg.text}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2 mt-4">
        <Input
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
