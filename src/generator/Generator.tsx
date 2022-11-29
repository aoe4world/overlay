import { Component, ComponentProps, createSignal, JSX, ParentComponent, splitProps } from "solid-js";
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

export const Generator = () => {
  const [player, setPlayer] = createSignal<IPublicPlayersAutocompletePlayerAPI>({ name: "Beastyqt" } as any);
  const [style, setStyle] = createSignal<"top" | "floating">("top");
  const [isCopied, setIsCopied] = createSignal(false);
  let urlField;
  let timeout;

  function copy() {
    copyInputText(urlField);
    setIsCopied(true);
    clearTimeout(timeout);
    timeout = window.setTimeout(() => setIsCopied(false), 1200);
  }
  return (
    <div class="bg-gray-800 min-h-screen m-0 p-6 text-white">
      <div class="flex flex-col gap-6 max-w-3xl mx-auto">
        <div class="rounded-xl bg-gray-600 p-6 flex flex-col gap-6">
          <Row step={1} label="Select your user profile" description="Search for your in-game name">
            {player() ? (
              <div class="my-6 font-bold text-xl flex items-center">
                {player()?.name}
                <button onClick={() => setPlayer(undefined)} class="ml-2 text-sm text-gray-300 hover:text-gray-100">
                  <Icons.X />
                </button>
              </div>
            ) : (
              <Search class="my-4" onSelect={setPlayer} />
            )}
          </Row>
          <Row step={2} label="Choose your style" description="Pick the theme and alignment for your overlay">
            <StyleOption
              label="Top"
              description="Centered above the current age"
              active={style() === "top"}
              onClick={() => setStyle("top")}
            >
              <img src={bannerTopImage} class="absolute top-0" />
            </StyleOption>
            <StyleOption
              label="Floating"
              description="Position anywhere on your screen"
              active={style() === "floating"}
              onClick={() => setStyle("floating")}
            >
              <img src={bannerFloatingImage} class="absolute top-1.5 right-1.5" />
            </StyleOption>
          </Row>
          <Row
            step={3}
            label="Add as Browser Source"
            description="In your streaming software, add a new Browser Source and paste the URL below"
          >
            {player() ? (
              <div class="bg-gray-400 rounded-lg  w-full flex gap-2 relative my-4" onClick={(e) => urlField.select()}>
                <input
                  value={`https://overlay-beta.aoe4world.com/profile/${
                    player()?.profile_id ?? "xxxx"
                  }/?theme=${style()}&includeAlts=true`}
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
