import React from "react";
import Lottie from "lottie-react";
import loading from "@/images/loading.json";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="w-full h-screen flex flex-col justify-start items-center px-10">
      <div>
        <Lottie
          loop={true}
          autoplay={true}
          animationData={loading}
          height={200}
          width={200}
          className="-mb-20"
        />
      </div>
      <p className="text-xl pb-2">Hang tight</p>
      <p className="">Your model is on its way</p>
    </div>
  );
};

export default Loading;
