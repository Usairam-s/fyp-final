"use client";
// import React, { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// function TagSearch() {
//   const [tags, setTags] = useState([]);
//   useEffect(() => {
//     getData();
//   }, []);

//   const getData = async () => {
//     const response = fetch("http://localhost:5000/api/tags", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .catch((error) => console.log(error));
//     setTags(await response);
//   };

//   return (
//     <>
//       <h2 className="text-center pt-14 pb-4 text-2xl font-semibold">
//         Select a tag to filter by
//       </h2>
//       <div className="mx-auto flex justify-center items-center">
//         <Select>
//           <SelectTrigger className="w-[280px]">
//             <SelectValue placeholder="Tag" />
//           </SelectTrigger>
//           <SelectContent>
//             {tags.map((tag, index) => (
//               <SelectItem key={index} value={tag.name}>
//                 {tag.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </>
//   );
// }

// export default TagSearch;

"use client";
// import React, { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { CalendarCheck } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Textarea } from "@/components/ui/textarea";

// function TagSearch() {
//   const [tags, setTags] = useState([]);
//   const [selectTag, setSelectedTag] = useState("");
//   const [docs, setDocs] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [lostItemImageUrl, setLostItemImageUrl] = useState("");
//   const [options, setOptions] = useState([]);
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [date, setDate] = useState();

//   const getTags = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/tags`);
//       const data = await response.json();
//       setTags(data); // Set the fetched tags in state
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
//   const getAllVenues = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/venues`);
//       const data = await response.json();
//       console.log(data);
//       // Extract the venues array from the response data
//       const venues = data.venues || [];
//       // Update options state with the venues array
//       setOptions(venues);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   useEffect(() => {
//     getAllVenues();
//   }, []);

//   const handleTagChange = async (selectedTag) => {
//     setSelectedTag(selectedTag);
//     if (selectedTag) {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/search/?tag=${selectedTag}`
//         );
//         const data = await response.json();
//         setDocs(data);
//         // Handle and display fetched documents here (optional)
//       } catch (error) {
//         console.error("Error fetching documents:", error);
//       }
//     }
//     console.log("Selected tag:", selectedTag);
//     // Update the state as well
//   };

//   useEffect(() => {
//     getTags();
//   }, []);

//   useEffect(() => {
//     console.log("Lost item image URL:", lostItemImageUrl);
//   }, [lostItemImageUrl]);

//   const handleYesClick = async (url) => {
//     setLostItemImageUrl(url);
//     console.log(lostItemImageUrl);
//     setShowForm(true);
//   };

//   const handleCheckboxChange = (event) => {
//     const { value, checked } = event.target;

//     // Check if the option is being selected or deselected
//     if (checked) {
//       // Check if the limit of 3 selections has been reached
//       if (selectedValues.length < 3) {
//         // Add the selected option to the array
//         setSelectedValues((prevSelectedValues) => [
//           ...prevSelectedValues,
//           value,
//         ]);
//       } else {
//         // Display a message or handle it in any way you prefer when the limit is reached
//         alert("You can only select up to 3 options.");
//         event.preventDefault(); // Prevent selecting more than 3 options
//       }
//     } else {
//       // Remove the option from the array if it's being deselected
//       setSelectedValues((prevSelectedValues) =>
//         prevSelectedValues.filter((val) => val !== value)
//       );
//     }
//   };

//   return (
//     <>
//       {!showForm && (
//         <div>
//           <div className="mx-auto max-w-[300px] mt-10 ">
//             <h2 className="font-semibold text-2xl mb-2">Search by tags</h2>
//             <Select onValueChange={handleTagChange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a tag" />
//               </SelectTrigger>
//               <SelectContent>
//                 {tags.map((tag) => (
//                   <SelectItem key={tag.name} value={tag.name}>
//                     {tag.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="w-full border rounded-lg p-4 mt-14 grid grid-cols-5 gap-4">
//             {docs.map((item, index) => (
//               <div key={index}>
//                 <AlertDialog>
//                   <AlertDialogTrigger>
//                     <Image
//                       className="border"
//                       src={item.imageUrl}
//                       alt="image"
//                       width="400"
//                       height="400"
//                     />
//                   </AlertDialogTrigger>
//                   <AlertDialogContent className="mx-auto items-center flex flex-col justify-center">
//                     <AlertDialogHeader>
//                       <AlertDialogTitle className="text-center mx-auto mb-3">
//                         Is this your item?
//                       </AlertDialogTitle>
//                       <AlertDialogDescription>
//                         <Image
//                           src={item.imageUrl}
//                           alt="uploaded_Image"
//                           width={300}
//                           height={400}
//                           className="rounded-lg"
//                         />
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter className="flex flex-row gap-10">
//                       <AlertDialogCancel>No</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={() => handleYesClick(item.imageUrl)}
//                       >
//                         Yes
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {showForm && (
//         <div className="shadow-md   p-4 mt-2 w-[500px] mx-auto">
//           <h2 className="tracking-normal mb-2 text-center items-center mx-auto text-xl">
//             Provide details to successfully finish your request
//           </h2>
//           <form className="w-full flex flex-col gap-4">
//             <div>
//               <label className="text-gray-500">Email</label>
//               <Input name="email" />
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

//             {/* <div>
//               <h2 className="text-gray-500">
//                 Select Venues (you can select up to 3)
//               </h2>
//               {options.map((venue) => (
//                 <div className="grid grid-cols-3" key={venue._id}>
//                   <label className="flex  flex-row items-center gap-1">
//                     <input
//                       type="checkbox"
//                       value={venue._id}
//                       checked={selectedValues.includes(venue._id)}
//                       onChange={handleCheckboxChange}
//                     />
//                     {venue.name}
//                   </label>
//                 </div>
//               ))}
//             </div> */}
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
//               <Textarea placeholder="Type your message here." />
//             </div>
//           </form>
//           <Button className="w-full mt-3">Submit</Button>
//         </div>
//       )}
//     </>
//   );
// }

// export default TagSearch;

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import useCopyClipboard from "@/hooks/useClipboardCopy";
import { CopyIcon } from "lucide-react";
import toast from "react-hot-toast";

function TagSearch() {
  const copyToClipboard = useCopyClipboard();
  const [clipboardClick, setClipboardClick] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectTag, setSelectedTag] = useState("");
  const [docs, setDocs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lostItemImageUrl, setLostItemImageUrl] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [date, setDate] = useState();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trackId, setTrackId] = useState("");
  const [haveTrackId, setHaveTrackId] = useState(false);

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

  const handleTagChange = async (selectedTag) => {
    const toastId = toast.loading("Please wait...");
    setSelectedTag(selectedTag);
    if (selectedTag) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/search/?tag=${selectedTag}`
        );
        const data = await response.json();
        setDocs(data);
        if (data.length === 0) {
          toast.error("No item found in this category", { id: toastId });
        } else {
          toast.success("See items below...", { id: toastId });
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Something went wrong", { id: toastId });
      }
    }
  };

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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
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
          {!showForm && (
            <div className="px-10">
              <div className="mx-auto max-w-[300px] mt-10 ">
                <h2 className="font-semibold text-2xl mb-2">Search by tags</h2>
                <Select onValueChange={handleTagChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.name} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full    rounded-lg p-4 mt-14 grid grid-cols-5 gap-4">
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
    </>
  );
}

export default TagSearch;
