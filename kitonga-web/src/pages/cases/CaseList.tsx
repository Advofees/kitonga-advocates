import {
  BackspaceIcon,
  ChevronRightIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosDelete, axiosGet, axiosPatch } from "../../lib/axiosLib";
import { Case, PaymentInformation, Population } from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { ControlledAccordions } from "../../ui/accordions/ControlledAccordions";
import {
  TanstackSuspense,
  TanstackSuspensePaginated,
} from "../../ui/TanstackSuspense";
import { NavLink, useSearchParams } from "react-router-dom";
import { CaseListSkeleton } from "../../ui/Skeletons";
import { Alert, Pagination } from "@mui/material";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { EditModal } from "../../ui/modals/EditModal";
import { caseStates } from "../../lib/data";
import { useQueryClient } from "@tanstack/react-query";
import { OpenNewCaseModal } from "./OpenNewCaseModal";
import { insertQueryParams, snakeCaseToTitleCase } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import { Search } from "../../ui/Search";
import { useContext, useState } from "react";
import DeleteModal from "../../ui/modals/DeleteModal";
import FilterDrawer from "./FilterDrawer";
import TableValues from "../../ui/TableValues";
import { AlertContext } from "../Dashboard";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";
import { AlertResponse } from "../../ui/definitions";
import { SplitButton } from "../../ui/SplitButton";

const endpoints = {
  index: { data: APIS.pagination.getCases, count: APIS.statistics.casesCount },
  search: {
    data: APIS.pagination.search.searchCases,
    count: APIS.statistics.searchCasesCount,
  },
};

