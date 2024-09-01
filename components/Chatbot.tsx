"use client";

import { useFormState } from "react-dom";
import { Suspense } from "react";
import { getChatbotResponse } from "@/actions/chatbot";
import SubmitButton from "./SubmitButton";
import ChatbotResponse from "./ChatbotResponse";

export default function Chatbot() {
  const [state, formAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      const message = formData.get("message") as string;
      const responseObj = await getChatbotResponse(message);
      return { ...prevState, response: responseObj.response };
    },
    { response: "" }
  );
  return (
    <div className="max-w-md mx-auto mt-10 text-black">
      <form action={formAction} className="mb-4">
        <input
          type="text"
          name="message"
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
