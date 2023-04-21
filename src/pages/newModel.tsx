import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import {
  HiOutlinePhotograph,
  HiOutlineViewGrid,
  HiOutlineAdjustments,
} from "react-icons/hi";
import { CgDatabase } from "react-icons/cg";
import Dropzone from "@/components/Dropzone";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../lib/mongo/db";
import Loading from "@/components/Loading";

type Props = {
  session: any;
  userInfo: any;
};

const NewModel = ({ session, userInfo }: Props) => {
  const [selected, setSelected] = useState(0);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<any>();
  const [fileLink, setFileLink] = useState("");
  const [labels, setLabels] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (title === "") {
      alert("Please enter a title");
      return;
    }
    if (file === undefined) {
      alert("Please upload a dataset");
      return;
    }
    if (labels === "") {
      alert("Please enter labels");
      return;
    }

    let formData = new FormData();
    formData.append("projectID", title);
    if (selected === 0) formData.append("task", "Image Classification");
    else if (selected === 1) formData.append("task", "classification");
    else if (selected === 2) formData.append("task", "regression");
    formData.append("labels", labels);
    formData.append("file", file[0]);
    formData.append("fileLink", fileLink);
    setLoading(true);
    const res = await axios({
      method: "post",
      url: "https://liamkyoung.live/train/" + userInfo._id,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    setLoading(false);
    console.log(res);
    if (res.status === 200)
      router.push({
        pathname: "/dashboard/" + title,
      });
    else {
      alert("Error creating model");
    }
  };

  return (
    <div className="flex flex-row">
      <Sidebar models={userInfo.models} />

      {!loading ? (
        <div className="flex flex-col w-5/6 px-20 py-6 space-y-4">
          <p className="text-lg font-medium">Create New Model</p>
          <div className="flex">
            <div className="flex flex-1">
              {/* number 1 in grey circle */}
              <div className="mt-1 w-5 h-5 bg-gray-300 text-white rounded-full flex items-center justify-center">
                <p className="text-xs">1</p>
              </div>
              <div className="flex flex-col justify-start px-5 w-full">
                <p className="font-medium py-1">Model Title</p>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  className="focus:outline-gray-500 focus:outline-width-1 text-sm border-2 border-gray-300 rounded-md p-1"
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mt-1 w-5 h-5 bg-gray-300 text-white rounded-full flex items-center justify-center">
              <p className="text-xs">2</p>
            </div>
            <div className="flex flex-col justify-start px-5 w-full">
              <p className="font-medium py-1">
                What do you want us to do for you?
              </p>
              <div className="flex justify-even items-center space-x-6 text-gray-400">
                <div
                  onClick={() => setSelected(0)}
                  className={`flex flex-1 flex-col space-y-2 p-2 justify-center items-center text-center text-xs h-40 border-2 rounded ${
                    selected === 0 ? "border-gray-500" : "border-gray-200"
                  } cursor-pointer`}
                >
                  <HiOutlinePhotograph size={20} />
                  <p className="font-semibold">Image Classification</p>
                  <p>
                    Use our algorithm to categorize your images. Think
                    classifying the species of a bird.{" "}
                  </p>
                </div>
                <div
                  onClick={() => setSelected(1)}
                  className={`flex flex-1 flex-col space-y-2 p-2 justify-center items-center text-center text-xs h-40 border-2 rounded ${
                    selected === 1 ? "border-gray-500" : "border-gray-200"
                  } cursor-pointer`}
                >
                  <HiOutlineViewGrid size={20} />
                  <p className="font-semibold">Data Classification</p>
                  <p>
                    Classify your data to find binary meaning. For example,
                    classifying a type of molecule.
                  </p>
                </div>
                <div
                  onClick={() => setSelected(2)}
                  className={`flex flex-1 flex-col space-y-2 p-2 justify-center items-center text-center text-xs h-40 border-2 rounded ${
                    selected === 2 ? "border-gray-500" : "border-gray-200"
                  } cursor-pointer`}
                >
                  <HiOutlineAdjustments size={20} className="rotate-90" />
                  <p className="font-semibold">Regression</p>
                  <p>
                    Find the numerical meaning behind your data. Think home
                    prices related to square footage and location.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-1">
              <div className="mt-1 w-5 h-5 bg-gray-300 text-white rounded-full flex items-center justify-center">
                <p className="text-xs">3</p>
              </div>
              <div className="flex flex-col justify-start px-5 w-full">
                <p className="font-medium py-1 w-full">
                  Upload your dataset here:
                </p>
                <div className="flex">
                  <div className="flex-1 text-gray-400 p-1">
                    <Dropzone file={file} setFile={setFile} />
                  </div>
                  {/* <div className="w-1/2 m-1 flex flex-col h-24 text-xs justify-center items-center border border-dashed border-gray-300 rounded cursor-pointer">
                    <p className="text-xs text-gray-400 pb-1">
                      Paste a link to your dataset here:
                    </p>
                    <input
                      onChange={(e) => setFileLink(e.target.value)}
                      className="focus:outline-gray-500 focus:outline-width-1 text-sm border w-3/4 border-gray-300 rounded-md p-1"
                    />
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex flex-1 h-24">
              {/* number 4 in grey circle */}
              <div className="mt-1 w-5 h-5 bg-gray-300 text-white rounded-full flex items-center justify-center">
                <p className="text-xs">4</p>
              </div>
              <div className="flex flex-col justify-start px-5 w-full">
                <p className="font-medium py-1">Name of labels column</p>
                <input
                  onChange={(e) => setLabels(e.target.value)}
                  className="focus:outline-gray-500 focus:outline-width-1 text-sm border-2 border-gray-300 rounded-md p-1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end px-6">
            <button
              className="hover:bg-blue hover:text-white bg-blueBg text-blue text-sm rounded p-2 px-4"
              onClick={() => handleSubmit()}
            >
              Train &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-5/6 px-20 py-6 space-y-4">
          <Loading />
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const client: any = await connectToDatabase();
  const db = client.db("easyAI");
  const userInfoRaw = await db
    .collection("users")
    .findOne({ email: session.user?.email });

  const userInfo = JSON.parse(JSON.stringify(userInfoRaw));
  client.close();

  return {
    props: { session, userInfo },
  };
}

export default NewModel;
