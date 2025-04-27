import React from "react";
import Team from '../assets/images/team.jpg';

const About = () => {
    return <div className='flex flex-col justify-center bg-[#f0f0f0] w-full items-center py-6'>
        <div className='flex justify-center w-full max-w-[1100px]'>
            <h3 className='text-4xl font-bold text-black text-center'>About 52 Bazaar</h3>
        </div>
        <div className='flex justify-center w-full max-w-[1100px] py-6'>
            <div className="flex w-full">
            <p className="w-1/2 text-black text-justify p-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <div className="w-1/2 flex items-center justify-center p-4">
                <img src={Team} alt="52-bazaar-team" />
            </div>
            </div>
        </div>
    </div>;
}

export default About;