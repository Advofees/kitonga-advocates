import { ModalLink } from "./ModalLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faWarning } from "@fortawesome/free-solid-svg-icons";
import { apiCalls } from "../../assets/apiCalls";
import { notifiers } from "../../assets/notifiers";
import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";

export function DeleteModal({
  normalCrudManipulator = () => {},
  recordPrimaryKey,
  description = "Delete",
  anchorText = "Delete",
  anchorClassName = "flex gap-2 items-center rounded px-4 py-2 bg-gray-100 text-amber-800 hover:text-black hover:bg-amber-700 hover:-translate-y-2 duration-200",
  endpoint = "",
  interceptDestruction,
  consequences,
  receiveResponse = () => {},
  icon = <FontAwesomeIcon icon={faTrashCan} />,
}) {
  const handleSubmit = () => {
    if (typeof interceptDestruction !== "undefined") {
      if (typeof interceptDestruction === "function") {
        interceptDestruction(recordPrimaryKey);
      } else {
        alert("Destruction interceptor should be a function");
      }
    } else {
      if (endpoint) {
        apiCalls.deleteRequest({
          endpoint: endpoint,
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          successCallback: (res) => {
            receiveResponse(res);
            normalCrudManipulator(recordPrimaryKey, -1);
            notifiers.httpSuccess("Record Deleted");
          },
          errorCallback: (err) => {
            notifiers.httpError(err);
          },
        });
      }
    }
  };

  return (
    <div>
      <ModalLink
        anchorClassName={anchorClassName}
        submitButtonClassName="ring-1 ring-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded"
        cancelButtonClassName="ring-1 ring-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded"
        cancelText="No"
        anchorText={anchorText}
        icon={icon}
        submitText="Yes"
        description={description}
        submitData={handleSubmit}
        modalContent={
          <div className="flex flex-col items-center py-2">
            <div className="flex gap-2 items-center font-bold text-red-600">
              <span className="text-[4em]">
                <FontAwesomeIcon icon={faWarning} />
              </span>
              <div className="flex items-center gap-2">
                <span>Are you sure you want to delete</span>
                <div className="flex gap-1 text-2xl">
                  <FontAwesomeIcon icon={faExclamation} />
                  <FontAwesomeIcon icon={faExclamation} />
                </div>
              </div>
            </div>
            {consequences}
          </div>
        }
      />
    </div>
  );
}
