import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SimpleScreen({
  title,
  firstButton,
  secondButton,
  hrefOne,
  hrefTwo,
  style = "",
}) {
  return (
    <div className="pt-24 mx-auto items-center flex justify-center flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-wide">{title}</h1>
      <div className="flex flex-col gap-4">
        <Button
          className={cn(
            "uppercase px-10 py-6 hover:bg-gray-800 bg-black tracking-wider",
            style
          )}
        >
          <Link href={hrefOne}>{firstButton}</Link>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "uppercase px-10 py-6 drop-shadow-2xl  tracking-wider",
            style
          )}
        >
          <Link href={hrefTwo}>{secondButton}</Link>
        </Button>
      </div>
    </div>
  );
}

export default SimpleScreen;
