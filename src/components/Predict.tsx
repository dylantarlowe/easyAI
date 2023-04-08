import React, { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { HiOutlineDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BsArrowRight } from "react-icons/bs";

type Props = {};

const Predict = (props: Props) => {
  const [file, setFile] = useState<any>();

  const { data: session, status } = useSession();

  const handlePredict = async () => {
    console.log(file);

    let formData = new FormData();
    formData.append("file", file[0]);
    const email = session?.user?.email?.toString();
    if (email && email.length > 0) {
      formData.append("user", email);
    } else return;

    const res = await axios({
      method: "post",
      url: "https://liamkyoung.live/predict",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleDownload = async () => {
    const res = await axios({
      method: "get",
      url: "https://liamkyoung.live/download",
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return (
    <div className="h-60 rounded-sm bg-white py-4 px-8 space-y-2">
      <div>
        <p className="text-base pb-1 text-gray-400">Predict with your model</p>
        <p className="text-xs text-gray-400">
          Upload a photo to discover the species of elephant
        </p>
      </div>
      <div className="w-full text-gray-400">
        <Dropzone file={file} setFile={setFile} />
      </div>
      {/* two buttons covering width in row */}
      <div className="flex flex-row justify-between pt-3 px-4 space-x-4">
        <button
          onClick={() => handleDownload()}
          className="bg-blue text-white text-xs rounded-md p-2 w-1/2"
        >
          <HiOutlineDownload size={12} className="inline-block mr-1.5" />
          Download
        </button>
        <button
          onClick={() => handlePredict()}
          className="bg-emerald-500 text-white text-xs rounded-md p-2 w-1/2"
        >
          Predict
          <BsArrowRight size={12} className="inline-block ml-1.5" />
        </button>
      </div>
    </div>
  );
};

export default Predict;
