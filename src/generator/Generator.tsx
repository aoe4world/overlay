import {
  Component,
  ComponentProps,
  createEffect,
  createResource,
  createSignal,
  JSX,
  Match,
  ParentComponent,
  splitProps,
  Switch,
} from "solid-js";
import screenImage from "../assets/images/screen.svg";
import bannerTopImage from "../assets/images/banner-top.svg";
import bannerFloatingImage from "../assets/images/banner-floating.svg";
import { classes } from "../utils";
import { Search } from "./Search";
import { IPublicPlayersAutocompletePlayerAPI } from "./types";
import { Icons } from "../assets/icons";

const Row: ParentComponent<{ step: number; label: string; description: string }> = (props) => (
  <div class="flex items-start gap-4">
    <div class="bg-green-700/20 text-green-500 w-6 h-6 rounded-full grid place-items-center">{props.step}</div>

    <div class="flex-auto">
      <h2 class="text-gray-100 mb-1 text-lg">{props.label}</h2>
      <p class="text-gray-300 leading-relaxed">{props.description}</p>
      {props.children}
    </div>
  </div>
);

const StyleOption: ParentComponent<
  { label: string; description: string; active: boolean } & ComponentProps<"button">
> = (props) => {
  const [local, rest] = splitProps(props, ["label", "description", "children", "active"]);
  return (
    <button class="mt-2 mr-4 inline-flex flex-col items-center group " {...rest}>
      <strong class={classes(local.active ? "text-white" : "text-gray-100/80")}>{local.label}</strong>
      <div
        class={classes(
          "relative my-2 outline-white:outline rounded-md flex flex-col items-center overflow-hidden transition duration-300 group-hover:saturate-100",
          local.active ? "outline saturate-100" : "saturate-0"
        )}
      >
        <img src={screenImage} />
        {local.children}
      </div>
      <small class="text-sm text-gray-200">{local.description}</small>
    </button>
  );
};

async function getAuthUser() {
  try {
    const req = await fetch("https://aoe4world.com/account/profile_token", {
      credentials: "include",
    });
    const user = await req.json();
    if (user?.logged_in) return user;
    else return null;
  } catch {
    return null;
  }
}

