"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler } from "react";

interface LoginForm extends HTMLFormElement {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit: FormEventHandler<LoginForm> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username");
    const password = formData.get("password");

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const { code, message } = await res.json();

    if (code === 200) {
      const nextUrl = searchParams.get("next");
      // @see: https://github.com/vercel/next.js/discussions/44149
      router.push(nextUrl ?? "/dashboard");
      router.refresh();
    } else {
      alert(message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Username:
        <input type="text" name="username" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
