import React from "react";

const Results = (props) => {
  const { resultMatrix } = props;
  return (
    <div class="container px-4 py-2 pb-5">
      <h4>Result Matrix</h4>
      <div class="container">
        <div class="row row-cols-lg-5 g-2 g-lg-3">
          {Object.entries(resultMatrix).map((attr) => (
            <div class="col">
              <div class="p-3 border bg-light">
                {attr[0]}: {attr[1]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
