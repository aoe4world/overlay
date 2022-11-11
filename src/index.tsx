/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { registerSW } from 'virtual:pwa-register';

import App from './App';
import { TwitchPlayer } from './TwitchPlayer';

render(() => <App />, document.getElementById('root') as HTMLElement);

const options = new URLSearchParams(window.location.search);
const twitch = options.get("twitch");
if (twitch) {
  render(() => <TwitchPlayer channel={twitch} />, document.getElementById('twitch') as HTMLElement);
}

// Registers the serviceworker and will autoUpdate it on page load, then if there's an update refresh the page.
registerSW({ immediate: true });
