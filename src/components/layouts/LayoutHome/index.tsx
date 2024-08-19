"use client";

import Navbar from "./Navbar";
import Content from "./Content";
import { useEffect } from "react";
import useDicStore from "@/stores/dict";

const LayoutHome = ({ children }: React.PropsWithChildren) => {
  const initDict = useDicStore((state) => state.init);
  const systems = useDicStore((state) => state.systems);

  const items = systems.map((system) => ({
    href: `/system/${system.value}`,
    ...system,
  }));

  useEffect(() => {
    loadDict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDict() {
    const res = await fetch("/api/dict");

    const { data } = await res.json();

    initDict(data);
  }

  return (
    <>
      <Navbar items={items} />

      <Content>{children}</Content>
    </>
  );
};

export default LayoutHome;
