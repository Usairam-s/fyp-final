"use client";
import useCopyClipboard from "@/hooks/useClipboardCopy";
import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { unstable_noStore as noStore } from "next/cache";
import { Clipboard, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function CheckStatus() {
  noStore();
  const copyToClipboard = useCopyClipboard();
  const [pastedText, setPastedText] = useState(""); // Create state for input value
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Custom hook to handle clipboard paste
  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setPastedText(text); // Update state with pasted text
  };

  const handleButtonClick = async () => {
    const toastId = toast.loading("Checking your request...");
    try {
      setLoading(true);
      setApiResponse(null); // Reset apiResponse before making the API call
      setStatus(""); // Reset status before making the API call

      // Make API call using pastedText
      const response = await fetch(
        `http://localhost:5000/api/checkstatus/${pastedText}`
      );
      if (!response.ok) {
        throw new Error("Invalid reference number or server error");
      }
      const data = await response.json();
      setApiResponse(data);
      setStatus(data.request.status);
      toast.success("Check status below", { id: toastId });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Please enter a valid reference number!!!", { id: toastId });
      setApiResponse(null); // Ensure apiResponse is reset on error
      setStatus(""); // Ensure status is reset on error
    } finally {
      setLoading(false);
      setPastedText(""); // Clear the input field
    }
  };

  function textBasedOnStatus(status) {
    switch (status) {
      case "pending":
        return "Please wait for the request to be verified. Thanks for your patience.";
      case "approved":
        return "Your request has been approved. Visit Reception to claim your item.";
      case "rejected":
        return "Sorry, your request was rejected. You can try again to submit the request.";
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
  const saveFeedback = async () => {
    const formData = {
      name: name,
      email: email,
      feedback: feedback,
    };

    try {
      const toastId = toast.loading("Saving your feedaback");
      const res = await fetch("http://localhost:5000/api/userfeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success("Your feedback recieved!!!", { id: toastId });
        setOpen(false);
        // Do something with the data
      } else {
        console.log("Failed to fetch data:", res.status);
        toast.error("Something went wrong!!!", { id: toastId });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong!!!", { id: toastId });
    }
  };
  return (
    <div className="">
      <section className="-mt-40 relative " aria-disabled>
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center border-gray-400 shadow-lg p-10">
            <p className="mt-4 mb-2 text-3xl">Please enter reference number</p>
            <hr className="mb-3" />
            <div className="flex items-center gap-3">
              <Input
                className="dark:text-white"
                placeholder="Enter here"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)} // Handle user input
              />
              <span
                onClick={pasteFromClipboard}
                className="cursor-pointer text-sm flex items-center gap-1 bg-primary px-2 py-2 text-white rounded-md"
              >
                Paste <Clipboard size={15} />
              </span>
            </div>
            <Button
              onClick={handleButtonClick}
              className="dark:hover:bg-white dark:bg-white w-full mt-6 bg-black"
              disabled={loading} // Disable button during loading
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div>
        <div className="absolute top-[600px] left-[1100px]">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-pointer" asChild>
              <div className="bg-blue-500 p-2 flex gap-2 items-center rounded-full">
                <User2 className="h-7 w-7 rounded-full invert" />
                <h2 className="text-white">Feedback</h2>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4 py-4">
                <div className=" items-center gap-4">
                  <Label htmlFor="name" className="text-right mb-2">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="col-span-3"
                    onChange={handleNameChange}
                    value={name}
                  />
                </div>
                <div className=" items-center gap-4">
                  <Label htmlFor="email" className="text-right mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    className="col-span-3"
                    onChange={handleEmailChange}
                    value={email}
                  />
                </div>
                <div className="  items-center gap-4">
                  <Label htmlFor="feedback" className="text-right">
                    Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    placeholder="Please enter your feedback"
                    className="w-full mt-2"
                    onChange={handleFeedbackChange}
                    value={feedback}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={saveFeedback}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="mx-auto flex justify-center -mt-48">
        {apiResponse && (
          <div
            className={cn(
              getGradientClass(status),
              "items-center text-center p-10 w-[475px] mx-auto shadow-lg rounded-lg"
            )}
          >
            <h2>Reference No: {apiResponse.request._id}</h2>
            <h2 className="flex gap-4 items-center justify-center my-4">
              <span className="text-3xl font-medium">Status: </span>
              <span className="text-2xl border-2 border-white rounded-md p-1 px-4">
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
  );
}

export default CheckStatus;
