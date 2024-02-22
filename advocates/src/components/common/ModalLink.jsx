import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ScaleButton } from "./ScaleButton";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

export function ModalLink({
  icon = <FontAwesomeIcon icon={faAdd} />,
  onInit = () => {},
  hostResourceCleaner = () => {},
  fullscreen = false,
  submitButtonClassName = "",
  cancelButtonClassName = "",
  cancelText = "Close",
  anchorClassName = "flex gap-2 items-center line-shadow rounded px-4 py-2 bg-gray-100 text-amber-800 hover:text-white hover:bg-amber-700 duration-200",
  modalContent,
  submitText,
  description,
  anchorText = "",
  disabled = false,
  submitData = () => {},
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    hostResourceCleaner();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const styles = {
    backgroundColor: "rgba(255, 255, 255, .8)",
    border: "none",
  };

  useEffect(() => {
    Array.from(document.querySelectorAll(".modal-content")).forEach(
      (modalContent) => {
        Object.keys(styles).forEach((key) => {
          modalContent.style[key] = styles[key];
        });
      }
    );
  }, [show]);

  return (
    <div className="">
      <button
        type="button"
        onClick={() => {
          handleShow();
          onInit();
        }}
        className={`${anchorClassName}`}
      >
        {icon}
        <span>{anchorText}</span>
      </button>
      <Modal
        fullscreen={fullscreen}
        centered
        className="modal-special"
        style={styles}
        size="lg"
        backdrop="static"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header className="border-none flex justify-between">
          <span className="px-4">{description}</span>
          <button
            className="hover:text-amber-800 duration-300"
            style={{}} // Set the color to black
            onClick={handleClose}
          >
            <span>
              <FontAwesomeIcon icon={faClose} />
            </span>
          </button>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div>
            <div className="px-4 relative text-sm">{modalContent}</div>
            <div className="grid grid-cols-2 gap-4 p-4">
              <button
                as="button"
                onClick={handleClose}
                className={`flex-grow duration-300 ${cancelButtonClassName}`}
              >
                {cancelText}
              </button>
              <button
                as="submit"
                onClick={() => {
                  submitData();
                  handleClose();
                }}
                disabled={disabled}
                className={`flex-grow duration-300 ${submitButtonClassName} disabled:cursor-not-allowed`}
              >
                {submitText ? submitText : "Submit"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
