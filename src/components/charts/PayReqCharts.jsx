// ./components/BarChart.js
import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  // BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PayReqMonthlyDataTable from "../utility/table/PayReqMonthlyDataTable";
import PayReqWeeklyDataTable from "../utility/table/PayReqWeeklyDataTable";
import PayReqDailyDataTable from "../utility/table/PayReqDailyDataTable";
import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { SearchSelect } from "../utility/InputFields";
import GetErrorNotification from "../utility/GetErrorNotification";
import NonFound from "../utility/NonFound";
import {
  getNumberOfWeeksInMonth,
  ProfessionalColors,
  userProfession,
} from "../../utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// const lineChartData = {
//   labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//   datasets: [
//     {
//       label: "Steps",
//       data: [3000, 5000, 4500, 6000, 8000, 7000, 9000],
//       borderColor: "rgb(75, 192, 192)",
//     },
//     {
//       label: "Steps",
//       data: [0, 15000, 3500, 6000, 2000, 7000, 800],
//       borderColor: "rgb(75, 192, 192)",
//     },
//   ],
// };

// export const LineGraphWeekly = () => {
//   const options = {};

//   return <Line options={options} data={lineChartData} />;
// };

const LineGraphMonthly = ({ info }) => {
  const options = {};
  let newDataSets = info.map((data, index) => {
    let newData = Object.values(data);
    return {
      label: userProfession[data?.profession],
      data: newData.slice(1, -1),
      borderColor: ProfessionalColors[index],
    };
  });

  let lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: newDataSets,
  };

  return <Line options={options} data={lineData} />;
};

const PieChartMonthly = ({ info }) => {
  const options = {};

  let pieData = {
    labels: info.map((data) => userProfession[data?.profession]),
    datasets: [
      {
        labels: "Total amount spent by professionals",
        data: info.map((data) => data?.total),
        backgroundColor: ProfessionalColors,
        hoverOffset: 4,
      },
    ],
  };

  console.log(pieData);

  // let newDataSets = lineInfo.map((data, index) => {
  //   let newData = Object.values(data);
  //   return {
  //     label: userProfession[data.profession],
  //     data: newData.slice(1, -1),
  //     borderColor: lineGraphColors[index],
  //   };
  // });

  return <Pie options={options} data={pieData} />;
};

const LineGraphWeekly = ({ info }) => {
  const options = {};
  let newDataSets = info.map((data, index) => {
    let newData = Object.values(data);
    return {
      label: userProfession[data.profession],
      data: newData.slice(1, -1),
      borderColor: ProfessionalColors[index],
    };
  });

  let lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: newDataSets,
  };

  return <Line options={options} data={lineData} />;
};

const PieChartWeekly = ({ info }) => {
  const options = {};

  let pieData = {
    labels: info.map((data) => userProfession[data?.profession]),
    datasets: [
      {
        labels: "Total amount spent by professionals",
        data: info.map((data) => data?.total),
        backgroundColor: ProfessionalColors,
        hoverOffset: 4,
      },
    ],
  };

  console.log(pieData);

  // let newDataSets = lineInfo.map((data, index) => {
  //   let newData = Object.values(data);
  //   return {
  //     label: userProfession[data.profession],
  //     data: newData.slice(1, -1),
  //     borderColor: lineGraphColors[index],
  //   };
  // });

  return <Pie options={options} data={pieData} />;
};

const LineGraphDaily = ({ info }) => {
  const options = {};
  let newDataSets = info.map((data, index) => {
    let newData = Object.values(data);
    return {
      label: userProfession[data.profession],
      data: newData.slice(1, -1),
      borderColor: ProfessionalColors[index],
    };
  });

  let lineData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: newDataSets,
  };

  return <Line options={options} data={lineData} />;
};

const PieChartDaily = ({ info }) => {
  const options = {};

  let pieData = {
    labels: info.map((data) => userProfession[data?.profession]),
    datasets: [
      {
        labels: "Total amount spent by professionals",
        data: info.map((data) => data?.total),
        backgroundColor: ProfessionalColors,
        hoverOffset: 4,
      },
    ],
  };

  console.log(pieData);

  // let newDataSets = lineInfo.map((data, index) => {
  //   let newData = Object.values(data);
  //   return {
  //     label: userProfession[data.profession],
  //     data: newData.slice(1, -1),
  //     borderColor: lineGraphColors[index],
  //   };
  // });

  return <Pie options={options} data={pieData} />;
};

