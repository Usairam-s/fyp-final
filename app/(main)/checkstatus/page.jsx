"use client";
import useCopyClipboard from "@/hooks/useClipboardCopy";
import useClipboardPaste from "@/hooks/useClipboardPaste";
import React from "react";
import Link from "next/link";
import { BadgeAlert, Clipboard, TextSearch } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CheckStatus() {
  const copyToClipboard = useCopyClipboard();
  const [pastedText, pasteFromClipboard] = useClipboardPaste();
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [status, setStatus] = useState("");

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      // Make API call using pastedText
      const response = await fetch(
        `http://localhost:5000/api/checkstatus/${pastedText}`
      );
      const data = await response.json();
      setApiResponse(data);
      setStatus(data.request.status);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  function textBasedOnStatus(status) {
    switch (status) {
      case "pending":
        return "Please wait  for the request to be verified. Thanks for patience";
      case "approved":
        return "Your request has been approved. Visit Reception to claim your item";
      case "rejected":
        return "Sorry, your request was rejected.You can try again to submit the request";
      default:
        return "Something went wrong on our end. Please try again later.";
    }
  }

  function getGradientClass(status) {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-amber-400 to-yellow-400";
      case "approved":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "rejected":
        return "bg-gradient-to-r from-red-400 to-red-500";
      default:
        return "bg-gray-200";
    }
  }

  return (
    <div className="">
      <section className="-mt-40 " aria-disabled>
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center  border-gray-400 shadow-lg p-10">
            <p className="mt-4  mb-2 text-3xl ">Please enter refrence number</p>
            <hr className="mb-3" />
            <div className="flex items-center gap-3">
              <Input
                className="dark:text-white"
                placeholder="Enter here"
                value={pastedText}
              />
              <span
                onClick={pasteFromClipboard}
                className=" cursor-pointer text-sm flex items-center gap-1 bg-primary px-2 py-2 text-white rounded-md"
              >
                Paste <Clipboard size={15} />
              </span>
            </div>
            <Button
              onClick={handleButtonClick}
              className="dark:hover:bg-white dark:bg-white w-full mt-6 bg-black"
            >
              Submit
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto  flex justify-center  -mt-48">
        {apiResponse && (
          <div
            className={cn(
              getGradientClass(status),
              "items-center text-center  p-10 w-[475px] mx-auto shadow-lg rounded-lg"
            )}
          >
            <h2>Reference No : {apiResponse.request._id}</h2>
            <h2 className="flex gap-4 items-center justify-center my-4">
              {" "}
              <span className="text-3xl font-medium">Status : </span>{" "}
              <span className="text-2xl  border-2 border-white rounded-md p-1 px-4 ">
                {apiResponse.request.status}
              </span>
            </h2>
            <h2 className="italic tracking-wide text-slate-600">
              {textBasedOnStatus(status)}
            </h2>
          </div>
        )}
      </div>
    </div>

    // <div>
    //   <button onClick={pasteFromClipboard}>Paste from clipboard</button>
    //   {pastedText && <p>Pasted Text is : {pastedText}</p>}
    // </div>
  );
}

export default CheckStatus;
