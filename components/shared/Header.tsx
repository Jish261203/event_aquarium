import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
	return (
		<header
			className="w-full border-b"
			style={{
				background:
					"linear-gradient(135deg, #aad6ec, #151269, #0f1056, #113065)",
			}}>
			<div className="wrapper flex items-center justify-between">
				<Link href="/" className="w-36">
					<Image
						src="/assets/images/logo1.svg"
						width={128}
						height={38}
						alt="EventHub Logo"
					/>
				</Link>
				<SignedIn>
					<nav className="md:flex-between hidden w-full max-w-xs">
						<NavItems />
					</nav>
				</SignedIn>
				<div className="flex w-32 justify-end gap-3">
					<SignedIn>
						<UserButton afterSignOutUrl="/" />
						<MobileNav />
					</SignedIn>
					<SignedOut>
						<Button
							asChild
							className="relative rounded-full scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-150"
							size="lg">
							<Link href="/sign-up">Login</Link>
						</Button>
					</SignedOut>
				</div>
			</div>
		</header>
	);
};

export default Header;
