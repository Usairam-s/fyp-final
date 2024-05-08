"use client";
import { Button } from "@/components/ui/button";
import { Card } from "flowbite-react";
import Image from "next/image";

import { useRouter } from "next/navigation";

const usernames = [
  {
    name: "Usairam",
    image:
      "https://images.playground.com/85f1055d52144cceb7bc53b105e6fc5c.jpeg",
  },
  {
    name: "Najaf",
    image:
      "https://storage.googleapis.com/pai-images/0bdcfa13678847cc92770a6b42afd0f6.jpeg",
  },
  {
    name: "Laiba",
    image:
      "https://t3.ftcdn.net/jpg/06/24/56/28/360_F_624562803_eouJpZTTanYDz5t0SOYsMxQian05qMAT.webp",
  },
];

function ProfileCard({ onSelect }) {
  // Accept onSelect as a prop
  const router = useRouter();

  const handleProfileSelect = (username) => {
    onSelect(username); // Call onSelect to set the selected username in the parent component state
    router.push(`/dashboard`); // Navigate to /dashboard with the selected username as a query parameter
    localStorage.setItem("username", username);
  };

  return (
    <div className="flex overflow-x-auto">
      {usernames.map((username, index) => (
        <Card
          key={index}
          className="w-[250px] h-[300px] drop-shadow-2xl cursor-pointer mx-auto mt-28"
        >
          <div className="flex flex-row justify-center px-4 pt-4"></div>
          <div className="flex rounded-full flex-col items-center pb-10">
            <Image
              src={username.image}
              width={100}
              height={100}
              alt="image"
              className="rounded-full border drop-shadow-2xl"
            />
            <h5 className="my-2 text-xl font-medium text-gray-900 dark:text-white">
              {username.name}
            </h5>
            {/* Call handleProfileSelect when the button is clicked */}
            <Button
              variant="link"
              onClick={() => handleProfileSelect(username.name)}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ProfileCard;
