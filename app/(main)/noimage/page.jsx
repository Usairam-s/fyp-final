import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

function page() {
  return (
    <div>
      <div className="pt-24 mx-auto items-center flex justify-center flex-col gap-8">
        <h1 className="text-3xl font-semibold tracking-wide">
          Search without image
        </h1>
        <div className="flex flex-col gap-4">
          <Button
            className={cn(
              "uppercase px-40 py-6 hover:bg-gray-800 bg-black tracking-wider"
            )}
          >
            <Link href="/tagsearch">Search by Tag</Link>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "uppercase px-10 py-6 drop-shadow-2xl  tracking-wider"
            )}
          >
            <Link href="/textsearch">Search by text</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page;
