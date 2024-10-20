"use client";
import { useState } from "react";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ethers } from "ethers";
import { Res } from "./lib/types";
import verifyEvmBasedResult from "./verifyEvmBasedResult";


declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [appid1, setAppid1] = useState<string>(
    "b3806b17-af5a-4a96-a90f-f885e8cb27af"
  );
  const [value1, setValue1] = useState<string>(
    "0987a7d73745480cba1ef255945592b9"
  );
  const [result, setResult] = useState<any>();
  const [attestAtationTx, setAttestAtationTx] = useState<string>();

  const start = async (schemaId: string, appid: string) => {
    try {
      const connector = new TransgateConnect(appid);
      const isAvailable = await connector.isTransgateAvailable();
      if (!isAvailable) {
        return alert("Please install zkPass TransGate");
      }

      const res = await connector.launch(schemaId) as Res ;
      setResult(res);

      const isVerified = verifyEvmBasedResult(res, schemaId)

      if (!isVerified) {
        return alert("Invalid result");
      }

      const taskId = ethers.hexlify(ethers.toUtf8Bytes(res.taskId));
      schemaId = ethers.hexlify(ethers.toUtf8Bytes(schemaId));

      setFollowed(true);
    } catch (err) {
      alert("There was an error prooving you joined in 2006);
      console.log("error", err);
    }
  };

  const [followed, setFollowed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-black text-white">
  {!followed ? (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Verify if You're an OG Twitter User</h1>
      <a
        href="https://twitter.com"
        target="_blank"
        className="bg-blue-500 px-6 py-2 rounded-md text-xl hover:bg-blue-600"
      >
        Go to Twitter
      </a>
      <p className="mt-4">Once you've signed in, click below to verify your OG status:</p>
      <button
        onClick={() => start(value1, appid1)}
        className="mt-4 px-4 py-2 bg-green-500 rounded-md text-lg hover:bg-green-600"
      >
        Verify OG Twitter User
      </button>
    </div>
  ) : (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Thank You for Verifying!</h1>
      <p className="text-xl">You are confirmed as an OG Twitter user.</p>
    </div>
  )}
</div>
  );
}
