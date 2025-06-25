import React from "react";

import Facebook from "@mui/icons-material/FacebookSharp";
import WhatsApp from "@mui/icons-material/WhatsApp";
import LinkedIn from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <div className="flex flex-col justify-center bg-[transparent] w-full items-center">
      <div className="flex justify-center w-full max-w-[1100px]">
        <div className="flex w-full">
          <p className="w-1/2 flex items-baseline justify-start text-black text-justify p-4">
            Copyright &copy; 2025&nbsp;
            <strong style={{ fontSize: "20px", color: "#01723E" }}>
              52 BAZAAR
            </strong>
            . All rights reserved
          </p>
          <div className="w-1/2 flex items-baseline justify-end p-4">
            <ul className="flex font-semibold">
              <li className="px-2">
                <Facebook style={{ fontSize: "32px", color: "blue" }} />
              </li>
              <li className="px-2">
                <a
                  href="https://wa.me/8801994282802" // Replace with your actual WhatsApp number
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsApp style={{ fontSize: "32px", color: "green" }} />
                </a>
              </li>
              <li className="px-2">
                <LinkedIn style={{ fontSize: "32px", color: "skyblue" }} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
