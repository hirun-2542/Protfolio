// Single source of truth for the projects. Add a project = add one object here, plus its 3D object in main.js.
export const PROJECTS = [
  {
    slug: 'wangchan-dorm',
    name: 'Wang Chan Dorm',
    tagline: 'Dorm billing for a single owner, from notebook to bills sent on their own.',
    summary: [
      'Enter the meter readings once and the whole dorm gets billed. Each bill goes out through LINE with a PromptPay QR for the exact amount, and closes itself when the tenant sends a transfer slip.',
      'Tenants install nothing and remember no password. They send a photo of the slip in the dorm chat.'
    ],
    highlights: [
      'Bills store the rates and meter readings of the day they were issued, so changing settings later never rewrites old bills.',
      'One slip closes exactly one bill; duplicate slips are rejected at the database level.',
      'Slips that fail are queued with a readable reason, and "rejected" is kept apart from "could not be checked".',
      'Invoice PDF with Thai fonts and an EMVCo-standard PromptPay QR.'
    ],
    stack: ['TypeScript', 'React', 'Hono', 'Cloudflare Workers'],
    repo: 'https://github.com/hirun-2542/wangchan-dorm-demo',
    demo: 'https://wangchan-demo.nodhk2545.workers.dev/welcome',
    demoLabel: 'Open project page',
    image: 'assets/wangchan-welcome.webp',
    alt: 'Wang Chan Dorm project page: "from notebook to bills sent for the whole dorm", with the create-bill screen for room A101'
  },
  {
    slug: 'foodqueue',
    name: 'FoodQueue',
    tagline: 'QR ordering for a single shabu / buffet restaurant.',
    summary: [
      'Customers scan the QR on the table and order from their phone. The kitchen sees each order instantly, and the owner manages tables, menu, bills, payments and reports from one screen.',
      'A demo mode opens every role with one click, with 30 days of sample data and a bot that places orders by itself.'
    ],
    highlights: [
      'The QR is bound to the seating session, not the table: valid until the bill closes, dead the moment it is paid.',
      'Time is judged by the restaurant clock, so a customer phone with the wrong time cannot cause a wrong rejection.',
      'Real-time table view over SignalR; runs locally with a single docker compose command.'
    ],
    stack: ['Next.js', 'ASP.NET Core', 'PostgreSQL', 'SignalR', 'Docker'],
    repo: 'https://github.com/hirun-2542/foodqueue',
    demo: null,
    image: 'assets/foodqueue3.png',
    alt: 'FoodQueue demo showing customer, kitchen and owner views side by side'
  },
  {
    slug: 'repairdesk',
    name: 'RepairDesk',
    tagline: 'Job tracking for repair shops, backed by a real database.',
    summary: [
      'One repair ticket walks a fixed path: received, diagnosing, quoted, approved, repairing, ready, completed. The system refuses any command that skips a step or acts on the wrong state, and gives declined quotes a way out.',
      'No mock backend. Every status on screen is data already saved in SQLite, with attachments on disk.'
    ],
    highlights: [
      'Role-based permissions and Auth.js sessions.',
      'Versioned quotations with 7% VAT.',
      'Customer tracking link and an audit log that cannot be edited.',
      'Unit tests with Vitest and end-to-end tests with Playwright.'
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma 7', 'SQLite', 'Tailwind CSS 4', 'Auth.js 5'],
    repo: 'https://github.com/hirun-2542/RepairDesk',
    demo: null,
    image: 'assets/repairdesk.png',
    alt: 'RepairDesk job board grouped by repair status'
  },
  {
    slug: 'barber-booking',
    name: 'Ash & Oak Barber',
    tagline: 'Appointment booking for a one-person barber shop.',
    summary: [
      'Customers pick a service and a slot that is actually free, then send a request. The owner sees the whole day on one page, approves requests, logs walk-ins and closes jobs.',
      'Both sides live in one front-end app with no backend. Open two tabs, one as customer and one as owner, and changes show up across them immediately.'
    ],
    highlights: [
      'Bookable times are computed from service duration, opening hours, breaks, buffer, minimum notice and closed days.',
      'Four-step booking flow, mobile-first, English and Thai.',
      'State in localStorage, synced between tabs.'
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    repo: 'https://github.com/hirun-2542/barber-booking',
    demo: null,
    image: 'assets/barber.png',
    alt: 'Customer booking screen and owner dashboard of the barber booking demo'
  },
  {
    slug: 'smartqueue',
    name: 'SmartQueue',
    tagline: 'Mobile-first queue management for shops with a single owner.',
    summary: [
      'Queue management built around QR entry and notifications, with SignalR pushing queue changes live to the phone.',
      'The back end is tested against real HTTP sessions, a real PostgreSQL and delivered emails in a local mailbox. Nothing is mocked or in-memory.'
    ],
    highlights: [
      '.NET 10 API with database migrations applied on startup.',
      'Playwright end-to-end tests run against a production build.'
    ],
    stack: ['C#', '.NET 10', 'PostgreSQL', 'SignalR', 'Playwright'],
    repo: 'https://github.com/hirun-2542/SmartQueue',
    demo: null,
    image: 'assets/smartqueue.png',
    alt: 'SmartQueue owner console showing queue ticket A003 being called and two waiting tickets'
  }
];
