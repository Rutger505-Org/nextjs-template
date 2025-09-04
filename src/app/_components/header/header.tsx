import { HeaderUser } from "@/app/_components/header/user";

export function Header() {
  return (
    <header className={"flex-end flex w-full p-4"}>
      <HeaderUser />
    </header>
  );
}
