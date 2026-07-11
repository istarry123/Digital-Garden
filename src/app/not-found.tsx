import Link from "next/link";
import { blogConfig } from "@/config/blog.config";

const { notFound } = blogConfig;

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">{notFound.title}</h1>
      <p className="text-neutral-500">{notFound.description}</p>
      <Link href="/" className="text-blue-600 underline dark:text-blue-400">
        {notFound.backHome}
      </Link>
    </main>
  );
}
