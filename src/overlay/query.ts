import { FLAGS } from "../assets";

export type Civilization = {
  name: string;
  flag: string;
  color: string;
};

const CIVILIZATIONS: Record<string, Civilization> = {
  abbasid_dynasty: {
    name: "Abbasid Dynasty",
    color: "#5D6063",
    flag: FLAGS.ab,
  },

  ayyubids: {
    name: "Ayyubids",
    color: "#C5B537",
    flag: FLAGS.ay,
  },

  byzantines: {
    name: "Byzantines",
    color: "#8038BE",
    flag: FLAGS.by,
  },

  chinese: {
    name: "Chinese",
    color: "#E15034",
    flag: FLAGS.ch,
  },

  delhi_sultanate: {
    name: "Delhi Sultanate",
    color: "#00AF63",
    flag: FLAGS.de,
  },

  english: {
    name: "English",
    color: "#C3D1DF",
    flag: FLAGS.en,
  },

  french: {
    name: "French",
    color: "#0087E7",
    flag: FLAGS.fr,
  },

  holy_roman_empire: {
    name: "Holy Roman Empire",
    color: "#FFCB2F",
    flag: FLAGS.hr,
  },

  japanese: {
    name: "Japanese",
    color: "#B8B594",
    flag: FLAGS.ja,
  },

  jeanne_darc: {
    name: "Jeanne d'Arc",
    color: "#FFD65C",
    flag: FLAGS.je,
  },

  malians: {
    name: "Malians",
    color: "#D61D60",
    flag: FLAGS.ma,
  },

  mongols: {
    name: "Mongols",
    color: "#16A8FF",
    flag: FLAGS.mo,
  },

  order_of_the_dragon: {
    name: "Order of the Dragon",
    color: "#E0D678",
    flag: FLAGS.od,
  },

  ottomans: {
    name: "Ottomans",
    color: "#0F6F3E",
    flag: FLAGS.ot,
  },

  rus: {
    name: "Rus",
    color: "#F74C43",
    flag: FLAGS.ru,
  },

  zhu_xis_legacy: {
    name: "Zhu Xi's Legacy",
    color: "#00A6A7",
    flag: FLAGS.zx,
  },
};

type Modes = "rm_solo" | "rm_team" | "rm_solo_console" | "rm_team_console";

const mapPlayer =
  (leaderboard: string) =>
  (player: ApiPlayer): Player => {
    if (leaderboard == "custom") leaderboard = "rm_solo";
    const mode: ApiMode = player.modes?.[leaderboard];
    const rank_level = mode?.rank_level ?? "unranked";
    return {
      name: player.name,
      civilization: CIVILIZATIONS[player.civilization] ?? {
        name: "Unknown Civilization",
        color: "#000000",
        flag: undefined,
      },
      mode_stats: mode?.games_count ? mode : null,
      rank: leaderboard.startsWith("rm_solo")
        ? `solo_${rank_level}`
        : leaderboard.startsWith("rm_team")
        ? `team_${rank_level}`
        : undefined,
      result: player.result,
    };
  };

export type Player = {
  name: string;
  civilization: Civilization;
  mode_stats?: ApiMode;
  rank?: string;
  result?: "win" | "loss";
};

export type CurrentGame = {
  id: number;
  duration: number;
  team: Player[];
  opponents: Player[];
  map: string;
  kind: string;
  ongoing: boolean;
  recentlyFinished: boolean;
};

export async function getLastGame(
  profile_id: string,
  params: { include_alts?: string; api_key?: string; include_custom?: string },
  { value, refetching }: { value: CurrentGame; refetching: boolean }
): Promise<CurrentGame> {
  try {
    const response: ApiGame = await fetch(
      `https://aoe4world.com/api/v0/players/${profile_id}/games/last?${new URLSearchParams(
        Object.entries(params).filter(([k, v]) => v != undefined)
      ).toString()}`
    ).then((r) => r.json());

    if ((response as any).error) throw new Error((response as any).error);

    if (refetching && value.id == response.game_id && value.duration == response.duration) return value;

    if (response.kind === "custom" && params.include_custom != "true") return value ?? null;

    const { map, ongoing, duration, just_finished, teams, leaderboard } = response;

    const team =
      teams.find((team) => team.some((player) => response.filters.profile_ids.includes(player.profile_id))) || [];
    const opponents = teams.filter((t) => t !== team).flat();
    return {
      id: response.game_id,
      team: team.map(mapPlayer(leaderboard)),
      opponents: opponents.map(mapPlayer(leaderboard)),
      kind: response.kind.replace(/_/g, " "),
      duration,
      map,
      ongoing,
      recentlyFinished: just_finished,
    };
  } catch (e) {
    if (refetching) return value;
    else throw e;
  }
}

interface ApiGame {
  filters: {
    profile_ids: number[];
  };
  game_id: number;
  started_at: string;
  duration?: any;
  map: string;
  kind: string;
  leaderboard: string;
  server: string;
  average_rating?: any;
  ongoing: boolean;
  just_finished: boolean;
  teams: ApiPlayer[][];
}

interface ApiPlayer {
  civilization: string;
  result?: any;
  name: string;
  profile_id: number;
  steam_id: string;
  site_url: string;
  avatars: ApiAvatars;
  social: ApiSocial;
  modes: Record<Modes, ApiMode>;
}

interface ApiMode {
  rating: number;
  max_rating: number;
  max_rating_7d: number;
  max_rating_1m: number;
  rank: number;
  streak: number;
  games_count: number;
  wins_count: number;
  losses_count: number;
  drops_count: number;
  last_game_at: string;
  win_rate: number;
  rank_level: string;
  rating_history: ApiRatinghistory;
}

type ApiRatinghistory = Record<string, ApiRating>;

interface ApiRating {
  rating: number;
  streak: number;
  wins_count: number;
  drops_count: number;
  games_count: number;
}

interface ApiSocial {
  twitch: string;
  liquipedia: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
}

interface ApiAvatars {
  small: string;
  medium: string;
  full: string;
}