export const Generator = () => {
  const [user, { mutate: setUser }] = createResource(getAuthUser);
  const [pickedPlayer, setPickedPlayer] = createSignal<IPublicPlayersAutocompletePlayerAPI>(undefined);
  const [isCopied, setIsCopied] = createSignal(false);
  const [params, setParams] = createSignal<{
    includeAlts: boolean;
    apiKey?: string;
    profileId: number;
    includeCustom: boolean;
    theme: "top" | "floating";
  }>({
    includeAlts: true,
    apiKey: undefined,
    profileId: undefined,
    includeCustom: true,
    theme: "top",
  });
  let urlField;
  let timeout;

  createEffect(() => {
    setParams((x) => ({
      ...x,
      apiKey: user()?.api_key,
      profileId: user()?.profile_id ?? pickedPlayer()?.profile_id,
    }));
  });

  const url = () => {
    const urlParams = new URLSearchParams({
      theme: params()?.theme,
      includeAlts: params()?.includeAlts.toString(),
    });
    if (params().apiKey) {
      urlParams.set("apiKey", params().apiKey);
      urlParams.set("includeCustom", params().includeCustom.toString());
    }

    if (params().profileId)
      return `https://${window.location.host}/profile/${params().profileId}/bar?${urlParams.toString()}`;
    else return null;
  };
  function copy() {
    copyInputText(urlField);
    setIsCopied(true);
    clearTimeout(timeout);
    timeout = window.setTimeout(() => setIsCopied(false), 1200);
  }
  return (
    <div class="bg-gray-800 min-h-screen m-0 p-6 text-white">
      <div class="flex flex-col gap-6 max-w-3xl mx-auto">
        <div class="p-6">
          <h1 class="font-bold text-2xl my-8">
            <span class="border-4 border-white rounded-lg px-2 py-1">AoE4 World</span> Overlay
          </h1>
          <h2 class="font-bold text-xl max-w-lg text-gray-100 my-4">
            A tool for streamers to display information about ongoing games in their broadcasts.
          </h2>
          <p class="text-lg text-gray-50 leading-snug max-w-xl">
            Show your rank, rating and that of your opponent to your viewers using the tool build specifically for
            streamers. Use the below generator to create a url that you can add as a browser source in your streaming
            software.
          </p>
          <a
            href="https://github.com/aoe4world/overlay"
            class="text-gray-300 my-6 hover:underline hover:text-white inline-block"
          >
            GitHub / Support
          </a>
        </div>
        <div class="rounded-xl bg-gray-600 p-6 flex flex-col gap-6">
          <Row step={1} label="Select your user profile" description="Search for your in-game name">
            <Switch fallback={<Search class="my-4" onSelect={setPickedPlayer} />}>
              <Match when={pickedPlayer()}>
                <div class="my-6 font-bold text-xl flex items-center">
                  {pickedPlayer()?.name}
                  <button
                    onClick={() => setPickedPlayer(undefined)}
                    class="ml-2 text-sm text-gray-300 hover:text-gray-100"
                  >
                    <Icons.X />
                  </button>
                </div>
              </Match>
              <Match when={user()}>
                <div class="my-3 font-bold text-xl flex flex-wrap items-center">
                  {user()?.name}
                  <button onClick={() => setUser(undefined)} class="ml-2 text-sm text-gray-300 hover:text-gray-100">
                    <Icons.X />
                  </button>
                </div>
                <p class="text-gray-100 text-sm">
                  You are logged in as {user()?.name}, the overlay can now include custom games!
                </p>
              </Match>
            </Switch>
            {user() ? (
              <></>
            ) : (
              <p class="text-sm text-gray-100 max-w-md">
                Tip: Sign in to{" "}
                <a href="https://aoe4world.com" target="_blank">
                  AoE4 World
                </a>{" "}
                with your steam account and then refresh this page to get access to custom games.
              </p>
            )}
          </Row>

          <Row step={2} label="Choose your style" description="Pick the theme and alignment for your overlay">
            <StyleOption
              label="Top"
              description="Centered above the current age"
              active={params().theme === "top"}
              onClick={() => setParams((x) => ({ ...x, theme: "top" }))}
            >
              <img src={bannerTopImage} class="absolute top-0" />
            </StyleOption>
            <StyleOption
              label="Floating"
              description="Position anywhere on your screen"
              active={params().theme === "floating"}
              onClick={() => setParams((x) => ({ ...x, theme: "floating" }))}
            >
              <img src={bannerFloatingImage} class="absolute top-1.5 right-1.5" />
            </StyleOption>
          </Row>
          <Row
            step={3}
            label="Choose which games to show"
            description="Optionally you can choose to limit what games are shown in the overlay."
          >
            <label class="block py-2">
              <input
                type="checkbox"
                checked={params()?.includeAlts}
                onChange={(e) => setParams((x) => ({ ...x, includeAlts: e.currentTarget.checked }))}
              />
              <span class="ml-2 text-gray-100">Include games from my alt/smurf accounts (if any).</span>
            </label>
            <label class={classes("block py-2", !user() && "line-through")}>
              <input
                type="checkbox"
                checked={params()?.includeCustom}
                onChange={(e) => setParams((x) => ({ ...x, includeCustom: e.currentTarget.checked }))}
                disabled={!user()}
              />
              <span class={classes("ml-2 text-gray-100", !user() && "opacity-40")}>Include custom games.</span>
            </label>
          </Row>
          <Row
            step={4}
            label="Add as Browser Source"
            description="In your streaming software, add a new Browser Source and paste the URL below"
          >
            {url() ? (
              <div class="bg-gray-400 rounded-lg  w-full flex gap-2 relative my-4" onClick={(e) => urlField.select()}>
                <input
                  value={url()}
                  class=" outline-none bg-transparent p-2 flex-auto selection:bg-green-800/40 selection:text-green-500"
                  readonly
                  ref={urlField}
                />
                <div
                  style={{ display: isCopied() ? "block" : "none" }}
                  class="absolute inset-1 rounded-lg bg-gray-400 p-2"
                >
                  Url copied to clipboard!
                </div>
                <button
                  class={classes("z-10  p-1 rounded w-8 m-2", !isCopied() && "hover:bg-gray-500")}
                  onClick={() => copy()}
                >
                  {isCopied() ? (
                    <Icons.CircleCheck class="text-green-500" />
                  ) : (
                    <Icons.Clipboard class="text-gray-200" />
                  )}
                </button>
              </div>
            ) : (
              <div class="text-gray-400 my-4">First select a player</div>
            )}
            <div class="text-gray-300">
              Learn more about adding a browser source in{" "}
              <a
                href="https://obsproject.com/wiki/Sources-Guide#browser-source"
                target="_blank"
                class="text-gray-200 hover:text-white"
              >
                OBS Project
              </a>{" "}
              and{" "}
              <a
                href="https://blog.streamlabs.com/introducing-browser-source-interaction-for-streamlabs-obs-d8fc4dcbb1fb"
                target="_blank"
                class="text-gray-200 hover:text-white"
              >
                Streamlabs OBS
              </a>
              .
            </div>
            <div class="text-sm text-gray-300  mt-4">
              {" "}
              Tip: To properly align the overlay to the center of the screen, right click on the source and click
              Transform → Center Horizontally
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
};

function copyInputText(el: HTMLInputElement) {
  navigator.clipboard.writeText(el.value).catch(() => {
    el.select();
    document.execCommand("copy");
  });
}

export default Generator;
