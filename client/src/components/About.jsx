import React from "react";
import Team from '../assets/images/team.jpg';

const About = () => {
    return (
      <div className="flex flex-col justify-center bg-[#f0f0f0] w-full items-center py-6">
        <div className="flex justify-center w-full max-w-[990px] mx-auto">
          <h3 className="text-4xl font-bold text-black text-center">
            About 52 Bazaar
          </h3>
        </div>
        <div className="flex justify-center w-full max-w-[1100px] py-6">
          <div className="flex flex-col-reverse md:flex-row w-full">
            <div className="w-full md:w-1/2 text-black text-justify p-4">
              <p>
                52 Bazaar is your trusted online shop dedicated to bringing you
                the best products at unbeatable prices. We promise quality and
                value by offering a wide range of items that are often cheaper
                than what you’d find at retail stores. Enjoy the convenience of
                shopping from home with the added benefit of cash on delivery,
                making your purchase secure and hassle-free. At 52 Bazaar, we
                strive to provide a seamless shopping experience with fast,
                reliable delivery right to your doorstep — because getting the
                best shouldn’t be complicated.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
              <img
                src={Team}
                alt="52-bazaar-team"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
}

export default About;