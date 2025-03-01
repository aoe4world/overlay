import { Component, ComponentProps, createEffect, createResource, createSignal, For } from "solid-js";
import { Icons } from "../assets/icons";
import { classes } from "../utils";
import type { IPublicPlayersAutocompleteAPI, IPublicPlayersAutocompletePlayerAPI } from "./types";

const DEBOUNCE = 100; // ms
const minQueryLength = 1;

export const Search: Component<{
  class?: string;
  onSelect: (player: IPublicPlayersAutocompletePlayerAPI) => void;
}> = (props) => {
  const [query, setQuery] = createSignal("");
  const [isOpen, setIsOpen] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(-1);
  const [results, { mutate }] = createResource(query, search);
  let suggestionsEl: HTMLDivElement;

  createEffect(() => setIsOpen(query().length >= minQueryLength));

  function pick(index: number) {
    if (index < 0 || !results()?.players?.length) return;
    props.onSelect(results()?.players[index]);
    close();
  }

  function close() {
    setQuery("");
    mutate({ players: [], count: 0, query: "", leaderboard: "" });
    setIsOpen(false);
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") moveSelectedIndex(1);
    else if (e.key === "ArrowUp") moveSelectedIndex(-1);
    else if (e.key === "Enter") {
      e.preventDefault();
      pick(selectedIndex());
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function moveSelectedIndex(change: number) {
    setSelectedIndex((i) => Math.min(Math.max(i + change, -1), results()?.players.length - 1));
    scrollSelectedIfOutsideScrollView();
  }

  function scrollSelectedIfOutsideScrollView() {
    const selectedEl = suggestionsEl?.querySelector<HTMLDivElement>(".selected");
    if (!selectedEl) return;
    if (selectedEl.offsetTop - suggestionsEl.clientHeight > suggestionsEl.scrollTop - selectedEl.clientHeight * 2)
      suggestionsEl.scrollTo({ top: selectedEl.offsetTop, behavior: "smooth" });
    else if (selectedEl.offsetTop - selectedEl.clientHeight < suggestionsEl.scrollTop)
      suggestionsEl.scrollTo({
        top: selectedEl.offsetTop - suggestionsEl.clientHeight + selectedEl.clientHeight,
        behavior: "smooth",
      });
  }

  return (
    <div class={classes("relative z-10", props.class)}>
      <Icons.Search class="absolute left-3 top-3 h-6 text-black pointer-events-none" />
      <input
        type="text"
        onBlur={() => setTimeout(close, 100)}
        onInput={(e) => setQuery(e.currentTarget.value)}
        value={query()}
        onKeyDown={handleKeydown}
        placeholder="Search players..."
        class="block w-full bg-gray-200 transition pl-12 focus:bg-white text-black px-6 py-3 placeholder-gray-900 rounded-lg focus:outline-none"
      />
      {isOpen() && (
        <div class="absolute mt-2 bg-gray-700 border-2 border-white/20 rounded-xl z-10 max-h-[60vh] w-full right-0 overflow-hidden">
          <div class={classes("max-h-96 overflow-auto", results()?.count ? "block" : "hidden")} ref={suggestionsEl}>
            <For each={results()?.players}>
              {(player, index) => (
                <button
                  class={classes(
                    "px-5 py-2 text-white block text-left w-full odd:bg-gray-800 hover:bg-gray-500",
                    selectedIndex() === index() && "!bg-blue-700 !text-white selected"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(index())}
                >
                  <div class="font-bold truncate max-w-screen lg:max-w-md">{player.name}</div>
                  <div class="text-sm opacity-60 space-x-2">
                    {player.rank ? (
                      <>
                        <span>#{player.rank}</span>
                        <span>{player.rating}</span>
                        <span>{player.win_rate}%</span>
                      </>
                    ) : (
                      <span> Not active on RM 1v1 leaderboard </span>
                    )}
                  </div>
                </button>
              )}
            </For>
          </div>
          <div class="px-5 py-2 text-white text-sm text-white/40 border-t border-white/10">
            {results.loading ? (
              <span class="animate-pulse">Loading...</span>
            ) : results().count ? (
              "Use ↑↓ and ⏎ to select."
            ) : (
              "No results"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

async function search(q: string) {
  const req = await fetch(
    `https://aoe4world.com/api/v0/players/autocomplete?query=${encodeURIComponent(q)}&limit=10&leaderboard=rm_1v1`
  );
  const data: IPublicPlayersAutocompleteAPI = await req.json();
  return data;
}
