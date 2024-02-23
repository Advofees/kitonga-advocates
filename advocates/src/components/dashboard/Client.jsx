import { useEffect, useState } from "react";
import { Background } from "../common/DottedBackground";
import { PairView } from "./PairView";
import { apiCalls } from "../../assets/apiCalls";
import { endpoints } from "../../assets/apis";
import { caseStates } from "../../assets/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataChart } from "../common/DataChart";
import {
  faChartGantt,
  faDownload,
  faFileCsv,
  faFileExcel,
  faGavel,
  faHandPointer,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { ModalInfo } from "../common/ModalInfo";
import { InputGroup, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { NoResults } from "../common/NoResults";
import { Dna } from "react-loader-spinner";
import { array2d, csvString, utilityFunctions } from "../../assets/functions";
import { notifiers } from "../../assets/notifiers";
import * as XLSX from "xlsx";
import { Loader } from "../common/Loader";
import { StaticPagination } from "./StaticPagination";
import EditModal from "../common/EditModal";
import { useNavigate } from "react-router-dom";

export function Client({ client, selectedClient, setSelectedClient }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dashboard/clients/${client.id}`)}
      className={`relative flex flex-col odd:bg-white hover:bg-amber-800 hover:font-bold hover:text-white duration-500 cursor-pointer border-b border-amber-800/25 py-2`}
    >
      {/* <div className="z-20 text-xs px-4 py-1">
        <span className="px-2 py-1 rounded-lg">{client.id}</span>
      </div> */}
      <div className="flex flex-grow p-2 gap-4">
        <div className="flex flex-grow">
          <div className="w-1/4 truncate z-20">{client.name}</div>
          <div className="w-1/4 truncate z-20">{client.email}</div>
          <div className="w-1/4 truncate z-20">{client.address}</div>
          <div className="w-1/4 truncate z-20">{client.contact_number}</div>
        </div>
      </div>
    </div>
  );
}

export function ClientDetails({ client = {}, className }) {
  const [currentClient, setCurrentClient] = useState({});
  //const [casesStatusTally, setCasesStatusTally] = useState({});

  useEffect(() => {
    setCurrentClient(client);
    // [
    //   [endpoints.statistics.showClientCaseStatusTally, setCasesStatusTally],
    // ].forEach((prop) => {
    //   apiCalls.getRequest({
    //     endpoint: prop[0].replace("<:clientId>", client.id),
    //     httpHeaders: {
    //       Authorization: "Bearer " + sessionStorage.getItem("token"),
    //       Accept: "application/json",
    //     },
    //     successCallback: (res) => {
    //       prop[1](res);
    //     },
    //   });
    // });
  }, [client]);

  // const sortedStatistics = caseStates.map((s) => ({
  //   ...s,
  //   count: casesStatusTally[s.name] || 0,
  // }));
  // sortedStatistics.sort((a, b) => b.count - a.count);

  return (
    <div className={`${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b my-2 py-4 px-4">
        <h3 className="text-2xl font-bold py-2">{client.name}</h3>
        <div className="flex gap-2">
          <EditModal
            receiveNewRecord={(res) => {
              setCurrentClient(res);
            }}
            description="Edit client details"
            anchorText="Edit client details"
            dataEndpoint={endpoints.clients.getClient.replace(
              "<:clientId>",
              client.id
            )}
            updateEndpoint={endpoints.clients.patchClient.replace(
              "<:clientId>",
              client.id
            )}
            editableFields={[
              {
                name: "name",
                as: "text",
                required: true,
              },
              {
                name: "username",
                as: "text",
                required: true,
              },
              {
                name: "email",
                as: "text",
                required: true,
              },
              {
                name: "contact_number",
                as: "text",
                required: true,
              },
              {
                name: "address",
                as: "text",
                required: true,
              },
            ]}
          />
          <ModalInfo
            fullscreen
            anchorText={`Export Data`}
            icon={<FontAwesomeIcon icon={faChartGantt} />}
            modalContent={
              <div>
                <ExportClientCases client={client} />
              </div>
            }
          />
        </div>
      </div>
      <div>
        <PairView
          className="grid md:grid-cols-2 lg:grid-cols-4 pb-4"
          fields={["name", "email", "contact_number", "address"].map((f) => ({
            name: f,
            dir: "h",
          }))}
          obj={currentClient}
        />
      </div>

      {/* <div className="shadow-sm rounded-lg">
          <div className="max-w-xl mx-auto">
            {Object.keys(casesStatusTally).length > 0 && (
              <DataChart
                plot_data={{
                  title: `${client.name}'s Case State Analysis`,
                  dimensionRatio: 0.7,
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
                          text: "Number of Conferences",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Case Status",
                        },
                      },
                    },
                  },
                  data: {
                    labels: sortedStatistics.map((s) => s.name),
                    datasets: [
                      {
                        label: "Number of Cases",
                        data: sortedStatistics.map((s) => s.count),
                        borderColor: "rgb(146 64 14)",
                        backgroundColor: "rgba(107, 114, 128, .7)",
                        fill: true,
                      },
                    ],
                  },
                }}
              />
            )}
          </div>
        </div> */}

      {/* States */}
      {/* <div>
        <h4 className="px-4 mt-4 text-xl dancing">Status Tally</h4>
        <div className="bg-white p-2 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
          {sortedStatistics.map((s, i) => (
            <div
              key={i}
              className="border-amber-800/75  rounded-lg bg-gradient-to-r from-gray-100 via-gray-100 to-white shadow-xl shadow-white overflow-hidden"
            >
              <div className="flex gap-2">
                <div className="text-3xl w-24 rounded-br-lg bg-gradient-to-r from-white text-gray-700/50 h-24 flex justify-center items-center shadow-md">
                  <FontAwesomeIcon icon={s.icon} />
                </div>
                <div className="text-5xl flex-grow flex items-center font-extrabold">
                  <StrokeText
                    fillColor="transparent"
                    strokeColor="black"
                    sz={1}
                    text={<SpeedCounter value={s.count} />}
                  />
                </div>
              </div>
              <div className="text-3xl py-2 font-extrabold italic px-4">
                <StrokeText
                  fillColor="white"
                  strokeColor="rgb(146 64 14)"
                  sz={1}
                  text={s.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

function ExportClientCases({ client }) {
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [matchFields, setMatchFields] = useState([]);
  const [criteria, setCriteria] = useState("match");
  const [responseColumns, setResponseColumns] = useState([]);
  const [matchColumns, setMatchColumns] = useState({});
  const [dataUrl, setDataUrl] = useState("");
  const [exportFormat, setExportFormat] = useState({
    name: "excel",
    icon: faFileExcel,
    ext: ".xlsx",
  });

  const supportedFilterFields = [
    "case_no_or_parties",
    "file_reference",
    "clients_reference",
    "record",
    "total_fee",
    "balance_due",
    "paid_amount",
  ];

  const handleSubmit = () => {
    if (
      Object.keys(matchColumns).length > 0 &&
      !Boolean(Object.keys(matchColumns).find((f) => matchColumns[f] === "")) &&
      responseColumns.length > 0
    ) {
      const payload = {
        match_columns: { ...matchColumns, client_id: client.id },
        response_columns: responseColumns,
      };
      setLoading(true);
      apiCalls.postRequest({
        endpoint: endpoints.filter.filterCases.replace("<:criteria>", criteria),
        httpHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        httpBody: payload,
        successCallback: (res) => {
          setLoading(false);
          setCases(res);
        },
        errorCallback: (err) => {
          setLoading(false);
          notifiers.httpError(err);
        },
      });
    } else {
      if (Object.keys(matchColumns).length < 1) {
        notifiers.generalInfo("No Columns Selected");
        return;
      }
      if (Object.keys(matchColumns).find((f) => matchColumns[f] === "")) {
        notifiers.generalInfo("Empty Fields Detected");
        return;
      }
      if (responseColumns.length < 1) {
        notifiers.generalInfo("Please select export columns");
        return;
      }
    }
  };

  useEffect(() => {
    setDataUrl("");
  }, [cases]);

  const handleCsv = () => {
    return URL.createObjectURL(
      new Blob([csvString(cases, responseColumns)], { type: "text/csv" })
    );
  };

  const handleExcel = () => {
    const workSheet = XLSX.utils.aoa_to_sheet(array2d(cases, responseColumns));
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");

    const xlsxData = XLSX.write(workBook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([xlsxData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return URL.createObjectURL(blob);
  };

  const handleExport = () => {
    if (exportFormat.name === "csv") {
      setDataUrl(handleCsv());
    } else {
      setDataUrl(handleExcel());
    }
  };

  const handleChange = (k, v) => {
    const newObj = { ...matchColumns, [k]: v };
    setMatchColumns(newObj);
  };

  useEffect(() => {
    const newObj = { ...matchColumns };
    for (let f of Object.keys(newObj)) {
      if (!matchFields.includes(f)) {
        delete newObj[f];
      }
    }
    matchFields.forEach((f) => {
      if (matchColumns[f] === undefined) {
        newObj[f] = "0";
      }
    });
    setMatchColumns(newObj);
  }, [matchFields]);

  return (
    <div className="relative">
      {loading && <Loader className="bg-white/75 z-50 fixed" />}
      <h4 className="text-2xl font-bold">{client.name}</h4>
      <div>
        <h5 className="py-1 px-4 text-sm">Flexibility</h5>
        <div className="grid grid-cols-3 max-w-2xl gap-4">
          <InputGroup className="">
            <InputGroup.Text style={{ borderRadius: 0 }}>
              <Form.Check
                checked={criteria === "match"}
                onChange={() => setCriteria("match")}
                name="flexibility"
                type="radio"
              />
            </InputGroup.Text>
            <InputGroup.Text style={{ borderRadius: 0 }} className="flex-grow">
              Match
            </InputGroup.Text>
          </InputGroup>
          <InputGroup className="">
            <InputGroup.Text style={{ borderRadius: 0 }}>
              <Form.Check
                checked={criteria === "strict"}
                onChange={() => setCriteria("strict")}
                name="flexibility"
                type="radio"
              />
            </InputGroup.Text>
            <InputGroup.Text style={{ borderRadius: 0 }} className="flex-grow">
              Strict
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <h4 className="px-4 font-bold text-lg">
            Supported Columns: Click to use
          </h4>
          <ListGroup horizontal="md">
            {supportedFilterFields.map((f, idx) => (
              <ListGroupItem
                key={idx}
                className={`border-amber-700 cursor-pointer ${
                  matchFields.includes(f) ? "bg-amber-800 text-white" : ""
                }`}
                variant={matchFields.includes(f) ? "dark" : ""}
                onClick={() => {
                  matchFields.includes(f)
                    ? setMatchFields((flds) => flds.filter((fld) => fld !== f))
                    : setMatchFields([...matchFields, f]);
                }}
              >
                {f}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
        <div>
          <h4 className="px-4 font-bold text-lg">Define Values</h4>
          <div className="gap-1 grid py-2 max-w-xl">
            {matchFields.length > 0 ? (
              matchFields.map((f, idx) => (
                <InputGroup key={idx}>
                  <InputGroup.Text
                    onClick={() =>
                      setMatchFields((flds) => flds.filter((fld) => fld !== f))
                    }
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </InputGroup.Text>
                  <InputGroup.Text style={{ minWidth: "14rem" }}>
                    {utilityFunctions.snakeCaseToTitleCase(f)}
                  </InputGroup.Text>
                  <Form.Control
                    name={f}
                    value={matchColumns[f] || ""}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    placeholder={utilityFunctions.snakeCaseToTitleCase(f)}
                  />
                </InputGroup>
              ))
            ) : (
              <div className="min-h-[10vh] flex justify-center items-center flex-col relative font-bold">
                <div className="flex flex-col items-center z-30 text-lg">
                  <FontAwesomeIcon icon={faHandPointer} />
                  <span>Please Select fields above</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="px-4 font-bold text-lg">
            Export Columns: Click to select
          </h4>
          <ListGroup horizontal="md">
            {supportedFilterFields.map((f, idx) => (
              <ListGroupItem
                key={idx}
                className={`border-amber-700 cursor-pointer ${
                  responseColumns.includes(f) ? "bg-amber-800 text-white" : ""
                }`}
                data-bs-theme={responseColumns.includes(f) ? "dark" : ""}
                onClick={() => {
                  responseColumns.includes(f)
                    ? setResponseColumns((flds) =>
                        flds.filter((fld) => fld !== f)
                      )
                    : setResponseColumns([...responseColumns, f]);
                }}
              >
                {f}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
      <div>
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleSubmit}
            className="py-2 px-8 my-4 shadow-md rounded-lg bg-amber-800 text-gray-100 hover:bg-white hover:shadow-lg duration-300 hover:scale-110 hover:shadow-gray-700 hover:text-black"
          >
            <FontAwesomeIcon icon={faSearch} /> Search
          </button>
          <div className="flex flex-grow justify-end">
            {cases.length > 0 && dataUrl && (
              <a
                href={dataUrl}
                download={`${client.name.replace(/\s+/g, "_")}_____${new Date()
                  .toDateString()
                  .replace(/\s+/g, "_")}${exportFormat.ext}`}
                className="flex gap-2 items-center font-bold text-amber-800 ring-2 ring-amber-800 rounded-sm hover:bg-amber-800 hover:text-white duration-300 cursor-pointer px-4 py-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download</span>
                <span className="uppercase">{exportFormat.name}</span>
              </a>
            )}
          </div>
          {cases.length > 0 && (
            <ListGroup horizontal>
              {[
                { name: "excel", icon: faFileExcel, ext: ".xlsx" },
                { name: "csv", icon: faFileCsv, ext: ".csv" },
              ].map((exf, idx) => (
                <ListGroupItem
                  className={`border-amber-600 cursor-pointer flex gap-2 items-center duration-300 ${
                    exf.name === exportFormat.name && "bg-amber-600 text-white"
                  }`}
                  onClick={() => setExportFormat(exf)}
                  key={idx}
                >
                  <FontAwesomeIcon icon={exf.icon} />
                  {exf.name}
                </ListGroupItem>
              ))}
              <ListGroupItem
                onClick={handleExport}
                className="border-amber-800 hover:bg-amber-950 hover:border-amber-950 duration-300 cursor-pointer hover bg-amber-800 text-white"
              >
                Export <span className="font-bold">{exportFormat.name}</span>
              </ListGroupItem>
            </ListGroup>
          )}
        </div>

        <h4 className="px-4 font-bold text-lg">Filter Results</h4>
        <div className="grid  gap-2 pb-8">
          <ListGroup horizontal>
            {responseColumns.map((col, idx) => (
              <ListGroupItem
                className="font-bold"
                variant="info"
                style={{ minWidth: `${(1 / responseColumns.length) * 100}%` }}
                key={idx}
              >
                {utilityFunctions.snakeCaseToTitleCase(col)}
              </ListGroupItem>
            ))}
          </ListGroup>
          {cases.length > 0 ? (
            <StaticPagination
              items={cases}
              itemHost={CaseRowItem}
              itemHostProps={{ responseColumns, className: "mb-2" }}
              perPage={10}
            />
          ) : (
            <NoResults
              content={
                <div>
                  <h4 className="flex flex-col items-center">
                    <span className="font-bold">No results matched</span>
                  </h4>
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CaseRowItem({ item, responseColumns, className }) {
  return (
    <ListGroup className={`${className}`} horizontal>
      {responseColumns.map((col, idx) => (
        <ListGroupItem
          variant="success"
          style={{
            minWidth: `${(1 / responseColumns.length) * 100}%`,
          }}
          key={idx}
        >
          <div className="break-all">{item[col]}</div>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}
