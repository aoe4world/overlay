/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { registerSW } from "virtual:pwa-register";
import { lazy } from "solid-js";
import { Router, Route, Routes, useNavigate } from "@solidjs/router";
import Overlay from "./overlay/Overlay";
import { TwitchPlayer } from "./overlay/TwitchPlayer";
const Generator = lazy(() => import("./generator/Generator.jsx"));

const options = new URLSearchParams(window.location.search);

const App = () => {
  const navigate = useNavigate();
  if (options.has("profileId")) {
    // Beta url detected, redirect to new url
    const profileId = options.get("profileId");
    options.delete("profileId");
    navigate(`/profile/${profileId}/bar?${options.toString()}`, { replace: true });
  }
  return (
    <Routes>
      <Route path="/profile/:profileId/bar" component={Overlay} />
      <Route path="/" component={Generator} />
    </Routes>
  );
};
render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);

const twitch = options.get("twitch");
if (twitch) {
  render(() => <TwitchPlayer channel={twitch} />, document.getElementById("twitch") as HTMLElement);
}

// Registers the serviceworker and will autoUpdate it on page load, then if there's an update refresh the page.
registerSW({ immediate: true });
