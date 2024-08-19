import Header from "./Header";
import Sidebar from "./Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminLayout = ({ children }: React.PropsWithChildren) => {
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

export default AdminLayout