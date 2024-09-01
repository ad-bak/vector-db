"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      {pending ? "Thinking..." : "Send"}
    </button>
  );
}
