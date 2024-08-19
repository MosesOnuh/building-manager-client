import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import useAPI from "../../hooks/useAPI";
import { generateNewArray, networkErr } from "../../utils/constants";
import Loader from "../loading/Loading";
import "./activityChart.css";
import { toast } from "react-toastify";
import GetErrorNotification from "../utility/GetErrorNotification";
import { useRef } from "react";
import { SelectInputField } from "../utility/InputFields";

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

const ActivityChart = ({ user }) => {
  const [activities, setActivities] = useState(null);
  const [display, setDisplay] = useState(null);
  const [netErr, setNetErr] = useState(false);
  const [requiredStatus, setRequiredStatus] = useState("");

  const handleChange = (e) => {
    console.log(e.target.value);
    setRequiredStatus(e.target.value);
  };

  const { loading, error, setErrToNull, get } = useAPI();

  let projectId = user?.projectId;

  const toastId = useRef(null);

  useEffect(() => {
    let Url = `/Activity/user/Getactivities?projectId=${projectId}&requiredStatus=${requiredStatus}`;

    const fetchData = async () => {
      try {
        setErrToNull();
        const response = await get(Url);
        setActivities(response);
        const rows = generateNewArray(response?.data);
        const data = [columns, ...rows];
        console.log("graph page data", response);
        console.log("gantt data", data);
        setDisplay(data);
        // console.log(response);
      } catch (err) {
        setActivities(null);
      }
    };

    fetchData();
  }, [projectId, requiredStatus]);

  // const [err, setErr] = useState(null);
  // const [isChartsLoaded, setIsChartsLoaded] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      setNetErr(true);
      toast.error(networkErr);
    }
  }, []);

  return (
    <>
      <div className="w-1/4 min-w-fit my-3">
        <SelectInputField
          InputValue={requiredStatus}
          InputTitle={"Status"}
          InputName={"requiredStatus"}
          OnChange={handleChange}
          selectOptions={[
            { value: "", text: "All" },
            { value: "1", text: "Pending" },
            { value: "2", text: "Awaiting Approval" },
            { value: "3", text: "Approved" },
            { value: "4", text: "Rejected" },
            { value: "5", text: "Done" },
          ]}
        />
      </div>
      {netErr && (
        <div className="sm:my-10">
          <GetErrorNotification message={"Chart data"} />
        </div>
      )}
      {!netErr && error && !loading && (
        <div className="sm:my-10">
          <GetErrorNotification
            customMessage={error?.message}
            message={"Chart data"}
          />
        </div>
      )}
      {loading && <Loader />}
      {/* {activities && !loading && !error && isChartsLoaded && ( */}
      {activities?.data?.length > 0 && !loading && !error && !netErr && (
        <div className="overflow-x-auto">
          <Chart
            chartType="Gantt"
            width="100%"
            height="50%"
            data={display}
            options={options}
          />
        </div>
      )}
      {activities?.data?.length < 1 && !loading && !error && !netErr && (
        //  {activities && !loading && !error && !netErr && (
        <GetErrorNotification
          customMessage={"No activities has been created"}
        />
      )}
    </>
  );
};

// const  ActivityChart = ({user}) => {
//     const [activities, setActivities] = useState(null);
//     const [display, setDisplay] = useState(null)

//     const {
//     loading,
//     error,
//     setErrToNull,
//     get,
//   } = useAPI();

//   let projectId = user?.projectId

//   useEffect(() => {
//     let Url = `/Activity/user/Getactivities/${projectId}`;

//     const fetchData = async () => {
//       try {
//         setErrToNull();
//         const response = await get(Url);
//         setActivities(response);
//         // setDisplay(response?.data)
//         const rows = generateNewArray(response?.data);
//         const data = [columns, ...rows];
//         setDisplay(data)
//         console.log(response);
//       } catch (err) {
//         setActivities(null);
//       }
//     };

//     fetchData();

//   }, [projectId]);

//   return (
//     <>
//       {error && (
//         <div className="error-alert">
//           <p>{error?.message}</p>
//         </div>
//       )}
//       {loading && <Loader />}
//       {activities && !loading && !error && (
//         <div className="overflow-x-auto">
//           <Chart
//             chartType="Gantt"
//             width="100%"
//             height="50%"
//             data={display}
//             options={options}
//           />
//         </div>
//       )}
//     </>
//   );
// }

export default ActivityChart;
