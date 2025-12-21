"use client";

import { LandingSections } from "@/config/sections";

export default function LandingPage() {
  return (
    <main>
      {LandingSections.map((Section, index) => (
        <Section key={index} />
      ))}
    </main>
  );
}


// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { tokenService } from "@/services/auth/token.service";

// export default function Home() {
//   const { access } = tokenService.get();
//   const accessToken = access;
//   console.log("first")
//   console.log(accessToken)
//   // const cookieStore = await cookies();
//   // const accessToken = cookieStore.get("access_token");

//   const isLoggedIn = !!accessToken;

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

//       <h1 className="text-4xl font-bold mb-6">Welcome to Our Website</h1>
//       <p className="text-lg text-gray-600 mb-10">
//         A simple landing page with auth-aware navigation.
//       </p>

//       <div className="flex gap-4">

//         {/* Show Login/Register if NOT logged in */}
//         {!isLoggedIn && (
//           <>
//             <Button asChild>
//               <Link href="/auth/login">Login</Link>
//             </Button>

//             <Button asChild variant="secondary">
//               <Link href="/auth/register">Register</Link>
//             </Button>
//           </>
//         )}

//         {/* Show Dashboard/Logout if logged in */}
//         {isLoggedIn && (
//           <>
//             <Button asChild>
//               <Link href="/auth/dashboard">Dashboard</Link>
//             </Button>

//             <Button asChild variant="destructive">
//               <Link href="/auth/logout">Logout</Link>
//             </Button>
//           </>
//         )}

//       </div>
//     </main>
//   );
// }
