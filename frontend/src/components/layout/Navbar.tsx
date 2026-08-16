import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import BrandMark from "./BrandMark";

const NAV_LINKS = [
  { to: "/review",  label: "Review"  },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 h-12 shrink-0 border-b border-gray-200 bg-white">
      <div className="relative mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">

        <Link to="/" className="relative z-10">
          <BrandMark />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 sm:flex">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to || (to === "/history" && location.pathname.startsWith("/history"));
            return (
              <Link key={to} to={to}>
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-[5px] px-2 py-0.5 text-xs tracking-tight",
                    active
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-[#aaa]"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative z-10 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-8 after:hidden">
                <AvatarFallback className="bg-black text-sm font-medium text-white">
                  {user?.username?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="sm:hidden">
              <Link to="/review" className="cursor-pointer">
                <Sparkles className="mr-2 size-4" /> Review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/history" className="cursor-pointer">
                <History className="mr-2 size-4" /> History
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 size-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
