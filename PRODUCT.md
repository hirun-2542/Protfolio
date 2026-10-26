# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + three.js (user choice). Static output, deployed to GitHub Pages (user choice). The build uses `base: './'` and project state lives in the URL hash, so it runs from any sub-path with no server routing.

## Users

Two audiences, both confirmed by the owner: (1) hiring managers and dev team leads judging a full-stack candidate, (2) freelance clients, mostly small single-owner shops, judging whether this person can build their system. Both need to see real shipped work and open the source or a demo quickly.

## Product Purpose

Personal portfolio of Hirun Kongpetch (GitHub: hirun-2542), full-stack developer. Success: a visitor understands within one screen what he builds, opens at least one project's details, and reaches the GitHub repo or live demo.

## Positioning

Builds complete small-business systems end to end (front end, API, database, real-time, tests) and ships them with real data and demos, for single-owner shops: dorm billing, restaurant QR ordering, repair tickets, booking, queues.

## Capabilities and Constraints

- One page. Five projects are selectable; choosing one opens a details panel on the right (summary, highlights, stack, links, previous/next) and shows that project's screenshot. Each project has a deep link (`/#<slug>`).
- Profile photo gets a hover effect (owner request).
- Mobile: the same panel works as a bottom sheet; a plain project list is the navigation.
- Copy language: English (user choice).
- Contact: GitHub only (owner confirmed "just GitHub is enough"). No email, location, resume or work history; do not invent.
- Wang Chan Dorm links to its project page (`/welcome`), not the live system root, by owner request.

## Brand Commitments

Name: Hirun Kongpetch. Initials HK. Profile photo: GitHub avatar (public/assets/profile.jpg). The earlier DESIGN.md palette and the "quiet minimal monograph" look were rejected by the owner ("ไม่ผ่านเลย"); they are not binding and DESIGN.md is stale.

## Evidence on Hand

Five real projects from GitHub, facts in `src/projects.js`: Wang Chan Dorm (project page https://wangchan-demo.nodhk2545.workers.dev/welcome), FoodQueue, RepairDesk, Ash & Oak Barber (repo barber-booking), SmartQueue. Every project has a real screenshot in `public/assets/` (SmartQueue's is from its own assets folder, `ProjectPort/SmartQueue/assets/banners/smartqueue/owner-screen.png`). Only Wang Chan Dorm has a hosted page; the others link to GitHub. No testimonials, customers, metrics or employment history exist; do not fabricate.

## Product Principles

1. Real work over decoration: every project shows true facts from its repo.
2. The effect serves the visit: the style may be playful, but a recruiter must reach a project's details in two clicks.
3. Never claim what the repos do not show.
