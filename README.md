# Profile website starter

A text-only HTML, CSS, and JavaScript starter derived from the original portfolio's console layout and dark theme.

## Run
Open index.html directly in a browser, or serve this folder with a local HTTP server. No dependencies or build step are required.

## Project structure

```text
index.html             Portfolio homepage
pages/                 Profile pages and blog index
  blog/                Standalone HTML articles
assets/
  css/
    shared/            Design tokens, base styles, layout, and components
    features/          Styles for the blog and rainy lake
  js/
    profile.js         Profile data, rendering, and active navigation
    effects/           Rainy lake animation
  images/              Profile and site images
  pdf/                 Downloadable documents
docs/                  Reference demo
idea/                  Standalone experiments
```

Edit the `content` object in `assets/js/profile.js` to update profile text, contact details, and section cards. The `data-page` attribute on each profile page selects the section to render. Add shared styles under `assets/css/shared/` and feature styles under `assets/css/features/`. Link feature styles only from pages that use them.

## Add a blog post

1. Copy `pages/blog/data-pipeline-dau-tien.html` to a new file in `pages/blog/`.
2. Edit the page title, description, article header, and content in the HTML. Update the table of contents links to match the IDs of the article sections.
3. Add a card to the `.blog-posts` list in `pages/blogs.html`. Set its link to the new file and update the title, topic, excerpt, and reading time. Put newer entries first.

## GitHub Pages
Live website: [https://phantrongnguyen.github.io/profile/](https://phantrongnguyen.github.io/profile/).

Push the contents to your own repository, then configure Settings > Pages > Deploy from a branch and select the publishing branch with /(root).

## Rainy lake background
- `assets/js/effects/rainy-lake.js` adapts the Canvas rain, ripple, and atmosphere simulation from `docs/interactive_rainy_lake_background.html` for the homepage and profile pages.
- `assets/css/features/rainy-lake.css` styles the background and the Weather panel without external dependencies.
- Use the circular umbrella icon in the top-right corner to adjust presets, colors, rain, wind, fog, and the horizon, or pause the animation. Lightning is off by default.
- Drag over noninteractive page space below the horizon to create ripples. Links, controls, and normal page scrolling remain available.
- Reduced-motion preference starts the scene paused and disables lightning; animation also stops while the tab is hidden.
