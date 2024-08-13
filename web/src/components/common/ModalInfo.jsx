import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export function ModalInfo({
  icon = <FontAwesomeIcon icon={faInfoCircle} />,
  onInit = () => {},
  hostResourceCleaner = () => {},
  fullscreen = false,
  anchorClassName = "flex gap-2  line-shadow items-center rounded px-4 py-2 bg-gray-100 text-amber-800  hover:text-white hover:bg-amber-700 duration-200",
  modalContent,
  description,
  anchorText = "",
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
    Array.from(document.querySelectorAll(".modal_info .modal-content")).forEach(
      (modalContent) => {
        Object.keys(styles).forEach((key) => {
          modalContent.style[key] = styles[key];
        });
      }
    );
  }, [show]);

  return (
    <div className="modal_info">
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
        <Modal.Body className="p-0">
          <div
            className="flex justify-end px-4 pt-2"
            style={{ border: "none" }}
          >
            <button
              className="h-8 w-8 rounded-full shadow-md shadow-black/50 hover:bg-amber-800 hover:text-white duration-300"
              style={{}} // Set the color to black
              onClick={handleClose}
            >
              <span>
                <FontAwesomeIcon icon={faClose} />
              </span>
            </button>
          </div>
          <div>
            <div className="px-4 relative text-sm">{modalContent}</div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
