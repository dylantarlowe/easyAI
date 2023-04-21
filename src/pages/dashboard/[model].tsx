import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import YourModel from "@/components/YourModel";
import Predict from "@/components/Predict";
import Visualizations from "@/components/Visualizations";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/mongo/db";
import { Session } from "inspector";

type Props = {
  session: any;
  userInfo: any;
};

const Dashboard = ({ session, userInfo }: Props) => {
  const router = useRouter();
  let { model } = router.query;
  const [loading, setLoading] = useState(true);
  model = model?.toString();

  useEffect(() => {
    if (session) {
      console.log(session);
    }
    if (userInfo) {
      console.log(userInfo);
    }
  }, [loading]);

  return (
    <div className="flex bg-gray-50">
      <Sidebar models={userInfo.models} />
      <div className="flex flex-col w-5/6 px-20 py-6 space-y-4">
        <p className="text-2xl text-gray-600 pl-8">{model}</p>
        {/* <button onClick={() => handleClick()}>Test</button> */}
        <div className="flex flex-row justify-even space-x-6  w-full">
          <div className="w-3/5 flex flex-col space-y-6">
            <Predict
              userId={userInfo._id}
              modelId={model}
              task={model && userInfo.models[model].task}
            />
            <Visualizations />
          </div>
          <YourModel
            metrics={model && userInfo.models[model].metrics}
            task={model && userInfo.models[model].task}
          />
        </div>
      </div>
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
  const client = await connectToDatabase();
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

export default Dashboard;
