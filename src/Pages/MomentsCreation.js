import React from "react";

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

      <button> View your Connections</button>


    </>
  );
};

export default MomentsCreation;
