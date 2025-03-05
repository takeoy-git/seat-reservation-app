import { redirect } from "next/navigation";

export default function Home() {
  redirect("/admin"); // "/" にアクセスしたら "/admin" に移動
  return null;
}
