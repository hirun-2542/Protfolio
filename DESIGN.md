---
name: Hirun Kongpetch Portfolio
description: A vinyl-toy desk diorama on a cobalt wall. Five small-business systems stand on one desk, and a night-navy panel opens beside the one you pick.
colors:
  toy-yellow: "#ffd977"
  yellow-foot: "#a98225"
  wall-cobalt: "#2a4fbe"
  deep-cobalt: "#16286f"
  night-navy: "#101a3d"
  cream-tag: "#fdfbf4"
  mist-text: "#dbe4ff"
  soft-label: "#93a7e6"
  panel-edge: "#24326b"
  ghost-edge: "#46589c"
  chip-fill: "#16224c"
  chip-edge: "#3b4d92"
  birch-desk: "#f2dbae"
  dorm-gold: "#f0bd4a"
  food-red: "#d9483a"
  repair-orange: "#e8792c"
  barber-periwinkle: "#8fa6ef"
  queue-mint: "#4fb9a3"
typography:
  display:
    fontFamily: "Baloo 2, Trebuchet MS, sans-serif"
    fontSize: "62px"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Baloo 2, Trebuchet MS, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Baloo 2, Trebuchet MS, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Rubik, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Baloo 2, Trebuchet MS, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  dot: "3px"
  chip: "8px"
  button: "12px"
  sheet: "18px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "26px"
  panel-x: "38px"
  page-inset: "62px"
components:
  tag-chip:
    backgroundColor: "{colors.cream-tag}"
    textColor: "#131c40"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "7px 13px 8px 9px"
  button-primary:
    backgroundColor: "{colors.toy-yellow}"
    textColor: "{colors.night-navy}"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "11px 20px 12px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#e7edff"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "11px 20px 12px"
  button-github:
    backgroundColor: "#14225c"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "8px 16px 9px"
  button-close:
    backgroundColor: "#18254f"
    textColor: "#d3ddff"
    rounded: "{rounded.chip}"
    height: "30px"
    padding: "0 11px"
  stack-chip:
    backgroundColor: "{colors.chip-fill}"
    textColor: "#cdd9ff"
    rounded: "{rounded.chip}"
    padding: "5px 11px 6px"
  back-pill:
    backgroundColor: "{colors.cream-tag}"
    textColor: "{colors.night-navy}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "9px 16px 10px 12px"
  panel:
    backgroundColor: "{colors.night-navy}"
    textColor: "#eef2ff"
    padding: "34px 38px 40px"
---

# Design System: Hirun Kongpetch Portfolio

## Overview

**Creative North Star: "The Shopkeeper's Desk"**

The whole site is one desk, seen the way you would look at a friend's workspace: a birch tabletop in front of a saturated cobalt wall, with a monitor at the back and five small objects standing on it. Each object is a shop the owner built a system for: a room-key tag and apartment block for dorm billing, a shabu pot with a QR tent for restaurant ordering, a toolbox with a phone for repair tickets, a barber pole for bookings, a ticket dispenser for queues. Choosing an object is the navigation. The camera flies to it, the monitor shows that project's real screenshot, and a panel opens on the right with the details.

The material is soft vinyl toy plastic: rounded geometry, gentle roughness, one window light with a long soft shadow. Everything pressable in the 2D layer borrows that material. Buttons stand on a solid colored foot, chips are pill-shaped and cream like a price tag, the panel is a flat night-navy slab. Color is committed: the wall is a full-field cobalt, and the one warm accent (toy yellow) is kept for the things you can act on.

The owner rejected an earlier quiet, white-paper, no-shadow, no-radius monograph look. This system is its opposite: saturated, dimensional, and tactile. Do not drift back toward flat paper, hairline dividers, or text-only layouts.

**Key Characteristics:**
- One 3D desk is the page; HTML only labels and explains it.
- Cobalt wall field, birch desk, primary-color toy objects.
- Raised plastic controls with a hard colored foot.
- A navy side panel for reading; a bottom sheet on mobile.
- Camera moves are the transitions. There are no page loads.

## Colors

A committed cobalt field with a single warm accent, plus five small colors that each belong to exactly one project.

