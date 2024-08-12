"use client";

const Content = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="flex-1 container mx-auto p-4 md:p-8">{children}</main>
  );
};

export default Content;
