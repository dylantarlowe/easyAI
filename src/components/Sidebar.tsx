import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/images/ai.svg";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";

type Props = {
  models: any;
};

const Sidebar = ({ models }: Props) => {
  const [colors, setColors] = useState([
    "blue",
    "green",
    "amber-500",
    "purple",
    "red-500",
  ]);
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, [loaded]);

  return (
    <div className="w-1/5 bg-[#07080a]">
      <button className="hidden text-blue border border-blue bg-blue/20"></button>
      <button className="hidden text-green border border-green bg-green/20"></button>
      <button className="hidden text-purple border border-purple bg-purple/20"></button>
      <button className="hidden text-amber-500 border border-amber-500 bg-amber-500/20"></button>
      <button className="hidden text-red-500 border border-red-500 bg-red-500/20"></button>
      <button className="hidden  border border-blue/30"></button>
      <button className="hidden border border-blue/50"></button>
      <button className="hidden  border border-green/30"></button>
      <button className="hidden border border-green/50"></button>
      <button className="hidden  border border-purple/30"></button>
      <button className="hidden border border-purple/50"></button>
      <button className="hidden  border border-amber-500/30"></button>
      <button className="hidden border border-amber-500/50"></button>
      <button className="hidden  border border-red-500/30"></button>
      <button className="hidden border border-red-500/50"></button>

      <div className="flex flex-col p-5 items-left h-screen space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <Image
            src={Logo}
            className="-ml-2"
            alt="logo"
            width={50}
            height={50}
          />
          {/* profile picture holder */}
          <div
            onClick={() => signOut()}
            className="w-6 h-6 flex justify-center items-center bg-slate-400 rounded-full cursor-pointer"
          >
            <AiOutlineUser />
          </div>
        </div>
        <p className="font-inter text-white pt-10">My Models</p>
        {models &&
          Object.values(models).map((model: any, i: number) => (
            <div key={i}>
              <button
                onClick={() => router.push("/dashboard/" + model.title)}
                className={`flex items-center justify-between h-10 w-full text-xs text-left px-4 text-${
                  colors[i % 5]
                } bg-${colors[i % 5]}/20 border rounded border-${
                  colors[i % 5]
                }`}
              >
                <p>{model.title}</p>
                {/* ripple circles inside each other with empty center */}
                <div
                  className={`w-4 h-4 relative border-2 border-${
                    colors[i % 5]
                  }/30 rounded-full`}
                >
                  <div
                    className={`w-3 h-3 relative border-2 border-${
                      colors[i % 5]
                    }/50 rounded-full`}
                  >
                    <div
                      className={`w-2 h-2 absolute border-2 border-${
                        colors[i % 5]
                      } rounded-full`}
                    ></div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        <button
          onClick={() => router.push("/newModel")}
          className={`h-10 w-full border border-dashed rounded border-white text-xs text-center px-4 text-white`}
        >
          + Add New Model
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
