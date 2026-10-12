# PARKFLOW – Visitor Parking Management Prototype

A prototype for managing visitor parking in residential communities, with separate workflows for residents, security staff and administrators.

## Problem
Visitors often don't know where to park, and security staff have no single record of who is expected. I saw this in my own neighbourhood, and the same problem appears on Razorpay's Fix My Itch platform ("Why don't apartments use QR gates for visitor parking management?").

## What it does
- **Residents** create time-bound visitor passes; each pass gets a generated QR code.
- **Security staff** verify passes at the gate (scanning is simulated) and see active visitors.
- **Administrators** see occupancy, recent passes and parking activity.
- A **parking view** (`/parking`) shows each bay's status: available, reserved, occupied, overstay, blocked or under maintenance.

## How bay allocation works
Allocation runs in two stages (`src/services/parking-engine/rules.ts`):
1. **Hard requirements (filter):** the bay must be available, fit the vehicle size, and be accessible if the visitor needs accessibility.
2. **Preferences (score):** the remaining bays are ranked by preferred zone for the visitor category and distance from the gate. Preferences reorder bays but never override a requirement.

Exception: if an emergency visitor needs an accessible bay and none is free, the nearest available bay is assigned.

Before assigning a bay, the engine rejects duplicate vehicles, visitors and passes that already have an active assignment, and expires stale reservations.

The engine sits behind a strategy interface (`AllocationStrategy` in `src/services/parking-engine/allocator.ts`), so the rule set can be replaced without changing the rest of the app.

## Run locally
Requires Node.js 20 or later.

    npm install
    npm run dev

Open http://localhost:3000, go to the login page, and pick a role (Resident, Security or Admin). Login is demo-only; there is no real authentication.

## Limitations
- Prototype only; not deployed.
- All data is sample data held in memory, so it resets on reload. There is no backend or database.
- QR codes are generated, but gate scanning is simulated (no camera scanning).
- No automated tests.
- Sample testimonials, metrics and pricing are hidden from the landing page because they are not real feedback.

## Tech
Next.js, React, TypeScript, Tailwind CSS
