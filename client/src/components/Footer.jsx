import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col justify-center bg-[#6AB802] w-full items-center">
      <div className="justify-center w-full max-w-[990px]">
        <div className="w-full">
          <p className="w-full items-baseline justify-center text-white text-center p-4">
            Copyright &copy; 2025&nbsp;
            <strong style={{ fontSize: "20px" }}>
              52 BAZAAR
            </strong>
            . All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
