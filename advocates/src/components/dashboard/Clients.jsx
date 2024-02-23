import { endpoints } from "../../assets/apis";
import { Client, ClientDetails } from "./Client";
import { Pagination } from "../common/Pagination";
import { useState } from "react";
import { FormModal } from "../common/FormModal";
import { apiCalls } from "../../assets/apiCalls";
import { notifiers } from "../../assets/notifiers";
import EditModal from "../common/EditModal";
import { DeleteModal } from "../common/DeleteModal";

export default function Clients({ setLoading }) {
  const [selectedClient, setSelectedClient] = useState(null);

  const paginationConfig = {
    modelName: "Client",
    itemsPrimaryKey: "id",
    paginationEndpoint: {
      endpoint: endpoints.pagination.getClients,
      method: "GET",
    },
    populationEndpoint: {
      endpoint: endpoints.statistics.clientsCount,
      method: "GET",
    },
    itemsPerPage: 10,
    componentName: Client,
    detailsComponent: ClientDetails,
    detailsProps: { setLoading },
    dataKey: "client",
    create: {
      NewRecordComponent: FormModal,
      interceptCreation: (payload, callback) => {
        setLoading(true);
        apiCalls.postRequest({
          endpoint: endpoints.clients.postClient,
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          httpBody: payload,
          successCallback: (res) => {
            notifiers.httpSuccess("New Client Created");
            setLoading(false);
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
          { as: "text", required: true, name: "name" },
          { as: "text", required: true, name: "username" },
          { as: "email", required: true, name: "email" },
          { as: "text", required: true, name: "contact_number" },
          { as: "text", required: true, name: "address" },
          // { as: "password", required: true, name: "password" },
          // { as: "password", required: true, name: "password_confirmation" },
        ],
        description: "New Client",
        anchorText: "Register New Client",
      },
    },
    update: {
      UpdateComponent: EditModal,
      interceptUpdate: (payload, callback) => {
        setLoading(true);

        apiCalls.postRequest({
          endpoint: endpoints.clients.patchClient.replace(
            "<:clientId>",
            payload.id
          ),
          httpMethod: "PATCH",
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          httpBody: payload.payload,
          successCallback: (res) => {
            setLoading(false);
            notifiers.httpSuccess("Update Success");
            callback(res, 1);
          },
          errorCallback: (err) => {
            setLoading(false);
            notifiers.httpError(err);
          },
        });
      },
      updateDataSource: endpoints.clients.getClient.replace(
        "<:clientId>",
        "<:id>"
      ),
      updateProps: {
        anchorClassName: "flex items-center gap-2 group-hover:text-amber-800",
        description: "Edit Client",
        anchorText: "Edit Client",
        editableFields: [
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
            as: "email",
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
        ],
      },
    },
    destroy: {
      DeleteComponent: DeleteModal,
      interceptDestruction: (payload, callback) => {
        apiCalls.deleteRequest({
          endpoint: endpoints.clients.deleteClient.replace(
            "<:clientId>",
            payload
          ),
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          successCallback: (res) => {
            callback(payload, -1);
            notifiers.httpSuccess("Record Deleted");
          },
          errorCallback: (err) => {
            notifiers.httpError(err);
          },
        });
      },
      deleteProps: {
        anchorText: "Delete Client",
        description: "Delete Client",
        anchorClassName: "flex items-center gap-2 group-hover:text-amber-800",
        consequences: (
          <div className="text-sm">
            <h5 className="text-sm py-2 px-2 font-bold">
              Deleting this Client has the following side effects
            </h5>
            <h4 className="px-4 text-gray-700 font-bold">
              The following information will be lost:
            </h4>
            <ul className="px-8 list-disc list-inside">
              <li>All cases registered under this client</li>
            </ul>

            {/* <div className="mx-auto flex justify-center">
              <InputGroup className="w-max mt-4">
                <InputGroup.Text>
                  <Form.Check type="switch" className="" />
                </InputGroup.Text>
                <InputGroup.Text className="text-sm">
                  Archive Instead
                </InputGroup.Text>
              </InputGroup>
            </div> */}
          </div>
        ),
      },
    },
    searchSupport: {
      support: true,
      searchPopulationEndpoint: {
        endpoint: endpoints.statistics.searchClientsCount,
        method: "GET",
      },
      searchPaginationEndpoint: {
        endpoint: endpoints.pagination.search.searchClients,
        method: "GET",
      },
      searchFields: [
        "id",
        "name",
        "username",
        "email",
        "contact_number",
        "address",
      ],
    },
  };

  return (
    <div className="bg-gray-100 py-4">
      <div className="bg-gray-100 mx-2">
        <Pagination
          direction="vertical"
          selfVScroll={{
            vScroll: true,
            vClasses: "p-2",
          }}
          paginationConfig={{ ...paginationConfig }}
          generalProps={{ setSelectedClient, selectedClient }}
          recordsHeader={
            <div className="flex gap-2 font-bold px-4 py-2">
              <span className="w-6"></span>
              <div className="flex flex-grow">
                <span className="w-1/4">Name</span>
                <span className="w-1/4">Email</span>
                <span className="w-1/4">Address</span>
                <span className="w-1/4">Contact Number</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
