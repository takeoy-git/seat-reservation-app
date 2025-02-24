import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // "/" にアクセスしたら "/login" に移動
  return null;
}
