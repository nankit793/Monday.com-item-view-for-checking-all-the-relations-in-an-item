import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";

const monday = mondaySdk();

const App = () => {
  const [itemData, setItemData] = useState({});
  const [boardDetails, setBoardDetails] = useState({});
  const [relationData, setRelationData] = useState([]);

  useEffect(() => {
    monday.execute("valueCreatedForUser");
    monday.listen("context", (res) => {
      setBoardDetails(res.data);
    });
  }, []);

  useEffect(() => {
    if (boardDetails) {
      monday.setToken(
        "your token"
      );
      monday
        .api(
          `query {
      boards (ids: ${boardDetails.boardIds}) { 
        items (ids: ${boardDetails.itemId}) {
          column_values {
            value
            text
            title
            type
          }
        }
       }
    }`
        )
        .then((res) => {
          if (res?.data?.boards[0]?.items[0]?.column_values) {
            setItemData(res.data.boards[0].items[0].column_values);
          }
        });
    }
  }, [boardDetails]);

  useEffect(() => {
    if (itemData) {
      const arr = [];
      for (let index = 0; index < itemData.length; index++) {
        const element = itemData[index];
        if (element.type === "board-relation") {
          arr.push(element);
        }
      }
      setRelationData(arr);
    }
  }, [itemData]);

  return (
    <div className="App">
      <table className="tableClass"> 
        <tr className="tableHeader">
          <th>Relationships</th>
          <th>Tasks</th>
        </tr>
        {relationData?.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item?.title || "--"}</td>
              <td style={{color: "gray", paddingLeft: '30px'}}>{item?.text || "--"}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default App;
