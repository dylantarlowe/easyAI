import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "@/images/aiWhite.svg";
import { signIn } from "next-auth/react";
import Link from "next/link";

type Props = {};

const Signup = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    //Validation
    if (!email || !email.includes("@") || !password) {
      alert("Invalid details");
      return;
    }
    //POST form values
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    //Await for data for any desirable next steps
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      alert(data.message || "Something went wrong!");
      return;
    }
    // sign in user
    const status = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    console.log(status);
    if (status && status.ok) {
      router.push("/newModel");
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
        <div className="flex flex-row justify-start items-baseline space-x-2  pb-2">
          <p className="text-lg font-medium">Sign Up</p>
          <Link
            href="/"
            className="cursor-pointer text-xs text-blue hover:text-lightBlue"
          >
            Have an account? Log in here.
          </Link>
        </div>
        <p className="text-sm py-1">Username</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <p className="text-sm py-1">Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex flex-row justify-end w-1/2">
        <button
          className="hover:bg-blue hover:text-white bg-blueBg text-blue text-sm rounded p-2 px-4"
          onClick={(e) => handleSignUp(e)}
        >
          Let&apos;s get training &rarr;
        </button>
      </div>
    </div>
  );
};

export default Signup;
