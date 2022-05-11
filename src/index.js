import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import StreamingData from "./components/streamingData";
import Mytitle from "./components/mytitle";
import Results from "./components/results";

const App = () => {
  const streamData = [
    { name: "Animal ID", value: "0" },
    { name: "Group_ID", value: "0" },
    { name: "Lactation Num", value: "0" },
    { name: "Yield", value: "0" },
    { name: "ProdRate", value: "0" },
    { name: "Fat", value: "0" },
    { name: "Avg Fat", value: "0" },
    { name: "Protein", value: "0" },
    { name: "Avg Protein", value: "0" },
    { name: "Lactose", value: "0" },
    { name: "Avg Lactose", value: "0" },
    { name: "Conductivity", value: "0" },
    { name: "Avg Conductivity", value: "0" },
    { name: "Blood", value: "0" },
    { name: "Avy Blood", value: "0" },
    { name: "Milking Time", value: "0" },
    { name: "Avg Milking Time", value: "0" },
    { name: "SCC", value: "0" },
    { name: "Avg SCC", value: "0" },
    { name: "Activity", value: "0" },
    { name: "Activity Deviation", value: "0" },
    { name: "Rest Bout", value: "0" },
    { name: "Rest Per Bout", value: "0" },
    { name: "Rest Ratio", value: "0" },
    { name: "Rest Restlessness", value: "0" },
    { name: "Rest Time", value: "0" },
    { name: "Weight", value: "0" },
    { name: "Date", value: "0" },
  ];

  const inital_resultMatrix = {
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0,
  };

  const [streamingData, setData] = useState(streamData);
  const [trueRes, setTrueRes] = useState("0");
  const [predictionRes, setPredictionRes] = useState(0);
  const [resultMatrix, setResultMatrix] = useState(inital_resultMatrix);

  // const protocol = document.location.protocol.startsWith("https")
  //   ? "wss://"
  //   : "ws://";
  // const webSocket = new WebSocket("ws://20.83.145.47:3000");

  useEffect(() => {
    // const webSocket = new WebSocket("ws://localhost:3000");
    const webSocket = new WebSocket("ws://20.83.145.47:3000");
    webSocket.onmessage = function onMessage(message) {
      try {
        const messageData = JSON.parse(message.data);
        const iotData = messageData.IotData;

        console.log("here IOT data come");

        const mlInput = {
          "Yield(gr)": iotData["Yield(gr)"],
          "ProdRate(gr/hr)": iotData["ProdRate(gr/hr)"],
          "Fat(%)": iotData["Fat(%)"],
          "Avg_Fat(%)": iotData["Avg_Fat(%)"],
          "Protein(%)": iotData["Protein(%)"],
          "Avg_Protein(%)": iotData["Avg_Protein(%)"],
          Lactose: iotData["Lactose"],
          "Avg_Lactose(%)": iotData["Avg_Lactose(%)"],
          Conductivity: iotData["Conductivity"],
          Avg_Conductivity: iotData["Avg_Conductivity"],
          "Blood(%)": iotData["Blood(%)"],
          "Avg_Blood(%)": iotData["Avg_Blood(%)"],
          "Milking_Time(seconds)": iotData["Milking_Time(seconds)"],
          "Avg_Milking_Time(seconds)": iotData["Avg_Milking_Time(seconds)"],
          "SCC(*1000/ml)": iotData["SCC(*1000/ml)"],
          "Avg_SCC(*1000/ml)": iotData["Avg_SCC(*1000/ml)"],
          "Activity(steps/hr)": iotData["Activity(steps/hr)"],
          "ActivityDeviation(%)": iotData["ActivityDeviation(%)"],
          "RestBout(#)": iotData["RestBout(#)"],
          "RestPerBout(min)": iotData["RestPerBout(min)"],
          "RestRatio(%)": iotData["RestRatio(%)"],
          RestRestlessness: iotData["RestRestlessness"],
          "RestTime(min)": iotData["RestTime(min)"],
          "Weight(gr)": iotData["Weight(gr)"],
        };

        const url =
          "http://2a748bb7-8080-4217-8fd5-d804f5c67cc8.eastus2.azurecontainer.io/score";
        const xhr = new XMLHttpRequest();
        const input = {
          data: "[" + JSON.stringify(mlInput) + "]",
        };

        xhr.open("POST", url, true);
        xhr.send(JSON.stringify(input));

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);

            const predictionRes = response.data[0];
            console.log(predictionRes);
            setPredictionRes((oldPred) =>
              predictionRes === 1 ? "infected" : "not infected"
            );
          }
        };

        setTrueRes((oldTrue) =>
          iotData.Mast === "1" ? "infected" : "not infected"
        );

        setResultMatrix((oldMatrix) => {
          const updatedResultMatrix = {
            truePos:
              oldMatrix.truePos +
              (iotData.Mast === "1" && predictionRes === 1 ? 1 : 0),
            trueNeg:
              oldMatrix.trueNeg +
              (iotData.Mast === "0" && predictionRes === 0 ? 1 : 0),
            falsePos:
              oldMatrix.falsePos +
              (iotData.Mast === "0" && predictionRes === 1 ? 1 : 0),
            falseNeg:
              oldMatrix.falseNeg +
              (iotData.Mast === "1" && predictionRes === 0 ? 1 : 0),
          };
          return updatedResultMatrix;
        });

        const streamData = [
          { name: "Animal ID", value: iotData.Animal_ID },
          { name: "Group_ID", value: iotData.Group_ID },
          { name: "Lactation Num", value: iotData.Lactation_Num },
          { name: "Yield", value: iotData["Yield(gr)"] + " gr" },
          {
            name: "ProdRate",
            value: iotData["ProdRate(gr/hr)"] + " gr/hr",
          },
          { name: "Fat", value: iotData["Fat(%)"] + "%" },
          { name: "Avg Fat", value: iotData["Avg_Fat(%)"] + " %" },
          { name: "Protein", value: iotData["Protein(%)"] + " %" },
          {
            name: "Avg Protein",
            value: iotData["Avg_Protein(%)"] + " %",
          },
          { name: "Lactose", value: iotData["Lactose"] + " %" },
          {
            name: "Avg Lactose",
            value: iotData["Avg_Lactose(%)"] + " %",
          },
          { name: "Conductivity", value: iotData.Conductivity },
          {
            name: "Avg Conductivity",
            value: iotData.Avg_Conductivity,
          },
          { name: "Blood", value: iotData["Blood(%)"] + " %" },
          {
            name: "Avg Blood",
            value: iotData["Avg_Blood(%)"] + " %",
          },
          {
            name: "Milking Time",
            value: iotData["Milking_Time(seconds)"] + " s",
          },
          {
            name: "Avg Milking Time",
            value: iotData["Avg_Milking_Time(seconds)"] + " s",
          },
          {
            name: "SCC",
            value: iotData["SCC(*1000/ml)"] + " *1000/ml",
          },
          {
            name: "Avg SCC",
            value: iotData["Avg_SCC(*1000/ml)"] + " *1000/ml",
          },
          {
            name: "Activity",
            value: iotData["Activity(steps/hr)"] + " steps/hr",
          },
          {
            name: "Activity Deviation",
            value: iotData["ActivityDeviation(%)"] + " %",
          },
          { name: "Rest Bout", value: iotData["RestBout(#)"] + " ss" },
          {
            name: "Rest Per Bout",
            value: iotData["RestPerBout(min)"] + " min",
          },
          { name: "Rest Ratio", value: iotData["RestRatio(%)"] + " %" },
          { name: "Rest Restlessness", value: iotData["RestRestlessness"] },
          { name: "Rest Time", value: iotData["RestTime(min)"] + " min" },
          { name: "Weight", value: iotData["Weight(gr)"] + " gr" },
          { name: "Date", value: iotData.datesql },
        ];
        setData((oldData) => streamData);
      } catch (err) {
        console.error(err);
      }
    };
    return () => webSocket.close();
  }, []);

  return (
    <div>
      <Mytitle />
      <StreamingData
        streamData={streamingData}
        trueRes={trueRes}
        predictionRes={predictionRes}
      />
      <Results resultMatrix={resultMatrix} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
