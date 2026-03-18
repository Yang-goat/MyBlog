export interface RawTreasureSite {
  name: string;
  url: string;
  desc: string;
  tags: string[];
  icon?: string;
}

export interface TreasureSite {
  name: string;
  url: string;
  desc: string;
  tags: string[];
  primaryTag: string;
  hostname: string;
  searchText: string;
  iconCandidates: string[];
}

export interface TreasureSection {
  tag: string;
  items: TreasureSite[];
}

export const TREASURE_ALL_TAG = "全部";
export const TREASURE_FALLBACK_ICON = "/websites/default.svg";

const collator = new Intl.Collator("zh-CN", { sensitivity: "base" });

const cleanText = (value: string | undefined): string => value?.trim() ?? "";

const isNonEmpty = (value: string): boolean => value.length > 0;

const unique = (items: string[]): string[] => Array.from(new Set(items));

const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const getFaviconCandidate = (url: string): string | null => {
  try {
    return `${new URL(url).origin}/favicon.ico`;
  } catch {
    return null;
  }
};

export const compareText = (first: string, second: string): number =>
  collator.compare(first, second);

export const normalizeTreasureSite = (site: RawTreasureSite): TreasureSite => {
  const tags = Array.isArray(site.tags)
    ? unique(site.tags.map(cleanText).filter(isNonEmpty))
    : [];
  const primaryTag = tags[0] ?? "未分类";
  const hostname = getHostname(site.url);
  const faviconCandidate = getFaviconCandidate(site.url);
  const iconCandidates = unique(
    [cleanText(site.icon), faviconCandidate ?? "", TREASURE_FALLBACK_ICON].filter(
      isNonEmpty,
    ),
  );

  return {
    name: cleanText(site.name),
    url: cleanText(site.url),
    desc: cleanText(site.desc),
    tags: tags.length > 0 ? tags : [primaryTag],
    primaryTag,
    hostname,
    searchText: [site.name, site.desc, hostname, ...tags].join(" ").toLowerCase(),
    iconCandidates,
  };
};

export const sortTreasureSites = (sites: TreasureSite[]): TreasureSite[] =>
  [...sites].sort((first, second) => {
    const nameOrder = compareText(first.name, second.name);

    if (nameOrder !== 0) return nameOrder;

    return compareText(first.hostname, second.hostname);
  });

export const buildTreasureSections = (
  sites: TreasureSite[],
): TreasureSection[] => {
  const groups = new Map<string, TreasureSite[]>();

  for (const site of sites) {
    const group = groups.get(site.primaryTag) ?? [];
    group.push(site);
    groups.set(site.primaryTag, group);
  }

  return Array.from(groups.entries())
    .sort(([firstTag], [secondTag]) => compareText(firstTag, secondTag))
    .map(([tag, items]) => ({
      tag,
      items: sortTreasureSites(items),
    }));
};
