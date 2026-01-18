"use client";
import { Menu01Icon, UnfoldMoreIcon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import SearchDialog from "@/components/search-dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    setMobileMenuOpen(false);
    router.push("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:px-8 md:py-4">
      {/* Logo */}
      <Link className="flex items-center gap-2" href="/">
        <Image alt="Coin Mantra" height={26} src="logo.svg" width={26} />
        <h1 className="font-bold text-lg md:text-xl">CoinWatch</h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-6 font-regular text-sm md:flex">
        <Link
          className={pathname === "/dashboard" ? "font-semibold text-primary" : ""}
          href="/dashboard"
        >
          Dashboard
        </Link>
        <SearchDialog />
        <Link
          className={pathname === "/watchlist" ? "font-semibold text-primary" : ""}
          href="/watchlist"
        >
          Watchlist
        </Link>
        <Link
          className={pathname === "/news" ? "font-semibold text-primary" : ""}
          href="/news"
        >
          News
        </Link>
      </div>

      {/* Desktop User Section */}
      <div className="hidden items-center gap-4 md:flex">
        {session ? (
          <Popover>
            <PopoverTrigger className="flex cursor-pointer items-center gap-2">
              <HugeiconsIcon icon={UserCircleIcon} size={24} />
              <p className="font-regular text-sm">{session.user?.name}</p>
              <HugeiconsIcon icon={UnfoldMoreIcon} size={16} />
            </PopoverTrigger>
            <PopoverContent className="w-[150px]">
              <Button onClick={handleSignOut} variant="destructive">
                Sign Out
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger className="flex items-center justify-center md:hidden">
          <HugeiconsIcon icon={Menu01Icon} size={24} />
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-6 px-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4 text-base">
              <Link
                className={`${pathname === "/dashboard" ? "font-semibold text-primary" : ""}`}
                href="/dashboard"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                className={`${pathname === "/watchlist" ? "font-semibold text-primary" : ""}`}
                href="/watchlist"
                onClick={closeMobileMenu}
              >
                Watchlist
              </Link>
              <Link
                className={`${pathname === "/news" ? "font-semibold text-primary" : ""}`}
                href="/news"
                onClick={closeMobileMenu}
              >
                News
              </Link>
            </nav>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Mobile User Section */}
            {session ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={UserCircleIcon} size={24} />
                  <p className="font-regular text-sm">{session.user?.name}</p>
                </div>
                <Button onClick={handleSignOut} variant="destructive" className="w-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button className="w-full" variant="outline">Sign In</Button>
                </Link>
                <Link href="/sign-up" onClick={closeMobileMenu}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

