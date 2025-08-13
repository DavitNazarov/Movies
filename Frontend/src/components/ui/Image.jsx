import React from "react";

export const Image = ({ alt, ...props }) => {
  return <img {...props} alt={alt} />;
};
