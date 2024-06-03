// components\navbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Kbd,
  Input,
  Avatar,
} from "@nextui-org/react";
import NextLink from "next/link";
import { SearchIcon } from "@/components/utils/icons";
import { ThemeSwitch } from "@/components/utils/theme-switch";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = e.currentTarget.elements.namedItem(
      "search"
    ) as HTMLInputElement;
    router.push(`/Search?q=${encodeURIComponent(searchQuery.value)}`);
  };

  const searchInput = (
    <form onSubmit={handleSearch}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        name="search"
      />
    </form>
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarBrand>
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <p className="font-bold text-inherit">Novel-DB</p>
        </NextLink>
      </NavbarBrand>
      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        <NavbarItem isActive>
          <NextLink href="/" aria-current="page">
            Home
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/MyList">My List</NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/reviews">Reviews</NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/forum">Forum</NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/help">Help</NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/news">News</NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink href="/blog">Blog</NextLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="hidden lg:flex" justify="end">
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        {!session && !loading && (
          <NavbarItem>
            <NextLink
              href={`/Auth?form=login&callbackUrl=${encodeURIComponent(
                pathname
              )}`}
            >
              Login / Register
            </NextLink>
          </NavbarItem>
        )}
        {session && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={session.user?.name || session.user?.email || ""}
                size="sm"
                src={session.user?.image || ""}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.user?.email || ""}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="add-novel">
                <NextLink href="/novels/new">Add Novel</NextLink>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut()}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
      <NavbarContent className="lg:hidden" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <NextLink href="/">Home</NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href="/MyList">My List</NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href="/reviews">Reviews</NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href="/forum">Forum</NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href="/help">Help</NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href="/news">News</NextLink>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <NextLink href="/blog">Blog</NextLink>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
