import SimpleScreen from "@/app/components/simpleScreen";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function ServicesPage() {
  return (
    <div>
      <SimpleScreen
        title="What service you want?"
        firstButton="Find you lost item     ⇢"
        secondButton="Check request status    ⇢"
        hrefOne={"/request"}
        hrefTwo={"/checkstatus"}
      />
    </div>
  );
}

export default ServicesPage;
