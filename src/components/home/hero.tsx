import { blogConfig } from "@/config/blog.config";

const { hero, social } = blogConfig;

export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col justify-center px-6 pb-16 pt-32">
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-4 text-sm font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
          {hero.tagline}
        </p>

        <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
          {hero.greeting}
          <br />
          who writes about{" "}
          <span
            className="text-blue-600 dark:text-blue-400"
            dangerouslySetInnerHTML={{ __html: hero.highlight }}
          />
          .
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {hero.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            GitHub
          </a>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            RSS Feed
          </a>
        </div>
      </div>
    </section>
  );
}
