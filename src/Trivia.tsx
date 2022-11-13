import { Component, createResource, ParentComponent } from "solid-js";
import { Flag } from "./App";
import { ApiRecentGame, CurrentGame, getPlayerHistory, Player } from "./query";

export const Trivia: Component<{ game: CurrentGame }> = (props) => {
  return (
    <div class="flex gap-1 mt-0.5 flex-wrap text-white w-full">
      {props.game?.player && <PlayerWinrateToday player={props.game.player} />}
      {props.game?.opponents.length == 1 && (
        <PlayerWinrateVsOpponent player={props.game.player} opponent={props.game.opponents[0]} />
      )}
      {props.game?.player && <PlayerWinrateAsCivilization player={props.game.player} />}
      {props.game?.opponents.length == 1 && <PlayerWinrateAsCivilization player={props.game.opponents[0]} />}
    </div>
  );
};

const Tidbit: ParentComponent = (props) => {
  return (
    <div class="bg-black/80 py-1.5 px-2 rounded inline-flex text-[13px] items-center animate-in slide-in-from-left fade-in">
      {props.children}
    </div>
  );
};

const PlayerWinrateToday: Component<{ player: Player }> = (props) => {
  const [games] = createResource(props.player.profile_id, (p) => getPlayerHistory(p, { today: true }));
  const wins = () => getTotalWins(props.player.profile_id, games());
  return (
    <>
      {games()?.size ? (
        <Tidbit>
          {games().size} games played today
          <span class="text-green-500 ml-2">{wins()}W</span>
          <span class="text-red-500 ml-2">{games()?.size - wins()}L</span>
        </Tidbit>
      ) : null}
    </>
  );
};

const PlayerWinrateAsCivilization: Component<{ player: Player }> = (props) => {
  const civ = props.player.mode_stats?.civilizations?.find((c) => c.civilization == props.player.civilization.key);
  return (
    civ && (
      <Tidbit>
        <Flag civ={props.player.civilization} class="h-4 rounded-sm mr-2" />
        <span class={civ.win_rate > 50 ? "text-green-500" : civ.win_rate < 50 ? "text-red-500" : ""}>
          {civ.win_rate.toFixed(1)}%
        </span>
        <span class="ml-1"> win rate as {props.player.civilization.short_name}</span>
        <span class="text-gray-400 ml-2">{civ.games_count} games</span>
      </Tidbit>
    )
  );
};

const PlayerWinrateVsOpponent: Component<{ player: Player; opponent: Player }> = (props) => {
  const [games] = createResource(props.player.profile_id, (p) =>
    getPlayerHistory(p, { opponent: props.opponent.profile_id })
  );
  const wins = () => getTotalWins(props.player.profile_id, games());
  return (
    <>
      {games()?.size > 1 ? (
        <Tidbit>
          {formatWinrate(games().size, wins())} Win rate vs {props.opponent.name}
          <span class="text-green-500 ml-2">{wins()}W</span>
          <span class="text-red-500 ml-2">{games()?.size - wins()}L</span>
        </Tidbit>
      ) : null}
    </>
  );
};

function getTotalWins(profile_id: number, games: Map<number, ApiRecentGame>) {
  return games
    ? [...games.values()].filter((g) =>
        g.teams.some((t) => t.some(({ player }) => player.profile_id == profile_id && player.result == "win"))
      ).length
    : 0;
}

function formatWinrate(total: number, wins: number) {
  if (total == wins) return "100%";
  return ((wins / total) * 100).toFixed(1) + "%";
}
