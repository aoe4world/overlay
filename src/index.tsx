/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { registerSW } from 'virtual:pwa-register';

import App from './App';

render(() => <App />, document.getElementById('root') as HTMLElement);

// Registers the serviceworker and will autoUpdate it on page load, then if there's an update refresh the page.
registerSW({ immediate: true });
