"use client"

import { FC, useState, ChangeEvent } from 'react'

const OptForm: FC = () => {
  const [email, setEmail] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return <div className="flex-1 w-full flex justify-center mt-10 mb-10">
  <div className="relative w-full max-w-md">
    <input value={email} onChange={handleChange} className="w-full ring-transparent focus:outline-none focus:border-gray-400 py-3 px-8 md:pr-16 rounded-full bg-transparent border border-gray-700 transition hover:border-gray-400 hover:placeholder-white" placeholder="Enter Your Email" />
    <div className="md:absolute w-full md:w-fit right-0 top-0 bottom-0 flex items-center">
      <button disabled={email.length < 7} className="bg-white text-gray-500 border-2 w-full md:w-fit mt-6 md:mt-0 border-transparent h-10 mr-1.5 rounded-full font-medium py-4 px-6 flex justify-center items-center text-sm">Notify me</button>
    </div>
  </div>
</div>
}

export default OptForm