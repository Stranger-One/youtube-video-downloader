import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { RiLoader2Fill } from "react-icons/ri";
import { conf } from './conf/conf';
import { HiSpeakerXMark } from "react-icons/hi2";
import { MdContentPaste } from "react-icons/md";
import { VscDebugRestart } from "react-icons/vsc";





const App = () => {
  const [URL, setURL] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rotateAngle, setRotateAngle] = useState(0)

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const paste = await navigator.clipboard.readText();
        // console.log(paste); 
        setURL(paste);
      } else {
        console.log('Clipboard API not supported');
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleReset = () => {
    setURL('')
    setRotateAngle(angle => angle + 360)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!URL.includes("https://")) {
      alert("Invalid URL");
      return;
    }

    setLoading(true)

    const options = {
      method: 'GET',
      url: conf.apiURL,
      params: {
        url: URL
      },
      headers: {
        'x-rapidapi-key': conf.apiKey,
        'x-rapidapi-host': conf.apiHost
      }
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      setData(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  return (
    <section className='w-full bg-slate-400 min-h-screen py-20 px-10'>
      <h1 className='text-center h-fit text-xl md:text-3xl font-bold mb-10'>Youtube Video Downloader</h1>
      <form onSubmit={handleSubmit} className='w-full h-fit flex flex-col items-center gap-2 '>
        <div className="px-2 py-1 rounded-md border-[1px] border-slate-900 shadow-lg flex items-center gap-2">
          <input type="text" value={URL} onChange={(e) => setURL(e.target.value)} placeholder="YouTube Video URL . . ." className='border-none outline-none text-slate-900 bg-transparent w-[300px] md:w-[350px] placeholder:text-slate-900 font-semibold' />
          <button type='button' onClick={handleReset} className='bg-slate-300 hover:bg-slate-300/70 p-1 rounded-md'>
            <VscDebugRestart style={{transform: `rotate(-${rotateAngle}deg)`,  transition: 'transform 0.3s ease' }} className='text-xl ' />
          </button>
          <button type='button' onClick={handlePaste} className='bg-slate-300 hover:bg-slate-300/70 p-1 rounded-md'>
            <MdContentPaste className='text-xl' />
          </button>
        </div>

        <button type='submit' className='rounded-md bg-blue-600 hover:bg-blue-700 shadow-md w-fit px-4 py-2 font-semibold'>{loading ? <RiLoader2Fill className='animate-spin text-2xl mx-10' /> : "Generate Download Link"}</button>
      </form>

      {data && (
        <div className="grid md:grid-cols-2 justify-center mt-10 gap-5 md:p-10 ">
          <div className="Thumbnail flex flex-col ">
            <img src={data?.picture} alt="thumbnail" className=' w-full object-cover object-center self-center md:self-start ' />
            <h2 className='text-lg font-semibold leading-5 mt-2'>{data?.description}</h2>
          </div>
          <div className="">
            {data?.links?.map((link, index) => (
              <div key={index} className="">
                <div className="">
                  <ul>
                    <li className='w-full flex justify-between items-center px-2 py-1 mb-2 border-b-[1px] border-t-[1px] border-slate-300 rounded-md '>
                      <h2 className='capitalize flex items-center gap-2'>{link.mimeType.split(";")[0]} {link.audioCodec === null && <HiSpeakerXMark />} </h2>
                      <h2 className='capitalize'>{link.qualityLabel}</h2>
                      <a href={link.link} target='_blank' className='rounded-md bg-blue-600 hover:bg-blue-700 shadow-md w-fit px-4 py-1'>Download</a>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default App