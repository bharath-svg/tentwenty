# Ticktock Timesheet Management App

Frontend technical assessment for Tentwenty.

Built with Next.js, TypeScript, Tailwind CSS and Auth.js / NextAuth.

## Live Demo

`ADD_VERCEL_URL_HERE`

## Demo Login

```text
Email: john@ticktock.com
Password: password123
```

Authentication is intentionally implemented using dummy user data as requested in the assessment.

## Features

- Responsive login page
- Dummy authentication using Auth.js / NextAuth
- Protected dashboard routes
- Timesheet table
- Status filtering
- Date-range filtering
- Pagination
- Weekly timesheet detail view
- Add timesheet entry
- Edit timesheet entry
- Delete timesheet entry
- Form validation and error handling
- Loading and empty states
- Internal Next.js API routes
- Responsive layouts for mobile, tablet and desktop
- Basic component tests

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Auth.js / NextAuth
- Vitest
- React Testing Library

## Setup

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd tentwenty-timesheet
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
AUTH_SECRET=
```

Generate a local Auth.js secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Add the generated value:

```env
AUTH_SECRET=YOUR_GENERATED_SECRET
```

Then start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

`.env.example` is included in the repository:

```env
AUTH_SECRET=
```

The real `.env.local` file is ignored by Git and should never be committed.

Each developer or deployment environment should generate its own `AUTH_SECRET`.


## Internal API Routes

Client-side timesheet operations use internal Next.js API routes.

```text
GET    /api/timesheets
GET    /api/timesheets/:id
POST   /api/timesheets/:id/entries
PATCH  /api/timesheets/:id/entries/:entryId
DELETE /api/timesheets/:id/entries/:entryId
```

## Testing

Run the component tests:

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Assumptions / Notes

- Authentication uses mock credentials because the assessment requests dummy authentication.
- No database is used.
- Timesheet data is mocked locally.
- Add/Edit/Delete requests go through internal Next.js API routes.
- Mock mutations may reset when the server restarts because there is no persistent database.
- The supplied Figma mainly provides desktop designs, so responsive mobile/tablet behavior was implemented using standard responsive design practices.



## Submission

- GitHub repository: `ADD_GITHUB_URL_HERE`
- Working demo: `ADD_VERCEL_URL_HERE`