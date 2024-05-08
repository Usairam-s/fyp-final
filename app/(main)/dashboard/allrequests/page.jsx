"use client";
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Link from "next/link";
// import { Eye } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// function formatDate(dateString) {
//   const options = { day: "2-digit", month: "2-digit", year: "numeric" };
//   return new Date(dateString)
//     .toLocaleDateString("en-US", options)
//     .replace(/\//g, "-");
// }

// function DashAllRequests() {
//   const [loading, setLoading] = useState(true);
//   const [allRequests, setAllRequests] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const getAllRequests = async () => {
//     const response = await fetch("http://localhost:5000/api/allrequests");
//     const data = await response.json();
//     console.log(data);
//     setAllRequests(data);
//     setLoading(false);
//   };
//   useEffect(() => {
//     getAllRequests();
//     console.log(allRequests);
//   }, []);

//   useEffect(() => {
//     const filteredRequests = allRequests.filter(
//       (request) => request.status === selectedStatus
//     );
//     setAllRequests(filteredRequests);
//   }, [selectedStatus]);

//   const handleStatusChange = async (selectedStatus) => {
//     setSelectedStatus(selectedStatus);
//     console.log(selectedStatus);
//   };

//   return (
//     <>
//       {loading ? (
//         <div className="h-screen flex items-center justify-center">
//           <div className="text-9xl ml-80 -mt-28 text-primary text-center animate-spin">
//             ❖
//           </div>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-3xl flex flex-row items-center justify-between px-6 mb-4 font-semibold">
//             All Requests
//             <div className="flex flex-row items-center gap-3">
//               <span className="text-sm">Filter by Status :</span>{" "}
//               <Select onValueChange={handleStatusChange}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pending">pending</SelectItem>
//                   <hr />
//                   <SelectItem value="approved">approved</SelectItem>
//                   <hr />
//                   <SelectItem value="rejected">rejected</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </h2>
//           <div className="border rounded-lg p-4">
//             <Table>
//               <TableCaption>All Requests.</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[200px]">Submission Date</TableHead>
//                   <TableHead>Reference No</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead className="text-right">Status</TableHead>
//                   <TableHead className="text-right">View</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {allRequests.map((request) => (
//                   <TableRow key={request._id}>
//                     <TableCell className="font-medium">
//                       {formatDate(request.lostDate)}
//                     </TableCell>
//                     <TableCell>{request._id}</TableCell>
//                     <TableCell>{request.email}</TableCell>
//                     <TableCell
//                       className={cn(
//                         `text-right font-normal text-xl`,
//                         request.status === "pending"
//                           ? "text-yellow-400"
//                           : request.status === "approved"
//                           ? "text-green-600"
//                           : request.status === "rejected"
//                           ? "text-red-600"
//                           : "text-gray-600"
//                       )}
//                     >
//                       {request.status}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {" "}
//                       <Link href={`/dashboard/request/${request._id}`}>
//                         <Eye />
//                       </Link>{" "}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default DashAllRequests;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString)
    .toLocaleDateString("en-US", options)
    .replace(/\//g, "-");
}

function DashAllRequests() {
  const [loading, setLoading] = useState(true);
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("none"); // Initialize to "none"

  const getAllRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/allrequests");
      const data = await response.json();
      console.log(data);
      setAllRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  useEffect(() => {
    if (selectedStatus === "none") {
      setFilteredRequests(allRequests);
    } else if (selectedStatus) {
      const filtered = allRequests.filter(
        (request) => request.status === selectedStatus
      );
      setFilteredRequests(filtered);
    }
  }, [selectedStatus, allRequests]);

  const handleStatusChange = async (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    console.log(selectedStatus);
  };

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="text-9xl ml-80 -mt-28 text-primary text-center animate-spin">
            ❖
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl flex flex-row items-center justify-between px-6 mb-4 font-semibold">
            All Requests
            <div className="flex flex-row items-center gap-3">
              <span className="text-sm">Filter by Status :</span>{" "}
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">none</SelectItem>
                  <hr />
                  <SelectItem value="pending">pending</SelectItem>
                  <hr />
                  <SelectItem value="approved">approved</SelectItem>
                  <hr />
                  <SelectItem value="rejected">rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </h2>
          <div className="border rounded-lg p-4">
            <Table>
              <TableCaption>All Requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Submission Date</TableHead>
                  <TableHead>Reference No</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {formatDate(request.lostDate)}
                    </TableCell>
                    <TableCell>{request._id}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell
                      className={cn(
                        `text-right font-normal text-xl`,
                        request.status === "pending"
                          ? "text-yellow-400"
                          : request.status === "approved"
                          ? "text-green-600"
                          : request.status === "rejected"
                          ? "text-red-600"
                          : "text-gray-600"
                      )}
                    >
                      {request.status}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/request/${request._id}`}>
                        <Eye />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

export default DashAllRequests;
