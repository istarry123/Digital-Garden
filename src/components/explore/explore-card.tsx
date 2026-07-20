import type { ExploreEntry } from "@/types";

const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  adventurous: { emoji: "🧗", label: "Adventurous" },
  amused: { emoji: "😄", label: "Amused" },
  analytical: { emoji: "📊", label: "Analytical" },
  angry: { emoji: "😠", label: "Angry" },
  anxious: { emoji: "😰", label: "Anxious" },
  blessed: { emoji: "🕊️", label: "Blessed" },
  bored: { emoji: "🥱", label: "Bored" },
  brainstorming: { emoji: "🧠", label: "Brainstorming" },
  calm: { emoji: "😌", label: "Calm" },
  chill: { emoji: "🌿", label: "Chill" },
  confident: { emoji: "😎", label: "Confident" },
  confused: { emoji: "😵", label: "Confused" },
  contemplative: { emoji: "☕", label: "Contemplative" },
  creative: { emoji: "🎨", label: "Creative" },
  curious: { emoji: "🧐", label: "Curious" },
  determined: { emoji: "🎯", label: "Determined" },
  disappointed: { emoji: "😞", label: "Disappointed" },
  dreamy: { emoji: "💭", label: "Dreamy" },
  energetic: { emoji: "⚡", label: "Energetic" },
  eureka: { emoji: "💡", label: "Eureka" },
  excited: { emoji: "🎉", label: "Excited" },
  focused: { emoji: "🔍", label: "Focused" },
  frustrated: { emoji: "😤", label: "Frustrated" },
  grateful: { emoji: "🙏", label: "Grateful" },
  grumpy: { emoji: "😾", label: "Grumpy" },
  happy: { emoji: "😊", label: "Happy" },
  hopeful: { emoji: "🌅", label: "Hopeful" },
  inspired: { emoji: "✨", label: "Inspired" },
  intrigued: { emoji: "🤩", label: "Intrigued" },
  laughing: { emoji: "😂", label: "Laughing" },
  lazy: { emoji: "🦥", label: "Lazy" },
  learning: { emoji: "📚", label: "Learning" },
  loved: { emoji: "💖", label: "Loved" },
  melancholic: { emoji: "🍂", label: "Melancholic" },
  motivated: { emoji: "🔥", label: "Motivated" },
  nervous: { emoji: "😬", label: "Nervous" },
  nostalgic: { emoji: "📷", label: "Nostalgic" },
  observing: { emoji: "👀", label: "Observing" },
  optimistic: { emoji: "🌈", label: "Optimistic" },
  overthinking: { emoji: "🌀", label: "Overthinking" },
  overwhelmed: { emoji: "🤯", label: "Overwhelmed" },
  peaceful: { emoji: "🧘", label: "Peaceful" },
  pensive: { emoji: "😔", label: "Pensive" },
  philosophical: { emoji: "💡", label: "Philosophical" },
  playful: { emoji: "🎮", label: "Playful" },
  pondering: { emoji: "🤷", label: "Pondering" },
  productive: { emoji: "💪", label: "Productive" },
  proud: { emoji: "🏆", label: "Proud" },
  puzzled: { emoji: "🧩", label: "Puzzled" },
  questioning: { emoji: "❓", label: "Questioning" },
  reflective: { emoji: "🪞", label: "Reflective" },
  relaxed: { emoji: "🍹", label: "Relaxed" },
  researching: { emoji: "🔬", label: "Researching" },
  relieved: { emoji: "😮‍💨", label: "Relieved" },
  sad: { emoji: "😢", label: "Sad" },
  sarcastic: { emoji: "🙃", label: "Sarcastic" },
  shocked: { emoji: "😱", label: "Shocked" },
  sick: { emoji: "🤒", label: "Sick" },
  skeptical: { emoji: "🤨", label: "Skeptical" },
  sleepy: { emoji: "🛌", label: "Sleepy" },
  stressed: { emoji: "😫", label: "Stressed" },
  studying: { emoji: "📖", label: "Studying" },
  surprised: { emoji: "😲", label: "Surprised" },
  thoughtful: { emoji: "🤔", label: "Thoughtful" },
  tired: { emoji: "😴", label: "Tired" },
  worried: { emoji: "😟", label: "Worried" },
  writing: { emoji: "✍️", label: "Writing" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ExploreCard({ entry }: { entry: ExploreEntry }) {
  const mood = MOOD_MAP[entry.mood] ?? { emoji: "💬", label: entry.mood };

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header: mood + date */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          title={mood.label}
        >
          <span aria-hidden="true">{mood.emoji}</span>
          {mood.label}
        </span>
        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600">
          &middot;
        </span>
        <time
          dateTime={entry.date}
          className="text-xs text-neutral-400 dark:text-neutral-500"
        >
          {formatDate(entry.date)}
        </time>
      </div>

      {/* Body: rendered Markdown content */}
      <div
        className="prose prose-neutral prose-sm max-w-none text-neutral-700 dark:prose-invert dark:text-neutral-300"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />

      {/* Footer: tags */}
      {entry.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
