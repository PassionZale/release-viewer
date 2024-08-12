"use client";

import Navbar from "./Navbar";
import Content from "./Content";

const LayoutAdmin = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Navbar />

      <Content>{children}</Content>
    </>
  );
};

export default LayoutAdmin;
