"use client";

import axios from "axios";
import { FC, useState, ChangeEvent, FormEvent } from "react";

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
  const [dataReceived, setDataReceived] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit: (e: FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    setDataReceived(null);
    try {
      setIsFetching(true);
      const res = await axios.post(
        `http://localhost:3000/api/v1/phone`,
        {
          number: number,
        },
        {
          headers: {
            Authorization: apiKey.key,
          },
        }
      );
      // console.log(res);
      setIsFetching(false);
      setDataReceived(res.data.data);
      // console.log(dataReceived);
    } catch (err) {}
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-6 items-center">
          <input
            style={{
              fontFamily: "inherit",
              fontSize: "14px",
              padding: "10px 0 10px 10px",
            }}
            className="basis-4/5 px-1 py-1 rounded-lg border-b border-slate-300 dark:border-slate-700"
            name="phone_number"
            placeholder="Phone number e.g +17609355809"
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <button
            disabled={number.length < 10}
            className=""
          >
            Submit
          </button>
        </div>
      </form>
      <div>
        {dataReceived && (
          <div dangerouslySetInnerHTML={{ __html: dataReceived }}></div>
        )}
        {isFetching && <>Jared 😃: running your errand. Hang tight...</>}
      </div>
    </>
  );
};

export default PromptForm;
