import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/libs/utils";
import MobileSidebar from "./MobileSidebar";
import Profile from "../Profile";

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Profile />
        </div>
      </nav>
    </header>
  );
}
