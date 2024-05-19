import React from "react";

const Testimonial = ({ username, email, feedback }) => {
  return (
    <div className=" rounded-md  mb-4">
      <h3 className="text-lg font-semibold">{username}</h3>
      <p className="text-gray-500 text-sm">{email}</p>
      <p className="mt-2">{feedback}</p>
    </div>
  );
};

export default Testimonial;
