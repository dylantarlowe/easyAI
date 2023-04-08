import React from "react";
import ComingSoon from "@/images/coming-soon.json";
import Lottie from "lottie-react";
import { BsRocketTakeoff, BsArrowRight } from "react-icons/bs";

type Props = {};

const Visualizations = (props: Props) => {
  return (
    <div className="h-56 rounded-sm bg-white py-4 px-8 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-base text-gray-400">Your visualizations </p>
        <button className="bg-emerald-50 text-emerald-500 text-xs rounded-md py-2 px-3">
          Discover
          <BsArrowRight size={12} className="inline-block ml-1" />
        </button>
      </div>
      <p className="text-xs text-gray-400">
        See correlations in predicted data. All based on your trained model.
      </p>
      {/* create coming soon dotted box */}
      <div className="h-24 w-full mt-2 p-2 space-y-1.5 flex flex-col text-xs justify-center items-center border border-dashed border-gray-300 rounded">
        <BsRocketTakeoff size={20} className="text-gray-400" />
        <p className="text-gray-400 tracking-widest">coming soon...</p>
      </div>
    </div>
  );
};

export default Visualizations;
