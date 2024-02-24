import { useState, useEffect } from "react";
import { capitalize } from "../../assets/functions";
import { apiCalls } from "../../assets/apiCalls";
import { endpoints } from "../../assets/apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceD6,
  faHandPointer,
  faMoneyCheckDollar,
  faPen,
  faPencil,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { faMoneyCheck } from "@fortawesome/free-solid-svg-icons/faMoneyCheck";
import { ModalLink } from "../common/ModalLink";
import {
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  NavLink,
} from "react-bootstrap";
import { notifiers } from "../../assets/notifiers";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import EditModal from "../common/EditModal";
import { paymentMethods, paymentTypes } from "../../assets/data";
import { DeleteModal } from "../common/DeleteModal";
import { Progress } from "../common/Progress";
import { PairView } from "./PairView";
import { useNavigate } from "react-router-dom";

export default function Case({ casex }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dashboard/cases/${casex.id}`)}
      className={`relative group odd:bg-white hover:bg-amber-100 hover:font-bold duration-500 cursor-pointer flex items-center border-b border-amber-800/25`}
    >
      <div
        onClick={() => navigate(`/dashboard/cases/${casex.id})`)}
        className="flex-col items-center flex-grow py-4 px-2"
      >
        {/* <span className={`mx-2 text-xs font-bold rounded p-1`}>{casex.id}</span>{" "} */}
        <div className="flex items-center">
          <div className="grid grid-cols-2 flex-grow break-all">
            <div className="z-20 px-2">
              <div className="flex flex-wrap items-center">
                <span className="text-gray-600 font-bold">{casex.title}</span>

                {/* <span
                  className={`mx-2 text-xs bg-amber-700 text-white rounded px-2`}
                >
                  {casex.status}
                </span> */}
              </div>
              <div className="text-gray-600">{casex.description}</div>
            </div>
            <div className="z-20 px-2">
              <div>
                <span className="text-amber-800 group-hover:text-amber-400 font-bold">
                  CN:
                </span>{" "}
                {casex.case_no_or_parties}
              </div>
              <div>
                <span className="text-amber-800 group-hover:text-amber-400 font-bold">
                  FR:
                </span>{" "}
                {casex.file_reference}
              </div>
              <div>
                <span className="text-amber-800 group-hover:text-amber-400 font-bold">
                  CR:
                </span>{" "}
                {casex.clients_reference}
              </div>
            </div>
          </div>
          <div className="min-w-[7rem] max-w-[7rem] px-2">{casex.record}</div>
        </div>
      </div>
    </div>
  );
}

export function CaseDetails({
  casex = {},
  setLoading,
  normalCrudManipulator,
  className,
}) {
  const [tasks, setTasks] = useState([]);
  const [importantDates, setImportantDatess] = useState([]);
  const [paymentInformation, setPaymentInformation] = useState(null);
  const [casey, setCasey] = useState(casex);
  const [parties, setParties] = useState([]);
  const [users, setUsers] = useState([]);
  const [client, setClient] = useState({});

  useEffect(() => {
    setCasey(casex);
  }, [casex]);

  useEffect(() => {
    if (casey) {
      [
        [endpoints.cases.getPaymentInformation, setPaymentInformation],
        // [endpoints.cases.getImportantDates, setImportantDatess],
        // [endpoints.cases.getTasks, setTasks],
        // [endpoints.cases.getParties, setParties],
        // [endpoints.users.getBriefUsers, setUsers],
      ].forEach((prop) => {
        apiCalls.getRequest({
          endpoint: prop[0].replace("<:caseId>", casey.id),
          httpHeaders: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            Accept: "application/json",
          },
          successCallback: prop[1],
        });
      });
    }
  }, [casey]);

  useEffect(() => {
    if (casey.client_id) {
      [
        [
          endpoints.clients.getClient.replace("<:clientId>", casey.client_id),
          setClient,
        ],
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
    }
  }, [casey]);

  const addInstallment = (payload) => {
    setLoading(true);
    apiCalls.postRequest({
      endpoint: endpoints.cases.addInstallment.replace("<:caseId>", casey.id),
      httpHeaders: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      httpBody: payload,
      successCallback: (res) => {
        setLoading(false);
        notifiers.httpSuccess("New Installment Recorded");
        setPaymentInformation(res);
      },
      errorCallback: (err) => {
        setLoading(false);
        notifiers.httpError(err);
      },
    });
  };

  const addParty = (payload) => {
    setLoading(true);
    apiCalls.postRequest({
      endpoint: endpoints.cases.addParty.replace("<:caseId>", casey.id),
      httpHeaders: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      httpBody: payload,
      successCallback: (res) => {
        setLoading(false);
        notifiers.httpSuccess("Added New Party");
        setParties(res);
      },
      errorCallback: (err) => {
        setLoading(false);
        notifiers.httpError(err);
      },
    });
  };

  function submitPaymentInformation(payload) {
    setLoading(true);
    apiCalls.postRequest({
      endpoint: endpoints.cases.initializePaymentInformation.replace(
        "<:caseId>",
        casey.id
      ),
      httpHeaders: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      httpBody: payload,
      successCallback: (res) => {
        setLoading(false);
        notifiers.httpSuccess("Succesfully Initialized Payment");
        setPaymentInformation(res);
      },
      errorCallback: (err) => {
        setLoading(false);
        notifiers.httpError(err);
      },
    });
  }

  const handleCumulativePaymentChange = (payload) => {
    setPaymentInformation(payload);
  };

  return (
    <div className={`${className}`}>
      <div>
        <h5>Case ID</h5>
        <NavLink
          to={`/dashboard/cases/${casex.id}`}
          className="text-xs px-2 pb-4"
        >
          {casex.id}
        </NavLink>
      </div>
      {casey && (
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex gap-4">
              <div className="text-xl flex-grow font-bold text-amber-800 border-b px-2 border-amber-700/50">
                {casey.title}
              </div>
              <EditModal
                receiveNewRecord={(res) => {
                  setCasey(res);
                  if (typeof normalCrudManipulator === "function") {
                    normalCrudManipulator(res, 0);
                  }
                }}
                description="Edit Case"
                anchorText="Edit Case"
                dataEndpoint={endpoints.cases.getCase.replace(
                  "<:caseId>",
                  casey.id
                )}
                updateEndpoint={endpoints.cases.patchCase.replace(
                  "<:caseId>",
                  casey.id
                )}
                editableFields={[
                  {
                    name: "title",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "description",
                    as: "textarea",
                    required: true,
                  },
                  {
                    name: "case_no_or_parties",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "record",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "file_reference",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "clients_reference",
                    as: "text",
                    required: true,
                  },
                ]}
              />
            </div>
            <div className="bg-white border-l-[10px] border-amber-600 rounded-r-2xl my-4">
              <div className="px-4 py-4 border-b text-gray-700 font-bold">
                {casey.description}
              </div>
              <PairView
                className="grid md:grid-cols-2 lg:grid-cols-4 pb-4"
                fields={[
                  "case_no_or_parties",
                  "record",
                  "file_reference",
                  "clients_reference",
                ].map((f) => ({ name: f, dir: "h" }))}
                obj={casey}
              />
            </div>
            <div className="bg-white border-l-[10px] border-amber-600 rounded-r-2xl">
              <h4 className="px-4 py-2 border-b font-bold text-xl">Client</h4>
              <PairView
                className="grid md:grid-cols-2 lg:grid-cols-4 pb-4"
                title={client.name}
                fields={["name", "email", "contact_number", "address"].map(
                  (f) => ({ name: f, dir: "h" })
                )}
                obj={client}
              />
            </div>
          </div>

          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md border-1 border-amber-800">
            <h4 className="text-lg bg-gray-200 py-2 px-4">
              Other assigned personel
            </h4>
            <div>
              {otherAssignedUsers.map((dt, index) => (
                <div key={index}></div>
              ))}
            </div>
          </div> */}

          {/*  Parties */}
          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md">
            <h4 className="text-lg bg-gray-200 py-2 px-4">Parties</h4>
            <div className="flex bg-gray-200 border-t border-b border-amber-700/75">
              <div className="w-1/3 flex items-center gap-2 px-1 py-2 justify-center border-r border-amber-700/75">
                <FontAwesomeIcon icon={faUserAlt} /> Party Type
              </div>

              <div className="w-2/3  flex items-center gap-2 px-2 py-2">
                Personal Details
              </div>
            </div>
            <div className="min-h-[5vh]">
              {parties.map((party, index) => (
                <div key={index} className="flex">
                  <div
                    className={`${
                      (index + 0) % 2 === 0 && "bg-white"
                    } w-1/3 flex items-center p-2 break-all justify-center border-r border-amber-700/75`}
                  >
                    {party.party_type}
                  </div>
                  <div
                    className={`w-2/3 grid ${
                      (index + 1) % 2 === 0 && "bg-white"
                    } p-2 lg:grid-cols-2`}
                  >
                    <div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faUserAlt} />
                        </span>
                        <div>{party.name}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faVoicemail} />
                        </span>
                        <div>{party.email}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faPhone} />
                        </span>
                        <div>{party.contact_number}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faLocation} />
                        </span>
                        <div>{party.address}</div>
                      </div>
                    </div>

                    <div className="pt-3 pb-2 px-4 flex gap-6 items-center">
                      <EditModal
                        description="Edit Party"
                        anchorText="Edit"
                        editableFields={[
                          { name: "party_type", as: "text" },
                          { name: "name", as: "text" },
                          { name: "email", as: "email" },
                          { name: "contact_number", as: "text" },
                          { name: "address", as: "textarea" },
                        ]}
                        receiveNewRecord={(updatedParty) => {
                          setParties(
                            parties.map((party) =>
                              party.id === updatedParty.id
                                ? updatedParty
                                : party
                            )
                          );
                        }}
                        updateEndpoint={endpoints.parties.crud.replace(
                          "<:id>",
                          party.id
                        )}
                        dataEndpoint={endpoints.parties.crud.replace(
                          "<:id>",
                          party.id
                        )}
                        displayFields={["id"]}
                      />
                      <DeleteModal
                        receiveResponse={() => {
                          setParties(parties.filter((p) => p.id !== party.id));
                        }}
                        endpoint={endpoints.parties.crud.replace(
                          "<:id>",
                          party.id
                        )}
                        anchorText="Delete"
                        description="Delete Party"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-2">
              <FormModal
                description="Add Case No/Parties"
                anchorText="Add Party"
                onSubmit={addParty}
                inputFields={[
                  {
                    name: "party_type",
                    as: "select",
                    required: true,
                    label: "Select Party Type",
                    options: [
                      { value: "plaintiff", label: "Plaintiff" },
                      { value: "defendant", label: "Defendant" },
                    ],
                  },
                  { name: "name", as: "text", required: true },
                  { name: "email", as: "email", required: true },
                  { name: "contact_number", as: "text", required: true },
                  { name: "address", as: "text", required: true },
                ]}
              />
            </div>
          </div> */}

          {/* Assigned Tasks */}
          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md">
            <h4 className="text-lg bg-gray-200 py-1 px-4">Assigned tasks</h4>
            <div>
              {tasks.map((dt, index) => (
                <div key={index}>Tasks</div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-2">
              <FormModal
                onSubmit={(payload) => {
                  console.log(payload);
                }}
                inputFields={[
                  {
                    name: "description",
                    as: "textarea",
                    required: true,
                  },
                  {
                    name: "due_date",
                    as: "date",
                    required: true,
                  },
                  {
                    name: "username",
                    as: "select",
                    label: "Select Staff",
                    options: users.map((usr) => ({
                      value: usr.username,
                      label: usr.name,
                    })),
                  },
                ]}
                description="Assign tasks"
                anchorText="Assign Task"
                icon={<FontAwesomeIcon icon={faTasks} />}
              />
            </div>
          </div> */}

          {/* Important Dates */}
          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md">
            <h4 className="text-lg bg-gray-200 py-2 px-4">Important Dates</h4>
            <div className="mb-2">
              {importantDates.map((dt, index) => (
                <div key={index}>Dates</div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-2">
              <FormModal
                onSubmit={(payload) => {
                  console.log(payload);
                }}
                inputFields={[
                  {
                    name: "date",
                    as: "date",
                    required: true,
                  },
                  {
                    name: "time",
                    as: "time",
                    required: true,
                  },
                  {
                    name: "activity_description",
                    as: "textarea",
                    required: true,
                  },
                ]}
                description="Create an Important Date"
                anchorText="New Important Date"
              />
            </div>
          </div> */}

          {/* <>
            percentage=
            {(parseFloat(paymentInformation.paid_amount) /
              parseFloat(paymentInformation.total_fee)) *
              100}
          </> */}

          {paymentInformation?.id ? (
            <div className="overflow-hidden rounded">
              <div className="flex flex-wrap gap-2 px-4 items-center justify-between">
                <h4 className="text-xl py-2 px-4">Payment Information</h4>
                <EditModal
                  receiveNewRecord={(res) => {
                    setPaymentInformation(res);
                  }}
                  description="Edit Payment Information"
                  anchorText="Edit Payment Information"
                  dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                    "<:caseId>",
                    casex.id
                  )}
                  updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                    "<:caseId>",
                    casex.id
                  )}
                  editableFields={[
                    {
                      name: "payment_type",
                      as: "select",
                      required: true,
                      label: "Select Type of Payment",
                      options: [
                        {
                          value: "full",
                          label: "Full Payment",
                        },
                        {
                          value: "installment",
                          label: "Installment",
                        },
                      ],
                    },
                    {
                      name: "outstanding",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "paid_amount",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "total_fee",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "deposit_pay",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "deposit_fees",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "final_fees",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "final_pay",
                      as: "text",
                      required: true,
                    },
                    {
                      name: "deposit",
                      as: "text",
                      required: true,
                    },
                  ]}
                />
              </div>
              <div className="p-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="rounded bg-white line-shadow p-4">
                  <div className="text-center pb-2">
                    Payment Completion status
                  </div>
                  <div className="px-4 max-w-[10rem] p-2 mx-auto">
                    <Progress
                      width={10}
                      completeColor="rgb(120 53 15)"
                      incompleteColor="white"
                      innerClassName="bg-gray-200 font-extrabold text-amber-800"
                      percentage={
                        (parseFloat(paymentInformation.paid_amount) /
                          parseFloat(paymentInformation.total_fee)) *
                        100
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 xl:grid-cols-2 xl:col-span-2 items-start">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center relative rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faDiceD6} />
                      </div>
                      <div className="flex flex-col">
                        <span>Total Fee</span>
                        <span className="text-amber-800 font-bold px-2">
                          {paymentInformation.total_fee}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          <EditModal
                            description="Change Total Fee"
                            dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            editableFields={[
                              { name: "total_fee", as: "number" },
                            ]}
                            anchorClassName="text-amber-800"
                            anchorText="......."
                            icon={<FontAwesomeIcon icon={faPencil} />}
                            receiveNewRecord={(res) => {
                              setPaymentInformation(res);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center relative rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faWallet} />
                      </div>
                      <div className="flex flex-col">
                        <span>Payment Type</span>
                        <span className="text-amber-800 font-bold px-2 uppercase">
                          {paymentInformation.payment_type}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          <EditModal
                            description="Change type of payment"
                            dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            editableFields={[
                              {
                                name: "payment_type",
                                as: "select",
                                label: "Select Payment Type",
                                options: [
                                  { label: "Full", value: "full" },
                                  {
                                    label: "Installment",
                                    value: "installment",
                                  },
                                ],
                              },
                            ]}
                            anchorClassName="text-amber-800"
                            anchorText="......."
                            icon={<FontAwesomeIcon icon={faPencil} />}
                            receiveNewRecord={(res) => {
                              setPaymentInformation(res);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center relative rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faMoneyCheck} />
                      </div>
                      <div className="flex flex-col">
                        <span>Outstanding</span>
                        <span className="text-amber-800 font-bold px-2">
                          {paymentInformation.outstanding}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          <EditModal
                            description="Change Due Balance"
                            dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            editableFields={[
                              { name: "outstanding", as: "number" },
                            ]}
                            anchorClassName="text-amber-800"
                            anchorText="......."
                            icon={<FontAwesomeIcon icon={faPencil} />}
                            receiveNewRecord={(res) => {
                              setPaymentInformation(res);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center relative rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faMoneyCheckDollar} />
                      </div>
                      <div className="flex flex-col">
                        <span>Paid Amount</span>
                        <span className="text-amber-800 font-bold px-2">
                          {paymentInformation.paid_amount}
                        </span>
                        <div className="absolute shadow-md shadow-gray-700/10 hover:shadow-xl hover:shadow-gray-800/50 hover:scale-105 duration-300 rounded-lg px-2 py-1 right-2">
                          <EditModal
                            description="Paid Amount"
                            dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                              "<:caseId>",
                              casey.id
                            )}
                            editableFields={[
                              { name: "paid_amount", as: "number" },
                            ]}
                            anchorClassName="text-amber-800"
                            anchorText="......."
                            icon={<FontAwesomeIcon icon={faPencil} />}
                            receiveNewRecord={(res) => {
                              setPaymentInformation(res);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {paymentInformation.payment_type !== "full" && (
                <div className="p-2">
                  <div className="text-lg p-4 text-amber-800">
                    <div>Cummulative Payments</div>
                  </div>
                  <div className="">
                    <div className="flex border-b border-amber-800">
                      <div className="min-w-[12.5%] max-w-[12.5%] text-center px-1 truncate py-2 border-r border-amber-800"></div>
                      <div className="min-w-[25%] max-w-[25%] text-center px-1 truncate py-2 border-r border-amber-800">
                        Amount
                      </div>
                      <div className="min-w-[12.5%] max-w-[12.5%] text-center px-1 truncate py-2 border-r border-amber-800">
                        Payment Type
                      </div>
                      <div className="min-w-[25%] max-w-[25%] text-center px-1 truncate py-2 border-r border-amber-800">
                        Payment Method
                      </div>
                      <div className="min-w-[25%] max-w-[25%] text-center px-1 truncate py-2">
                        Time
                      </div>
                    </div>
                    <div className="grid">
                      <div className="">
                        {paymentInformation?.cummulative_payments?.map(
                          (payment, index) => (
                            <div
                              key={index}
                              className="flex items-center border-b border-amber-800"
                            >
                              <div className="flex-grow flex">
                                <div
                                  className={`${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[12.5%] max-w-[12.5%] px-1 font-bold flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  <div className="flex flex-wrap gap-2">
                                    <EditModal
                                      receiveNewRecord={
                                        handleCumulativePaymentChange
                                      }
                                      editableFields={[
                                        {
                                          name: "payment_method",
                                          as: "select",
                                          options: paymentMethods.map(
                                            (paymentMethod) => ({
                                              value: paymentMethod,
                                              label: paymentMethod,
                                            })
                                          ),
                                          label: "Payment Method",
                                        },
                                        {
                                          name: "payment_type",
                                          as: "select",
                                          options: [
                                            "final",
                                            "installment",
                                            "deposit",
                                          ].map((paymentMethod) => ({
                                            value: paymentMethod,
                                            label: capitalize(paymentMethod),
                                          })),
                                          label: "Payment Type",
                                        },
                                        { name: "amount", as: "number" },
                                      ]}
                                      updateEndpoint={endpoints.payments.crud.replace(
                                        "<:id>",
                                        payment.id
                                      )}
                                      dataEndpoint={endpoints.payments.crud.replace(
                                        "<:id>",
                                        payment.id
                                      )}
                                      anchorText=""
                                      description="Edit Payment Details"
                                      icon={<FontAwesomeIcon icon={faPen} />}
                                      anchorClassName="p-1 rounded line-shadow-on-hover"
                                    />
                                    <DeleteModal
                                      endpoint={endpoints.payments.crud.replace(
                                        "<:id>",
                                        payment.id
                                      )}
                                      receiveResponse={(res) => {
                                        setPaymentInformation(res);
                                      }}
                                      anchorText=""
                                      description="Delete Payment"
                                      anchorClassName="p-1 rounded line-shadow-on-hover"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    (index + 1) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[25%] max-w-[25%] px-1 flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  {payment.amount}
                                </div>
                                <div
                                  className={`${
                                    (index + 2) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[12.5%] max-w-[12.5%] px-1 flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  {payment.payment_type}
                                </div>
                                <div
                                  className={`${
                                    (index + 3) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[25%] max-w-[25%] px-1 flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  {payment.payment_method}
                                </div>
                                <div
                                  className={`${
                                    (index + 4) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[25%] max-w-[25%] px-1 flex items-center justify-center py-2`}
                                >
                                  {payment.created_at}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex justify-end px-4 pt-3 pb-2">
                        <AddInstallment
                          {...{
                            id: casey.id,
                            title: casey.title,
                            description: casey.description,
                            addInstallment: addInstallment,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <AddPaymentInformation
                {...{
                  id: casey.id,
                  title: casey.title,
                  description: casey.description,
                  handleSubmit: submitPaymentInformation,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AddPaymentInformation({
  id,
  title,
  description,
  handleSubmit,
  modalAndchorText = "Add Payment Information",
}) {
  const [paymentInformation, setPaymentInformation] = useState({});

  const handlePaymentInformationChange = (e) => {
    const newObj = {
      ...paymentInformation,
      [e.target.name]: e.target.value,
    };
    if (e.target.value === "full") {
      delete newObj.payment;
    }
    setPaymentInformation(newObj);
  };

  const updatePayment = (payment) => {
    setPaymentInformation({
      ...paymentInformation,
      payment: payment,
    });
  };

  const submitPaymentInformation = () => {
    handleSubmit(paymentInformation);
    setPaymentInformation({});
  };

  const fields = ["payment_type", "total_fee"];

  if (paymentInformation?.payment_type === "installment") {
    fields.push("payment");
  }

  return (
    <ModalLink
      submitData={submitPaymentInformation}
      submitButtonClassName="ring-1 ring-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded p-2"
      cancelButtonClassName="ring-1 ring-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded p-2"
      disabled={Boolean(
        fields.find((field) => !Boolean(paymentInformation[field]))
      )}
      icon={<FontAwesomeIcon icon={faAdd} />}
      description={modalAndchorText}
      anchorText={modalAndchorText}
      modalContent={
        <div className="text-sm">
          <h4 className="flex gap-4">
            <span>Case ID</span>
            <span className="bg-gray-200 px-4 py-1 rounded font-bold">
              {id}
            </span>
          </h4>
          <h4 className="dancing text-2xl border-b">Case</h4>
          <div className="text-gray-700/75 italic text-xl px-2 font-bold">
            {title}
          </div>
          <div className="text-gray-600 px-8">{description}</div>

          <div className="grid gap-4 py-4">
            <InputGroup>
              <InputGroup.Text>Total Fee</InputGroup.Text>
              <Form.Control
                name="total_fee"
                value={paymentInformation?.total_fee || ""}
                onChange={handlePaymentInformationChange}
                required
                type="number"
                placeholder="KShs 000000.00"
                className="px-4 py-2 "
              />
            </InputGroup>

            {/* ---------------------------------------------------------------------- */}
            <ListGroup>
              <ListGroupItem className="p-0" style={{ overflow: "hidden" }}>
                <InputGroup>
                  <InputGroup.Text style={{ border: "none" }}>
                    <span className="text-gray-700/75 font-bold">
                      Payment Type
                    </span>
                  </InputGroup.Text>
                  <Form.Select
                    style={{ border: "none", borderRadius: 0 }}
                    value={paymentInformation?.payment_type || ""}
                    onChange={handlePaymentInformationChange}
                    name="payment_type"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="full">Full Payment</option>
                    <option value="installment">Installments</option>
                  </Form.Select>
                </InputGroup>
              </ListGroupItem>
              <ListGroupItem className="p-0">
                <input
                  className="outline-none px-4 py-2 rounded"
                  style={{ border: "none" }}
                  onChange={() => {}}
                  value={(paymentInformation?.payment_type || "").toUpperCase()}
                  required
                  type="text"
                  placeholder="Type of payment"
                />
              </ListGroupItem>
            </ListGroup>

            {/* ------- Down Payment -------- */}
            {paymentInformation?.payment_type === "installment" && (
              <div className="grid gap-3">
                <InputGroup>
                  <InputGroup.Text style={{}}>
                    <span className="text-gray-700/75 font-bold">
                      Deposit Amount
                    </span>
                  </InputGroup.Text>
                  <Form.Control
                    className="outline-none px-4 py-2 flex-grow border rounded-r"
                    style={{ border: "none" }}
                    onChange={() => {}}
                    value={(
                      paymentInformation?.payment?.amount || ""
                    ).toUpperCase()}
                    required
                    type="text"
                    placeholder="Deposit Amount"
                  />
                </InputGroup>
                <Payment updatePayment={updatePayment} />
              </div>
            )}
          </div>
        </div>
      }
      submitText="Create"
    />
  );
}

function AddInstallment({ id, title, description, addInstallment }) {
  const [payment, setPayment] = useState({});

  const updatePayment = (payload) => {
    setPayment(payload);
  };

  const sendInstallment = () => {
    addInstallment(payment);
    setPayment({});
  };

  return (
    <ModalLink
      submitText="Add"
      anchorText="New Installment"
      submitButtonClassName="ring-1 ring-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded p-2"
      cancelButtonClassName="ring-1 ring-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded p-2"
      disabled={!Boolean(payment?.amount)}
      description="Add New Installment"
      submitData={sendInstallment}
      modalContent={
        <div className="grid gap-3">
          <h4 className="flex gap-4">
            <span>Case ID</span>
            <span className="bg-gray-200 px-4 py-1 rounded font-bold">
              {id}
            </span>
          </h4>
          <h4 className="dancing text-2xl border-b">Case</h4>
          <div className="text-gray-700/75 italic text-xl px-2 font-bold">
            {title}
          </div>
          <div className="text-gray-600 px-8">{description}</div>

          <InputGroup>
            <InputGroup.Text style={{}}>
              <span className="text-gray-700/75 font-bold">Installment</span>
            </InputGroup.Text>
            <Form.Control
              className="outline-none px-4 py-2 flex-grow border rounded-r"
              style={{ border: "none" }}
              onChange={() => {}}
              value={payment?.amount || ""}
              required
              type="number"
              placeholder="KSHs. 0000.00"
            />
          </InputGroup>
          <Payment updatePayment={updatePayment} />
        </div>
      }
    />
  );
}

function Payment({ updatePayment }) {
  const [payment, setPayment] = useState({});
  const [set, setSet] = useState(false);

  const handlePaymentChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const submitPayment = () => {
    updatePayment(payment);
    setPayment({});
    setSet(true);
  };

  const payState = payment?.amount ? "Change Amount" : "Add Payment";

  return (
    <ModalLink
      disabled={Boolean(
        ["payment_method", "amount", "payment_type"].find(
          (field) => !Boolean(payment[field])
        )
      )}
      icon={<FontAwesomeIcon icon={faHandPointer} />}
      anchorText="Set Amount"
      submitButtonClassName="ring-1 ring-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded p-2"
      cancelButtonClassName="ring-1 ring-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded p-2"
      submitText={payState.split(" ")[0]}
      submitData={submitPayment}
      description={payState}
      modalContent={
        <div className="grid gap-4">
          {set && (
            <div className="flex gap-4 items-center font-bold text-amber-800 pl-12">
              <span className="text-amber-700 text-xl">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              <span>Payment set</span>
            </div>
          )}

          {/* Payment Method */}
          <ListGroup>
            <ListGroupItem className="p-0" style={{ overflow: "hidden" }}>
              <InputGroup>
                <InputGroup.Text style={{ border: "none" }}>
                  <span className="text-gray-700/75 font-bold">
                    Payment Method
                  </span>
                </InputGroup.Text>
                <Form.Select
                  style={{ border: "none", borderRadius: 0 }}
                  value={payment?.payment_method || ""}
                  onChange={handlePaymentChange}
                  name="payment_method"
                >
                  <option value="">Select Method of Payment</option>
                  {paymentMethods.map((m, idx) => (
                    <option key={idx} value={m}>
                      {m}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </ListGroupItem>
            <ListGroupItem className="p-0">
              <input
                className="outline-none px-4 py-2 rounded"
                style={{ border: "none" }}
                onChange={() => {}}
                value={(payment?.payment_method || "").toUpperCase()}
                required
                type="text"
                placeholder="Method of payment"
              />
            </ListGroupItem>
          </ListGroup>

          {/* Payment Type */}
          <ListGroup>
            <ListGroupItem className="p-0" style={{ overflow: "hidden" }}>
              <InputGroup>
                <InputGroup.Text style={{ border: "none" }}>
                  <span className="text-gray-700/75 font-bold">
                    Payment Type
                  </span>
                </InputGroup.Text>
                <Form.Select
                  style={{ border: "none", borderRadius: 0 }}
                  value={payment?.payment_type || ""}
                  onChange={handlePaymentChange}
                  name="payment_type"
                >
                  <option value="">Select Type of Payment</option>
                  {paymentTypes.map((m, idx) => (
                    <option key={idx} value={m}>
                      {capitalize(m)}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </ListGroupItem>
            <ListGroupItem className="p-0">
              <input
                className="outline-none px-4 py-2 rounded"
                style={{ border: "none" }}
                onChange={() => {}}
                value={(payment?.payment_type || "").toUpperCase()}
                required
                type="text"
                placeholder="Type of payment"
              />
            </ListGroupItem>
          </ListGroup>

          {/* Payment Amount */}
          <div>
            <h4 className="mb-1 font-bold text-gray-700/75 px-3">
              Enter amount
            </h4>
            <InputGroup>
              <InputGroup.Text>Amount</InputGroup.Text>
              <Form.Control
                name="amount"
                onChange={handlePaymentChange}
                value={payment?.amount || ""}
                required
                type="number"
                placeholder="KShs. 00000.00"
              />
            </InputGroup>
          </div>
        </div>
      }
    />
  );
}
