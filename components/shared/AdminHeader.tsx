"use client";

import classNames from "classnames";
import { Dispatch, SetStateAction } from "react";
import { BsList } from "react-icons/bs";

const AdminHeader = ({
  toggleCollapse,
  setToggleCollapse,
}: {
  toggleCollapse: boolean;
  setToggleCollapse: Dispatch<SetStateAction<boolean>>;
}) => {
  const headerStyle = classNames(
    "fixed top-0 w-full z-20 px-4 shadow-md bg-[#31353d] transition-all duration-300",
    {
      "sm:pl-[20rem]": !toggleCollapse,
      "sm:pl-[5.6rem]": toggleCollapse,
    }
  );

  return (
    <header className={headerStyle}>
      <div className="flex items-center justify-between h-16">
        <button
          onClick={() => setToggleCollapse(!toggleCollapse)}
          className="rounded-full bg-[#3a3f48] p-2 text-[#6e768e] hover:bg-[#4a4f58] hover:text-white transition-all"
        >
          <BsList size={20} />
        </button>

        <div className="h-10 w-10 rounded-full bg-[#3a3f48] flex items-center justify-center text-center text-white font-semibold">
          AD
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
