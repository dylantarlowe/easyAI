import React from "react";

type Props = {
  metrics: any;
};

const YourModel = ({ metrics }: Props) => {
  return (
    <div className="w-1/3 h-full bg-white rounded-sm space-y-3">
      <div className="flex flex-col p-5 space-y-3">
        <p className="text-base text-gray-400">Your model</p>
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">Accuracy</p>
          <p className="text-xs text-black">
            {metrics?.accuracy ? metrics.accuracy : "40"}%
          </p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">Datapoints</p>
          <p className="text-xs text-black">
            {metrics?.datapoints ? metrics.datapoints : "200"}
          </p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">Features</p>
          <p className="text-xs text-black">
            {metrics?.features ? metrics.features : "9"}
          </p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">Layers</p>
          <p className="text-xs text-black">
            {metrics?.layers ? metrics.layers : "2"}
          </p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
      </div>
      <div className="flex flex-col p-5 space-y-3">
        <p className="text-sm text-gray-400">Enhanced Performance Metrics</p>
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">True Positives</p>
          <p className="text-xs text-black">60</p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">True Negatives</p>
          <p className="text-xs text-black">23</p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">False Positives</p>
          <p className="text-xs text-black">9</p>
        </div>
        <div className="h-[.5px] w-full bg-gray-200" />
        <div className="flex flex-row justify-between ">
          <p className="text-xs text-gray-400">False Negatives</p>
          <p className="text-xs text-black">8</p>
        </div>
        <div className="h-[.25px] w-full bg-gray-100" />
      </div>
    </div>
  );
};

export default YourModel;
