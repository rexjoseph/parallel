import { getServerSession } from "next-auth";
import Link from "next/link";
import SignInButton from "@/components/ui/SignInButton";
import { buttonVariants } from "@/ui/Button";
import SignOutButton from "@/components/ui/SignOutButton";
import ThemeToggle from "./ThemeToggle";
import { authOptions } from "@/lib/auth";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 z-50 top-0 left-0 right-0 h-20 shadow-sm flex items-center justify-between">
      <div style={{padding: "0"}} className="container max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          Parallel
        </Link>

        <div className="md:hidden">
          <ThemeToggle />
        </div>

        <div className="hidden md:flex gap-4">
          <ThemeToggle />
          <Link
            href="/documentation"
            className={buttonVariants({ variant: "ghost" })}
          >
            Documentation
          </Link>

          {session ? (
            <>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/prompt"
              >
                Start Jared
              </Link>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
