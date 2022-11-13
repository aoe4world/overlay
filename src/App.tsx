import {
  Component,
  ComponentProps,
  createEffect,
  createResource,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";
import { Civilization, getLastGame, Player as TeamPlayer } from "./query";
import { Trivia } from "./Trivia";

// seconds
const CONFIG = {
  HIDE_GAME_AFTER: 20,
  SYNC_EVERY: 15,
};

export const Flag: Component<ComponentProps<"img"> & { civ: Civilization }> = (props) => {
  const [local, rest] = splitProps(props, ["civ", "class"]);
  return (
    <img
      src={local.civ.flag}
      style={{ "outline-color": local.civ.color }}
      class={classes(local.class, "outline outline-1")}
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
  const compact = () => props.size === "compact";
  const rightAligned = () => props.align === "right";
  return (
    <div class={classes("flex items-center gap-3", rightAligned() && "flex-row-reverse")}>
      <Flag
        civ={props.civ}
        class={classes("rounded-sm object-cover", compact() ? "h-5 w-9 rounded-xs" : "h-10 w-17 scale-[0.9]")}
      />
      {props.player?.rank && (
        <Badge rank={props.player.rank} class={classes("rounded-sm scale-[1.2]", compact() ? "h-5" : "h-9")} />
      )}
      <div
        class={classes(
          "gap-2 justify-between",
          rightAligned() && "text-right",
          compact() && "flex items-center gap-4",
          compact() && rightAligned() && "flex-row-reverse"
        )}
      >
        <h1
          class={classes(
            "font-bold text-md whitespace-nowrap",
            props.player.result == "loss" && "text-red-500",
            props.player.result == "win" && "text-green-500"
          )}
        >
          {props.player.name}
        </h1>
        <div
          class={classes(
            "flex gap-2 text-md leading-tight",
            compact() && "opacity-80",
            rightAligned() && "justify-end"
          )}
        >
          {props.player.mode_stats ? (
            <>
              <span>#{props.player.mode_stats.rank}</span>
              <span>{props.player.mode_stats.rating}</span>
              {!compact() && (
                <>
                  <span class="text-green-500">{props.player.mode_stats.wins_count}W</span>
                  <span class="text-red-500">{props.player.mode_stats.losses_count}L</span>
                  <span>{props.player.mode_stats.win_rate}%</span>
                </>
              )}
            </>
          ) : props.player.rank?.endsWith("unranked") ? (
            <span class="text-md text-white/50">Unranked</span>
          ) : (
            <span class="text-md text-white/50">No stats found</span>
          )}
        </div>
      </div>
    </div>
  );
};

let sync;
let scheduledHide;
const App: Component = () => {
  const options = new URLSearchParams(window.location.search);
  const [profileId, setProfileId] = createSignal(options.get("profileId")?.toString()?.split("-")[0]);
  const [theme, setTheme] = createSignal<"top" | "floating">((options.get("theme") as any) ?? "floating");
  const [currentGame, { refetch }] = createResource(profileId, getLastGame);
  const [visible, setVisible] = createSignal(false);
  const game = () => (currentGame.loading ? currentGame.latest : currentGame());
  const teamGame = () => game()?.team.length > 1 || game()?.opponents.length > 1;

  const toggle = (show: boolean) => {
    setVisible(show);
    window.clearTimeout(scheduledHide);
  };

  onMount(() => {
    sync = setInterval(() => refetch(), 1000 * CONFIG.SYNC_EVERY);
  });

  onCleanup(() => {
    clearInterval(sync);
    clearTimeout(scheduledHide);
  });

  createEffect(
    on(game, () => {
      if (visible() && game()?.ongoing === false)
        scheduledHide = window.setTimeout(() => toggle(false), 1000 * CONFIG.HIDE_GAME_AFTER);
      else if (!visible() && game()?.ongoing) toggle(true);
    })
  );

  return (
    <div class="flex items-center flex-col w-[800px] mx-auto" style="text-shadow: 0px 1px 0 1px black;">
      {!profileId() && (
        <div class="bg-red-900 p-6 text-sm m-4 rounded-md">
          <div class="font-bold text-white text-md mb-4">No profile selected</div>
          <span class="text-white">
            Make sure the url ends with{" "}
            <code class="text-gray-100">
              ?profileId=<span class="text-blue-300">your profile id</span>
            </code>
          </span>
        </div>
      )}
      {currentGame.error && profileId() && (
        <div class="bg-red-900 p-6 text-sm m-4 rounded-md">
          <div class="font-bold text-white text-md">Error while loading last match</div>
          <span class="text-white">{currentGame.error?.message}</span>
        </div>
      )}

      <div
        class={classes(
          "w-full duration-700 fade-in fade-out",
          theme() == "top" && "slide-in-from-top slide-out-to-top-20",
          visible() ? "animate-in" : "animate-out"
        )}
        onanimationend={(e) => {
          e.target.classList.contains("animate-out") && e.target.classList.add("hidden");
        }}
      >
        <div
          class={classes(
            "from-black/90 via-black/70 to-black/90 bg-gradient-to-r rounded-md mt-0 w-full text-white inline-flex items-center relative p-1.5"
          )}
          style={themes[theme()]}
        >
          <div class="basis-1/2 flex flex-col gap-2">
            <For each={game()?.team}>
              {(player) => (
                <Player player={player} civ={player.civilization} align="left" size={teamGame() ? "compact" : null} />
              )}
            </For>
          </div>
          <div class="text-center basis-36 flex flex-col self-start	gap-1 px-4 whitespace-nowrap">
            <p class="text-sm font-bold">{currentGame()?.map}</p>
            {theme() != "top" && <p class="text-sm uppercase text-white/80">{currentGame()?.kind}</p>}
          </div>
          <div class="basis-1/2 flex flex-col gap-2">
            <For each={game()?.opponents}>
              {(player) => (
                <Player player={player} civ={player.civilization} align="right" size={teamGame() ? "compact" : null} />
              )}
            </For>
          </div>
        </div>

        <Trivia game={game()} />
      </div>

      <button onClick={() => toggle(!visible())} class="absolute top-0 right-0 p-2 bg-black text-white text-4xl">
        {visible() ? "Hide" : "Show"}
      </button>
    </div>
  );
};

const themes = {
  top: `
    background-image: radial-gradient(circle at bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.9) 80%);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
  floating: `
    margin: 10px;
  `,
};

export default App;

function classes(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
