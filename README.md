This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Installation Process

# Next.js Project Setup Guide

This document explains how to install and set up a **Next.js application** with the following configuration:

- TypeScript: ❌ No  
- Linter: ✅ ESLint  
- React Compiler: ❌ No  
- Tailwind CSS: ✅ Yes  
- `src/` directory: ✅ Yes  
- App Router: ✅ Yes  
- Import Alias: ❌ No  

---

## 📦 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)

Check versions:
```bash
node -v
npm -v
```

## 🚀 Create Next.js Project

Run the following command:

```bash

npx create-next-app@latest my-next-app

```

## During setup, choose exactly these options:

```bash

✔ TypeScript? → No
✔ ESLint? → Yes
✔ Use React Compiler? → No
✔ Use Tailwind CSS? → Yes
✔ Use `src/` directory? → Yes
✔ Use App Router? → Yes
✔ Customize import alias? → No

```

## After installation, move into the project directory:

```bash

cd my-next-app

```

## ▶️ Start Development Server

Run the development server:

```bash

npm run dev

```

## Open your browser and visit:

http://localhost:3000

## 📁 Project Structure (Overview)

```bash
my-next-app/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   └── components/
├── public/
├── package.json
└── README.md

```

# shadcn/ui Installation Guide (Next.js – JavaScript)

This guide explains how to install and configure **shadcn/ui** in a **Next.js App Router project** using **JavaScript (no TypeScript)** and **Tailwind CSS**.

---

## 📦 Prerequisites

Make sure your project already has:

- Next.js (App Router)
- Tailwind CSS installed and working
- `src/` directory enabled
- Node.js v18 or later

Verify Tailwind is working by checking `src/app/globals.css`:

```css
@import "tailwindcss";

🚀 Step 1: Initialize shadcn/ui

Run the following command in your project root:

npx shadcn@latest init


You will be prompted with questions.
Choose exactly these options 👇


✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS config. Found v4.
✔ Validating import alias.
√ Which color would you like to use as the base color? » Neutral
✔ Writing components.json.
✔ Checking registry.
✔ Updating CSS variables in src\app\globals.css
✔ Installing dependencies.
✔ Created 1 file:
  - src\lib\utils.js
  
📁 Resulting Folder Structure

After setup, you will have:

src/
├── app/
│   └── globals.css
├── components/
│   └── ui/
│       ├── button.jsx
│       ├── card.jsx
│       └── ...
├── lib/
│   └── utils.js

🧠 Utility Function (cn)

shadcn/ui uses a utility function for class merging.

File created automatically:

// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

🧪 Step 2: Test Installation

Add a button to src/app/page.js:

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button>shadcn is working 🚀</Button>
    </main>
  );
}


Run the app:

npm run dev


If the button appears styled → ✅ installation successful.

➕ Adding New Components

To add a component:

npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog


Components will be added to:

src/components/ui/
```

