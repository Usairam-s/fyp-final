import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-white drop-shadow-md text-3xl font-bold sm:text-5xl">
            Lost and Found System
          </h1>

          <p className=" text-gray-200 mt-4 ">
            Find your lost item using image. You can also find your item using
            tag if you don't have image 📷
          </p>

          <div className="mt-8 animate-pulse flex flex-wrap justify-center gap-4">
            <Button variant="secondary" asChild>
              <Link href="/services">Get Started ➡</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