export function CaseList() {
  const { pushAlert } = useContext(AlertContext);
  const handleRequest = useAPI();
  const queryClient = useQueryClient();
  const [queryStringParams, setQueryStringParams] = useSearchParams();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination();
  const [api, setApi] = useState<keyof typeof endpoints>("index");
  const [queryParams, setQueryParams] = useState<
    Record<string, string | number>
  >({});

  async function updateCaseDetails(
    payload: Record<string, string | number>,
    caseId: string
  ) {
    const caseDetailsQueryKey = `${TANSTACK_QUERY_KEYS.CASE_DETAILS}#${caseId}`;
    return await handleRequest<PaymentInformation>({
      func: axiosPatch,
      args: [APIS.cases.patchCase.replace("<:caseId>", `${caseId}`), payload],
    }).then((res) => {
      if (res.status === "ok") {
        queryClient.invalidateQueries({
          queryKey: [caseDetailsQueryKey],
        });
        queryClient.invalidateQueries({
          queryKey: [
            TANSTACK_QUERY_KEYS.CASE_LIST,
            api,
            queryParams,
            itemsPerPage,
          ],
        });
        pushAlert({
          status: "success",
          message: "Case updated successfully",
        });
        return true;
      } else {
        pushAlert({
          status: "error",

          message: (
            <RequestErrorsWrapperNode
              fallbackMessage="Sorry, an error occured while updating case details, please your input fields and try again."
              requestError={res}
            />
          ),
        });
        return false;
      }
    });
  }

  return (
    <div className="p-2 grid gap-2">
      <div className="flex gap-2">
        <FilterDrawer
          anchorClassName="px-2 rounded border hover:border-teal-600 hover:text-teal-600 duration-300 flex items-center justify-center cursor-pointer"
          anchorContent={
            <>
              <FunnelIcon height={24} />
            </>
          }
        />

        <button
          onClick={() => {
            setQueryParams({});
            setApi("index");
          }}
          className="text-sm text-white px-2 rounded bg-teal-800 cursor-pointer hover:bg-teal-600 duration-300"
        >
          <BackspaceIcon height={20} />
        </button>

        <SplitButton
          sx={{ ...MUI_STYLES.TransparentButton }}
          prefix="Search by: "
          options={[
            "title",
            "case_no_or_parties",
            "file_reference",
            "clients_reference",
            "record",
          ].map((k) => ({
            value: k,
            name: snakeCaseToTitleCase(k),
          }))}
          onChange={(newOption) => {
            queryStringParams.set("q", newOption.value);
            setQueryStringParams(queryStringParams);
          }}
        />

        <Search
          queryKey="v"
          onSubmit={(v) => {
            setQueryParams({
              q: queryStringParams.get("q") || "title",
              v,
            });
            setApi("search");
          }}
          className="flex-grow rounded overflow-hidden shadow"
        />

        <OpenNewCaseModal />
      </div>
      <TanstackSuspensePaginated
        currentPage={currentPage}
        queryKey={[
          TANSTACK_QUERY_KEYS.CASE_LIST,
          api,
          queryParams,
          itemsPerPage,
        ]}
        queryFn={() => {
          const params: Record<string, string | number> = {
            page_number: currentPage,
            page_population: itemsPerPage,
            ...queryParams,
          };

          return handleRequest<Case[]>({
            func: axiosGet,
            args: [insertQueryParams(endpoints[api].data, params)],
          });
        }}
        fallback={<CaseListSkeleton size={8} />}
        RenderPaginationIndicators={({ currentPage }) => (
          <TanstackSuspense
            queryKey={[TANSTACK_QUERY_KEYS.CASE_COUNT, api]}
            queryFn={() => {
              const params: Record<string, string | number> = {
                page_number: currentPage,
                page_population: itemsPerPage,
                ...queryParams,
              };

              return handleRequest<Population>({
                func: axiosGet,
                args: [insertQueryParams(endpoints[api].count, params)],
              });
            }}
            RenderData={({ data }) => {
              if (data.status === "ok" && data.result) {
                const { count } = data.result;

                return (
                  <div className="p-2 shadow border rounded bg-white flex items-center gap-4">
                    <SplitButton
                      sx={{ ...MUI_STYLES.TransparentButton }}
                      initialValue={String(itemsPerPage)}
                      prefix="Per page: "
                      options={[5, 10, 25, 50, 75, 100].map((p) => ({
                        name: `${p}`,
                        value: `${p}`,
                      }))}
                      onChange={(newValue) =>
                        setNumberOfItemsPerPage(Number(newValue.value))
                      }
                    />

                    <div className="flex-grow flex">
                      <Pagination
                        page={currentPage}
                        onChange={(_, page) => {
                          setNextPage(page);
                        }}
                        size="small"
                        count={Math.ceil(count / Number(itemsPerPage))}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div className="rounded overflow-hidden shadow-sm">
                  <Alert severity="warning">
                    <RequestErrorsWrapperNode
                      fallbackMessage="Could not count cases..."
                      requestError={data}
                    />
                  </Alert>
                </div>
              );
            }}
          />
        )}
        RenderData={({ data }) => {
          if (data.status !== "ok" || !!!data.result) {
            return (
              <div className="rounded overflow-hidden shadow-sm">
                <Alert severity="warning">
                  <RequestErrorsWrapperNode
                    fallbackMessage="Could not fetch cases..."
                    requestError={data}
                  />
                </Alert>
              </div>
            );
          }

          return (
            <div className="grid rounded overflow-hidden border shadow">
              {data.result.length > 0 ? (
                <ControlledAccordions
                  className="border-b bg-white last:border-none"
                  expandedClassName="bg-teal-900"
                  expand={{
                    ExpandIcon: ({ expanded }) => (
                      <ChevronRightIcon
                        className={`${
                          expanded ? "text-gray-200" : " text-teal-800"
                        }`}
                        height={16}
                      />
                    ),
                  }}
                  items={data.result.map(
                    ({
                      id,
                      title,
                      status,
                      description,
                      case_no_or_parties,
                      file_reference,
                      clients_reference,
                      record,
                    }) => ({
                      summary: { title, status, id },
                      details: {
                        id,
                        title,
                        status,
                        description,
                        case_no_or_parties,
                        file_reference,
                        clients_reference,
                        record,
                      },
                    })
                  )}
                  Summary={({ summary: { title, status }, expanded }) => (
                    <div
                      className={`flex items-center w-full duration-300 ${
                        expanded ? "text-gray-200" : ""
                      }`}
                    >
                      <h3 className="w-2/3 font-semibold">{title}</h3>
                      <span className="w-1/3 grid px-4">
                        <span
                          title={status}
                          className={`truncate border ${
                            expanded
                              ? "text-gray-200 border-gray-200/50"
                              : "bg-teal-50 text-teal-900 border-teal-800/40"
                          } px-2 py-1 rounded w-max justify-self-end text-xs`}
                        >
                          {status}
                        </span>
                      </span>
                    </div>
                  )}
                  Details={({
                    details: {
                      id,
                      title,
                      description,
                      case_no_or_parties,
                      file_reference,
                      clients_reference,
                      record,
                      status,
                    },
                    expanded,
                  }) => (
                    <div className={`${expanded ? "text-gray-200" : ""}`}>
                      <div className="grid grid-cols-">
                        <div className="flex items-start border-y border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">Description</h4>
                          <p className="flex-grow">{description}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">
                            Case NO. or Parties
                          </h4>
                          <p className="flex-grow">{case_no_or_parties}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">File Reference</h4>
                          <p className="flex-grow">{file_reference}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">
                            Clients Reference
                          </h4>
                          <p className="flex-grow">{clients_reference}</p>
                        </div>
                        <div className="flex items-start border-b border-gray-200/50 py-1">
                          <h4 className="min-w-44 max-w-44">Record</h4>
                          <p className="flex-grow">{record}</p>
                        </div>
                      </div>
                      <div className="py-1 flex gap-2">
                        <NavLink
                          className="bg-teal-800 hover:bg-teal-700 duration-300 w-max px-4 py-1 text-gray-200 rounded flex items-center gap-2 text-sm"
                          to={`/dashboard/cases/details/${id}`}
                        >
                          <span>See More</span> <ChevronRightIcon height={16} />
                        </NavLink>
                        <EditModal
                          title={<h3>Modify case details</h3>}
                          className="grid gap-2"
                          anchorClassName="px-2 py-1 rounded text-sm text-white flex items-center gap-2 cursor-pointer bg-teal-800 hover:bg-teal-600 duration-300"
                          anchorContent={
                            <>
                              <PencilSquareIcon height={20} />
                            </>
                          }
                          initial={{
                            title,
                            case_no_or_parties,
                            description,
                            file_reference,
                            clients_reference,
                            record,
                            status,
                          }}
                          editableFields={[
                            {
                              name: "title",
                              label: "Case Title",
                              options: { type: "text" },
                              required: true,
                            },
                            {
                              name: "description",
                              label: "Case Description",
                              options: { type: "textarea", rows: 3 },
                              required: true,
                            },
                            {
                              name: "case_no_or_parties",
                              label: "Case No. or Parties",
                              options: { type: "text" },
                              required: true,
                            },
                            {
                              name: "file_reference",
                              label: "File Reference",
                              options: { type: "text" },
                              required: true,
                            },
                            {
                              name: "clients_reference",
                              label: "Clients Reference",
                              options: { type: "text" },
                              required: true,
                            },
                            {
                              name: "record",
                              label: "Record",
                              options: { type: "number" },
                              required: true,
                            },
                            {
                              name: "status",
                              label: "Status",
                              options: {
                                type: "select",
                                options: caseStates.map(({ name }) => ({
                                  name,
                                  level: 0,
                                  type: "item",
                                  value: name,
                                })),
                              },
                              required: true,
                            },
                          ]}
                          onSubmit={async (payload) => {
                            return await updateCaseDetails(payload, id);
                          }}
                        />
                        <DeleteModal
                          passKey="delete case"
                          onSubmit={() =>
                            handleRequest<null>({
                              func: axiosDelete,
                              args: [
                                APIS.cases.deleteCase.replace("<:caseId>", id),
                              ],
                            }).then((res) => {
                              queryClient.invalidateQueries({
                                queryKey: [
                                  TANSTACK_QUERY_KEYS.CASE_LIST,
                                  api,
                                  queryParams,
                                  itemsPerPage,
                                ],
                              });
                              if (res.status === "ok") {
                                const rs: AlertResponse = {
                                  status: "success",
                                  message: "Case deleted successfully.",
                                };
                                pushAlert(rs);
                                return rs;
                              } else {
                                return {
                                  status: "error",
                                  message: (
                                    <RequestErrorsWrapperNode
                                      fallbackMessage="Failed to delete case!"
                                      requestError={res}
                                    />
                                  ),
                                };
                              }
                            })
                          }
                          anchorClassName="px-2 py-1 rounded text-sm text-white flex items-center gap-2 cursor-pointer bg-teal-800 hover:text-red-800 hover:ring-1 hover:ring-red-800 duration-300"
                          anchorContent={
                            <>
                              <TrashIcon height={20} />
                            </>
                          }
                        >
                          <h3>You are about to delete this case</h3>
                          <TableValues
                            transformKeys={(k) => snakeCaseToTitleCase(k)}
                            className="rounded text-sm"
                            values={{
                              id,
                              title,
                              file_reference,
                              clients_reference,
                            }}
                            valueClassName="gap-2"
                            copy={{
                              fields: [
                                "id",
                                "file_reference",
                                "clients_reference",
                              ],
                              copyContentProps: {
                                iconClassName: "p-0.5",
                                className:
                                  "flex items-center border border-gray-500 text-gray-500 rounded",
                              },
                            }}
                          />
                        </DeleteModal>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div className="p-4 bg-white rounded shadow">
                  No Results Found...
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
