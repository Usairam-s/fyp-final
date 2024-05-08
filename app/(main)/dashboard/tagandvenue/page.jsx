"use client";
import React, { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "flowbite-react";

function TagVenue() {
  const [tags, setTags] = useState([]);
  const [options, setOptions] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  //loading variable
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/venues`);
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setOptions(data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchAllRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/allrequests`);
      if (!response.ok) {
        throw new Error("Failed to fetch all requests");
      }
      const data = await response.json();
      setAllRequests(data);
    } catch (error) {
      console.error("Error fetching all requests:", error);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchVenues();
    fetchAllRequests();
    setLoading(false);
  }, []);
  useEffect(() => {
    console.log(allRequests);
  }, [allRequests]);

  const countRequestsByTag = (tagId) => {
    return allRequests.filter((request) => request.tag === tagId).length;
  };

  const countRequestsByVenue = (venueId) => {
    return allRequests.filter((request) => request.venues.includes(venueId))
      .length;
  };

  return (
    <>
      <h2 className="text-center mx-auto font-medium text-4xl -mt-2 mb-4">
        Tag and Venues
      </h2>
      <div className="border-2 rounded-lg p-6 flex flex-row  justify-around">
        <Command className="w-[300px]  p-2">
          <CommandInput
            className="text-black font-medium text"
            placeholder="Search a tag"
          />
          <CommandList className="ml-8">
            {loading ? (
              <>
                {" "}
                <div className="mt-4 flex mx-auto items-center  justify-center">
                  <Spinner color="info" aria-label="Info spinner example" />
                </div>
              </>
            ) : (
              <>
                {" "}
                <CommandEmpty>No results found.</CommandEmpty>
                {tags.map((tag) => (
                  <CommandItem
                    className="flex justify-between px-2"
                    key={tag._id}
                  >
                    {tag.name}
                    <div className="h-6 w-6 rounded-full text-white bg-primary items-center flex justify-center">
                      <span>{countRequestsByTag(tag._id)}</span>
                    </div>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
        <Command className="w-[300px]  p-2">
          <CommandInput
            className="text-black font-medium text"
            placeholder="Search a venue"
          />
          <CommandList className="ml-8">
            {loading ? (
              <>
                <div className="mt-4 flex mx-auto items-center  justify-center">
                  <Spinner color="info" aria-label="Info spinner example" />
                </div>
              </>
            ) : (
              <>
                {" "}
                <CommandEmpty>No results found.</CommandEmpty>
                {options.map((option) => (
                  <CommandItem
                    className="flex justify-between px-2"
                    key={option._id}
                  >
                    {option.name}
                    <div className="h-6 w-6 rounded-full text-white bg-primary items-center flex justify-center">
                      <span>{countRequestsByVenue(option._id)}</span>
                    </div>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </div>
    </>
  );
}

export default TagVenue;
