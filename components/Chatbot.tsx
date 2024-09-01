// components/Chatbot/Chatbot.tsx
"use client";

import { useFormState } from "react-dom";
import { Suspense, useState } from "react";
import { getChatbotResponse } from "@/actions/chatbot";
import SubmitButton from "./SubmitButton";
import ChatbotResponse from "./ChatbotResponse";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [state, formAction] = useFormState(
    async (_: any, formData: FormData) => {
      const message = formData.get("message") as string;
      return getChatbotResponse(message);
    },
    { response: "" }
  );

  return (
    <div className="max-w-md mx-auto mt-10 text-black">
      <form action={formAction} className="mb-4">
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about movies..."
          className="w-full p-2 border rounded"
        />
        <SubmitButton />
      </form>
      <Suspense fallback={<div>Loading response...</div>}>
        {state.response && <ChatbotResponse response={state.response} />}
      </Suspense>
    </div>
  );
}
