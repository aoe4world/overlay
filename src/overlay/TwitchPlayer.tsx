
import {
  Component,
  ComponentProps,
} from "solid-js";

export const TwitchPlayer: Component<ComponentProps<"iframe">& { channel: string }> = (props) => {
    return (
      <iframe
      src={`https://player.twitch.tv/?channel=${props.channel}&parent=${window.location.hostname}`}
      height="100%"
      width="100%"
      allowfullscreen
      class="w-screen h-screen absolute inset-0 z-10 pointer-events-none"
    >
    </iframe>
    );
  };
  