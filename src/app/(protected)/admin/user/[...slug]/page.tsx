"use client";

import request from "@/libs/request";
import { DetailPageSlug } from "@/types/interface";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { slug } = useParams<{ slug: DetailPageSlug }>();

  const [action, id] = slug;

  useEffect(() => {
    if (id) {
      request.get(`/api/users/${id}`).then((res) => {
        console.log(res);
      });
    }
  }, [id]);

  return <div> user 1</div>;
}
