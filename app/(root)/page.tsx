import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Collection from "@/components/shared/Collection";
import { getAllEvents } from "@/lib/actions/event.actions";
import Typewriter from "./TypeEffect";
import Search from "@/components/shared/Search";
import { SearchParamProps } from "@/types";
import CategoryFilter from "@/components/shared/CategoryFilter";

export default async function Home({ searchParams }: SearchParamProps) {
	const page = Number(searchParams?.page) || 1;
	const searchText = (searchParams?.query as string) || "";
	const category = (searchParams?.category as string) || "";
	const events = await getAllEvents({
		query: searchText,
		category,
		page,
		limit: 6,
	});

	const words = ["Build", "Connect!", "Celebrate!!"];

	return (
		<>
			<section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
				<div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
					<div className="flex flex-col justify-center gap-8">
						<h1 className="text-6xl font-bold">
							<Typewriter words={words} />
						</h1>

						<h2 className="h2-bold">Your Events, Our Platform!</h2>
						<p className="p-regular-20 md:p-regular-24">
							Transform your events with ease on our all-in-one platform.
							Connect and celebrate with a global community. Your perfect event,
							effortlessly managed.
						</p>
						<Button
							size="lg"
							asChild
							className="button w-full sm:w-fit scale-80 bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500 hover:scale-125">
							<Link href="#events">Explore Now</Link>
						</Button>
					</div>
					<Image
						src="/assets/images/event1.png"
						alt="hero"
						width={1000}
						height={1000}
						className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
					/>
				</div>
			</section>

			<section
				id="events"
				className="wrapper my-8 flex flex-col gap-8 md:gap-12">
				<h1 className="h1-bold">
					Trust By <br /> Thousands of Events{" "}
				</h1>
				<div className="flex w-full flex-col gap-5 md:flex-row">
					<Search />
					<CategoryFilter />
				</div>
				<Collection
					data={events?.data}
					emptyTitle="No Events Avaliable"
					emptyStateSubtext="Come Back Later"
					collectionType="All_Events"
					limit={6}
					page={page}
					totalPages={events?.totalPages}
				/>
			</section>
		</>
	);
}
