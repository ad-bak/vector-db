"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { getChatbotResponse } from "@/actions/chatbot";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await getChatbotResponse(message);
      setResponse(result.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-black">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about movies..."
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <Link
                  href={props.href || ""}
                  className="text-blue-500 hover:underline"
                >
                  {props.children}
                </Link>
              ),
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
