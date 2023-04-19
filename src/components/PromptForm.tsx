"use client";

import { publicRequest } from "@/requestMethods";
import { FC, useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toast } from "./ui/Toast";

interface IDataReceived {
  carrier_name: string;
}

type CurrentUser = {
  name?: string;
  email?: string;
  image?: string;
};

interface PromptProps {
  apiKey: {
    enabled: boolean;
    id: string;
    key: string;
    userId: string;
  };
  currentUser: CurrentUser;
}

interface ChatMessage {
  user: string;
  content: string;
}

const PromptForm: FC<PromptProps> = ({ apiKey, currentUser }) => {
  const [number, setNumber] = useState("");
  const [prompt, setPrompt] = useState("");
  /* const [response, setResponse] = useState<String>("");
  const [loading, setLoading] = useState(false); */
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [phoneLog, setPhoneLog] = useState<ChatMessage[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const [isPhoneTab, setIsPhoneTab] = useState(false);
  const [isPoenaTab, setIsPoenaTab] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);

  const switchPhone = () => {
    setIsPoenaTab(false);
    setIsPhoneTab((prev) => !prev);
  };

  const switchPoena = () => {
    setIsPhoneTab(false);
    setIsPoenaTab((prev) => !prev);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const handlePhoneSubmit: (e: FormEvent<HTMLFormElement>) => void = async (
    e
  ) => {
    e.preventDefault();
    try {
      await setIsFetching(true);
      let phoneLogNew = [...phoneLog, { user: "me", content: `${number}` }];
      setPhoneLog(phoneLogNew);
      const res = await axios.post(
        `https://parallel-ai.herokuapp.com/api/v1/phone`,
        {
          number: number,
        },
        {
          headers: {
            Authorization: apiKey.key,
          },
        }
      );
      await setNumber("");
      // console.log(res);
      await setIsFetching(false);
      if (res.data.error === "Too many requests. Give it a break") {
        return toast({
          title: "Hourly limit reached",
          message: "Too many requests. Give it a break",
          type: "error",
        });
      }
      await setPhoneLog([
        ...phoneLogNew,
        { user: "chatgpt", content: res.data.data },
      ]);
    } catch (err: any) {
      await setNumber("");
      await setIsFetching(false);
      return toast({
        title: "Invalid number",
        message: err.response.data.message,
        type: "error",
      });
    }
  };

  const handlePromptSubmit: (e: FormEvent<HTMLFormElement>) => void = async (
    e
  ) => {
    e.preventDefault();
    await setIsPrompting(true);
    await setPrompt("");
    let chatLogNew = [...chatLog, { user: "me", content: `${prompt}` }];
    setChatLog(chatLogNew);
    const messages = chatLogNew.map((message) => message.content).join("\n");
    const response = await fetch("https://parallel-ai.herokuapp.com/api/v1/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey.key,
      },
      body: JSON.stringify({
        prompt: messages,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    await setIsPrompting(false);
    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
  
    setChatLog((prev) => [...prev, { user: "chatgpt", content: "" }]);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setChatLog((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev.slice(-1)[0],
          content: prev.slice(-1)[0].content + chunkValue,
        },
      ]);
    }
  };

  const welcomeTypes = ["Good morning", "Good afternoon", "Good evening"];
  const hour = new Date().getHours();

  return (
    <>
      {isPhoneTab ? (
        <>
        <div style={{ height: "90vh" }} className="w-full relative flex">
          {/* this houses the left pane */}
          <div
            style={{ backgroundColor: "#000", position: "fixed" }}
            id="right-panel-div"
            className="fixed left-0 top-20 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[17px] transition-all sm:relative sm:top-0"
          >
            <div className="flex h-full min-h-0 flex-col ">
              <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                  <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Documents
                  </a>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex h-full max-w-full flex-1 flex-col">
            <main className="relative h-full w-full transition-width flex flex-col items-stretch flex-1">
              <div className="flex-1 pb-20">
                <div className="dark:bg-gray-800">
                  <div className="">
                    <div
                      className="flex flex-col items-center text-sm dark:bg-gray-800"
                      onClick={switchPhone}
                    >
                      <span className="cursor-pointer underline">back</span>
                    </div>
                    <div className="flex flex-col items-center text-sm dark:bg-gray-800">
                      {phoneLog.map((message, index) => {
                        return (
                          <div
                            ref={scroll}
                            key={index}
                            className="group w-full text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                          >
                            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
                              <div className="w-[30px] flex relative items-start">
                                {message.user === "me" && (
                                  <div className="relative flex">
                                    <span
                                      style={{
                                        boxSizing: "border-box",
                                        display: "inline-block",
                                        overflow: "hidden",
                                        width: "initial",
                                        height: "initial",
                                        background: "none",
                                        opacity: "1",
                                        border: "0px",
                                        margin: "0px",
                                        padding: "0px",
                                        position: "relative",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      <Image
                                        src={`${currentUser.image}`}
                                        width={20}
                                        height={20}
                                        alt={`${currentUser.email}`}
                                      />
                                    </span>
                                  </div>
                                )}
                                {message.user === "chatgpt" && (
                                  <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center">
                                    <svg
                                      width="41"
                                      height="41"
                                      viewBox="0 0 41 41"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      strokeWidth="1.5"
                                      className="h-6 w-6"
                                    >
                                      <path
                                        d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                                        fill="currentColor"
                                      ></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                                <div className="flex flex-grow flex-col gap-3">
                                  <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                                    <div className="text-base markdown prose w-full break-words dark:prose-invert dark">
                                      {message.content}
                                    </div>
                                  </div>
                                </div>
                                {message.user === "chatgpt" && (
                                  <div className="flex justify-between lg:block">
                                    <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            message.content
                                          );

                                          toast({
                                            title: "Copied",
                                            message:
                                              "Response copied to clipboard",
                                            type: "success",
                                          });
                                        }}
                                        className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={20}
                                          height={20}
                                          fill="none"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          className="tabler-icon tabler-icon-copy"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
                                          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              {/* this holds the form */}
              <div
                style={{ backgroundColor: "#000" }}
                className="bottom-0 fixed w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 dark:border-white/20 dark:via-[#343541] dark:to-[#343541] md:pt-2"
              >
                {isFetching && (
                  <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto">
                    <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                      <div className="flex flex-grow flex-col gap-3">
                        <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                          <div className="text-sm markdown prose w-full break-words dark:prose-invert dark">
                            Loading
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <form
                  onSubmit={handlePhoneSubmit}
                  className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
                >
                  <div className="relative flex h-full flex-1 md:flex-col">
                    <div className="flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center"></div>
                    <div className="flex flex-col w-full flex-grow relative bg-white dark:text-white dark:bg-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                      <textarea
                        tabIndex={0}
                        data-id="root"
                        style={{ maxHeight: "200px", overflowY: "hidden" }}
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        rows={1}
                        placeholder="e.g +17609355809"
                        className="text-base font-medium rounded-md outline-0 m-0 md:pl-4 w-full resize-none border-0 bg-transparent py-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2"
                      ></textarea>
                      <button className="absolute p-1 rounded-md text-gray-500 bottom-1.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </>
      ) : isPoenaTab ? (
        <>
          <div style={{ height: "90vh" }} className="w-full relative flex">
            {/* this houses the left pane */}
            <div
              style={{ backgroundColor: "#000", position: "fixed" }}
              id="right-panel-div"
              className="fixed left-0 top-20 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[17px] transition-all sm:relative sm:top-0"
            >
              <div className="flex h-full min-h-0 flex-col ">
                <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                  <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                    <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Documents
                    </a>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex h-full max-w-full flex-1 flex-col">
              <main className="relative h-full w-full transition-width flex flex-col items-stretch flex-1">
                <div className="flex-1 pb-20">
                  <div className="dark:bg-gray-800">
                    <div className="">
                      <div
                        className="flex flex-col items-center text-sm dark:bg-gray-800"
                        onClick={switchPoena}
                      >
                        <span className="cursor-pointer underline">back</span>
                      </div>
                      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
                        {chatLog.map((message, index) => {
                          return (
                            <div
                              ref={scroll}
                              key={index}
                              className="group w-full text-gray-800 dark:text-gray-100 dark:bg-gray-800"
                            >
                              <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
                                <div className="w-[30px] flex relative items-start">
                                  {message.user === "me" && (
                                    <div className="relative flex">
                                      <span
                                        style={{
                                          boxSizing: "border-box",
                                          display: "inline-block",
                                          overflow: "hidden",
                                          width: "initial",
                                          height: "initial",
                                          background: "none",
                                          opacity: "1",
                                          border: "0px",
                                          margin: "0px",
                                          padding: "0px",
                                          position: "relative",
                                          maxWidth: "100%",
                                        }}
                                      >
                                        <Image
                                          src={`${currentUser.image}`}
                                          width={20}
                                          height={20}
                                          alt={`${currentUser.email}`}
                                        />
                                      </span>
                                    </div>
                                  )}
                                  {message.user === "chatgpt" && (
                                    <div className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center">
                                      <svg
                                        width="41"
                                        height="41"
                                        viewBox="0 0 41 41"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        strokeWidth="1.5"
                                        className="h-6 w-6"
                                      >
                                        <path
                                          d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                                          fill="currentColor"
                                        ></path>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                                  <div className="flex flex-grow flex-col gap-3">
                                    <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                                      <div className="text-base markdown prose w-full break-words dark:prose-invert dark">
                                        {message.content}
                                      </div>
                                    </div>
                                  </div>
                                  {message.user === "chatgpt" && (
                                    <div className="flex justify-between lg:block">
                                      <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              message.content
                                            );

                                            toast({
                                              title: "Copied",
                                              message:
                                                "Response copied to clipboard",
                                              type: "success",
                                            });
                                          }}
                                          className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={20}
                                            height={20}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            className="tabler-icon tabler-icon-copy"
                                            viewBox="0 0 24 24"
                                          >
                                            <path d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
                                            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {/* this holds the form */}
                <div
                  style={{ backgroundColor: "#000" }}
                  className="bottom-0 fixed w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 dark:border-white/20 dark:via-[#343541] dark:to-[#343541] md:pt-2"
                >
                  {isPrompting && (
                    <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto">
                      <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex flex-grow flex-col gap-3">
                          <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                            <div className="text-sm markdown prose w-full break-words dark:prose-invert dark">
                              Loading
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <form
                    onSubmit={handlePromptSubmit}
                    className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
                  >
                    <div className="relative flex h-full flex-1 md:flex-col">
                      <div className="flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center"></div>
                      <div className="flex flex-col w-full flex-grow relative bg-white dark:text-white dark:bg-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                        <textarea
                          tabIndex={0}
                          data-id="root"
                          style={{ maxHeight: "200px", overflowY: "hidden" }}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          rows={1}
                          placeholder="Send a message..."
                          className="text-base font-medium rounded-md outline-0 m-0 md:pl-4 w-full resize-none border-0 bg-transparent py-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2"
                        ></textarea>
                        <button className="absolute p-1 rounded-md text-gray-500 bottom-1.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{ height: "90vh" }}
            className="overflow-hidden w-full relative flex"
          >
            <div className="flex h-full max-w-full flex-1 flex-col">
              <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                <div className="flex-1 overflow-hidden">
                  <div className="dark:bg-gray-800">
                    <div className="">
                      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
                        <div className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
                          <h1 className="text-4xl font-semibold text-center mt-6 sm:mt-[10vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
                            {hour < 12 ? (
                              <>{welcomeTypes[0]}</>
                            ) : hour < 18 ? (
                              <>{welcomeTypes[1]}</>
                            ) : (
                              <>{welcomeTypes[2]}</>
                            )}
                          </h1>
                          <div className="md:flex items-start text-center gap-3.5">
                            <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                              <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="1em"
                                  height="1em"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx={12} cy={12} r={5} />
                                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                                Carrier Prompt Example
                              </h2>
                              <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                                <button className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900">
                                  +17609355809
                                </button>
                              </ul>
                            </div>
                            <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                              <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                  className="h-6 w-6"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                                  />
                                </svg>
                                Legal Assistant Example
                              </h2>
                              <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                                <button className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900">
                                  Serve a subpoeana for [number]
                                </button>
                              </ul>
                            </div>
                            <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                              <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="1em"
                                  height="1em"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                                </svg>
                                Choose Tab
                              </h2>
                              <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                                <button
                                  type="button"
                                  className="border border-white rounded-full px-4 py-1 text-base font-semibold"
                                  onClick={switchPhone}
                                >
                                  Phone
                                </button>
                                <button
                                  type="button"
                                  className="border border-white rounded-full px-4 py-1 text-base font-semibold"
                                  onClick={switchPoena}
                                >
                                  Subpoena
                                </button>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PromptForm;
