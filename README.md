# HS-SIMS (High School Student Information Management System)

A Next.js Application for managing student records with temporal data handling.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI**: Tailwind CSS + shadcn/ui

## Features
1. **Temporal Data Management**: Tracks history of changes (Address, Name, etc.) with effective dates.
2. **Dual Name Support**: Toggles between Legal Name and Alias Name.
3. **Bulk Promotion**: Spreadsheet-like interface for year-end processing.
4. **Fast Search**: Client-side filtering for instant results.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Ensure you have a PostgreSQL database running. Update `.env` with your connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hs_sims?schema=public"
   ```

3. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Key Components
- `src/app/page.tsx`: Student Dashboard (KPIs & Search)
- `src/app/students/[id]/page.tsx`: Student Detail (Profile & Timeline)
- `src/app/promotion/page.tsx`: Bulk Promotion Interface
- `src/lib/prisma.ts`: Prisma Client Singleton

## Notes on Architecture
- **Data History**: Changes to critical fields are stored in `DataHistory` table. The UI displays the chronological timeline of these changes.
- **Year-End Logic**: The `/api/promotion` endpoint handles the logic of copying current Enrollments to the next Fiscal Year.
