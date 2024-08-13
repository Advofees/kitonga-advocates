import { useEffect, useState } from "react";
import { endpoints } from "../../assets/apis";
import { apiCalls } from "../../assets/apiCalls";
import { DataChart } from "../common/DataChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { joinArrays, utilityFunctions } from "../../assets/functions";
import { StrokeText } from "../common/StrokeText";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Puff } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

export function Dash() {
  const [casesPerClient, setCasesPerClient] = useState([]);
  const [weekCounts, setWeekCounts] = useState({});
  const [counts, setCounts] = useState({});
  const [enforcementCases, setEnforcementCases] = useState([]);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({});
  const [dataChart, setDataChart] = useState(null);
  const [weeklyChart, setWeeklyChart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    [
      [endpoints.dash.getCasesPerClient, setCasesPerClient],
      [endpoints.dash.getDashConuts, setCounts],
      [endpoints.dash.getFirst10MostRecentCases, setEnforcementCases],
    ].forEach((prop) => {
      apiCalls.getRequest({
        endpoint: prop[0],
        httpHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
        },
        successCallback: prop[1],
      });
    });
  }, []);

  useEffect(() => {
    const sortedCasesPerClient = casesPerClient.slice();
    sortedCasesPerClient.sort((a, b) => a.cases - b.cases);
    setDataChart(
      <DataChart
        plot_data={{
          title: (
            <div className="flex items-center justify-between">
              <div>Number of Cases</div>
              {/* <ModalLink
                submitText="PRINT"
                description="Print"
                anchorText=""
                anchorClassName="text-amber-800 p-2 rounded hover:bg-white hover:-translate-y-2 duration-300"
                icon={<FontAwesomeIcon icon={faPrint} />}
              /> */}
            </div>
          ),
          dimensionRatio: 0.6,
          graph_type: "line",
          options: {
            indexAxis: "x",
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Number of Cases",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Clients",
                },
              },
            },
          },
          data: {
            labels: sortedCasesPerClient.map((s) => s.name),
            datasets: [
              {
                label: "Number of Cases",
                data: sortedCasesPerClient.map((s) => s.cases),
                borderColor: "rgb(146 64 14)",
                backgroundColor: "rgba(107, 114, 128, .7)",
                fill: true,
              },
            ],
          },
        }}
      />
    );
  }, [casesPerClient]);

  // useEffect(() => {
  //   if (typeof weekCounts === "object") {
  //     setWeeklyChart(
  //       <DataChart
  //         plot_data={{
  //           title: (
  //             <div className="flex items-center justify-between">
  //               <div>The past seven days</div>
  //               {/* <ModalLink
  //               submitText="PRINT"
  //               description="Print"
  //               anchorText=""
  //               anchorClassName="text-amber-800 p-2 rounded hover:bg-white hover:-translate-y-2 duration-300"
  //               icon={<FontAwesomeIcon icon={faPrint} />}
  //             /> */}
  //             </div>
  //           ),
  //           dimensionRatio: 0.4,
  //           graph_type: "line",
  //           options: {
  //             indexAxis: "x",
  //             plugins: {
  //               legend: {
  //                 display: false,
  //               },
  //             },
  //             scales: {
  //               x: {
  //                 title: {
  //                   display: true,
  //                   text: "Weekday",
  //                 },
  //               },
  //               y: {
  //                 title: {
  //                   display: true,
  //                   text: "Number of cases",
  //                 },
  //               },
  //             },
  //           },
  //           data: {
  //             labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Mon", "Tue"],
  //             datasets: [
  //               {
  //                 label: "Number of Cases",
  //                 data: [12, 23, 9, 17, 34, 27, 8],
  //                 borderColor: "rgb(146 64 14)",
  //                 backgroundColor: "rgba(107, 114, 128, .7)",
  //                 fill: false,
  //               },
  //             ],
  //           },
  //         }}
  //       />
  //     );
  //   }
  // }, [weekCounts]);

  const handleSearch = () => {
    if (search) {
      setSearching(true);
      setSearchResults({});

      apiCalls.getRequest({
        endpoint: endpoints.dash.deepSearch.replace("<:q>", search),
        httpHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
        },
        successCallback: (res) => {
          setSearching(false);
          setSearchResults(res);
        },
        errorCallback: (err) => {
          setSearching(false);
        },
      });
    }
  };

  return (
    <div className="grid gap-12">
      <div className="my-4 container">
        <div className="relative">
          <div className="absolute line-shadow rounded-lg bg-gray-100 left-0 right-0 z-40">
            <div className="flex self-start items-center flex-grow px-4">
              <div
                onClick={() => handleSearch()}
                className="text-gray-400 h-8 w-8 flex items-center justify-center"
              >
                {searching ? (
                  <Puff color="gray" width={20} height={20} />
                ) : (
                  <FontAwesomeIcon
                    className="text-xl text-gray-400 hover:text-amber-700"
                    icon={faSearch}
                  />
                )}
              </div>
              <input
                value={search}
                onChange={(e) => {
                  if (!e.target.value) {
                    setSearchResults({});
                  }
                  setSearch(e.target.value);
                }}
                className="outline-none py-1 px-6 flex-grow bg-transparent text-lg text-gray-400"
                placeholder="Search Cases/Clients"
              />
            </div>
            <div className="grid lg:grid-cols-2">
              {searchResults?.cases?.length ? (
                <div>
                  <h5 className="px-4 font-bold text-amber-700">Cases</h5>
                  <div className="max-h-[80vh] scroll_y">
                    {searchResults?.cases?.map((_case_, idx) => (
                      <div
                        onClick={() =>
                          navigate(`/dashboard/cases/${_case_["id"]}`)
                        }
                        className="border-l-[20px] hover:border-amber-500 p-4 grid grid-cols-2 bg-gray-100 m-2 shadow-md hover:bg-white hover:text-black hover:shadow-lg hover:shadow-black/20 cursor-pointer duration-200"
                        key={idx}
                      >
                        {Object.keys(_case_)
                          .filter(
                            (k) => !["id", "entity", "description"].includes(k)
                          )
                          .map((k, j) => {
                            return (
                              <div className="break-all p-2" key={j}>
                                <h5 className="font-bold">
                                  {utilityFunctions.snakeCaseToTitleCase(k)}
                                </h5>
                                <div>
                                  {joinArrays(
                                    `${_case_[k]}`,
                                    search,
                                    "bg-amber-700 text-white"
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* <NoResults
                    content={
                      <div className="px-4 py-2 rounded-2xl flex gap-2 items-center bg-white m-2">
                        <FontAwesomeIcon icon={faLayerGroup} />
                        <span>No records</span>
                      </div>
                    }
                  /> */}
                </>
              )}
              {searchResults?.clients?.length ? (
                <div>
                  {searchResults?.clients?.length && (
                    <h5 className="px-4 font-bold text-amber-700">Clients</h5>
                  )}
                  <div className="max-h-[80vh] scroll_y">
                    {searchResults?.clients?.map((client, idx) => (
                      <div
                        onClick={() =>
                          navigate(`/dashboard/clients/${client["id"]}`)
                        }
                        className="border-l-[20px] hover:border-amber-500 p-4 grid grid-cols-2 bg-gray-100 m-2 shadow-md hover:bg-white hover:text-black hover:shadow-lg hover:shadow-black/20 cursor-pointer duration-200"
                        key={idx}
                      >
                        {Object.keys(client)
                          .filter(
                            (k) => !["id", "entity", "description"].includes(k)
                          )
                          .map((k, j) => {
                            return (
                              <div key={j}>
                                <h5 className="font-bold">
                                  {utilityFunctions.snakeCaseToTitleCase(k)}
                                </h5>
                                <div>
                                  {joinArrays(
                                    `${client[k]}`,
                                    search,
                                    "bg-amber-700 text-white"
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* <NoResults
                    content={
                      <div className="px-4 py-2 rounded-2xl flex gap-2 items-center bg-white m-2">
                        <FontAwesomeIcon icon={faLayerGroup} />
                        <span>No records</span>
                      </div>
                    }
                  /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 container mx-auto">
        <div className="flex items-start gap-8 px-8 py-4">
          {Object.keys(counts).map((c, i) => (
            <div
              key={i}
              className="shadow-md py-4 rounded px-12 duration-300 hover:shadow-xl hover:shadow-gray-600/50"
            >
              <div className="text-2xl font-bold">
                {utilityFunctions.snakeCaseToTitleCase(c)}
              </div>
              <div className="text-4xl font-extrabold font-mono">
                <StrokeText text={counts[c]} />
              </div>
            </div>
          ))}
        </div>

        {/* <div className="max-w-xl">{weeklyChart}</div> */}
      </div>

      <div className=" grid xl:grid-cols-2 p-4 gap-4 items-start">
        <div className="p-4 shadow-md rounded duration-300 hover:shadow-2xl hover:shadow-gray-600/50 max-w-">
          {dataChart}
        </div>
        <div className="p-2">
          <h4 className="px-4 text-lg font-bold">Most Recent Cases</h4>
          <ListGroup className="shadow-md shadow-gray-700/50">
            {enforcementCases.map((cs, idx) => (
              <ListGroupItem
                action
                onClick={() => navigate(`/dashboard/cases/${cs["id"]}`)}
                className="line-shadow"
                key={idx}
              >
                <div className="font-bold text-gray-700/75">{cs.title}</div>
                <div className="">
                  <span className="mr-2 font-bold text-amber-800/75">CN</span>
                  {cs.case_no_or_parties}
                </div>
                <div className="">
                  <span className="mr-2 font-bold text-amber-800/75">FR</span>
                  {cs.file_reference}
                </div>
                <div className="">
                  <span className="mr-2 font-bold text-amber-800/75">CR</span>
                  {cs.clients_reference}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}
