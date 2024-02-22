import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCalls } from "../../assets/apiCalls";
import { endpoints } from "../../assets/apis";
import { ClientDetails } from "./Client";
import { Pagination } from "../common/Pagination";
import { FormModal } from "../common/FormModal";
import EditModal from "../common/EditModal";
import { PairView } from "./PairView";

function ClientDetailsWrapper({ setLoading }) {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [paginationConfig, setPaginationConfig] = useState(null);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    apiCalls.getRequest({
      endpoint: endpoints.clients.getClient.replace("<:clientId>", clientId),
      httpHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
      },
      successCallback: setClient,
      errorCallback: (err) => {
        console.log(err);
      },
    });
  }, [clientId]);

  useEffect(() => {
    if (client) {
      // Setting up pagination for client's cases
      const config = {
        modelName: "Case",
        itemsPrimaryKey: "id",
        paginationEndpoint: endpoints.pagination.search.searchCases
          .replace("<:q>", "client_id")
          .replace("<:v>", client.id),
        populationEndpoint: endpoints.statistics.searchCasesCount
          .replace("<:q>", "client_id")
          .replace("<:v>", client.id),
        itemsPerPage: 10,
        componentName: CaseDisplayItem,
        dataKey: "casex",
        create: {
          NewRecordComponent: FormModal,
          interceptCreation: (payload, callback) => {
            setLoading(true);
            apiCalls.postRequest({
              endpoint: endpoints.cases.postCase,
              httpHeaders: {
                Accept: "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              httpBody: payload,
              successCallback: (res) => {
                setLoading(false);
                notifiers.httpSuccess("Case created successfully");
                callback(res, 0);
              },
              errorCallback: (err) => {
                notifiers.httpError(err.message);
                setLoading(false);
              },
            });
          },
          newRecordProps: {
            inputFields: [
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
            ],
            anchorText: "Add New Case",
            submitText: "Save Case",
            description: "Create New Case",
          },
        },
        searchSupport: {
          support: false,
          searchPopulationEndpoint: endpoints.statistics.searchCasesCount,
          searchPaginationEndpoint: endpoints.pagination.search.searchCases,
          searchFields: [
            "id",
            "title",
            "case_no_or_parties",
            "file_reference",
            "clients_reference",
            "record",
          ],
        },
      };

      setPaginationConfig(config);
    }
  }, [client]);

  return (
    <div className="bg-gray-100 py-4">
      <div>{client && <ClientDetails client={client} />}</div>
      <div>
        <h3 className="px-4 py-2 text-2xl">{client?.name} Cases</h3>
      </div>
      <div>
        {paginationConfig && (
          <Pagination
            direction="vertical"
            selfVScroll={{
              vScroll: true,
              vClasses: "p-2",
            }}
            items={[cases, setCases]}
            //   recordsHeader={
            //     <div className="flex items-center gap-2 text-xs font-bold p-2">
            //       <span className="w-8"></span>
            //       <div className="grid grid-cols-2 items-center flex-grow">
            //         <div className="">Case</div>
            //         <div className="flex flex-wrap gap-x-4">
            //           <h5>Case No/Parties (CN)</h5>
            //           <h5>File Reference (FR)</h5>
            //           <h5>Clients Reference (CR)</h5>
            //         </div>
            //       </div>
            //       <div className="min-w-[7rem] max-w-[7rem]">Record</div>
            //     </div>
            //   }
            paginationConfig={{ ...paginationConfig }}
          />
        )}
      </div>
    </div>
  );
}

function CaseDisplayItem({ casex = {} }) {
  const [casey, setCasey] = useState(casex);
  const [paymentInformation, setPaymentInformation] = useState(null);
  useEffect(() => {
    if (casey) {
      [[endpoints.cases.getPaymentInformation, setPaymentInformation]].forEach(
        (prop) => {
          apiCalls.getRequest({
            endpoint: prop[0].replace("<:caseId>", casex.id),
            httpHeaders: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              Accept: "application/json",
            },
            successCallback: prop[1],
          });
        }
      );
    }
  }, [casey]);

  useEffect(() => {
    if (casex) {
      setCasey(casex);
    }
  }, [casex]);

  return (
    <div className="bg-white mt-4 border-l-[10px] rounded-lg border-amber-500 p-4">
      <div>
        <h4 className="text-gray-700 font-bold text-lg">{casey?.title}</h4>
        <div className="border-b pb-2">{casey?.description}</div>
      </div>
      {casey && (
        <div className="border-b">
          <PairView
            className="grid md:grid-cols-2 lg:grid-cols-4"
            fields={[
              "case_no_or_parties",
              "file_reference",
              "clients_reference",
              "record",
            ].map((f) => ({
              name: f,
              dir: f == "v",
            }))}
            obj={casey}
          />
          <div className="flex justify-end px-4">
            <EditModal
              receiveNewRecord={(res) => {
                setCasey(res);
              }}
              description="Edit Case"
              anchorText="..."
              anchorClassName="hover:text-amber-700"
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
        </div>
      )}
      {paymentInformation && (
        <div>
          <PairView
            className="grid md:grid-cols-2 lg:grid-cols-4 pb-4 relative"
            fields={[
              "payment_type",
              "outstanding",
              "paid_amount",
              "total_fee",
              "deposit_pay",
              "deposit_fees",
              "final_fees",
              "final_pay",
              "deposit",
            ].map((f) => ({
              name: f,
              dir: "v",
            }))}
            obj={paymentInformation}
          />
          <div className="flex justify-end px-4">
            <EditModal
              receiveNewRecord={(res) => {
                setPaymentInformation(res);
              }}
              description="Edit Payment Information"
              anchorText="..."
              anchorClassName="hover:text-amber-700"
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
        </div>
      )}
    </div>
  );
}

export { ClientDetailsWrapper };
