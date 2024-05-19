"use client";
import React, { useEffect, useState } from "react";
import { FileInput, Label } from "flowbite-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DashUpload() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState("");
  const [accessTokenTagging, setAccessTokenTagging] = useState("");
  const [accessTokenSample, setAccessTokenSample] = useState("");
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [venue, setVenue] = useState("");
  const [allVenues, setAllVenues] = useState([]);
  const [date, setDate] = useState();
  const [disbaleUpload, setDisableUpload] = useState(true);
  const [resultArray, setResultArray] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  // token for sample search
  const [accessToken, setAccessToken] = useState("");
  // token for sample search

  //token for seraching the samples
  useEffect(() => {
    fetch("https://www.nyckel.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "client_id=32ofdqbrxk311xhpzv4hie70sub4o3r5&client_secret=ov94sajr1bsoxq4siygiay8ovnnif73utxc5ncwpccg7li21qilpm9uqnk94n0ct&grant_type=client_credentials",
    })
      .then((response) => response.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);
  //token for seraching the samples
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDisableUpload(false);
    //upload to cloudinary
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "test123");
    data.append("cloud_name", "drdysons1");
    data.append("folder", "admin");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drdysons1/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    const cloudImageUrl = result.url;
    setImageUrl(cloudImageUrl);
  };
  const uploadImage = async () => {
    // const formData = new FormData();
    // formData.append("data", file, file.name);

    const nyckelResponse = await fetch(
      "https://www.nyckel.com/v0.9/functions/kz83ic2yrzndowmi/invoke",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessTokenTagging,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: imageUrl }),
      }
    );

    if (!nyckelResponse.ok) {
      console.error(
        "Error occurred while fetching data from Nyckel API:",
        nyckelResponse.status
      );
      return;
    }

    const nyckelData = await nyckelResponse.json();
    if (
      !Array.isArray(nyckelData) ||
      nyckelData.length === 0 ||
      !nyckelData[0].labelName
    ) {
      console.error("No labelName found in the response or response is empty");
      setLabel("Uncategorized");
      return;
    }

    const labelName = nyckelData[0].labelName;
    setLabel(labelName); // Set the state variable 'label
    //get tag

    // create sample and get sample id and image url

    //create sample and get sampleId
    const sampleResponse = await fetch(
      "https://www.nyckel.com/v1/functions/sz7vhe91xgo9cwre/samples",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessTokenSample,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: imageUrl,
        }),
      }
    );

    if (!sampleResponse.ok) {
      console.error(
        "Error occurred while creating sample:",
        sampleResponse.status
      );
      return;
    }

    const sampleResult = await sampleResponse.json();
    const sampleId = sampleResult.id;
    setSampleId(sampleId);
  };

  // get token for create sample

  useEffect(() => {
    fetch("https://www.nyckel.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "client_id=a26jb766l7v2hiwvkgnk0hugy8v03f45&client_secret=n2n9izpeac8zw29m86o605ht8ql2c5353qeevmdkq9ao9ujwy8sxry4ilu1rem14&grant_type=client_credentials",
    })
      .then((response) => response.json())
      .then((data) => setAccessTokenSample(data.access_token));
  }, []);

  // get token for create sample

  //get access token for tagging
  useEffect(() => {
    fetch("https://www.nyckel.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "client_id=32ofdqbrxk311xhpzv4hie70sub4o3r5&client_secret=ov94sajr1bsoxq4siygiay8ovnnif73utxc5ncwpccg7li21qilpm9uqnk94n0ct&grant_type=client_credentials",
    })
      .then((response) => response.json())
      .then((data) => setAccessTokenTagging(data.access_token));
  }, []);

  // get acces token for tagging

  //get all venues
  const getVenues = async () => {
    const response = await fetch("http://localhost:5000/api/venues");
    const data = await response.json();
    setAllVenues(data);
  };

  useEffect(() => {
    getVenues();
  }, []);

  const handleVenueSelect = (selectedVenue) => {
    console.log("Selected venue:", selectedVenue); // Log the selected venue
    setVenue(selectedVenue); // Update the state with the selected venue
  };

  const submitForm = async () => {
    const lostItemData = {
      label: label,
      sampleId: sampleId,
      imageUrl: imageUrl,
      venue: venue,
      date: date,
    };
    ///

    // getting samples
    const data = await fetch(
      "https://www.nyckel.com/v1/functions/qrv1midmav189yws/invoke?sampleCount=3",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: imageUrl }),
      },
      { cache: "no-store" }
    );

    if (!data.ok) {
      console.error("Error fetching search samples:", data.statusText);

      setLoading(false);
      return; // Exit the function early if the fetch fails
    }
    console.log(data);

    const response = await data.json();
    console.log(response);
    const searchSamples = response;

    if (searchSamples.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const fetchedImages = [];
      for (const sample of searchSamples) {
        const id = sample.sampleId;

        const result = await fetch(
          `http://localhost:5000/api/getsingleimagedash/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
          { caches: "no-store" }
        );

        if (!result.ok) {
          console.error(
            `Error fetching data for sampleId ${id}: ${result.statusText}`
          );
          continue; // Skip to the next iteration if fetch was unsuccessful
        }

        const data = await result.json();
        const imageUrl = data; // Adjust path if necessary

        if (imageUrl) {
          // Check if imageUrl is valid
          fetchedImages.push(imageUrl);
        } else {
          console.warn(`No image URL found for sampleId ${id}`);
        }
      }

      setResultArray(fetchedImages); // Update resultArray with valid image URLs
      setDone(true);
      setLoading(false);
      console.log(resultArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }

    ///

    // try {
    //   const response = await fetch(
    //     "http://localhost:5000/api/lostitem/savedata",
    //     {
    //       method: "POST",

    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(lostItemData),
    //     }
    //   );

    //   if (response.ok) {
    //     toast.success("LostItem Saved Successfully!", {
    //       position: "top-center",
    //       onClose: () => {
    //         router.push("/dashboard/allrequests");
    //       },
    //     });
    //   } else {
    //     toast.error("Failed to save LostItem. Please try again later.", {
    //       position: "top-center",
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error occurred while saving data:", error);
    // }
  };

  return (
    <>
      <div className="flex mt-6 flex-row justify-between gap-40">
        <div>
          <FileInput id="file-upload" onChange={handleImageChange} />
          {previewUrl && (
            <Image
              src={previewUrl}
              className="rounded-lg mt-2"
              height={300}
              width={300}
              alt="image-preview"
            />
          )}
          <Button
            disabled={disbaleUpload}
            className="w-[300px] mt-4 bg-black"
            onClick={uploadImage}
          >
            Uplaod
          </Button>
        </div>

        <form className="flex flex-col gap-6">
          <h2 className="text-3xl mb-4 font-semibold">
            Additional Information
          </h2>
          <Input value={label} />
          <Select onValueChange={handleVenueSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Venues</SelectLabel>
                {/* Pass the handleVenueSelect function to onSelect event of SelectItem */}

                {allVenues.map((venue) => (
                  <SelectItem
                    key={venue.name}
                    value={venue.name}
                    onSelect={handleVenueSelect}
                  >
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="w-full"
              />
            </PopoverContent>
          </Popover>
        </form>
      </div>
      <Button
        className=" mb-8 flex px-20 py-2 rounded-lg text-xl mx-auto mt-20"
        onClick={submitForm}
      >
        Submit
      </Button>
      {/* //render sample */}
      {done && (
        <div className="ml-20 mr-20 ">
          <h2 className="text-center my-8 text-3xl font-semibold uppercase">
            See if there is similar item
          </h2>

          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-black mb-4 p-6 rounded-lg ">
            {done &&
              resultArray.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center border border-gray-300 rounded-lg"
                >
                  <div className="mx-auto">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        {" "}
                        <Image
                          src={item}
                          alt="preview_image"
                          width="200"
                          height={200}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="items-center mx-auto flex flex-col justify-center">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            Is this similar item?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <Image
                              src={item}
                              alt="preview_image"
                              width="350"
                              height={350}
                              className="object-cover"
                            />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No</AlertDialogCancel>
                          <AlertDialogAction>
                            Email to Requestor
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </div>

          <Button
            className="mx-auto items-center flex justify-center mb-6"
            variant="link"
            asChild
          >
            <Link href="/dashboard/allrequests">
              <span className="text-center text-xl font-semibold">
                No matched Item? Go back to All Requests
              </span>
            </Link>
          </Button>
        </div>
      )}
      {/* //render sample */}
    </>
  );
}

export default DashUpload;
