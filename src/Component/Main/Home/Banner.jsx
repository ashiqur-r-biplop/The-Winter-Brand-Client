import React from 'react';
import './Banner.css'
import { TypeAnimation } from 'react-type-animation';

const Banner = () => {
    return (
        <div className="banner-content text-center">
            <div className="flex justify-center items-center h-[80vh]">
                <div className="">
                    <h1 className='text-4xl font-semibold text-white'>Elevate Your <span className="brand-color font-bold text-5xl">Winter Style</span> with Our </h1>
                    <h1 className='text-4xl text-white mt-3'>Cozy <span className="brand-color font-semibold">Beanie Bundle</span>!</h1>
                    <h3 className='text-gray-300 text-xl mt-5'>Everything in one Bundle: Unparalleled Quality, Unbeatable Price, and Fashion Forward</h3>
                    <div className='mt-3'>
                        <span className='bg-black brand-color p-2 rounded text-lg font-semibold'>
                            <TypeAnimation
                                sequence={[
                                    'Black Friday Special: ',
                                    1000,
                                    'Black Friday Special: Now only $39',
                                    1000,
                                    'Black Friday Special: Now only $39',
                                    1000,
                                    'Black Friday Special: Now only $39',
                                    1000,
                                ]}
                                speed={50}
                                repeat={Infinity}
                            />
                        </span>
                    </div>
                    <div className='mt-5'>
                        <button className='btn brand-btn font-bold'>Get The Bundle</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Banner;