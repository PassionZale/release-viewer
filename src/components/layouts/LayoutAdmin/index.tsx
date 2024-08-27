"use client";

import useDicStore from "@/stores/dict";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { Metadata } from "next";
import request from "@/libs/request";
import { PrismaModels } from "@/types/interface";
import { useEffect } from "react";
import useUserStore, { User } from "@/stores/user";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { init: initUserStore } = useUserStore();
  const { init: initDictStore } = useDicStore();

  useEffect(() => {
    request
      .get<User>("/api/users/profile")
      .then(({ data }) => initUserStore(data));

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
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