export const PayReqCharts = ({ user }) => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [projYears, setProjectYears] = useState([]);
  const [monthWeeks, setMonthWeeks] = useState([]);
  const [monthlyInfo, setMonthlyInfo] = useState({
    selectedYear: null,
  });
  const [weeklyInfo, setWeeklyInfo] = useState({
    year: null,
    month: null,
  });

  const [dailyInfo, setDailyInfo] = useState({
    year: null,
    month: null,
    week: null,
  });

  let projectId = user?.projectId;
  let createdAt = new Date(user?.createdAt);

  const projMonths = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  useEffect(() => {
    let projYear = createdAt.getFullYear();
    let projMonth = createdAt.getMonth();

    setMonthlyInfo({
      selectedYear: { label: `${projYear}`, value: `${projYear}` },
    });

    setMonthlyInfo({
      ...monthlyInfo,
      year: { label: `${projYear}`, value: `${projYear}` },
      month: { label: `${projMonth}`, value: `${projMonth}` },
    });

    // let totalYear = projYear + 50;
    const yearList = [{ label: `${projYear}`, value: `${projYear}` }];

    for (let i = 0; i < 50; i++) {
      projYear++;
      yearList.push({ label: `${projYear}`, value: `${projYear}` });
    }
    setProjectYears(yearList);

    console.log(yearList);
  }, []);

  useEffect(() => {
    let newWeeks = [];
    let wk = 0;
    for (let i = 0; i < 5; i++) {
      wk++;
      newWeeks.push({ label: `Week ${wk}`, value: `${wk}` });
    }
    setMonthWeeks(newWeeks);
  }, []);

  const handleMonthlyInfoChange = (selectedOption) => {
    setMonthlyInfo({ selectedYear: selectedOption });
  };

  const handleWeeklyInfoChangeForYear = (selectedOption) => {
    setWeeklyInfo({ ...weeklyInfo, year: selectedOption });
  };

  const handleWeeklyInfoChangeForMonth = (selectedOption) => {
    setWeeklyInfo({ ...weeklyInfo, month: selectedOption });
  };

  const handleDailyInfoChangeForYear = (selectedOption) => {
    console.log();
    console.log({ yearOption: selectedOption });
    setDailyInfo({ ...dailyInfo, year: selectedOption });
  };

  const handleDailyInfoChangeForMonth = (selectedOption) => {
    setDailyInfo({ ...dailyInfo, month: selectedOption });
  };
  const handleDailyInfoChangeForWeek = (selectedOption) => {
    setDailyInfo({ ...dailyInfo, week: selectedOption });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid black",
      borderRadius: "8px",
      fontSize: "13px",
      minWidth: "113px",
      // outline: "none"
      // "&:focus": {
      //   borderColor: "black",
      // },
      // minHeight: "2rem", // Reduce the min height
      // height: "2rem",
      // padding: "0", // Ensure no padding
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const {
    loading: monthlyLoading,
    error: monthlyError,
    setErrToNull: monthlySetErrToNull,
    get: monthlyGet,
  } = useAPI();

  const {
    loading: weeklyLoading,
    error: weeklyError,
    setErrToNull: weeklySetErrToNull,
    get: weeklyGet,
  } = useAPI();

  const {
    loading: dailyLoading,
    error: dailyError,
    setErrToNull: dailySetErrToNull,
    get: dailyGet,
  } = useAPI();

  useEffect(() => {
    let monthlyUrl = `/PaymentRequest/User/PayReqMonthlyData?projectId=${projectId}&year=${monthlyInfo?.selectedYear?.value}`;

    const fetchMonthlyData = async () => {
      try {
        const response = await monthlyGet(monthlyUrl);
        setMonthlyData(response);
        monthlySetErrToNull;
      } catch {
        setMonthlyData(null);
      }
    };

    if (monthlyInfo?.selectedYear) {
      fetchMonthlyData();
    }
  }, [projectId, monthlyInfo]);

  useEffect(() => {
    let weeklyUrl = `/PaymentRequest/User/PayReqWeeklyDataDto?projectId=${projectId}&year=${weeklyInfo?.year?.value}&month=${weeklyInfo?.month?.value}`;

    const fetchWeeklyData = async () => {
      try {
        const response = await weeklyGet(weeklyUrl);
        setWeeklyData(response);
        weeklySetErrToNull;
      } catch {
        setWeeklyData(null);
      }
    };

    if (weeklyInfo?.month) fetchWeeklyData();
  }, [projectId, weeklyInfo]);

  useEffect(() => {
    let dailyUrl = `/PaymentRequest/User/PayReqDailyDataDto?projectId=${projectId}&year=${dailyInfo?.year?.value}&month=${dailyInfo?.month?.value}&week=${dailyInfo?.week?.value}`;

    const fetchDailyData = async () => {
      try {
        const response = await dailyGet(dailyUrl);
        setDailyData(response);
        dailySetErrToNull;
      } catch {
        setDailyData(null);
      }
    };

    if (dailyInfo?.week) fetchDailyData();
  }, [projectId, dailyInfo]);

  const handleChartDisplay = (data) => {
    let sum = data.reduce((totalValue, currentValue) => {
      return totalValue + currentValue?.total;
    }, 0);

    console.log("total sum", sum);

    if (sum > 0) return true;
    return false;
  };

  return (
    <>
      {monthlyError && (
        <div className="error-alert">
          <p>{monthlyError?.message}</p>
        </div>
      )}
      {(monthlyLoading || weeklyLoading || dailyLoading) && <Loader />}
      <>
        <div>
          <p className="mb-3 mt-10 font-bold text-xs md:text-sm lg:text-base text-center bg:green">
            Payment Request Monthly Data
          </p>
          <div className=" w-1/5 min-w-fit mb-10 mt-3">
            <SearchSelect
              InputValue={monthlyInfo.selectedYear}
              InputTitle={"Year"}
              InputName={"year"}
              OnChange={handleMonthlyInfoChange}
              selectOptions={projYears}
              customStyles={customStyles}
              className="react-select"
              Searchable={true}
            />
          </div>

          <div>
            {monthlyData?.data?.length > 0 &&
              !monthlyLoading &&
              !monthlyError && (
                <>
                  <div
                    style={{ width: "98%" }}
                    className="tableContainer mx-auto mb-3"
                  >
                    <PayReqMonthlyDataTable items={monthlyData?.data} />
                    {handleChartDisplay(monthlyData?.data) && (
                      <div className="mb-10 mt-5 flex min-w-fit gap-4 flex-wrap justify-between sm:flex-nowrap">
                        <div className=" w-2.5/5 min-w-fit self-center">
                          <LineGraphMonthly info={monthlyData?.data} />
                        </div>
                        <div className=" w-1.5/5 min-w-fit">
                          <PieChartMonthly info={monthlyData?.data} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            {monthlyData?.data?.length == 0 && !monthlyLoading && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={"No payment request monthly data available"}
                />
              </div>
            )}
            {monthlyError && !monthlyLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={monthlyError?.message}
                  message={"Payment request monthly data"}
                />
              </div>
            )}
          </div>

          <p className="font-bold text-xs md:text-sm lg:text-base text-center mt-10 mb-3">
            Payment Request Weekly Data
          </p>
          {/* <div className="mb-10 mt-3 w-full sm:w-2.5/5  flex justify-between min-w-fit flex-wrap gap-4 sm:flex-nowrap"> */}
          <div className="mb-10 mt-3 w-full md:w-full sm:w-2.5/5 flex min-w-fit flex-wrap gap-4 sm:flex-nowrap">
            <div className=" w-1/5 min-w-fit">
              <SearchSelect
                InputValue={weeklyInfo.year}
                InputTitle={"Year"}
                InputName={"year"}
                OnChange={handleWeeklyInfoChangeForYear}
                selectOptions={projYears}
                customStyles={customStyles}
                className="react-select"
                Searchable={true}
              />
            </div>

            <div className=" w-1/5 min-w-fit">
              <SearchSelect
                InputValue={weeklyInfo.month}
                InputTitle={"Month"}
                InputName={"month"}
                OnChange={handleWeeklyInfoChangeForMonth}
                selectOptions={projMonths}
                customStyles={customStyles}
                className="react-select"
                Searchable={true}
              />
            </div>
          </div>
          <div className="mt-10">
            {weeklyData?.data?.length > 0 && !weeklyLoading && !weeklyError && (
              <>
                <div
                  style={{ width: "98%" }}
                  className="tableContainer mx-auto mb-3"
                >
                  <PayReqWeeklyDataTable items={weeklyData?.data} />
                  {handleChartDisplay(weeklyData?.data) && (
                    <div className="mb-10 mt-5 flex min-w-fit gap-4 flex-wrap justify-between sm:flex-nowrap">
                      <div className=" w-2.5/5 min-w-fit self-center">
                        <LineGraphWeekly info={weeklyData?.data} />
                      </div>
                      <div className=" w-1.5/5 min-w-fit">
                        <PieChartWeekly info={weeklyData?.data} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {weeklyData?.data?.length == 0 &&
              !weeklyLoading &&
              !weeklyError && (
                <div className="sm:my-10">
                  <NonFound
                    customMessage={"No payment request weekly data available"}
                  />
                </div>
              )}
            {weeklyError && !weeklyLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={weeklyError?.message}
                  message={"Payment request weekly data"}
                />
              </div>
            )}
          </div>

          <p className="font-bold text-xs md:text-sm lg:text-base text-center mt-10 my-3">
            Payment Request Daily Data
          </p>
          <div className="mb-10 mt-3 w-full md:w-full sm:w-2.5/5  flex min-w-fit flex-wrap gap-4 sm:flex-nowrap">
            <div className=" w-1/5 min-w-fit">
              <SearchSelect
                InputValue={dailyInfo.year}
                InputTitle={"Year"}
                InputName={"year"}
                OnChange={handleDailyInfoChangeForYear}
                selectOptions={projYears}
                customStyles={customStyles}
                className="react-select"
                Searchable={true}
              />
            </div>
            <div className=" w-1/5 min-w-fit">
              <SearchSelect
                InputValue={dailyInfo.month}
                InputTitle={"Month"}
                InputName={"month"}
                OnChange={handleDailyInfoChangeForMonth}
                selectOptions={projMonths}
                customStyles={customStyles}
                className="react-select"
                Searchable={true}
              />
            </div>
            <div className=" w-1/5 min-w-fit">
              <SearchSelect
                InputValue={dailyInfo.week}
                InputTitle={"Week"}
                InputName={"week"}
                OnChange={handleDailyInfoChangeForWeek}
                selectOptions={monthWeeks}
                customStyles={customStyles}
                className="react-select"
                Searchable={true}
              />
            </div>
          </div>
          <div className=" mt-10">
            {dailyData?.data?.length > 0 && !dailyLoading && !dailyError && (
              <>
                <div
                  style={{ width: "98%" }}
                  className="tableContainer mx-auto mb-3"
                >
                  <PayReqDailyDataTable items={dailyData?.data} />
                  {handleChartDisplay(dailyData?.data) && (
                    <div className="mb-10 mt-5 flex min-w-fit gap-4 flex-wrap justify-between sm:flex-nowrap">
                      <div className=" w-2.5/5 min-w-fit self-center">
                        <LineGraphDaily info={dailyData?.data} />
                      </div>
                      <div className=" w-1.5/5 min-w-fit">
                        <PieChartDaily info={dailyData?.data} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {dailyData?.data?.length == 0 && !dailyLoading && !dailyError && (
              <div className="sm:my-10">
                <NonFound
                  customMessage={"No payment request daily data available"}
                />
              </div>
            )}
            {dailyError && !dailyLoading && (
              <div className="sm:my-10">
                <GetErrorNotification
                  customMessage={dailyError?.message}
                  message={"Payment request daily data"}
                />
              </div>
            )}
          </div>
        </div>
      </>
    </>
  );
};
