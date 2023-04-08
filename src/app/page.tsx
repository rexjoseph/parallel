import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import OptForm from "@/components/OptForm";

export const metadata: Metadata = {
  title: "Parallel - Your personal assistant for Legal Requests ⚡️",
  description: "Open source",
};

export default function Home() {
  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 rounded-xl text-white">
      <div className="text-center max-w-7xl mx-auto pt-32 md:pt-40 pb-32 sm:py-52 flex flex-col sm:items-center justify-center">
        <div className="rounded-full w-fit text-xs text-gray-400 py-1 px-4 mb-4 bg-gray-900 border border-indigo-900/50 shadow-md">
          Parallel AI 2023 Official Preview
        </div>
        <Heading
          size="default"
          className="w-full max-w-3xl text-left md:text-center md:max-w-2xl text-3xl my-2 md:my-0 font-bold text-white md:text-5xl md:leading-tight"
        >
          Your personal assistant for Legal Requests
        </Heading>

        <Paragraph className="max-w-lg text-left md:text-center mt-4 text-base font-medium text-gray-400 md:text-xl">
          With the parallel API, you can easily draft subpeonas easily with an{" "}
          <Link
            href="/login"
            className="underline underline-offset-2 text-black dark:text-light"
          >
            API key
          </Link>
          . Be the first to gain access when we launch.
        </Paragraph>
        <OptForm />
        <div className="relative mt-12">
          <div className="relative w-full max-w-5xl shadow-indigo-800/10 rounded-2xl border overflow-hidden border-indigo-500/40">
            <div>
              <span
                style={{
                  boxSizing: "border-box",
                  display: "inline-block",
                  overflow: "hidden",
                  width: "initial",
                  height: "initial",
                  background: "none",
                  opacity: 1,
                  border: 0,
                  margin: 0,
                  padding: 0,
                  position: "relative",
                  maxWidth: "100%",
                }}
              >
                <span
                  style={{
                    boxSizing: "border-box",
                    display: "block",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0,
                    maxWidth: "100%",
                  }}
                ></span>
                {/* <Image
                  priority
                  className="img-shadow"
                  quality={100}
                  style={{objectFit: 'contain'}}
                  src="/original-painting-faces.jpeg"
                  alt="original painting"   
                /> */}
              </span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto text-left mt-16">
          <h3 className="text-3xl font-semibold">
            Create subpeonas from just phone numbers
          </h3>
          <p className="max-w-lg text-base font-medium text-gray-400 md:text-lg">
            As you prompt with a phone number and check off info being
            requested. The app automatically determines the carrier, ISP, address,
            template and draft the subpoena in seconds. Hit download and get the PDF.
          </p>
        </div>
        <section className="relative w-full max-w-4xl mx-auto mt-28">
          <div className="w-full grid md:grid-cols-2 gap-6 md:gap-12 text-left items-end my-12">
            <h2 className="text-white text-3xl md:text-5xl font-semibold leading-tight">
              Supercharged by
              <span className="text-cyan-400 block">ML</span>
            </h2>
            <p className="max-w-lg text-base font-medium text-gray-400 md:text-lg">
              Leverage the power of ML to produce higher quality written
              subpeonas while freeing up your time. Streamline your drafts and make
              it that much easier to quickly craft the perfect one.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-x-8 gap-y-10 md:gap-0 text-left pt-6">
            <div>
              <h3 className="text-2xl md:text-4xl font-medium mb-2">0</h3>
              <p className="text-sm text-gray-400">trained parameters (training)</p>
            </div>
            <div>
             <h3 className="text-2xl md:text-4xl font-medium mb-2">Context</h3>
             <p className="text-sm text-gray-400">understanding & interference</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-2xl md:text-4xl font-medium mb-2">Enhanced consistency</h3>
              <p className="text-sm text-gray-400">
              optimized suggestions to match your writing style
              </p>
            </div>
          </div>
        </section>
      </div>
      <footer className="text-white border-t border-gray-800">
          <div className="mx-auto max-w-md py-12 px-4 overflow-hidden sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <p className="-my-2 text-center text-base text-white">
              <span className="text-gray-400 group-hover:text-white transition">
                Parallel - Your personal assistant for Legal Requests ⚡️
              </span>
            </p>
          </div>
        </footer>
    </div>
  );
}
