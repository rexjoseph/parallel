"use client";

import { publicRequest } from "@/requestMethods";
import { FC, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Image from "next/image";

interface IDataReceived {
  carrier_name: string;
}

interface PromptProps {
  apiKey: {
    enabled: boolean;
    id: string;
    key: string;
    userId: string;
  };
}

const PromptForm: FC<PromptProps> = ({ apiKey }) => {
  const [number, setNumber] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptResReceived, setPromptResReceived] = useState(null);
  const [dataReceived, setDataReceived] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const [isPhoneTab, setIsPhoneTab] = useState(false);
  const [isPoenaTab, setIsPoenaTab] = useState(false);

  const switchPhone = () => {
    setIsPoenaTab(false);
    setIsPhoneTab((prev) => !prev);
  };

  const switchPoena = () => {
    setIsPhoneTab(false);
    setIsPoenaTab((prev) => !prev);
  };

  const handlePhoneSubmit: (e: FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    setNumber('');
    try {
      setIsFetching(true);
      const res = await axios.post(
        `https://parallel-iota.vercel.app/api/v1/phone`,
        {
          number: number,
        },
        {
          headers: {
            Authorization: apiKey.key,
          },
        }
      );
      console.log(res);
      setIsFetching(false);
      setDataReceived(res.data.data);
      console.log(dataReceived);
    } catch (err) {}
  };

  const handlePromptSubmit: (e: FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    setPrompt('');
    try {
      setIsPrompting(true);
      const res = await axios.post(
        `https://parallel-iota.vercel.app/api/v1/parallel`,
        {
          prompt: prompt,
        },
        {
          headers: {
            Authorization: apiKey.key,
          },
        }
      );
      console.log(res);
      setIsPrompting(false);
      setPromptResReceived(res.data.data);
      // console.log(promptResReceived);
    } catch (err) {}
  };

  return (
    <>
      <div>
        <div className='flex gap-3'>
          <button type="button" className="border border-white rounded-full px-4 py-1 text-xs font-semibold" onClick={switchPhone}>Phone</button>
          <button type="button" className="border border-white rounded-full px-4 py-1 text-xs font-semibold" onClick={switchPoena}>Subpoena</button>
        </div>
      </div>
      {isPhoneTab ? (
          <div className="mt-3">
            <div className="text-sm mb-6">
              {dataReceived && (
                <div className="flex items-center flex-row gap-2">
                  <div>
                    <Image width={10} height={10} src="/favicon-32x32.png" alt="Jared" className="w-10 h-10 p-1 rounded-full" />
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: dataReceived }}></div>
                </div>
              )}
              {isFetching && 
              <div className="mt-3 mb-6">
                <div className="flex items-center flex-row gap-2">
                  <div>
                    <Image width={10} height={10} src="/favicon-32x32.png" alt="Jared" className="w-10 h-10 p-1 rounded-full" />
                  </div>
                  <div>Checking carrier. Hang tight...</div>
                </div>
              </div>}
            </div>
            <form onSubmit={handlePhoneSubmit}>
              <div className="flex flex-row relative grow w-full">
                <input onChange={(e) => setNumber(e.target.value)} placeholder="Drop a number..." style={{maxHeight: "200px", height: "24px", overflowY: "hidden"}} className="border rounded-md px-4 py-3 dark\:bg-gray-700 outline-0 text-xs m-0 w-full resize-none pt-5 pb-5 pr-7 pl-2 md\:pl-0 dark\:bg-gray-700" />
                <button disabled={number.length < 10} className=":disabled  rounded-md p-1 text-gray-500 disabled\:opacity-40:disabled">
                  <svg className="w-4 h-4 mr-1" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </form>
          </div>
        ) : isPoenaTab ? (
          <div className="mt-3">
            <div className="text-sm mb-6">
              {promptResReceived && (
                <div className="flex items-center flex-row gap-2">
                  <div>
                    <Image width={10} height={10} src="/favicon-32x32.png" alt="Jared" className="w-10 h-10 p-1 rounded-full" />
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: promptResReceived }}></div>
                </div>
              )}
              {isPrompting && 
                <div className="mt-3 mb-6">
                  <div className="flex items-center flex-row gap-2">
                    <div>
                      <Image width={10} height={10} src="/favicon-32x32.png" alt="Jared" className="w-10 h-10 p-1 rounded-full" />
                    </div>
                    <div>Running your errand. Hang tight...</div>
                  </div>
                </div>}
            </div>
            <form onSubmit={handlePromptSubmit}>
              <div className="flex flex-row relative grow w-full">
                <input onChange={(e) => setPrompt(e.target.value)} placeholder="Send a prompt..." style={{maxHeight: "200px", height: "24px", overflowY: "hidden"}} className="border rounded-md px-4 py-3 dark\:bg-gray-700 outline-0 text-xs m-0 w-full resize-none pt-5 pb-5 pr-7 pl-2 md\:pl-0 dark\:bg-gray-700" />
                <button disabled={prompt.length < 10} className=":disabled  rounded-md p-1 text-gray-500 disabled\:opacity-40:disabled">
                  <svg className="w-4 h-4 mr-1" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-3 text-sm">No tab selected</div>
        )}
    </>
  );
};

export default PromptForm;
