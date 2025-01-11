import React from "react";

const Image = ({ imgSrc, className, imgName }) => {
  return <img className={className} src={imgSrc} alt={imgName} />;
};

export default Image;
