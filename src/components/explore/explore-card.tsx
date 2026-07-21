import type { ExploreEntry } from "@/types";

const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  // ── Happy 快乐 ──
  amused: { emoji: "😄", label: "Amused" },
  blessed: { emoji: "🕊️", label: "Blessed" },
  blissful: { emoji: "😇", label: "Blissful" },
  cheerful: { emoji: "😁", label: "Cheerful" },
  content: { emoji: "😊", label: "Content" },
  delighted: { emoji: "🤗", label: "Delighted" },
  grateful: { emoji: "🙏", label: "Grateful" },
  happy: { emoji: "🙂", label: "Happy" },
  hopeful: { emoji: "🌅", label: "Hopeful" },
  joyful: { emoji: "🥳", label: "Joyful" },
  laughing: { emoji: "😂", label: "Laughing" },
  loved: { emoji: "💖", label: "Loved" },
  optimistic: { emoji: "🌈", label: "Optimistic" },
  pleased: { emoji: "☺️", label: "Pleased" },
  proud: { emoji: "🏆", label: "Proud" },
  relieved: { emoji: "😮‍💨", label: "Relieved" },
  satisfied: { emoji: "😋", label: "Satisfied" },

  // ── Excited 兴奋 ──
  adventurous: { emoji: "🧗", label: "Adventurous" },
  amazed: { emoji: "😲", label: "Amazed" },
  ecstatic: { emoji: "🤩", label: "Ecstatic" },
  energetic: { emoji: "⚡", label: "Energetic" },
  excited: { emoji: "🎉", label: "Excited" },
  "fired-up": { emoji: "🔥", label: "Fired Up" },
  hyped: { emoji: "📣", label: "Hyped" },
  motivated: { emoji: "🚀", label: "Motivated" },
  playful: { emoji: "🎮", label: "Playful" },
  pumped: { emoji: "💥", label: "Pumped" },
  thrilled: { emoji: "🎊", label: "Thrilled" },
  victorious: { emoji: "🏅", label: "Victorious" },

  // ── Thinking 思考 ──
  analytical: { emoji: "📊", label: "Analytical" },
  brainstorming: { emoji: "🧠", label: "Brainstorming" },
  contemplative: { emoji: "☕", label: "Contemplative" },
  curious: { emoji: "🧐", label: "Curious" },
  dreaming: { emoji: "💭", label: "Dreaming" },
  eureka: { emoji: "💡", label: "Eureka" },
  focused: { emoji: "🔍", label: "Focused" },
  inquisitive: { emoji: "🔎", label: "Inquisitive" },
  intrigued: { emoji: "👀", label: "Intrigued" },
  learning: { emoji: "📚", label: "Learning" },
  observing: { emoji: "🔭", label: "Observing" },
  overthinking: { emoji: "🌀", label: "Overthinking" },
  pensive: { emoji: "😔", label: "Pensive" },
  philosophical: { emoji: "🏛️", label: "Philosophical" },
  pondering: { emoji: "🤷", label: "Pondering" },
  puzzled: { emoji: "🧩", label: "Puzzled" },
  questioning: { emoji: "❓", label: "Questioning" },
  reflective: { emoji: "🪞", label: "Reflective" },
  researching: { emoji: "🔬", label: "Researching" },
  skeptical: { emoji: "🤨", label: "Skeptical" },
  studying: { emoji: "📖", label: "Studying" },
  thoughtful: { emoji: "🤔", label: "Thoughtful" },
  wondering: { emoji: "🌌", label: "Wondering" },

  // ── Creative 创造 ──
  artistic: { emoji: "🎨", label: "Artistic" },
  composing: { emoji: "🎼", label: "Composing" },
  crafting: { emoji: "🔨", label: "Crafting" },
  creative: { emoji: "✨", label: "Creative" },
  designing: { emoji: "✏️", label: "Designing" },
  doodling: { emoji: "🖍️", label: "Doodling" },
  experimenting: { emoji: "⚗️", label: "Experimenting" },
  imaginative: { emoji: "🌠", label: "Imaginative" },
  inspired: { emoji: "💫", label: "Inspired" },
  making: { emoji: "🛠️", label: "Making" },
  tinkering: { emoji: "🔧", label: "Tinkering" },
  visionary: { emoji: "🔮", label: "Visionary" },
  writing: { emoji: "✍️", label: "Writing" },

  // ── Growth 成长 ──
  accomplished: { emoji: "🎖️", label: "Accomplished" },
  ambitious: { emoji: "🏔️", label: "Ambitious" },
  blooming: { emoji: "🌸", label: "Blooming" },
  confident: { emoji: "😎", label: "Confident" },
  determined: { emoji: "🎯", label: "Determined" },
  evolving: { emoji: "🦋", label: "Evolving" },
  growing: { emoji: "🌱", label: "Growing" },
  improving: { emoji: "📈", label: "Improving" },
  mastering: { emoji: "🥋", label: "Mastering" },
  milestone: { emoji: "🚩", label: "Milestone" },
  progressing: { emoji: "🏃", label: "Progressing" },
  striving: { emoji: "💪", label: "Striving" },

  // ── Neutral 日常 ──
  busy: { emoji: "🐝", label: "Busy" },
  calm: { emoji: "😌", label: "Calm" },
  chill: { emoji: "🌿", label: "Chill" },
  comfy: { emoji: "🛋️", label: "Comfy" },
  distracted: { emoji: "📱", label: "Distracted" },
  indifferent: { emoji: "😐", label: "Indifferent" },
  nostalgic: { emoji: "📷", label: "Nostalgic" },
  okay: { emoji: "👌", label: "Okay" },
  patient: { emoji: "⏳", label: "Patient" },
  peaceful: { emoji: "🧘", label: "Peaceful" },
  quiet: { emoji: "🤫", label: "Quiet" },
  relaxed: { emoji: "🍹", label: "Relaxed" },
  reserved: { emoji: "🤐", label: "Reserved" },
  sarcastic: { emoji: "🙃", label: "Sarcastic" },
  waiting: { emoji: "⌛", label: "Waiting" },
  "zoning-out": { emoji: "🫠", label: "Zoning Out" },

  // ── Sad 低落 ──
  anxious: { emoji: "😰", label: "Anxious" },
  broken: { emoji: "💔", label: "Broken" },
  confused: { emoji: "😵", label: "Confused" },
  disappointed: { emoji: "😞", label: "Disappointed" },
  gloomy: { emoji: "🌧️", label: "Gloomy" },
  heartbroken: { emoji: "🖤", label: "Heartbroken" },
  hopeless: { emoji: "🥀", label: "Hopeless" },
  hurt: { emoji: "🤕", label: "Hurt" },
  lonely: { emoji: "🧍", label: "Lonely" },
  lost: { emoji: "🧭", label: "Lost" },
  melancholic: { emoji: "🍂", label: "Melancholic" },
  miserable: { emoji: "😩", label: "Miserable" },
  nervous: { emoji: "😬", label: "Nervous" },
  regretful: { emoji: "🫣", label: "Regretful" },
  sad: { emoji: "😿", label: "Sad" },
  shocked: { emoji: "😱", label: "Shocked" },
  vulnerable: { emoji: "🥺", label: "Vulnerable" },
  worried: { emoji: "😟", label: "Worried" },

  // ── Angry / Frustrated ──
  angry: { emoji: "😠", label: "Angry" },
  annoyed: { emoji: "😒", label: "Annoyed" },
  bitter: { emoji: "😖", label: "Bitter" },
  enraged: { emoji: "🤬", label: "Enraged" },
  frustrated: { emoji: "😤", label: "Frustrated" },
  furious: { emoji: "😡", label: "Furious" },
  grumpy: { emoji: "😾", label: "Grumpy" },
  irritated: { emoji: "🙄", label: "Irritated" },
  outraged: { emoji: "😧", label: "Outraged" },
  resentful: { emoji: "😣", label: "Resentful" },
  stressed: { emoji: "😫", label: "Stressed" },
  vexed: { emoji: "😮", label: "Vexed" },

  // ── Tired ──
  "burnt-out": { emoji: "🧯", label: "Burnt Out" },
  drained: { emoji: "🪫", label: "Drained" },
  exhausted: { emoji: "😴", label: "Exhausted" },
  fatigued: { emoji: "🥱", label: "Fatigued" },
  groggy: { emoji: "😵‍💫", label: "Groggy" },
  lazy: { emoji: "🦥", label: "Lazy" },
  sleepy: { emoji: "🛌", label: "Sleepy" },
  sluggish: { emoji: "🐌", label: "Sluggish" },
  tired: { emoji: "😵", label: "Tired" },
  weary: { emoji: "🫥", label: "Weary" },

  // ── Surprised / Other (legacy compat) ──
  bored: { emoji: "🔘", label: "Bored" },
  sick: { emoji: "🤒", label: "Sick" },
  surprised: { emoji: "😯", label: "Surprised" },
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
