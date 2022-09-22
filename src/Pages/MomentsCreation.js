import React from "react";
import { Subscribe } from "../Components/OptInChannel";

const MomentsCreation = () => {
  return (
    <>
      <h1>Create Moments</h1>

      <form>
        <h2>Title</h2>
        <input type="text" placeholder="Whats the Title" />
        <h2>Description</h2>
        <input type="text" placeholder="whats the moment About" />
        <h2>Tag Your Friends</h2>
        <input type="text" placeholder="Weed.eth / LSD.DAO" />
        <h2>Upload Your Moment</h2>
        <input type="file" />
      </form>



      <a href="/dynamic">
        <button className="launch-receiver hover-scale">
          {" "}
          View your Connections
        </button>
      </a>


    </>
  );
};

export default MomentsCreation;
