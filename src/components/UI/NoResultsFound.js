import React from "react";

import Search from "../../assets/icons/search.png";

const NoResultsFound = () => {
  return (
    <div className="FlexCenter text-center mt-10 my-20">
      <h2>
        No Results Found... <br />
        Please try again!
      </h2>
      <img src={Search} alt="Search" className="h-12 w-auto ml-2" />
    </div>
  );
};

export default NoResultsFound;
