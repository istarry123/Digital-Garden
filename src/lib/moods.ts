/**
 * 心情词表 —— 从 explore 组件里抽出来的数据模块。
 *
 * 说明：emoji 在 Explore 里是"数据"（每条笔记的心情取值），不是装饰，
 * 因此保留；标签文字用等宽字体渲染，与全站元信息语言一致。
 */
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

  // ── Angry / Frustrated 烦躁 ──
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

  // ── Tired 疲惫 ──
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

  // ── Surprised / Other（历史取值兼容）──
  bored: { emoji: "🔘", label: "Bored" },
  sick: { emoji: "🤒", label: "Sick" },
  surprised: { emoji: "😯", label: "Surprised" },
};

export interface Mood {
  emoji: string;
  label: string;
}

/** 未知心情退化为原文，而不是丢掉信息 */
export function moodOf(key: string): Mood {
  return MOOD_MAP[key] ?? { emoji: "💬", label: key };
}
