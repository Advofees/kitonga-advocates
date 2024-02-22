import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../../assets/apis";
import { apiCalls } from "../../assets/apiCalls";
import { CaseDetails } from "./Case";

function CaseDetailsWrapper({ setLoading }) {
  const { caseId } = useParams();
  const [casex, setCasex] = useState(null);

  useEffect(() => {
    apiCalls.getRequest({
      endpoint: endpoints.cases.getCase.replace("<:caseId>", caseId),
      httpHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
      },
      successCallback: setCasex,
      errorCallback: (err) => {
        console.log(err);
      },
    });
  }, [caseId]);

  return (
    <div className="bg-gray-100">
      {casex ? <CaseDetails setLoading={setLoading} casex={casex} /> : <></>}
    </div>
  );
}

export { CaseDetailsWrapper };
