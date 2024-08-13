import { useEffect, useState } from "react";
import { ModalLink } from "./ModalLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileEdit } from "@fortawesome/free-solid-svg-icons";
import { apiCalls } from "../../assets/apiCalls";
import { notifiers } from "../../assets/notifiers";
import { utilityFunctions } from "../../assets/functions";
import { InputGroup, ListGroup, ListGroupItem, Form } from "react-bootstrap";
import { OptionSelection } from "./OptionSelection";
import { ThreeDots } from "react-loader-spinner";

export default function EditModal({
  disableEditing = false,
  dataEndpoint = "",
  icon = <FontAwesomeIcon icon={faFileEdit} />,
  anchorText = "Edit",
  anchorClassName = "flex gap-2 items-center line-shadow rounded px-4 py-2 text-amber-800 hover:text-white hover:bg-amber-700 duration-200",
  description = "Edit",
  updateEndpoint = "",
  interceptUpdate,
  receiveNewRecord = () => {},
  editableFields = [],
  displayFields = [],
}) {
  const [endpoint, setEndpoint] = useState(null);
  const [formData, setFormData] = useState({});
  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (endpoint) {
      apiCalls.getRequest({
        endpoint: endpoint,
        httpHeaders: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        successCallback: (res) => {
          setFormData(res);
        },
        errorCallback: (err) => {
          notifiers.httpError(err);
        },
      });
    }
  }, [endpoint]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setChanges({
      ...changes,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    if (typeof changes == "object" && Object.keys(changes).length > 0) {
      if (typeof interceptUpdate === "function") {
        interceptUpdate(changes);
      } else {
        apiCalls.postRequest({
          endpoint: updateEndpoint,
          httpMethod: "PATCH",
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          httpBody: changes,
          successCallback: (res) => {
            receiveNewRecord(res);
            notifiers.httpSuccess("Update Success");
          },
          errorCallback: (err) => {
            notifiers.httpError(err);
          },
        });
      }
    } else {
      notifiers.generalInfo("No changes detected");
    }
    setEndpoint(null);
  };

  return (
    <div className="">
      <ModalLink
        disableAnchor={disableEditing}
        anchorClassName={anchorClassName}
        submitButtonClassName="ring-1 ring-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded p-2"
        cancelButtonClassName="ring-1 ring-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded p-2"
        anchorText={anchorText}
        submitText="Save Changes"
        onInit={() => {
          setEndpoint(dataEndpoint);
        }}
        hostResourceCleaner={() => {
          setFormData({});
          setChanges({});
          setEndpoint(null);
        }}
        submitData={handleUpdate}
        disabled={Boolean(
          editableFields.find((field) => !Boolean(formData[field.name]))
        )}
        description={description}
        icon={icon}
        modalContent={
          endpoint &&
          !Boolean(
            [...displayFields, ...editableFields.map((f) => f.name)].find(
              (field) => formData[field] === undefined
            )
          ) &&
          Object.keys(formData).length > 0 ? (
            <div className="grid gap-4">
              <div className="grid gap-2 shadow-sm p-2 rounded">
                {displayFields.map((field, index) => (
                  <div className="" key={index}>
                    <div className=" text-amber-800 font-bold px-4 text-lg">
                      {utilityFunctions.snakeCaseToTitleCase(field)}
                    </div>
                    <div className=" px-8">{formData[field]}</div>
                  </div>
                ))}
              </div>
              <div className="grid gap-4">
                {editableFields.map((field, index) =>
                  field.as === "select" ? (
                    <OptionSelection
                      key={index}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      label={field.label}
                      name={field.name}
                      options={field.options}
                    />
                  ) : field.as === "textarea" ? (
                    <ListGroup key={index}>
                      <ListGroupItem>
                        <span className="font-bold px-4">
                          {utilityFunctions.snakeCaseToTitleCase(field.name)}
                        </span>
                      </ListGroupItem>
                      <ListGroupItem
                        style={{ overflow: "hidden" }}
                        className="p-0"
                      >
                        <Form.Control
                          style={{ borderRadius: 0, border: "none" }}
                          as="textarea"
                          rows={4}
                          name={field.name}
                          onChange={handleChange}
                          value={formData[field.name] || ""}
                          required
                        />
                      </ListGroupItem>
                    </ListGroup>
                  ) : (
                    <InputGroup className="" key={index}>
                      <InputGroup.Text
                        style={{
                          maxWidth: "40%",
                          minWidth: "40%",
                          direction: "rtl",
                        }}
                      >
                        <span className="font-bold">
                          {utilityFunctions.snakeCaseToTitleCase(field.name)}
                        </span>
                      </InputGroup.Text>

                      <Form.Control
                        type={field.as}
                        style={{ maxWidth: "60%", minWidth: "60%" }}
                        name={field.name}
                        onChange={handleChange}
                        value={formData[field.name] || ""}
                        required
                      />
                    </InputGroup>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="relative min-h-[10vh] flex justify-center items-center">
              <div className="px-4 py-2 shadow-inner shadow-black rounded-lg">
                <ThreeDots height={10} color="rgb(146 64 14)" />
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
