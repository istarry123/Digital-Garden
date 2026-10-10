/**
 * 内容日期的解析与相对时间计算。
 *
 * 这里是纯函数、零依赖：Server Component（构建期预渲染）和 Client Component
 * （浏览器里重算相对时间）都要用它，所以不能引入 blogConfig 或任何
 * fs / node 内置模块 —— 否则会把整份站点配置带进客户端 bundle。
 *
 * 与 lib/format.ts 的分工：
 *   format.ts      → 把日期渲染成给人看的**绝对**日期（Sep 27, 2026）
 *   content-date.ts → 把 frontmatter 日期解析成**日历日**，并算相对时间（13 天前）
 */

/** content/ 全站约定的 frontmatter 日期格式 */
const CONTENT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface ContentDate {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
}

/**
 * 把 frontmatter 的日期字符串解析成一个**日历日**。
 *
 * 只接受 `YYYY-MM-DD`：这是 content/ 的约定格式，也是唯一能无歧义解释成
 * "哪一天"（而不是"哪个时刻"）的写法。其余一律返回 null，交给调用方降级，
 * 避免 `new Date()` 的宽松解析把脏数据变成看似合理的错误日期：
 *   - `2026-9-2`    → Date 会按**本地时间**解析，和 `2026-09-02` 差一个时区
 *   - `2026-02-30`  → Date 会静默溢出成 3 月 2 日，而不是报错
 */
export function parseContentDate(raw: unknown): ContentDate | null {
  if (typeof raw !== "string") return null;

  const match = CONTENT_DATE_PATTERN.exec(raw.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // 回写校验：拒绝 2026-02-30 / 2026-13-01 这类格式合法但日历上不存在的日期
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

/**
 * 把日历日折算成"第几天"，用于跨日比较。
 *
 * 两个日期都走 UTC 零点再相减，所以结果只取决于年月日，
 * 不受运行环境时区、夏令时或当天几点钟影响。
 */
function toDayNumber({ year, month, day }: ContentDate): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * 「今天 / 昨天 / N 天前 / N 个月前 / N 年前」。
 *
 * `now` 由调用方注入，不在函数内部读时钟：
 *   - Client Component 传 `new Date()`，拿到访问者的当前时间
 *   - 测试可以传固定时刻，验证跨日边界
 *
 * 天数按**日历日**相减，不做毫秒差除法 —— 否则 23:59 到次日 00:01 只差
 * 2 分钟却会被算成 0 天，按毫秒推自然日的写法在跨日时必然出错。
 */
export function formatRelativeDays(dateStr: string, now: Date): string {
  const parsed = parseContentDate(dateStr);
  if (!parsed || Number.isNaN(now.getTime())) return "—";

  const days =
    toDayNumber({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    }) - toDayNumber(parsed);

  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 30) return `${days} 天前`;
  if (days < 365) return `${Math.floor(days / 30)} 个月前`;
  return `${Math.floor(days / 365)} 年前`;
}

/**
 * 从一组 frontmatter 日期里挑出最新的一天，没有合法日期时返回 null。
 *
 * 用解析后的日历日比较，而不是字符串排序：`YYYY-MM-DD` 的字典序恰好等于
 * 时间序是巧合，一旦混进 `2026-9-2` 这种写法就会排错。非法日期直接跳过，
 * 不会污染结果。
 */
export function pickLatestContentDate(dates: readonly string[]): string | null {
  let latest: { iso: string; dayNumber: number } | null = null;

  for (const raw of dates) {
    const parsed = parseContentDate(raw);
    if (!parsed) continue;

    const dayNumber = toDayNumber(parsed);
    if (latest && dayNumber <= latest.dayNumber) continue;

    // parseContentDate 已保证 raw 是标准 YYYY-MM-DD，trim 后即可直接使用
    latest = { iso: raw.trim(), dayNumber };
  }

  return latest?.iso ?? null;
}
