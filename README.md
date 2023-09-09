
# AoE4 World Overlay

### A tool for streamers to display information about ongoing games in their broadcasts.

* Supports all all Ranked and Quickmatch modes (1v1, 2v2, etc)
* Shows players' names, ranking, civ and win rate
* Includes all new civilizations
* Optionally supports custom games
* Ready to use as a browser source in OBS and Streamlabs OBS

Get yours at [overlay.aoe4world.com](https://overlay.aoe4world.com/)

<img width="1005" alt="CleanShot 2022-11-13 at 02 08 30@2x" src="https://user-images.githubusercontent.com/6642554/201501074-ea967231-59cb-44b4-b339-437bf741255c.png">


> **Note** 
> We highly recommend you join our #overlay channel on our [Discord](https://discord.gg/rVgtQ8n6QK) to stay up to date on new releases and changes. It's also a good place to share feedback or get help.

---

## Set up

To get the AoE4 World Overlay for your account, follow the steps outline on [overlay.aoe4world.com](https://overlay.aoe4world.com/). 

--- 

## Manual Set up 
The overlay is actually a personalized web page that you can include as a browser source in your streaming software. First, you will need to create the right url, outlined below, then you can add it as a source.

#### Profile ID
The url for your overlay needs your AoE4 profile ID. Your profile ID is the number in the url of your profile page on aoe4world.com. For example, coRe's profile url is https://aoe4world.com/players/7090781-coRe, so his profile ID is 7090781. 

### Default url
To use the overlay in the default setup, replace the numbers in the below url with your profile ID.

```
https://overlay.aoe4world.com/profile/1234567/bar?theme=top&includeAlts=true
```

> **Note** This url will change once the overlay comes out of beta

#### Default theme
The default behavior is intended for showing the overlay at the top of your stream, centered to the screen. This way it overlays nicely with the current Age indicator. 

#### Floating theme
If you want to show the overlay in an arbitrary position, like the  corner of your stream, you can use the floating theme. This will render the overlay in a fixed width with round corners on all sides. To use the floating theme, replace `theme=top` with `theme=floating` in your url.

##### Example
```
https://overlay.aoe4world.com/profile/1234567/bar?theme=floating&includeAlts=true
```

<img width="932" alt="Floating Theme" src="https://user-images.githubusercontent.com/6642554/201501063-67a07b01-474b-4460-9efe-5c701b6b436a.png">


### Add as a browser source
Once you have the url, you can add it as a browser source in your streaming software, following these guides:

* [OBS](https://obsproject.com/wiki/Sources-Guide#browser-source)
* [Streamlabs OBS](https://blog.streamlabs.com/introducing-browser-source-interaction-for-streamlabs-obs-d8fc4dcbb1fb)

In both instances, use a width of at least 800px and a height of 400px. 

> **Note** To properly align the overlay to the center of the screen, right click on the source and click _Transform ->Center Horizontally_

### Auto hiding behavior
The overlay will automatically hide when you are not in a game. This is to prevent the overlay from showing outdated info when you are in the lobby, in the main menu or loading a new game.

When first loading the overlay, it will always show your current/last game to help you set up the overlay.

To prevent the overlay from displaying at the start, when you switch to a configured scene, make sure un uncheck the 'Refresh browser when scene becomes active' option in your browser source settings.

---

## About
### Bugs & Support
Open an issue in this GitHub repo or connect with us on Discord in the [#overlay](https://discord.gg/rVgtQ8n6QK) channel.

### Contributing
We are open to contributions and feedback. If you want to contribute, please open an issue or a pull request on this GitHub repo. The stack is fairly straightforward:
- [SolidJS](https://www.solidjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Other projects
- [FluffyMaguro's AoE4 Overlay](https://github.com/FluffyMaguro/AoE4_Overlay) — A feature rich native app, with a lot of customization options, build orders and stats. Not just for streamers!
- [Capture Age Spectator Tool](https://www.ageofempires.com/news/captureage-new-spectator-tool-ageiv/) – A casting overlay for watching/observing games with real time income and unit stats (bundled with the game)

### Credits
Build and maintained by the [AoE4 World team](https://aoe4world.com). A lot of inspiration was taken from the original 'AOEIV Overlay' by Hadmaerd.

> Age Of Empires 4 © Microsoft Corporation. AoE4 World Overlay was created under Microsoft's "Game Content Usage Rules" using assets from Age Of Empires 4, and it is not endorsed by or affiliated with Microsoft.
