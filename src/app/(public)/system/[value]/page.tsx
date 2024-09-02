"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useDictStore from "@/stores/dict";
import Head from "next/head";
import request from "@/libs/request";
import { AppCard, AppCardProps, AppCardSkeleton } from "@/components/AppCard";

export default function Page() {
  const { value } = useParams();
  const { systems } = useDictStore();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<AppCardProps["app"][]>([]);

  const found = systems.find((item) => item.value === value);

  useEffect(() => {
    if (value) {
      setLoading(true);

      request
        .get<AppCardProps["app"][]>(`/api/system/${value}`)
        .then(({ data }) => {
          setApps(data);
        })
        .catch(() => setApps([]))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <Head>
        <title>{found?.value}</title>
      </Head>

      <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-3">
        {loading ? (
          <AppCardSkeleton />
        ) : (
          apps.map((app) => <AppCard key={app.id} app={app} />)
        )}
      </div>
    </>
  );
}
