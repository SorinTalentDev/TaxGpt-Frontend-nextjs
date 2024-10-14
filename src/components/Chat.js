import React, { useState, useEffect, useRef } from "react";
import './../Asset/css/Chat.css';
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Chat() {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatViewRef = useRef(null); // Create a reference for the chat view
    const handleSendMessage = async () => {
        if(!input.trim()) return;

        //Add user message to the messages list
        setMessages([...messages, { role:"user", content:input }]);

        //Send message to backend to interact with OpenAI assistant
        setLoading(true);
        try{
            // const response = await axios.post("http://localhost:5000/send-message", { messages:input });
            const response = await axios.post("https://ltpoc-backend-b90752644b3c.herokuapp.com/send-message", { messages:input });
            const assistantMessage = response.data;
            setMessages((prev) => [...prev, { role:"assistant", content:assistantMessage}]);
        } catch (error) {
            console.error("Error occurred:", error);
        } finally {
            setLoading(false);
            setInput("");
        }
    }
    // Scroll to the bottom of chat whenever messages update
    useEffect(() => {
        if (chatViewRef.current) {
            chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
        }
    }, [messages]); // Trigger when messages array changes
    const handleKeyPress = (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); //Prevents newline in textarea
            handleSendMessage();
        }
    };
    const renderMessage = (message) => (
        <ReactMarkdown
            children={message.content}
            components={{
                code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={coy} // You can change the theme here
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                }
            }}
        />
    );
    return(
        <div className="main-content">
            <div className="chatview" ref={chatViewRef}>
                {messages.map((message, index) => (
                <React.Fragment key={index}>
                    <div className={`message ${message.role}`}>
                        {renderMessage(message)}
                    </div>
                </React.Fragment>
                ))}
            </div>
            <div className="input-content">
                <div className="content">
                    <textarea
                    aria-label="Type your message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="type your message"
                    disabled={loading}
                    />
                </div>
                <div className="submit">
                    <button onClick={handleSendMessage} disabled={loading}>
                        {loading ? "Sending..." : "send" }
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Chat;