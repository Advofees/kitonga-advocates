import { useState } from "react";
import { ModalLink } from "./ModalLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { InputGroup, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { OptionSelection } from "./OptionSelection";
import { utilityFunctions } from "../../assets/functions";

export function FormModal({
  inputFields = [],
  icon = <FontAwesomeIcon icon={faAdd} />,
  anchorText = "New",
  anchorClassName = "flex gap-2 items-center rounded px-4 py-2 bg-gray-100 text-amber-800 hover:text-black hover:bg-amber-700 hover:text-white ring-1 ring-amber-800 duration-200",
  description = "New",
  onSubmit = () => {},
}) {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <ModalLink
        anchorClassName={anchorClassName}
        submitButtonClassName="ring-1 ring-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded p-2"
        cancelButtonClassName="ring-1 ring-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded p-2"
        cancelText="Cancel"
        anchorText={anchorText}
        submitText="Create"
        onInit={() => {}}
        hostResourceCleaner={() => {
          setFormData({});
        }}
        submitData={handleSubmit}
        disabled={Boolean(
          inputFields
            .filter((f) => f.required)
            .find((field) => !Boolean(formData[field.name]))
        )}
        description={description}
        icon={icon}
        modalContent={
          <div className="grid gap-4">
            {inputFields.map((field, index) =>
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
                    <span className="text-gray-900/50 font-bold px-4">
                      {utilityFunctions.snakeCaseToTitleCase(field.name)}
                    </span>
                  </ListGroupItem>
                  <ListGroupItem style={{ overflow: "hidden" }} className="p-0">
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
                    <div className="text-gray-900/50 font-bold w-full flex gap-2 flex-wrap">
                      {utilityFunctions
                        .snakeCaseToTitleCase(field.name)
                        .split(" ")
                        .map((p, i) => (
                          <span className="" key={i}>{p}</span>
                        ))}
                    </div>
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
        }
      />
    </div>
  );
}
