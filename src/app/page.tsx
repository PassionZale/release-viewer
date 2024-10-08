"use client";

import LayoutHome from "@/components/layouts/LayoutHome";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { Skeleton } from "@/components/ui/skeleton";
import useDicStore from "@/stores/dict";
import {
  IconBrandGithub,
  IconBrandNextjs,
  IconBrandTailwind,
  IconBug,
  IconMessageChatbot,
  IconRocket,
} from "@tabler/icons-react";

export default function Home() {
  const platforms = useDicStore((state) => state.platforms);

  const words = platforms.map(({ label }) => label);

  return (
    <LayoutHome>
      <div className="relative overflow-hidden">
        <div className="container py-20 lg:py-24">
          <div className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Release Viewer
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              micro platform to preview all release logs.
            </p>
            <div className="hidden md:block mt-7 mx-auto max-w-xl relative">
              <div className="relative z-10 p-6 border bg-background rounded-lg shadow-lg">
                <div className="flex-[1_0_0%] text-xl flex items-center justify-center">
                  Release logs of
                  {words?.length ? (
                    <FlipWords words={words} duration={2400} />
                  ) : (
                    <Skeleton className="w-[100px] h-[1.25rem] mx-4 inline-block" />
                  )}
                  is Omost there!
                </div>
              </div>

              <div className="absolute top-0 end-0 -translate-y-12 translate-x-20">
                <svg
                  className="w-16 h-auto text-orange-500"
                  width={121}
                  height={135}
                  viewBox="0 0 121 135"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <path
                    d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <path
                    d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="absolute bottom-0 start-0 translate-y-10 -translate-x-32">
                <svg
                  className="w-40 h-auto text-cyan-500"
                  width={347}
                  height={188}
                  viewBox="0 0 347 188"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                    stroke="currentColor"
                    strokeWidth={7}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-10 sm:mt-20">
              <button
                className="p-[3px] relative"
                onClick={() => (window.location.href = "/admin/release/create")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent break-keep	">
                  发布应用
                  <IconRocket className="w-5 h-5 inline ml-2" />
                </div>
              </button>
            </div>

            <div className="mt-10 sm:mt-20 flex flex-wrap gap-2 justify-center">
              <Button
                variant={"outline"}
                onClick={() => window.open("https://nextjs.org/", "_blank")}
              >
                <IconBrandNextjs className="flex-shrink-0 w-6 h-auto mr-2" />
                Nextjs
              </Button>

              <Button
                variant={"outline"}
                onClick={() =>
                  window.open("https://tailwindcss.com/", "_blank")
                }
              >
                <IconBrandTailwind className="flex-shrink-0 w-6 h-auto mr-2" />
                Tailwindcss
              </Button>

              <Button
                variant={"outline"}
                onClick={() =>
                  window.open(
                    "https://github.com/PassionZale/release-viewer/issues/new"
                  )
                }
              >
                <IconBug className="flex-shrink-0 w-6 h-auto mr-2" />
                报告问题
              </Button>

              <Button
                variant={"outline"}
                onClick={() =>
                  window.open("https://github.com/PassionZale", "_blank")
                }
              >
                <IconBrandGithub className="flex-shrink-0 w-6 h-auto mr-2" />
                @PassionZale
              </Button>

              <Button
                variant={"outline"}
                onClick={() =>
                  window.open("https://www.lovchun.com/", "_blank")
                }
              >
                <IconMessageChatbot className="flex-shrink-0 w-6 h-auto mr-2" />
                Lei Zhang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LayoutHome>
  );
}
