import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
        <div className='flex items-center justify-center p-4 '>
        <h1 className="font-extrabold text-3xl text-indigo-700 underline decoration-double decoration-gray-300">
          X Xerox Centre
        </h1>
        {/* {For baseline of xeorx} */}
        {/* <p className="text-center text-base text-indigo-700 mt-1 ">
          विश्वसनीयता आणि सातत्य यांचे प्रतीक
        </p> */}
      </div>
    );
  }
}

export default Header;
