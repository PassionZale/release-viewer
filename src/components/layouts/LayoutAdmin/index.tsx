"use client";

import useDicStore from "@/stores/dict";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { Metadata } from "next";
import request from "@/libs/request";
import { PrismaModels } from "@/types/interface";
import { useEffect } from "react";
import useUserStore from "@/stores/user";
import { IconGhost2 } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { user } = useUserStore();
  const { init: initDictStore } = useDicStore();

  useEffect(() => {
    let platforms: PrismaModels["Platform"][] = [];
    let systems: PrismaModels["System"][] = [];

    const platformsLoader = () =>
      request.get<PrismaModels["Platform"][]>("/api/platforms");

    const systemsLoader = () =>
      request.get<PrismaModels["System"][]>("/api/systems");

    Promise.allSettled([platformsLoader(), systemsLoader()]).then((results) => {
      const [platformsResult, systemsResult] = results;

      if (platformsResult.status === "fulfilled") {
        platforms = platformsResult.value.data;
      }

      if (systemsResult.status === "fulfilled") {
        systems = systemsResult.value.data;
      }

      initDictStore({ platforms, systems });
    });
  }, [initDictStore]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden relative">
        <Header />
        {user ? (
          children
        ) : (
          <div className="absolute flex items-center gap-x-2 top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 leading-none ">
            <IconGhost2 className={"h-6 w-6 animate-spin mx-auto"} />
            <span>waiting...</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout;
