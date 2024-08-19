"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div>
      <p>user test page</p>
      <button onClick={() => router.push("/api/auth/signout")}>退出登录</button>
    </div>
  );
}
