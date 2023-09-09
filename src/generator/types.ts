import type { StringChain } from "lodash";

export interface ILeaderboardsMap {
  [key: string]: ILeaderboard;
}

export interface ILeaderboard {
  key: string;
  name: string;
  shortName: string;
  siteUrl: string;
  players: IPlayer[];
}

export interface IPlayer {
  name: string;
  profileId: number;
  siteUrl: string;
  twitchUrl?: string;
  twitchIsLive: boolean;
  avatars: IPlayerAvatars;
  social: IPlayerSocial;
  rating: number;
  rank: number;
  streak: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  lastGameAt: string;
  lastRatingChange: number;
  winRate: number;
}

export interface IPlayerAvatars {
  small: string;
  medium: string;
  full: string;
}

export interface IPlayerSocial {
  twitch?: string;
  youtube?: string;
  liquipedia?: string;
  twitter?: string;
  reddit?: string;
  instagram?: string;
}

export interface ITwitchStream {
  title: string;
  url: string;
  thumbnailUrl: string;
  userName: string;
  viewerCount: number;
}

export interface IPublicPlayersSearchAPI {
  total_count: number;
  page: number;
  per_page: number;
  count: number;
  offset: number;
  query: string;
  players: IPublicPlayer[];
}

export interface IPublicPlayersAutocompleteAPI {
  count: number;
  query: string;
  leaderboard: string;
  players: IPublicPlayersAutocompletePlayerAPI[];
}

export interface IPublicPlayersAutocompletePlayerAPI {
  name: string;
  profile_id: number;
  steam_id?: number;
  site_url: string;
  avatars: IPlayerAvatars;
  rating?: number;
  rank?: number;
  streak?: number;
  games_count?: number;
  wins_count?: number;
  losses_count?: number;
  last_game_at?: string;
  win_rate?: number;
}

export interface IPublicPlayer {
  name: string;
  profile_id: number;
  steam_id?: string;
  avatars: IPlayerAvatars;
  social: IPlayerSocial;
  last_game_at?: string;
  leaderboards: Partial<Record<"qm_1v1" | "qm_2v2" | "qm_3v3" | "qm_4v4", IPublicPlayerLeaderboardPosition>>;
}

export interface IPublicPlayerLeaderboardPosition {
  rating: number;
  rank: number;
  streak: number;
  games_count: number;
  wins_count: number;
  losses_count: number;
  last_game_at: string;
  win_rate: number;
}
