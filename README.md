# Hirun Kongpetch — Portfolio

Live: https://hirun-2542.github.io/Protfolio/

Five systems built for small, single-owner shops, standing as objects on a 3D toy desk. Pick one and the camera flies to it and opens its details. Each project links to its repository on [GitHub](https://github.com/hirun-2542).

Wang Chan Dorm · FoodQueue · RepairDesk · Ash & Oak Barber · SmartQueue

## Stack

Vite and three.js, static output. The open project lives in the URL hash (`/#foodqueue`), so deep links work under any sub-path. On narrow screens the desk becomes a list with a bottom sheet.

## Run locally

```bash
npm install
npm run dev      # dev server
npm run build    # static site in dist/
npm run preview  # serve dist/
```

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/pages.yml`).
