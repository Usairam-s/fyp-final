"use client";
import { Button } from "@/components/ui/button";
import { FileInput } from "flowbite-react";
import useCopyClipboard from "@/hooks/useClipboardCopy";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CalendarCheck, CopyIcon } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
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
import { Spinner } from "flowbite-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";

function HaveImage() {
  const copyToClipboard = useCopyClipboard();
  //
  const [previewUrl, setPreviewUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [file, setFile] = useState(null);
  const [resultArray, setResultArray] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [lostitemUrl, setLostitemUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [allVenues, setAllVenues] = useState([]);
  const [uncategorized, setUncategorized] = useState(false);
  const [label, setLabel] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [date, setDate] = useState();
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [accessTokenTagging, setAccessTokenTagging] = useState("");
  const [accessTokenSample, setAccessTokenSample] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [uploadToForm, setUploadToForm] = useState(true);
  const [trackId, setTrackId] = useState("");
  const [haveTrackId, setHaveTrackId] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    const toastId = toast.loading("Searching for your item!!!");
    const dataCloud = new FormData();
    dataCloud.append("file", file);
    dataCloud.append("upload_preset", "test123");
    dataCloud.append("cloud_name", "drdysons1");
    dataCloud.append("folder", "user");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drdysons1/image/upload",
      {
        method: "POST",
        body: dataCloud,
      }
    );
    const result = await res.json();
    const cloudImageUrl = result.url;
    setImageUrl(cloudImageUrl);
    setLoading(true);

    const data = await fetch(
      "https://www.nyckel.com/v0.9/functions/sz7vhe91xgo9cwre/search?sampleCount=5",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: cloudImageUrl }),
      },
      { cache: "no-store" }
    );

    if (!data.ok) {
      console.error("Error fetching search samples:", data.statusText);
      toast.error("Something went wrong! Try agian later", { id: toastId });
      setLoading(false);
      return; // Exit the function early if the fetch fails
    }

    const response = await data.json();
    const searchSamples = response.searchSamples;
    if (searchSamples.length === 0) {
      toast.error("No item found! Try agian later", { id: toastId });
      setLoading(false);
      return;
    }
    console.log(searchSamples);

    try {
      const fetchedImages = [];
      for (const sample of searchSamples) {
        const id = sample.sampleId;

        const result = await fetch(
          `http://localhost:5000/api/getsingleimage/${id}`,
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

      toast.success("See the items below!!", { id: toastId });
      setResultArray(fetchedImages); // Update resultArray with valid image URLs
      setDone(true);
      setLoading(false);
      console.log(resultArray);
    } catch (error) {
      toast.error("Try again later!!", { id: toastId });
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  ///get fresh token every time

  useEffect(() => {
    fetch("https://www.nyckel.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "client_id=a26jb766l7v2hiwvkgnk0hugy8v03f45&client_secret=n2n9izpeac8zw29m86o605ht8ql2c5353qeevmdkq9ao9ujwy8sxry4ilu1rem14&grant_type=client_credentials",
    })
      .then((response) => response.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  /// get fresh token every time

  //get all venues

  const getVenues = async () => {
    const response = await fetch("http://localhost:5000/api/venues");
    const data = await response.json();
    setAllVenues(data);
  };

  useEffect(() => {
    getVenues();
  }, []);

  // get all venues

  const handleYesClick = async (item) => {
    setResultArray([]);

    setLostitemUrl(item);
    setUploadToForm(false);
    setShowForm(true);
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

    //create sample and get sampleId
    const sampleResponse = await fetch(
      "https://www.nyckel.com/v1/functions/qrv1midmav189yws/samples",
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
      body: "client_id=32ofdqbrxk311xhpzv4hie70sub4o3r5&client_secret=ov94sajr1bsoxq4siygiay8ovnnif73utxc5ncwpccg7li21qilpm9uqnk94n0ct&grant_type=client_credentials",
    })
      .then((response) => response.json())
      .then((data) => setAccessTokenSample(data.access_token));
  }, []);

  // get token for create sample

  //checkbox
  const handleCheckbox = () => {
    setUncategorized(!uncategorized);
  };

  //
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    // Check if the option is being selected or deselected
    if (checked) {
      // Check if the limit of 3 selections has been reached
      if (selectedValues.length < 3) {
        // Add the selected option to the array
        setSelectedValues((prevSelectedValues) => [
          ...prevSelectedValues,
          value,
        ]);
      } else {
        // Display a message or handle it in any way you prefer when the limit is reached
        alert("You can only select up to 3 options.");
        event.preventDefault(); // Prevent selecting more than 3 options
      }
    } else {
      // Remove the option from the array if it's being deselected
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((val) => val !== value)
      );
    }
  };
  //

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    console.log(e.target.value); // Add this line to check the value being captured
    setDescription(e.target.value);
  };

  const handleButtonClick = () => {
    const formData = {
      imageUrl: imageUrl,
      email: email, // Add logic to collect email input value
      name: name,
      label: uncategorized ? "uncategorized" : label,
      venues: selectedValues,
      date: date,
      description: description, // Add logic to collect description input value
      mappingUrl: lostitemUrl,
      sampleId: sampleId,
    };

    fetch("http://localhost:5000/api/request/savedata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrackId(data.trackid);
        setHaveTrackId(true);

        console.log("Response from server:", data);
        // Process the response data here
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

  const handleCopy = (text) => {
    useCopyClipboard(text);
  };
  const [clipboardClick, setClipboardClick] = useState(false);
  return (
    <>
      {trackId ? (
        <>
          <div className="mx-auto bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white items-center drop-shadow-xl w-[500px] border p-8 justify-center flex flex-col mt-20 rounded-lg ">
            <h2 className="flex  justify-center items-center mx-auto text-center leading-6">
              Your request has been submitted ✅<br /> You can check status of
              you request with Refrence No
            </h2>
            <span className="text-center text-black items-center  p-4 mt-6 drop-shadow-lg">
              <Input
                className="rounded-lg text-black w-[350px]"
                value={trackId}
              />
              <div className="flex mx-auto justify-center items-center mt-3">
                {clipboardClick ? (
                  <>
                    <Button className="bg-black hover:bg-black  items-center justify-center flex gap-2">
                      ✅ Copied
                    </Button>
                  </>
                ) : (
                  <div onClick={() => setClipboardClick(true)}>
                    <Button
                      className="gap-2 hover:bg-black items-center flex flex-row bg-black"
                      onClick={() => copyToClipboard(trackId)}
                    >
                      <CopyIcon size={20} />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </span>
            <Button variant="link" className="text-white text-xl">
              <Link href="/checkstatus">Check Status</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          {uploadToForm ? (
            <>
              {" "}
              {!showForm && (
                <>
                  {" "}
                  <h2 className="font-semibold mb-2 pt-14 text-xl mx-auto items-center text-center">
                    Click below to upload image
                  </h2>
                  <div className="w-[300px] mx-auto">
                    <FileInput
                      className="drop-shadow-2xl mb-2"
                      type="file"
                      placeholder="click here"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                    {previewUrl && (
                      <Image
                        src={previewUrl}
                        alt="preview_image"
                        width={300}
                        height={300}
                      />
                    )}
                    <Button
                      onClick={uploadImage}
                      className="mt-2 w-full hover:bg-gray-800 bg-black"
                      disabled={loading || !previewUrl}
                    >
                      Upload
                    </Button>
                  </div>
                  {/* show similar image from api */}
                  {loading ? (
                    <div className="text-center items-center flex justify-center mt-4">
                      <Spinner
                        aria-label="Extra large spinner example"
                        size="xl"
                      />
                    </div>
                  ) : (
                    <>
                      {" "}
                      {done && (
                        <div className="ml-20 mr-20 ">
                          <h2 className="text-center my-8 text-3xl font-semibold uppercase">
                            Choose your item
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
                                            Is this your item?
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
                                          <AlertDialogCancel>
                                            No
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleYesClick(item)}
                                          >
                                            Yes
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
                            <Link href="/tagsearch">
                              <span className="text-center text-xl font-semibold">
                                Do not found item?
                              </span>
                            </Link>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {" "}
              {showForm && (
                <div className="shadow-md   p-4 mt-2 w-[650px] mx-auto">
                  {/* <h2 className="tracking-normal mb-2 text-center  items-center mx-auto text-xl">
            Provide details to successfully finish your request
          </h2> */}
                  <form className="w-full mt-4 flex flex-col gap-6">
                    <div className="flex gap-4 ">
                      <Input
                        className="w-1/2"
                        name="name"
                        placeholder="Name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                      />

                      <Input
                        name="email"
                        value={email}
                        type="text"
                        onChange={handleEmailChange}
                        placeholder="Name"
                      />
                    </div>
                    <div className="flex flex-row gap-4 ">
                      <Input
                        className="w-1/2"
                        value={label}
                        disabled={uncategorized}
                      />
                      <div className="flex flex-row items-center mt-2 gap-2 ">
                        <label className="text-sm font-medium underline leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Check this if tag not look accurate.
                        </label>
                        <Checkbox onClick={handleCheckbox} className="mr-2" />
                      </div>
                    </div>

                    <div>
                      <h2 className=" mb-2">
                        <span className="font-semibold"> Select Venues </span>
                        <span className="text-gray-400">
                          (You can select up to 3)
                        </span>
                      </h2>
                      <div className="grid grid-cols-3 gap-1">
                        {allVenues.map((venue) => (
                          <label
                            key={venue._id}
                            className="flex flex-row items-center gap-1"
                          >
                            <input
                              type="checkbox"
                              value={venue._id}
                              checked={selectedValues.includes(venue._id)}
                              onChange={handleCheckboxChange}
                            />
                            {venue.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-black font-semibold" htmlFor="">
                        Lost Date
                      </label>
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
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                    </div>

                    <div className="grid w-full gap-1.5">
                      <label className="text-gray-500" htmlFor="message">
                        Description (optional)
                      </label>
                      <Textarea
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Type your message here."
                      />
                    </div>
                  </form>
                  <Button onClick={handleButtonClick} className="w-full mt-3">
                    Submit
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default HaveImage;
