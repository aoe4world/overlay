import { Component, ComponentProps, createResource, createSignal, For, onCleanup, onMount, splitProps } from "solid-js";
import { Civilization, getLastGame, Player as TeamPlayer } from "./query";

const Flag: Component<ComponentProps<"img"> & { civ: Civilization }> = (props) => {
  const [local, rest] = splitProps(props, ["civ", "class"]);
  return (
    <img
      src={local.civ.flag}
      style={{ "outline-color": local.civ.color }}
      class={`${local.class} outline outline-1`}
      {...rest}
    />
  );
};

const Badge: Component<{ rank: string; class?: string }> = (props) => (
  <img src={`/badges/s3/${props.rank}.svg`} class={props.class} />
);

const Player: Component<{
  civ: Civilization;
  player: TeamPlayer;
  class?: string;
  align: "left" | "right";
  size?: "compact";
}> = (props) => {
  return (
    <div class={`flex items-center gap-3 ${props.class} ${props.align == "right" ? "flex-row-reverse" : ""} `}>
      <Flag civ={props.civ} class={`rounded-sm object-cover ${props.size == "compact" ? "h-5 w-9" : "h-9 w-16"}`} />
      {props.player?.rank && <Badge rank={props.player.rank} class={props.size == "compact" ? "h-5" : "h-9"} />}
      <div
        class={`
        gap-1 justify-between
        ${props.align == "right" ? "text-right" : ""} 
          ${props.size == "compact" ? "flex items-center gap-3" : ""}
          ${props.size == "compact" && props.align == "right" ? "flex-row-reverse" : ""}
          `}
      >
        <h1
          class={`font-bold text-sm whitespace-nowrap ${
            props.player.result == "loss" ? " text-red-600 " : props.player.result == "win" ? " text-green-600" : ""
          }`}
        >
          {props.player.name}
        </h1>
        {props.player.mode_stats ? (
          <div class={`flex gap-2 text-sm ${props.size == "compact" ? "opacity-70" : ""} `}>
            <span>#{props.player.mode_stats.rank}</span>
            <span>{props.player.mode_stats.rating}</span>
            {props.size != "compact" && (
              <>
                <span>{props.player.mode_stats.win_rate}%</span>
                <span class="text-green-600">{props.player.mode_stats.wins_count}W</span>
                <span class="text-red-600">{props.player.mode_stats.losses_count}L</span>
              </>
            )}
          </div>
        ) : (
          <span class="text-sm text-white/50">No rank found</span>
        )}
      </div>
    </div>
  );
};

let interval;
const App: Component = () => {
  const [profileId, setProfileId] = createSignal<string>();
  const [currentGame, { refetch }] = createResource(profileId, getLastGame);

  const game = () => (currentGame.loading ? currentGame.latest : currentGame());
  const teamGame = () => game()?.team.length > 1 || game()?.opponents.length > 1;
  onMount(() => {
    const profileId = new URLSearchParams(window.location.search).get("profileId")?.toString()?.split("-")[0];
    setProfileId(profileId);
    interval = setInterval(() => refetch(), 1000 * 15);
  });

  onCleanup(() => {
    clearInterval(interval);
  });

  return (
    <div class="flex items-center flex-col" style="text-shadow: 0px 1px 0 1px black;">
      <div class="from-black/90 via-black/70 to-black/90 bg-gradient-to-r rounded-md mt-6 min-w-[700px] text-white inline-flex items-center p-2 relative">
        {!profileId() && (
          <div class="flex-none p-4">
            <div class="font-bold text-white text-md">No profile selected</div>
            <span class="text-sm">
              Make sure the url ends with{" "}
              <code class="text-gray-100">
                ?profileId=<span class="text-blue-300">your profile id</span>
              </code>
            </span>
          </div>
        )}

        {currentGame.error && profileId() && (
          <div class="flex-none p-4">
            <div class="font-bold text-white text-md">Error while loading last match</div>
            <span class="text-sm">{currentGame.error?.message}</span>
          </div>
        )}

        <div class="basis-1/2 flex flex-col gap-3">
          <For each={game()?.team}>
            {(player) => (
              <Player player={player} civ={player.civilization} align="left" size={teamGame() ? "compact" : null} />
            )}
          </For>
        </div>
        <div class="text-center basis-36 flex flex-col self-start	 gap-1 px-4 whitespace-nowrap">
          <p class="text-xs font-bold">{currentGame()?.map}</p>
          <p class="text-xs uppercase text-white/80">{currentGame()?.kind}</p>
        </div>
        <div class="basis-1/2 flex flex-col gap-3">
          <For each={game()?.opponents}>
            {(player) => (
              <Player player={player} civ={player.civilization} align="right" size={teamGame() ? "compact" : null} />
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default App;