### Primary
- **Toy Yellow** (#ffd977): The action and emphasis color. Fills the primary button, colors the role line under the name and each project's tagline, and draws focus rings. Its foot, **Yellow Foot** (#a98225), is the darker tone under the button.

### Secondary
- **Wall Cobalt** (#2a4fbe): The wall field, as a CSS value; the 3D wall uses a near-identical #2c4fc4. It is the surface the identity text sits on and the largest color on the screen.
- **Deep Cobalt** (#16286f): The page background behind the canvas and the loading and error ground.

### Tertiary
- **Dorm Gold** (#f0bd4a), **Food Red** (#d9483a), **Repair Orange** (#e8792c), **Barber Periwinkle** (#8fa6ef), **Queue Mint** (#4fb9a3): One per project. Each appears only on that project's desk object, its tag dot, and its selection glow ring on the desk.

### Neutral
- **Night Navy** (#101a3d): The panel background and the text color on cream tags and yellow buttons.
- **Cream Tag** (#fdfbf4): Project tags and the back pill, like a price tag on the toy.
- **Mist Text** (#dbe4ff): Panel body copy on Night Navy (13.4:1).
- **Soft Label** (#93a7e6): Small section labels in the panel (7.2:1).
- **Panel Edge** (#24326b): The 1px line between the scene and the panel.
- **Ghost Edge** (#46589c): The outline on the secondary button.
- **Chip Fill** (#16224c) and **Chip Edge** (#3b4d92): The stack chips.
- **Birch Desk** (#f2dbae): The tabletop's base tone in the wood texture.

### Named Rules

**The Own-Color Rule.** A project color is used only for that project. If a color shows up on a second project's object, tag or glow, it stops meaning anything.

**The One Warm Voice Rule.** Toy Yellow is the only warm color in the 2D layer, and it always marks something to press or read first. Do not use it for decoration.

## Typography

**Display Font:** Baloo 2 (with Trebuchet MS, sans-serif)
**Body Font:** Rubik (with Helvetica Neue, Arial, sans-serif)

**Character:** Baloo 2 is round, heavy and friendly, like lettering on a toy box. Rubik is plain and slightly rounded so long project copy stays readable. Both are self-hosted variable files.

### Hierarchy
- **Display** (800, 62px, 0.9 line-height, -0.015em): The owner's name on the wall, white. Two lines: "Hirun / Kongpetch".
- **Headline** (800, 40px, 1.02): The project name at the top of the panel; 32px on mobile.
- **Title** (700, 17px, 1.25): Buttons, previous/next names, tag chips (16px), stack chips (600, 14.5px).
- **Body** (Rubik 400, 16px, 1.62): Panel summary and highlights (15.5px). Keep the panel measure near the 460px column.
- **Label** (Baloo 2 700, 14px, 0.14em, uppercase): The "What it does" and "Stack" section labels in the panel, in Soft Label; the role line under the name is the same treatment at 17px in Toy Yellow, tracked 0.13em.

### Named Rules

**The Two Voices Rule.** Baloo 2 names things and labels controls. Rubik explains. Never set a paragraph in Baloo 2 or a button in Rubik.

## Layout

The page is a single fixed full-viewport canvas with HTML laid over it. The identity block sits top-left (62px from the left, 54px from the top, 356px wide). Project tags are pinned to projected 3D anchor points on each object with a thin leader line, and are nudged apart so they never overlap. The panel is fixed to the right edge at min(460px, 42vw), full height.

When a project is picked, the camera does not just zoom: the rendered image is also shifted left by half the panel's width, so the object and the monitor that shows its screenshot sit centered in the space the panel leaves free. The camera backs off until both fit that remaining width. Identity text and the other tags step back; only the selected tag stays.

Compact layout (windows narrower than 1180px, shorter than 880px, or squarer than 1.45:1): the title moves to a row across the top (name at 48px with the role beside it, one-line summary, GitHub pill) and the desk is refit into the strip below it, so the title never sits on top of the scene. The desk scales with window height and the title does not; that mismatch is why the side-by-side layout only holds on tall, wide windows.

Below 760px the layout becomes a column: a 286px-tall desk strip, the identity block, then a plain list of the five projects. The panel becomes a bottom sheet (78vh, 18px top corners). Spacing is a loose 8px rhythm (8, 12, 16, 26, 38) inside the panel and generous 54 to 62px margins around the identity block.

## Elevation & Depth

Depth is real in the scene (a window light with soft shadow maps, rounded geometry, contact glow rings) and borrowed in the 2D layer.

### Shadow Vocabulary
- **Button foot** (`box-shadow: 0 5px 0 #a98225`, primary; `0 6px 0 #0b1640`, GitHub pill): A hard solid offset in a darker tone of the button's own color. Hover raises the button 2px and lengthens the foot by 2px.
- **Tag lift** (`box-shadow: 0 7px 16px rgba(6, 14, 46, 0.32)`): A soft drop under cream tags; on hover or selection it grows to `0 11px 22px rgba(6, 14, 46, 0.4)` and the tag rises 3px and scales to 1.04.

### Named Rules

**The Raised Plastic Rule.** Pressable things stand up and rise on hover; they never sink or fade. The panel itself is flat: it is a slab, not a card, and has no shadow, only a 1px Panel Edge line.

## Shapes

Round and toy-like, in four sizes. Tags, the back pill and the GitHub pill are full pills (999px). Buttons are 12px, chips and the close button 8px, color dots 3px. The mobile sheet rounds its top corners at 18px. The 3D objects use rounded boxes throughout; there are no sharp-cornered solids on the desk except the room itself.

## Components

### Tag Chip
Character: a cream price tag tied to a toy.
- **Shape:** full pill, 7px 13px 8px 9px padding, 2px transparent border.
- **Color:** Cream Tag fill, #131c40 text (16:1), Baloo 2 700 16px, with a 11px rounded-square dot in the project color.
- **Hover / selected:** lifts 3px, scales 1.04, border takes the project color, shadow grows. The matching desk object lifts 0.05 units and its glow ring appears.
- **Focus:** 3px Toy Yellow outline, 3px offset.

### Buttons
Character: a raised plastic key.
- **Primary:** Toy Yellow fill, Night Navy text (12.5:1), 12px radius, 11px 20px 12px padding, 5px Yellow Foot. Hover: up 2px, foot 7px.
- **Ghost (secondary):** transparent with a 2px Ghost Edge inset ring; hover brightens the ring to #7a8ed8.
- **GitHub pill:** #14225c fill, white text, pill shape, 6px #0b1640 foot, used for the single GitHub link under the identity block.
- **Focus:** 3px white outline, 3px offset (Toy Yellow on the dark pill).

### Close and Back
- **Close:** 30px tall, 8px radius, #18254f fill with a #35478c border, 13px Baloo 2 600 label "Close", top-right of the panel.
- **Back to the desk:** cream pill with a chevron, top-left over the scene, shown only while a project is open.

### Stack Chips
Rounded-rectangle labels (8px) on Chip Fill with a 1px Chip Edge, Baloo 2 600 14.5px, in #cdd9ff.

### Project Panel (signature)
Character: the spec sheet that slides in from the right.
- Night Navy slab, 1px Panel Edge on the left, 34px 38px 40px padding, scrolls on its own and traps scroll chaining.
- Order: Close, name (Headline), tagline in Toy Yellow, the buttons (Open project page or live demo when a page exists, GitHub repository) so the actions are visible without scrolling, then the summary, a "What it does" list with 9px rounded-square bullets in #4d6bd8, a "Stack" row of chips, and a previous/next row separated by a 1px #2a3a78 line.
- Slides in 500ms with `cubic-bezier(.2, .8, .2, 1)`; hidden state is inert and invisible.

### Desk Objects and Monitor (signature)
Five hand-built vinyl-toy objects, one per project, and a monitor that shows the selected project's real screenshot (a title card when nothing is selected). A framed photo of the owner leans on the desk and stands up, turns to face the pointer and catches a glint when hovered; a tap or click locks it.

## Do's and Don'ts

### Do:
- **Do** keep the 3D desk as the page. New content opens in the panel or on the monitor, not as a new scrolling section.
- **Do** give each pressable a solid foot in a darker tone of its own color, and raise it on hover.
- **Do** keep Toy Yellow to actions, taglines and focus rings.
- **Do** use a project's color only for that project's object, dot and glow ring.
- **Do** make every camera move 850ms ease-in-out and every panel move 500ms, and make both instant under `prefers-reduced-motion`.
- **Do** keep body copy at 16px or larger on Night Navy with at least 4.5:1 contrast.

### Don't:
- **Don't** return to the rejected white-paper monograph: no hairline dividers, no flat text-only layout, no zero-radius everything.
- **Don't** replace the desk with a card grid or a scrolling list of project cards. The mobile project list is a fallback, not the design.
- **Don't** put a soft blurred shadow under buttons or a hard foot under the panel. Hard feet are for pressables; soft shadows are for tags.
- **Don't** use a gradient, glow or glass for UI chrome. Light comes from the scene.
- **Don't** use a second warm accent next to Toy Yellow.
- **Don't** invent contact details, metrics or screenshots. Every claim comes from the project's repo.
