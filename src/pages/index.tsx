import React, { useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "@/images/aiWhite.svg";
import { signIn } from "next-auth/react";
import { connectToDatabase } from "../../lib/mongo/db";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    //Validation
    if (!email || !email.includes("@") || !password) {
      alert("Invalid username or password");
      return;
    }

    const status = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    // get user info from mongodb
    const res = await fetch("/api/mongo/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const user = await res.json();

    if (status && status.ok) {
      const models: any = Object.values(user.existingUser.models);
      if (user.existingUser.models === null) router.push("/newModel");
      else router.push("/dashboard/" + models[0].title);
    } else if (status && !status.ok) alert("Invalid username or password");
    else console.log("no idea");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen px-8 space-y-6">
      <div className="flex space-x-6">
        <Image src={Logo} width={70} height={70} alt="logo" />
        <div>
          <p className="text-2xl">Machine Learning.</p>
          <p className="text-2xl">But easy.</p>
        </div>
      </div>
      <div className="flex flex-col justify-start w-1/2">
        <div className="flex flex-row justify-start items-baseline space-x-2 w-1/2 pb-2">
          <p className="text-lg font-medium">Log In</p>
          <a
            href="/signup"
            className="cursor-pointer text-xs text-blue hover:text-lightBlue"
          >
            New? Sign up here.
          </a>
        </div>
        <p className="text-sm py-1">Username</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <p className="text-sm py-1">Password</p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex flex-row justify-end w-1/2">
        <button
          className="hover:bg-blue hover:text-white bg-blueBg text-blue text-sm rounded p-2 px-4"
          onClick={(e) => handleSignIn(e)}
        >
          Let's get training &rarr;
        </button>
      </div>
    </div>
  );
}
