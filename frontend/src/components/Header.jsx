import React from "react";
import Logo from '../assets/images/52-bazaar-logo.png';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <>
            <div className='flex flex-col justify-center bg-[transparent] w-full h-[200px] items-center'>
                <div className='flex justify-center w-full max-w-[1100px]'>
                    <img src={Logo} width="150" height="150" alt="52-bazaar" />
                </div>
            </div>
            <div className='flex flex-col justify-center bg-[#ff0000] w-full items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
                <div className='flex justify-center w-full max-w-[1100px]'>
                    <ul className="flex divide-x-2 divide-white text-white font-semibold py-3">
                        <li className='px-3'><Link to='/admin'>Login</Link></li>
                        <li className='px-3'>Menu 2</li>
                        <li className='px-3'>Menu 3</li>
                        <li className='px-3'>Menu 4</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Header;