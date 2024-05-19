"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Image from "next/image";
import Link from "next/link";
import useCopyClipboard from "@/hooks/useClipboardCopy";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { CopyIcon } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function TextSearch() {
  const [showToast, setShowToast] = useState(true);
  //see if ttken is there remove text search bttun

  useEffect(() => {
    if (showToast) {
      toast.success("Example Phrase : A black usb (color , your item)", {
        position: "top-center",
        theme: "dark",
        autoClose: false, // Prevent auto closing
      });
    }
    return () => {
      toast.dismiss(); // Dismiss toast when component unmounts
    };
  }, [showToast]);
  const copyToClipboard = useCopyClipboard();
  const [loading, setLoading] = useState(false);
  const [clipboardClick, setClipboardClick] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [status, setStatus] = useState("");
  const [inputText, setInputText] = useState(""); // State to hold the input text
  const [accessTokenSample, setAccessTokenSample] = useState("");
  const [resultArray, setResultArray] = useState([]);
  const [done, setDone] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [trackId, setTrackId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [haveTrackId, setHaveTrackId] = useState(false);
  const [lostItemImageUrl, setLostItemImageUrl] = useState("");

  ///
  const [tags, setTags] = useState([]);
  const [selectTag, setSelectedTag] = useState("");
  const [docs, setDocs] = useState([]);

  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [date, setDate] = useState();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getTags = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tags`);
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllVenues = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/venues`);
      const data = await response.json();
      const venues = data || [];
      setOptions(venues);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllVenues();
  }, []);

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    console.log("Lost item image URL:", lostItemImageUrl);
  }, [lostItemImageUrl]);

  const handleYesClick = async (url) => {
    setLostItemImageUrl(url);
    console.log(lostItemImageUrl);
    setShowForm(true);
  };

  ///

  const handleButtonClick = async () => {
    const toastId = toast;
    const data = await fetch(
      "https://www.nyckel.com/v0.9/functions/sz7vhe91xgo9cwre/search?sampleCount=3",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessTokenSample,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputText }),
      }
    );
    if (!data.ok) {
      console.error("Error fetching search samples:", data.statusText);
      return; // Exit the function early if the fetch fails
    }

    const response = await data.json();
    const searchSamples = response.searchSamples;
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

      setResultArray(fetchedImages); // Update resultArray with valid image URLs
      setDone(true);
      setLoading1(false);
      console.log(resultArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKeyPress = (event) => {
    // Check if the key pressed is Enter (key code 13)
    if (event.key === "Enter") {
      handleButtonClick(); // Call handleButtonClick function when Enter is pressed
    }
  };

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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setShowToast(false);
    const formData = {
      name,
      email,
      venues: selectedValues,
      lostDate: date,
      description,
      lostItemImageUrl,
    };
    console.log(formData);
    try {
      const response = await fetch(
        "http://localhost:5000/api/request/noimage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      const data = await response.json();
      console.log(data.trackid, data.status);
      setTrackId(data.trackid);
      setHaveTrackId(true);

      // Handle successful form submission here
      console.log("Form data submitted successfully");
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      // Handle error here
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      if (selectedValues.length < 3) {
        setSelectedValues((prevSelectedValues) => [
          ...prevSelectedValues,
          value,
        ]);
      } else {
        alert("You can only select up to 3 options.");
        event.preventDefault();
      }
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((val) => val !== value)
      );
    }
  };

  return (
    // <>
    //   <div className="">
    //     <section className="-mt-40 " aria-disabled>
    //       <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    //         <div className="mx-auto max-w-xl text-center  border-gray-400 shadow-lg p-10">
    //           <p className="mt-4  mb-2 text-3xl ">
    //             Describe your item with phrase
    //           </p>
    //           <hr className="mb-3" />
    //           <div className="flex items-center gap-3">
    //             <Input
    //               className="dark:text-white"
    //               placeholder="Enter here"
    //               value={inputText}
    //               onChange={(e) => setInputText(e.target.value)} // Update inputText state on change
    //               onKeyPress={handleKeyPress} // Call handleKeyPress when Enter is pressed
    //             />
    //           </div>
    //           <Button
    //             onClick={handleButtonClick}
    //             className="dark:hover:bg-white dark:bg-white w-full mt-6 bg-black"
    //           >
    //             Submit
    //           </Button>
    //         </div>
    //       </div>
    //     </section>
    //   </div>

    //   {/* //show similar images */}
    //   {done && (
    //     <div className="ml-20 mr-20 ">
    //       <h2 className="text-center my-8 text-3xl font-semibold uppercase">
    //         Choose your item
    //       </h2>

    //       <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-black mb-4 p-6 rounded-lg ">
    //         {done &&
    //           resultArray.map((item, index) => (
    //             <div
    //               key={index}
    //               className="flex justify-center items-center border border-gray-300 rounded-lg"
    //             >
    //               <div className="mx-auto">
    //                 <AlertDialog>
    //                   <AlertDialogTrigger>
    //                     {" "}
    //                     <Image
    //                       src={item}
    //                       alt="preview_image"
    //                       width="200"
    //                       height={200}
    //                     />
    //                   </AlertDialogTrigger>
    //                   <AlertDialogContent className="items-center mx-auto flex flex-col justify-center">
    //                     <AlertDialogHeader>
    //                       <AlertDialogTitle className="text-center">
    //                         Is this your item?
    //                       </AlertDialogTitle>
    //                       <AlertDialogDescription>
    //                         <Image
    //                           src={item}
    //                           alt="preview_image"
    //                           width="350"
    //                           height={350}
    //                           className="object-cover"
    //                         />
    //                       </AlertDialogDescription>
    //                     </AlertDialogHeader>
    //                     <AlertDialogFooter>
    //                       <AlertDialogCancel>No</AlertDialogCancel>
    //                       <AlertDialogAction
    //                         onClick={() => handleYesClick(item)}
    //                       >
    //                         Yes
    //                       </AlertDialogAction>
    //                     </AlertDialogFooter>
    //                   </AlertDialogContent>
    //                 </AlertDialog>
    //               </div>
    //             </div>
    //           ))}
    //       </div>

    //       <Button
    //         className="mx-auto items-center flex justify-center mb-6"
    //         variant="link"
    //         asChild
    //       >
    //         <Link href="/tagsearch">
    //           <span className="text-center text-xl font-semibold">
    //             Do not found item?
    //           </span>
    //         </Link>
    //       </Button>
    //     </div>
    //   )}
    // </>
    //   <>
    //   {trackId ? (
    //     <>
    //       <div className="mx-auto bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white items-center drop-shadow-xl w-[500px] border p-8 justify-center flex flex-col mt-20 rounded-lg ">
    //         <h2 className="flex  justify-center items-center mx-auto text-center leading-6">
    //           Your request has been submitted ✅<br /> You can check status of
    //           you request with Refrence No
    //         </h2>
    //         <span className="text-center text-black items-center  p-4 mt-6 drop-shadow-lg">
    //           <Input
    //             className="rounded-lg text-black w-[350px]"
    //             value={trackId}
    //           />
    //           <div className="flex mx-auto justify-center items-center mt-3">
    //             {clipboardClick ? (
    //               <>
    //                 <Button className="bg-black hover:bg-black  items-center justify-center flex gap-2">
    //                   ✅ Copied
    //                 </Button>
    //               </>
    //             ) : (
    //               <div onClick={() => setClipboardClick(true)}>
    //                 <Button
    //                   className="gap-2 hover:bg-black items-center flex flex-row bg-black"
    //                   onClick={() => copyToClipboard(trackId)}
    //                 >
    //                   <CopyIcon size={20} />
    //                   Copy
    //                 </Button>
    //               </div>
    //             )}
    //           </div>
    //         </span>
    //         <Button variant="link" className="text-white text-xl">
    //           <Link href="/checkstatus">Check Status</Link>
    //         </Button>
    //       </div>
    //     </>
    //   ) : (
    //     <>
    //       {!showForm && (
    //           <div className="">
    //           <section className="-mt-40 " aria-disabled>
    //             <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    //               <div className="mx-auto max-w-xl text-center  border-gray-400 shadow-lg p-10">
    //                 <p className="mt-4  mb-2 text-3xl ">
    //                   Describe your item with phrase
    //                 </p>
    //                 <hr className="mb-3" />
    //                 <div className="flex items-center gap-3">
    //                   <Input
    //                     className="dark:text-white"
    //                     placeholder="Enter here"
    //                     value={inputText}
    //                     onChange={(e) => setInputText(e.target.value)} // Update inputText state on change
    //                     onKeyPress={handleKeyPress} // Call handleKeyPress when Enter is pressed
    //                   />
    //                 </div>
    //                 <Button
    //                   onClick={handleButtonClick}
    //                   className="dark:hover:bg-white dark:bg-white w-full mt-6 bg-black"
    //                 >
    //                   Submit
    //                 </Button>
    //               </div>
    //             </div>
    //           </section>
    //         </div>
    //       )}

    //       {showForm && (
    //         <div className="shadow-md   p-4 mt-6 w-[600px] mx-auto">
    //           {/* <h2 className="tracking-normal mb-2 text-center items-center mx-auto text-xl">
    //         Provide details to successfully finish your request
    //       </h2> */}
    //           <form
    //             className="w-full flex flex-col gap-6"
    //             onSubmit={handleFormSubmit}
    //           >
    //             <div className="flex flex-row gap-4">
    //               <Input
    //                 name="name"
    //                 value={name}
    //                 onChange={(e) => setName(e.target.value)}
    //                 className="w-1/2"
    //                 placeholder="Name"
    //               />

    //               <Input
    //                 name="email"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 placeholder="Email"
    //               />
    //             </div>

    //             <div>
    //               <h2 className="text-gray-500">
    //                 Select Venues (you can select up to 3)
    //               </h2>
    //               <div className="grid grid-cols-3 gap-1">
    //                 {options.map((venue) => (
    //                   <label
    //                     key={venue._id}
    //                     className="flex flex-row items-center gap-1"
    //                   >
    //                     <input
    //                       type="checkbox"
    //                       value={venue._id}
    //                       checked={selectedValues.includes(venue._id)}
    //                       onChange={handleCheckboxChange}
    //                     />
    //                     {venue.name}
    //                   </label>
    //                 ))}
    //               </div>
    //             </div>

    //             <div>
    //               <label className="text-gray-500" htmlFor="">
    //                 Lost Date
    //               </label>
    //               <Popover>
    //                 <PopoverTrigger asChild>
    //                   <Button
    //                     variant={"outline"}
    //                     className={cn(
    //                       "w-full justify-start text-left font-normal",
    //                       !date && "text-muted-foreground"
    //                     )}
    //                   >
    //                     <CalendarCheck className="mr-2 h-4 w-4" />
    //                     {date ? format(date, "PPP") : <span>Pick a date</span>}
    //                   </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-auto p-0" align="start">
    //                   <Calendar
    //                     mode="single"
    //                     selected={date}
    //                     onSelect={setDate}
    //                     initialFocus
    //                     className="w-full"
    //                   />
    //                 </PopoverContent>
    //               </Popover>
    //             </div>

    //             <div className="grid w-full gap-1.5">
    //               <label className="text-gray-500" htmlFor="message">
    //                 Description (optional)
    //               </label>
    //               <Textarea
    //                 placeholder="Type your message here."
    //                 value={description}
    //                 onChange={(e) => setDescription(e.target.value)}
    //               />
    //             </div>

    //             <Button
    //               onClick={handleFormSubmit}
    //               className="w-full mt-3"
    //               type="submit"
    //             >
    //               Submit
    //             </Button>
    //           </form>
    //         </div>
    //       )}
    //     </>
    //   )}
    // </>

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
          {!showForm && (
            <div>
              <>
                <div className="">
                  <section className="-mt-40 " aria-disabled>
                    <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
                      <div className="mx-auto max-w-xl text-center  border-gray-400 shadow-lg p-10">
                        <p className="mt-4  mb-2 text-3xl ">
                          Describe your item with phrase
                        </p>
                        <hr className="mb-3" />
                        <div className="flex items-center gap-3">
                          <Input
                            className="dark:text-white"
                            placeholder="Example: A black sunglasses"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)} // Update inputText state on change
                            onKeyPress={handleKeyPress} // Call handleKeyPress when Enter is pressed
                          />
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
                </div>

                {/* //show similar images */}
                {done && (
                  <div className="-mt-40 ml-20 mr-20 ">
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
                                    <AlertDialogCancel>No</AlertDialogCancel>
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
              <div className="w-full border rounded-lg p-4 mt-14 grid grid-cols-5 gap-4">
                {docs.map((item, index) => (
                  <div key={index}>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Image
                          className="border"
                          src={item.imageUrl}
                          alt="image"
                          width="400"
                          height="400"
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-auto items-center flex flex-col justify-center">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center mx-auto mb-3">
                            Is this your item?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <Image
                              src={item.imageUrl}
                              alt="uploaded_Image"
                              width={300}
                              height={400}
                              className="rounded-lg"
                            />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-row gap-10">
                          <AlertDialogCancel>No</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleYesClick(item.imageUrl)}
                          >
                            Yes
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showForm && (
            <div className="shadow-md   p-4 mt-6 w-[600px] mx-auto">
              {/* <h2 className="tracking-normal mb-2 text-center items-center mx-auto text-xl">
        Provide details to successfully finish your request
      </h2> */}
              <form
                className="w-full flex flex-col gap-6"
                onSubmit={handleFormSubmit}
              >
                <div className="flex flex-row gap-4">
                  <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-1/2"
                    placeholder="Name"
                  />

                  <Input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>

                <div>
                  <h2 className="text-gray-500">
                    Select Venues (you can select up to 3)
                  </h2>
                  <div className="grid grid-cols-3 gap-1">
                    {options.map((venue) => (
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
                  <label className="text-gray-500" htmlFor="">
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
                </div>

                <div className="grid w-full gap-1.5">
                  <label className="text-gray-500" htmlFor="message">
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder="Type your message here."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleFormSubmit}
                  className="w-full mt-3"
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </div>
          )}
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default TextSearch;
