// components/Sidebar.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, Banknote, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 h-screen bg-blue-600 text-white p-4 space-y-6  border-gray-800">
        <Logo />
        <NavLinks pathname={pathname} />
      </aside>

      {/* Mobile Drawer */}
      {/* Mobile Drawer */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {open && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
        )}

        <aside
          className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white p-4 space-y-6 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-500 ease-in-out`}
        >
          <Logo />
          <NavLinks pathname={pathname} onLinkClick={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
}

function Logo() {
  return (
    <div className="font-bold text-2xl flex items-center space-x-2">
      {/* 🏦 <span>Bank System</span> */}
    </div>
  );
}
interface NavLinksProps {
  pathname: string;
  onLinkClick?: () => void;
}

function NavLinks({ pathname, onLinkClick }: NavLinksProps) {
  const [expandedParent, setExpandedParent] = useState<string | null>(null);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/customers/create", label: "Customers", icon: <Users className="h-5 w-5" /> },
    {
      label: "Accounts",
      icon: <Banknote className="h-5 w-5" />,
      sub: [
        { href: "/accounts/add", label: "Open Account" },
        { href: "/accounts/transaction", label: "Transaction" },
      ],
    },
  ];

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const hasSub = !!link.sub;
        const isActive = hasSub
          ? link.sub!.some((sub) => pathname.startsWith(sub.href))
          : pathname.startsWith(link.href!);

        return (
          <div key={link.href || link.label}>
            {hasSub ? (
              <button
                onClick={() => setExpandedParent(expandedParent === link.label ? null : link.label)}
                className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition w-full ${isActive ? "bg-gray-800 text-blue-400 font-semibold" : "text-white"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ) : (
              <Link
                href={link.href!}
                onClick={onLinkClick}
                className={`flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800 transition ${isActive ? "bg-gray-800 text-blue-400 font-semibold" : "text-white"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )}

            {hasSub && (expandedParent === link.label || isActive) && (
              <div className="ml-8 mt-1 space-y-2">
                {link.sub!.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={onLinkClick}
                    className={`block p-2 rounded-md hover:bg-gray-800 transition ${pathname === sub.href ? "bg-gray-700 text-blue-300" : "text-gray-300"
                      }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
