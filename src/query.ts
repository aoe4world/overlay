import { FLAGS } from "./assets";

export type Civilization = {
  name: string;
  flag: string;
  color: string;
};

const CIVILIZATIONS: Record<string, Civilization> = {
  abbasid_dynasty: {
    name: "Abbasid Dynasty",
    color: "#3B3E41",
    flag: FLAGS.ab,
  },

  delhi_sultanate: {
    name: "Delhi Sultanate",
    color: "#29A362",
    flag: FLAGS.de,
  },

  chinese: {
    name: "Chinese",
    color: "#DA593B",
    flag: FLAGS.ch,
  },

  english: {
    name: "English",
    color: "#C3D1DF",
    flag: FLAGS.en,
  },

  french: {
    name: "French",
    color: "#2CA5EA",
    flag: FLAGS.fr,
  },

  holy_roman_empire: {
    name: "Holy Roman Empire",
    color: "#EFDA5C",
    flag: FLAGS.hr,
  },

  malians: {
    name: "Malians",
    color: "#D61D60",
    flag: FLAGS.ma,
  },
  mongols: {
    name: "Mongols",
    color: "#6EC9FF",
    flag: FLAGS.mo,
  },
  ottomans: {
    name: "Ottomans",
    color: "#2F6C4D",
    flag: FLAGS.ot,
  },
  rus: {
    name: "Rus",
    color: "#F74C43",
    flag: FLAGS.ru,
  },
};

const KIND_TO_MODE = {
  rm_1v1: "rm_solo",
  rm_2v2: "rm_team",
  rm_3v3: "rm_team",
  rm_4v4: "rm_team",
  qm_1v1: "qm_1v1",
  qm_2v2: "qm_2v2",
  qm_3v3: "qm_3v3",
  qm_4v4: "qm_4v4",
};

type Modes = "rm_solo" | "rm_team";

const mapPlayer =
  (mode_id: string) =>
  (player: ApiPlayer): Player => {
    const mode: ApiMode = player.modes?.[mode_id];
    const rank_level = mode?.rank_level ?? "unranked";
    return {
      name: player.name,
      civilization: CIVILIZATIONS[player.civilization] ?? {
        name: "Unknown Civilization",
        color: "#000000",
        flag: undefined,
      },
      mode_stats: mode,
      rank: mode_id === "rm_solo" ? `solo_${rank_level}` : mode_id === "rm_team" ? `team_${rank_level}` : undefined,
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
};

export async function getLastGame(
  profile_id: string,
  { value, refetching }: { value: CurrentGame; refetching: boolean }
): Promise<CurrentGame> {
  try {
    const response: ApiGame = await fetch(`https://aoe4world.com/api/v0/players/${profile_id}/games/last`).then((r) =>
      r.json()
    );
    if (refetching && value.id == response.game_id && value.duration == response.duration) return value;

    const team = response.teams.find((team) => team.some((player) => player.profile_id === +profile_id)) || [];
    const opponents = response.teams.filter((t) => t !== team).flat();
    const mode = KIND_TO_MODE[response.kind];
    return {
      id: response.game_id,
      duration: response.duration,
      team: team.map(mapPlayer(mode)),
      opponents: opponents.map(mapPlayer(mode)),
      map: response.map,
      kind: response.kind.replace("_", " "),
    };
  } catch (e) {
    if (refetching) return value;
    else throw e;
  }
}

interface ApiGame {
  game_id: number;
  started_at: string;
  duration?: any;
  map: string;
  kind: string;
  server: string;
  average_rating?: any;
  ongoing: boolean;
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
