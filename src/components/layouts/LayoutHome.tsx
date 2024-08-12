"use client";

import Navbar from "./Navbar";
import Content from "./Content";

const LayoutHome = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Navbar />

      <Content>{children}</Content>
    </>
  );
};

export default LayoutHome;
