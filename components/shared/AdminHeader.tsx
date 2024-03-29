import { Dispatch, SetStateAction } from "react";
import { BsList } from "react-icons/bs";
export default function AdminHeader({ toggleCollapse, setToggleCollapse }: { toggleCollapse: boolean, setToggleCollapse: Dispatch<SetStateAction<boolean>> }) {
	const sideBarToggle = () => {
		setToggleCollapse(!toggleCollapse)
	}
	return (
		<header className="fixed bg-[#31353d] w-full z-0 px-4 shadow-sm shadow-slate-500/40 pl-[20rem]">
			<div className="flex items-center justify-between h-16">
				<button
					onClick={sideBarToggle}
					className="bg-[#3a3f48] text-[#6e768e] hover:bg-white ml-3 rounded-full w-10 h-10 flex items-center justify-center">
					<BsList />
				</button>
				<div className="h-10 w-10 rounded-full bg-[#3a3f48] flex items-center justify-center text-center  ">
					<span className="font-semibold text-sm">SR</span>
				</div>
			</div>
		</header>
	);
}
