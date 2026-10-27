# Radio Astraël — The Classic Mixcloud Radio

**Public website:** https://dj-astrael.github.io/radio-astrael/

This is the original dark/cyan/purple Radio Astraël design, powered entirely by public Mixcloud shows. No Supabase, no MP3 database and no manual uploads are required.

## Complete live Mixcloud catalogue

The home page loads ALL public shows from https://www.mixcloud.com/Astrael/ using Mixcloud's public, read-only REST API at `https://api.mixcloud.com/Astrael/cloudcasts/`.

The seven original curated mixes always remain at the top of the list:

1. The Last Transmission
2. Neural Dream
3. Into The Blue
4. Echoes of Trance
5. Eclipse
6. Autumn Passion
7. Rainy Day

Every other published show is appended automatically in the order returned by Mixcloud, with its own title, cover art, duration (when available), and link to its Mixcloud page. Duplicate show URLs are removed. The count is dynamic: 55 if the public profile currently exposes 55 unique shows, then 56, 57, and so on as new shows are published.

The catalogue updates:
- whenever a visitor opens or refreshes the site;
- every 10 minutes while a visitor keeps the page open;
- when a visitor returns to the page after switching tabs.

If Mixcloud's API is temporarily unavailable, the page retains the seven original mixes and reports that the catalogue will retry. Visitors do not need an account to browse.

## Listening

Playback uses Mixcloud's official embedded player and can attempt to advance when a mix ends. Autoplay with sound before the first click is not guaranteed by browsers or Mixcloud. The site is an on-demand radio-style Mixcloud playlist, not a synchronized live broadcast. The page never attempts to manufacture plays or listener statistics.

## Technology and deployment

All HTML, CSS and JavaScript are self-contained in `index.html`. Site hosting is provided by GitHub Pages, branch `main`, folder `/(root)`. Each public visitor retrieves show metadata directly from Mixcloud using their web browser. The code needs no backend, Supabase key or scheduled workflow.

To change the special seven curated mixes, edit the `pinnedTracks` array in `index.html`. Normally no manual maintenance is necessary.

Mixcloud API documentation: https://www.mixcloud.com/developers/
