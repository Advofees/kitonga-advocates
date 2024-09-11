import { Alert, Pagination } from "@mui/material";
import useAPI from "../../hooks/useAPI";
import { APIS } from "../../lib/apis";
import { axiosDelete, axiosGet } from "../../lib/axiosLib";
import {
  AccessPolicy,
  BriefAccessPolicy,
  Population,
} from "../../lib/definitions";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import {
  TanstackSuspense,
  TanstackSuspensePaginated,
} from "../../ui/TanstackSuspense";
import KDrawer from "../../ui/drawers/KDrawer";
import {
  ChevronRightIcon,
  TrashIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import { Add, More, MoreHorizOutlined } from "@mui/icons-material";
import { insertQueryParams, snakeCaseToTitleCase } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { useQueryClient } from "@tanstack/react-query";
import { BuildNewPolicyForm } from "./BuildNewPolicyForm";
import { ClientListSkeleton } from "../../ui/Skeletons";
import { NavLink } from "react-router-dom";
import DeleteModal from "../../ui/modals/DeleteModal";
import { LazySearch } from "../../ui/Search";
import { ManualModal } from "../../ui/modals/ManualModal";
import { KTooltip } from "../../ui/KTooltip";
import TableValues from "../../ui/TableValues";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";
import { SplitButton } from "../../ui/SplitButton";

export function AccessPolicyList() {
  const queryClient = useQueryClient();
  const handleRequest = useAPI();
  const { currentPage, itemsPerPage, setNextPage, setNumberOfItemsPerPage } =
    usePagination({
      initialPage: 1,
    });
  return (
    <div>
      <div className="grid gap-2">
        <div className="flex gap-2">
          <KDrawer
            collapseClassName="border-r-2 border-y-2 rounded-r py-4 bg-white hover:text-white hover:bg-teal-800 duration-300 hover:border-teal-800"
            collapseContent={
              <>
                <ChevronRightIcon height={20} />
              </>
            }
            anchorPosition="right"
            anchorClassName="flex items-center gap-2 bg-teal-800 w-max text-white px-4 text-sm py-1 rounded hover:bg-teal-600 duration-300"
            anchorContent={
              <>
                <Add />
                <span>Build a new policy</span>
              </>
            }
          >
            <div className="p-2 max-w-xl">
              <BuildNewPolicyForm
                onNewRecord={() => {
                  setNextPage(1);
                  queryClient.invalidateQueries({
                    queryKey: [
                      TANSTACK_QUERY_KEYS.ACCESS_POLICY_COUNT,
                      itemsPerPage,
                      currentPage,
                    ],
                  });
                  queryClient.invalidateQueries({
                    queryKey: [
                      TANSTACK_QUERY_KEYS.ACCESS_POLICY_LIST,
                      itemsPerPage,
                      currentPage,
                    ],
                  });
                }}
              />
            </div>
          </KDrawer>
          <div className="flex-grow max-w-xl">
            <LazySearch
              containerClassName="h-10"
              placeholder="Seach access policies..."
              zIndex={20}
              viewPortClassName="max-h-36 vertical-scrollbar"
              className="border bg-white rounded shadow"
              fetchItems={(q: string) =>
                handleRequest<BriefAccessPolicy[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.accessPolicies.search,
                      { q }
                    ),
                  ],
                }).then((res) => {
                  if (res.status === "ok" && res.result) {
                    return res.result;
                  }
                  return [];
                })
              }
              childClassName="border-b mr-2 first:border-t"
              RenderItem={({
                item: { id, name, description, effect, created_at, updated_at },
              }) => (
                <div className="flex justify-between items-center">
                  <span className="px-2">{name}</span>
                  <ManualModal
                    anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer"
                    anchorContent={
                      <>
                        <MoreHorizOutlined fontSize="small" />
                      </>
                    }
                  >
                    <h3>Access policy details</h3>
                    <TableValues
                      transformKeys={(k) => snakeCaseToTitleCase(k)}
                      className="rounded text-sm"
                      values={{
                        id,
                        name,
                        description,
                        effect,
                        created: `${new Date(
                          created_at
                        ).toDateString()} at ${new Date(
                          created_at
                        ).toLocaleTimeString()}`,
                        last_updated: `${new Date(
                          updated_at
                        ).toDateString()} at ${new Date(
                          updated_at
                        ).toLocaleTimeString()}`,
                      }}
                      valueClassName="gap-2"
                      copy={{
                        fields: ["id", "name"],
                        copyContentProps: {
                          iconClassName: "p-0.5",
                          className:
                            "flex items-center border border-gray-500 text-gray-500 rounded",
                        },
                      }}
                    />
                  </ManualModal>
                </div>
              )}
            />
          </div>
        </div>
        <TanstackSuspensePaginated
          fallback={<ClientListSkeleton />}
          currentPage={currentPage}
          RenderPaginationIndicators={({ currentPage }) => (
            <TanstackSuspense
              queryKey={[
                TANSTACK_QUERY_KEYS.ACCESS_POLICY_COUNT,
                itemsPerPage,
                currentPage,
              ]}
              queryFn={() => {
                const params: Record<string, string | number> = {
                  page_number: currentPage,
                  page_population: itemsPerPage,
                };

                return handleRequest<Population>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.accessPolicies.count,
                      params
                    ),
                  ],
                });
              }}
              RenderData={({ data }) => {
                if (data.status === "ok" && data.result) {
                  const { count } = data.result;

                  return (
                    <div className="p-2 shadow rounded bg-white flex items-center gap-4">
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
                  <div className="rounded overflow-hidden shadow border">
                    <Alert severity="warning">
                      <RequestErrorsWrapperNode
                        fallbackMessage="Could not count access policies..."
                        requestError={data}
                      />
                    </Alert>
                  </div>
                );
              }}
            />
          )}
          queryKey={[
            TANSTACK_QUERY_KEYS.ACCESS_POLICY_LIST,
            itemsPerPage,
            currentPage,
          ]}
          queryFn={() => {
            const params: Record<string, string | number> = {
              page_number: currentPage,
              page_population: itemsPerPage,
            };

            return handleRequest<AccessPolicy[]>({
              func: axiosGet,
              args: [
                insertQueryParams(
                  APIS.authorization.accessPolicies.index,
                  params
                ),
              ],
            });
          }}
          RenderData={({ data }) => {
            if (data.status === "ok" && data.result) {
              const accessPolicies = data.result;
              return (
                <>
                  {accessPolicies.length > 0 ? (
                    <div className="grid">
                      <div className="bg-white rounded border shadow">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="px-4 text-start py-1">Name</th>
                              <th className="px-4 text-start py-1">
                                Description
                              </th>
                              <th className="px-4 text-start py-1">Effect</th>
                              <th className="px-4 text-start py-1">Created</th>
                              <th className="px-4 text-start py-1">Subjects</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {accessPolicies.map(
                              (
                                {
                                  id,
                                  name,
                                  description,
                                  effect,
                                  created_at,
                                  updated_at,
                                  actions,
                                  principals,
                                  resources,
                                },
                                index
                              ) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-1">{name}</td>
                                  <td className="px-4 py-1">
                                    <span className="grid">
                                      <span className="max-w-48 truncate">
                                        {description}
                                      </span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-1">{effect}</td>
                                  <td className="px-4 py-1">
                                    {new Date(created_at).toDateString()}
                                  </td>
                                  <td className="px-4">
                                    <span className="flex w-max text-sm border rounded">
                                      <span className="px-2 border-r">
                                        A {actions?.length}
                                      </span>
                                      <span className="px-2 border-r">
                                        P {principals?.length}
                                      </span>
                                      <span className="px-2">
                                        R {resources?.length}
                                      </span>
                                    </span>
                                  </td>
                                  <td className="pr-2 flex justify-end">
                                    <KTooltip
                                      tooltipContainerClassName="shadow shadow-black/50 bg-white-100/10 backdrop-blur rounded overflow-hidden"
                                      tooltipContent={
                                        <>
                                          <NavLink
                                            to={`/dashboard/settings/policies/details/${id}`}
                                            className="flex items-center gap-2 px-2 py-1 hover:text-white hover:bg-teal-800 duration-300"
                                          >
                                            <ViewfinderCircleIcon height={16} />
                                            <span>See More</span>
                                          </NavLink>
                                          <DeleteModal
                                            passKey="delete policy"
                                            anchorClassName="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-white hover:bg-red-800 duration-300"
                                            anchorContent={
                                              <>
                                                <TrashIcon height={16} />
                                                <span>Delete</span>
                                              </>
                                            }
                                            onSubmit={async () =>
                                              handleRequest<null>({
                                                func: axiosDelete,
                                                args: [
                                                  APIS.authorization.accessPolicies.destroy.replace(
                                                    "<:policyId>",
                                                    id
                                                  ),
                                                ],
                                              }).then((res) => {
                                                queryClient.invalidateQueries({
                                                  queryKey: [
                                                    TANSTACK_QUERY_KEYS.ACCESS_POLICY_LIST,

                                                    itemsPerPage,
                                                    currentPage,
                                                  ],
                                                });
                                                if (res.status === "ok") {
                                                  return {
                                                    status: "success",
                                                    message:
                                                      "Access policy deleted successfully.",
                                                  };
                                                } else {
                                                  return {
                                                    status: "error",
                                                    message: (
                                                      <RequestErrorsWrapperNode
                                                        fallbackMessage="Could not delete policy."
                                                        requestError={res}
                                                      />
                                                    ),
                                                  };
                                                }
                                              })
                                            }
                                          >
                                            <h3>
                                              You are about to delete this
                                              access policy
                                            </h3>
                                            <TableValues
                                              transformKeys={(k) =>
                                                snakeCaseToTitleCase(k)
                                              }
                                              className="rounded text-sm"
                                              values={{
                                                id,
                                                name,
                                                created: `${new Date(
                                                  created_at
                                                ).toDateString()} at ${new Date(
                                                  created_at
                                                ).toLocaleTimeString()}`,
                                                last_updated: `${new Date(
                                                  updated_at
                                                ).toDateString()} at ${new Date(
                                                  updated_at
                                                ).toLocaleTimeString()}`,
                                              }}
                                              valueClassName="gap-2"
                                              copy={{
                                                fields: ["id", "name"],
                                                copyContentProps: {
                                                  iconClassName: "p-0.5",
                                                  className:
                                                    "flex items-center border border-gray-500 text-gray-500 rounded",
                                                },
                                              }}
                                            />
                                          </DeleteModal>
                                        </>
                                      }
                                    >
                                      <span className="text-teal-600">
                                        <More />
                                      </span>
                                    </KTooltip>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded shadow overflow-hidden border">
                      <Alert severity="info">No results found!!</Alert>
                    </div>
                  )}
                </>
              );
            }
            return (
              <div className="rounded shadow overflow-hidden border">
                <Alert severity="error">
                  <RequestErrorsWrapperNode
                    fallbackMessage="Sorry, could not fetch access policies."
                    requestError={data}
                  />
                </Alert>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
