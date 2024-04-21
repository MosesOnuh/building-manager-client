

import {useState, useEffect} from "react";
import { Chart } from "react-google-charts";
// import { userProfession } from "../../utils/constants";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
import { generateNewArray } from "../../utils/constants";
import Loader from "../loading/Loading";
import "./activityChart.css"

const columns = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "string", label: "Resource" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];


const options = {
  height: 10000,
  gantt: {
    trackHeight: 50,
  },
};

const  ActivityChart = () => {
    const [activities, setActivities] = useState(null);
    const [display, setDisplay] = useState(null)

    const {
    loading,
    error,
    setErrToNull,
    get,
  } = useAPI();

  const { projectId } = useParams();

  useEffect(() => {
    // let preConsUrl = `https://localhost:7129/api/Activity/user/Getactivities/?projectId=${projectId}`;
    let Url = `/Activity/user/Getactivities/${projectId}`;

    const fetchData = async () => {
      try {
        setErrToNull();
        const response = await get(Url);
        setActivities(response);
        // setDisplay(response?.data)
        const rows = generateNewArray(response?.data);
        const data = [columns, ...rows];
        setDisplay(data)
        console.log(response);
      } catch (err) {
        setActivities(null);
      }
    };

    fetchData();


  }, [projectId]);

//   const rows = generateNewArray(display);
//   const data = [columns, ...rows];
    //  setDisplay(data)
    
  return (
    <>
      {error && (
        <div className="error-alert">
          <p>{error?.message}</p>
          {/* <p>dfdffdfdfdd</p> */}
        </div>
      )}
      {loading && <Loader />}
      {activities && !loading && !error && (
        <div className="scroll-horizontal">
          <Chart
            chartType="Gantt"
            width="100%"
            height="50%"
            //   data={data}
            data={display}
            options={options}
          />
        </div>
      )}
    </>
  );
}

export default ActivityChart;