```bash
📦 Life_hub_frontend-Project-Structure
│
├── public/                            # Static public assets (served directly)
│   ├── assets/
│   │   └── images/
│   │       └── logo.png               # Application logo
│   ├── file.svg               # Generic SVG asset
│   ├── globe.svg              # Decorative SVG
│   ├── next.svg               # Next.js default asset
│   ├── vercel.svg             # Vercel branding asset
│   ├── window.svg             # UI/illustration asset
│
├── src/
│   │
│   ├── app/                           # ✅ Next.js App Router (routing system)
│   │
│   │   ├── (root)/                    # Route group (no URL impact)
│   │   │   ├── auth/                  # Authentication routes
│   │   │   │   ├── change_password/
│   │   │   │   │   └── page.jsx            # Change password (logged-in user)
│   │   │   │   │
│   │   │   │   ├── forgot_password/
│   │   │   │   │   └── page.jsx            # Forgot password page
│   │   │   │   │
│   │   │   │   ├── login/
│   │   │   │   │   └── page.jsx            # Login page
│   │   │   │   │
│   │   │   │   ├── register/
│   │   │   │   │   └── page.jsx            # Register page
│   │   │   │   │
│   │   │   │   ├── reset_password/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── [token]/
│   │   │   │   │           └── page.jsx    # Reset password (dynamic route)
│   │   │   │   │
│   │   │   │   └── layout.jsx             # Shared auth layout (logo, background, card)
│   │   │   └── page.jsx               # Landing / Home page
│   │   │
│   │   ├── dashboard/                 # Protected dashboard routes
│   │   │   ├── profile/
│   │   │   │   └── page.jsx            # User profile page
│   │   │   │
│   │   │   ├── travelspots/            # TravelSpot CRUD routes
│   │   │   │   ├── create/
│   │   │   │   │   └── page.jsx            # Create form
│   │   │   │   │
│   │   │   │   ├── edit/
│   │   │   │   │   └── [id]/            
│   │   │   │   │       └── page.jsx        # Edit form
│   │   │   │   │
│   │   │   │   ├── view/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.jsx        # View Details
│   │   │   │   │
│   │   │   │   └── page.jsx                # Listing page
│   │   │   │
│   │   │   ├── page.jsx                # Dashboard home
│   │   │
│   │   │
│   │   ├── favicon.ico                # Browser tab icon
│   │   ├── globals.css                # Global styles (reset, base typography)
│   │   ├── layout.jsx                 # Root layout (wrapping entire app)
│   │   └── page.jsx                   # Root entry page
│   │
│   ├── components/                    # Reusable UI & layout components
│   │   ├── Application/
│   │   │   ├── ButtonLoading.jsx       # Loading button component
│   │   │   ├── GlobalSnackbarRenderer.jsx # Snackbar mount point
│   │   │   ├── Logo.jsx                # App logo component
│   │   │   ├── PopupMenu.jsx           # User menu dropdown
│   │   │   └── SnackBar.jsx            # Snackbar UI
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.jsx     # Dashboard wrapper logic
│   │   │   ├── Header.jsx              # Dashboard header
│   │   │   └── Sidebar.jsx             # Dashboard sidebar navigation
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx           # Generic app layout
│   │   │   ├── DashboardLayout.jsx     # Dashboard layout abstraction
│   │   │   └── LandingLayout.jsx       # Public landing layout
│   │   │
│   │   ├── sections/                  # Landing page sections
│   │   │   ├── FeaturesSection.jsx     # Features list
│   │   │   ├── FooterSection.jsx       # Footer
│   │   │   ├── HeroSection.jsx         # Hero banner
│   │   │   ├── NavbarSection.jsx       # Navbar
│   │   │   └── PricingSection.jsx      # Pricing plans
│   │   │
│   │   ├── travelspots/               # TravelSpot specific components
│   │   │   └── TravelSpotActions.jsx  # Action buttons (edit/delete/view)
│   │   │   ├── TravelSpotCard.jsx     # Card view component
│   │   │   ├── TravelSpotForm.jsx     # Reusable form component
│   │   │   ├── TravelSpotTable.jsx    # Listing table component
│   │
│   │   └── ui/                         # Low-level UI primitives (shadcn-style)
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── form.jsx
│   │       ├── input.jsx
│   │       └── label.jsx
│   │
│   ├── config/                        # App configuration files
│   │   ├── sections.js                # Landing sections config
│   │   └── theme.js                   # Theme variables
│   │
│   ├── context/                       # React Context providers
│   │   └── SnackbarContext.jsx        # Snackbar global context
│   │
│   ├── lib/                           # Helper libraries
│   │   └── validations/
│   │   │   └── travelspotSchema.js    # Zod validation schemas
│   │   │    
│   │   ├── utils.js                   # Utility functions
│   │   └── zodSchema.js               # Zod validation schemas
│   │
│   ├── redux/                         # Redux Toolkit setup
│   │   └── store.js                   # Redux store configuration
│   │
│   ├── routes/                        # Route constants
│   │   └── routes.constants.js        # Centralized route names
│   │
│   ├── services/                      # API & business logic layer
│   │   ├── api/
│   │   │   ├── authApi.js              # Auth RTK Query endpoints
│   │   │   ├── baseQueryWithReauth.js  # Token refresh logic
│   │   │   └── travelspotApi.js       # TravelSpot API endpoints
│   │   │
│   │   └── auth/
│   │       ├── auth.service.js         # Auth helpers
│   │       └── token.service.js        # Token storage & handling
│   │
│   ├── styles/                        # CSS Modules (scoped styles)
│   │   ├── auth/                      # Auth-related styles
│   │   │   ├── AuthBase.module.css     # Shared auth styles
│   │   │   ├── Login.module.css        # Login-specific styles
│   │   │   ├── Register.module.css     # Register-specific styles
│   │   │   ├── ForgotPassword.module.css
│   │   │   └── ResetPassword.module.css
│   │   │
│   │   ├── common/               # Common styles
│   │   │   └── Listing.module.css
│   │   │
│   │   ├── travelspots/               # TravelSpot styles
│   │   │   ├── TravelSpotList.module.css
│   │   │   ├── TravelSpotForm.module.css
│   │   │   └── TravelSpotView.module.css
│   │   │
│   │   ├── dashboard.module.css        # Dashboard page styles
│   │   ├── profile.module.css          # Profile page styles
│   │   └── settings.module.css         # Settings page styles
│   │
│   └── middleware.js                  # Route protection (auth middleware)
│
├── .gitignore                         # Git ignored files
├── README.md                          # Project documentation
├── components.json                   # UI components config
├── eslint.config.mjs                  # ESLint rules
├── jsconfig.json                     # Absolute imports config
├── next.config.mjs                   # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
├── package.json                      # Dependencies & scripts
└── package-lock.json                 # Locked dependency versions
```