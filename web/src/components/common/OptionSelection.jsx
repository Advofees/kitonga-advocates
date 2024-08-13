import {} from "react";
import { ListGroup, ListGroupItem, InputGroup, Form } from "react-bootstrap";

export function OptionSelection({
  label = "",
  value = "",
  name = "",
  onChange = () => {},
  options = [],
}) {
  return (
    <ListGroup>
      <ListGroupItem className="p-0" style={{ overflow: "hidden" }}>
        <InputGroup>
          <InputGroup.Text style={{ border: "none" }}>
            <span className="text-gray-700/75 font-bold">{label}</span>
          </InputGroup.Text>
          <Form.Select
            style={{ border: "none", borderRadius: 0 }}
            value={value || ""}
            onChange={onChange}
            name={name}
          >
            <option value="">-------------------------------</option>
            {options.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
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
          value={(value || "").toUpperCase()}
          required
          type="text"
          placeholder={label}
        />
      </ListGroupItem>
    </ListGroup>
  );
}
