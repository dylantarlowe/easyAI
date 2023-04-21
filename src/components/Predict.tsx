import React, { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { HiOutlineDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BsArrowRight } from "react-icons/bs";

type Props = {
  userId: string;
  modelId?: string;
  task?: string;
};

const Predict = ({ userId, modelId, task }: Props) => {
  const [file, setFile] = useState<any>();

  const { data: session, status } = useSession();

  const handlePredict = async () => {
    if (!file[0])
      return alert("Please upload a file to predict with your model.");
    let formData = new FormData();
    formData.append("file", file[0]);
    formData.append("projectID", modelId);

    const res = await axios({
      method: "post",
      url: "https://liamkyoung.live/predict/" + userId,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res);
    // create file in browser
    const fileName = modelId?.toLowerCase() + "_predictions";
    const blob = new Blob([res.data]);
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleDownload = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "https://liamkyoung.live/download/" + userId + "/" + modelId,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res);
      // create file in browser
      const fileName = modelId?.toLowerCase() + "_model";
      const blob = new Blob([res.data]);
      const href = URL.createObjectURL(blob);

      // create "a" HTLM element with href to file
      const link = document.createElement("a");
      link.href = href;
      link.download = fileName + ".h5";
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (err) {
      alert("Error downloading model" + err);
    }
  };

  return (
    <div className="h-60 rounded-sm bg-white py-4 px-8 space-y-2">
      <div>
        <p className="text-base pb-1 text-gray-400">Predict with your model</p>
        {task === "classification" && (
          <p className="text-xs text-gray-400">
            Upload data to classify {modelId?.toLowerCase()} with your model.
          </p>
        )}
        {task === "regression" && (
          <p className="text-xs text-gray-400">
            Upload data to learn trends about {modelId?.toLowerCase()} with your
            model.
          </p>
        )}
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
          <HiOutlineDownload size={12} className="inline-block mr-1" />
          Download Model
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
