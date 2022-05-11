import React from "react";
import Attributes from "./attribute";

const StreamingData = (props) => {
  const { streamData, trueRes, predictionRes } = props;

  const useStart = () => {
    fetch("http://20.83.145.47:5001/start").then();
    // fetch("http://localhost:5001/start").then();
  };

  const useEnd = () => {
    fetch("http://20.83.145.47:5001/end").then();
    // fetch("http://localhost:5001/end").then();
  };
  return (
    <div class="container px-4 py-1">
      <div class="pb-2 border-bottom" style={{ display: "flex" }}>
        <h3>Streaming Data</h3>
        <div
          class="d-grid gap-2 d-md-flex justify-content-md-end"
          style={{ paddingLeft: 935 }}
        >
          <button
            type="button"
            class="btn btn-outline-primary"
            onClick={useStart}
          >
            Start
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            onClick={useEnd}
          >
            Stop
          </button>
        </div>
      </div>
      <div class="pt-2 pb-3 border-bottom">
        <Attributes
          streamData={streamData}
          trueRes={trueRes}
          predictionRes={predictionRes}
        />
      </div>
      <div></div>
    </div>
  );
};

export default StreamingData;
