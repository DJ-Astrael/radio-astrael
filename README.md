# Radio Astraël — The Classic Mixcloud Radio

This repository hosts the **classic Radio Astraël website**, matching the original dark/cyan/purple design supplied by the artist.

**Public radio:** https://dj-astrael.github.io/radio-astrael/

## Seven featured mixes (in the fixed order)

1. The Last Transmission
2. Neural Dream
3. Into The Blue
4. Echoes of Trance
5. Eclipse
6. Autumn Passion
7. Rainy Day

## How it works

- The entire site is contained in **index.html**, including layout, styles and player logic.
- Audio remains on **Mixcloud** through its official embedded player.
- Each mix provides a link to its Mixcloud page for comments, favorites and sharing.
- Previous / next, shuffle and repeat are provided. The site requests automatic continuation when a mix ends.
- It attempts autoplay with **The Last Transmission** first. Browser autoplay policies or Mixcloud restrictions may require a first click. Uninterrupted playback is not guaranteed when the browser sleeps or restricts embedded players.
- No Supabase database, no upload backend, no administration account, and no other playlist are required.

## Publish

In the GitHub repository Settings → Pages, select:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

The website is hosted freely by GitHub Pages. This is an on-demand Mixcloud playlist, not a synchronized live radio server.

## Update tracks

Edit the `tracks` array inside `index.html`. Use full Mixcloud set URLs. The page uses those Mixcloud URLs to load covers where permitted by the Mixcloud API. Do not add fake streams or automated plays to inflate statistics.
