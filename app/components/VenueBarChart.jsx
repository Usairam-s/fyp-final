// components/VenueBarChart.js
"use client";
import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";

const VenueBarChart = () => {
  const [venues, setVenues] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/venues`);
      if (!response.ok) {
        throw new Error("Failed to fetch venues");
      }
      const data = await response.json();
      setVenues(data || []);
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
    const fetchData = async () => {
      setLoading(true);
      await fetchVenues();
      await fetchAllRequests();
      setLoading(false);
    };

    fetchData();
  }, []);

  const countRequestsByVenue = (venueId) => {
    return allRequests.filter((request) => request.venues.includes(venueId))
      .length;
  };

  const venueRequestCounts = venues.reduce((acc, venue) => {
    acc[venue._id] = countRequestsByVenue(venue._id);
    return acc;
  }, {});

  const sortedVenues = venues
    .map((venue) => ({
      ...venue,
      count: venueRequestCounts[venue._id] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  const maxCount = sortedVenues.length > 0 ? sortedVenues[0].count : 1;

  return (
    <div className="flex flex-col items-center mt-8 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 border border-slate-300 text-white p-6 w-full rounded-md h-[208px]">
      <h3 className="text-2xl font-bold mb-4">Venue Request Counts</h3>
      {loading ? (
        <div className="mt-4 flex mx-auto items-center justify-center">
          <Spinner color="info" aria-label="Info spinner example" />
        </div>
      ) : (
        <div className="flex flex-row justify-around w-full items-end">
          {sortedVenues.map((venue) => (
            <div key={venue._id} className="flex flex-col items-center mx-2">
              <span className="mb-1 font-bold">{venue.count}</span>
              <div
                className="bg-white text-black text-center flex items-end justify-center"
                style={{
                  height: `${(venue.count / maxCount) * 50}px`, // Adjusted height calculation
                  width: "40px",
                }}
              ></div>
              <p className="mt-2 text-center">{venue.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueBarChart;
