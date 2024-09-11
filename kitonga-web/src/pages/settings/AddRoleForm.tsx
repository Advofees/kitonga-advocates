import { insertQueryParams, joinArrays } from "../../lib/utils";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import useAPI from "../../hooks/useAPI";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert } from "@mui/material";
import { Role } from "../../lib/definitions";
import { Check, Close } from "@mui/icons-material";
import { LazySearch } from "../../ui/Search";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { AlertResponse } from "../../ui/definitions";
import { useQueryClient } from "@tanstack/react-query";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function AddRoleForm({
  roles,
  groupId,
}: {
  roles: Role[];
  groupId: string;
}) {
  const queryClient = useQueryClient();
  const [createRes, setCreateRes] = useState<AlertResponse | null>(null);
  const groupRolesKey = `${TANSTACK_QUERY_KEYS.GROUP_DETAILS}#${groupId}#roles`;
  const handleRequest = useAPI();
  const [stagedRoles, setStagedRoles] = useState<Role[]>([]);
  const roleStaged = (id: string) =>
    [...roles, ...stagedRoles].some((r) => r.id === id);
  const stageRole = (role: Role) => {
    if (!roleStaged(role.id)) {
      setStagedRoles((p) => [...p, role]);
    }
  };
  const unstageRole = (role: Role) => {
    if (roleStaged(role.id)) {
      setStagedRoles((p) => p.filter((r) => r.id !== role.id));
    }
  };
  const [adding, setAdding] = useState(false);

  function handleSubmit() {
    setAdding(true);
    handleRequest<{ message: string }>({
      func: axiosPost,
      args: [
        APIS.authorization.groups.addRoles.replace("<:groupId>", groupId),
        { ids: stagedRoles.map((r) => r.id) },
      ],
    })
      .then((res) => {
        if (res.status === "ok") {
          setCreateRes({
            status: "success",
            message: "Roles added successfully.",
          });
          queryClient.invalidateQueries({
            queryKey: [groupRolesKey],
          });
        } else {
          setCreateRes({
            status: "error",
            message: (
              <RequestErrorsWrapperNode
                fallbackMessage="An error occured. Please try again later"
                requestError={res}
              />
            ),
          });
        }
      })
      .finally(() => {
        setAdding(false);
      });
  }

  return (
    <div className="min-w-[20rem] grid gap-2">
      {createRes && (
        <div className="border shadow">
          <Alert severity={createRes.status}>{createRes.message}</Alert>
        </div>
      )}
      <LazySearch
        placeholder="Search roles"
        containerClassName="h-10"
        zIndex={20}
        viewPortClassName="max--36 vertical-scrollba"
        className="border bg-white shadow"
        fetchItems={(q: string) =>
          handleRequest<Role[]>({
            func: axiosGet,
            args: [
              insertQueryParams(
                APIS.authorization.searchResource.replace(
                  "<:resource>",
                  "role"
                ),
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
        RenderItem={({ q, item }) => (
          <div
            onClick={() => {
              stageRole(item);
            }}
            className="flex items-center border-t w-full text-start text-sm hover:bg-teal-600 hover:border-t-teal-600 hover:text-white px-4 py-0.5 duration-300"
          >
            <span className="flex-grow">
              {joinArrays(String(item.name), q, "bg-black rounded text-white")}
            </span>
            {roleStaged(item.id) && (
              <span className="text-teal-400">
                <Check fontSize="small" />
              </span>
            )}
          </div>
        )}
      />
      {stagedRoles.length > 0 ? (
        <>
          <div className="border">
            {stagedRoles.map((role, index) => (
              <div
                key={index}
                className="flex items-center border-b last:border-none shadow bg-white w-full text-start text-sm p-2"
              >
                <span className="flex-grow">{role.name}</span>
                <span
                  onClick={() => unstageRole(role)}
                  className="text-teal-400 hover:text-teal-800"
                >
                  <Close fontSize="small" />
                </span>
              </div>
            ))}
          </div>
          <div className="">
            <div className="max-w-[12rem] flex-grow">
              <LoadingButton
                onClick={() => handleSubmit()}
                loading={adding}
                type="button"
                fullWidth
                variant="contained"
                sx={{ ...MUI_STYLES.Button, borderRadius: 0 }}
              >
                Add
              </LoadingButton>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 border">
          <div className="max-w-[18rem]">
            Search for roles above to add to this group.
          </div>
        </div>
      )}
    </div>
  );
}
