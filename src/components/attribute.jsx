import React from "react";

const Attributes = (props) => {
  const { streamData, trueRes, predictionRes } = props;

  return (
    <div class="container">
      <div class="row row-cols-lg-5 g-2 g-lg-3">
        {streamData.map((attr) => (
          <div class="col">
            <div class="p-3 border bg-light">
              {attr.name}: {attr.value}
            </div>
          </div>
        ))}
        <div class="col">
          <div class="p-3 border border-2 border-primary bg-light">
            Prediction: {predictionRes}
          </div>
        </div>
        <div class="col">
          <div class="p-3 border border-2 border-primary bg-light">
            True Result: {trueRes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attributes;
