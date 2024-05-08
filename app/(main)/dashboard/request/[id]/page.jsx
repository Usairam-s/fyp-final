"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString)
    .toLocaleDateString("en-US", options)
    .replace(/\//g, "-");
}

function SingleRequest({ params }) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(true);
  const id = params.id;
  const [requestData, setRequestData] = useState(null);
  const getSingleRequest = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/request/${id}`);
      const data = await response.json();
      setRequestData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReject = async () => {
    try {
      const requestResponse = await fetch(
        `http://localhost:5000/api/request/${id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (requestResponse.ok) {
        toast.success("Request Rejected Successfully!", {
          position: "top-center",
          onClose: () => {
            router.push("/dashboard/allrequests");
          },
        });
      } else {
        toast.error("Failed to reject request. Please try again later.", {
          position: "top-center",
        });
      }

      const requestDataUpdated = await requestResponse.json();
      console.log("Request data:", requestDataUpdated);

      // Update local state or perform any other action if needed after rejection
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError("Error processing request rejection. Please try again later.");
    }
  };

  // handle accept
  const handleAccept = async () => {
    try {
      const requestResponse = await fetch(
        `http://localhost:5000/api/request/${id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (requestResponse.ok) {
        toast.success("Request Accepted Successfully!", {
          position: "top-center",
          onClose: () => {
            router.push("/dashboard/allrequests");
          },
        });
      } else {
        toast.error("Failed to accept request. Please try again later.", {
          position: "top-center",
        });
      }
      const requestDataUpdated = await requestResponse.json();
      console.log("Request data:", requestDataUpdated);

      if (requestData.lostitem && requestData.lostitem._id) {
        const lostItemResponse = await fetch(
          `http://localhost:5000/api/lostitem/${requestData.lostitem._id}/claim`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const lostItemData = await lostItemResponse.json();
        console.log("Lost item data:", lostItemData);
      } else {
        console.error("Lost item data not available or _id is undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getSingleRequest();
  }, []);

  // Check if requestData is null (initial state or loading state)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-9xl ml-80 -mt-28 text-primary text-center animate-spin">
          ❖
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="border-2 p-4 w-[800px] rounded-lg flex flex-col gap-8">
        <div className="flex justify-between">
          <h2>
            <span className="font-medium bg-black mr-2 text-white px-2 py-2 rounded-lg">
              {" "}
              Requestor Email{" "}
            </span>
            <span className="text-slate-500 tracking-wide">
              {requestData.request.email}
            </span>
          </h2>

          <h2>
            Status :{" "}
            <span
              className={cn(
                `text-white px-3 py-1 rounded-full`,
                requestData.request.status === "pending"
                  ? "bg-yellow-400"
                  : requestData.request.status === "approved"
                  ? "text-green-600"
                  : requestData.request.status === "rejected"
                  ? "text-red-600"
                  : "text-gray-600"
              )}
            >
              {requestData.request.status}
            </span>
          </h2>
        </div>
        <div>
          <h2>
            <span className="font-medium bg-black mr-2 text-white px-2 py-2 rounded-lg">
              Requestor Description{" "}
            </span>
            <span className="text-slate-500 tracking-wide">
              {" "}
              {requestData.request.description !== ""
                ? requestData.request.description
                : "None"}
            </span>
          </h2>
        </div>
      </div>

      <div className="flex w-full justify-between border rounded-lg mt-2 p-4">
        <div className="flex-1 flex items-center flex-col gap-3">
          {" "}
          <h2 className="font-medium text-2xl">Request</h2>
          {requestData.request.imageUrl ? (
            <Image
              src={requestData.request.imageUrl}
              alt="userimage"
              width={200}
              height={200}
              className="border rounded-lg"
            />
          ) : (
            <Image
              src="https://drive.google.com/uc?id=1UrSBg4ejxrWyuzxrBRtP4ic9HCa3zcDe"
              alt="defaultimage"
              width={200}
              height={200}
              className="border rounded-lg"
            />
          )}
          <h2 className="bg-black text-white px-2 py-1 rounded-lg">
            Lost Date : {formatDate(requestData.request.lostDate)}
          </h2>
          {requestData.tagName && requestData.tagName.name && (
            <h2 className="bg-slate-200 flex flex-row gap-2 rounded-lg p-1 items-center w-[120px]">
              <Tag size={20} />
              {requestData.tagName.name}
            </h2>
          )}
          <h2 className="flex gap-4">
            {requestData.venueNames.map((item) => (
              <p className="bg-primary text-white px-2 py-1 text-sm rounded-lg">
                {item}
              </p>
            ))}
          </h2>
        </div>
        <div className="flex-1 flex items-center flex-col gap-3">
          <h2 className="font-medium text-2xl">Staff Information</h2>
          <Image
            src={requestData.lostitem.imageUrl}
            alt="userimage"
            width={200}
            height={200}
            className="border rounded-lg"
          />
          <h2 className="bg-black text-white px-2 py-1 rounded-lg">
            Found Date : {formatDate(requestData.lostitem.foundDate)}
          </h2>
          <h2 className="bg-slate-200 flex flex-ropw gap-2 rounded-lg p-1 items-center w-[120px]">
            <Tag size={20} />
            {requestData.lostitemTag.name}
          </h2>{" "}
          <h2 className="flex gap-4">
            <p className="bg-primary text-white px-2 py-1 text-sm rounded-lg">
              {requestData.lostitemVenue.name}
            </p>
          </h2>
        </div>
        {/* accept or reject */}
      </div>

      <div className="mt-4 w-full flex justify-between">
        <Button
          onClick={handleAccept}
          className="px-28 hover:bg-green-700 bg-green-600 text-xl tracking-wide"
        >
          Accept
        </Button>
        <Button
          onClick={handleReject}
          className="px-28 hover:bg-red-700 bg-red-600  text-xl tracking-wide"
        >
          Reject
        </Button>
        <ToastContainer autoClose={3000} />
      </div>
    </>
  );
}

export default SingleRequest;
