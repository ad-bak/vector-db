// components/Chatbot/ChatbotResponse.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function ChatbotResponse({ response }: { response: string }) {
  return (
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
  );
}
