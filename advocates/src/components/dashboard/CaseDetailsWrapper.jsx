import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../../assets/apis";
import { apiCalls } from "../../assets/apiCalls";
import { CaseDetails } from "./Case";
import { Loader } from "../common/Loader";
import Error404 from "../common/Error404";
import { ThreeDots } from "react-loader-spinner";

function CaseDetailsWrapper({ setLoading }) {
  const { caseId } = useParams();
  const [casex, setCasex] = useState(null);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    apiCalls.getRequest({
      endpoint: endpoints.cases.getCase.replace("<:caseId>", caseId),
      httpHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
      },
      successCallback: (res, status) => {
        setCasex(res);
        setStatus(status);
      },
      errorCallback: (err, status) => {
        setStatus(status);
      },
    });
  }, [caseId]);

  console.log(status);

  return (
    <div className="">
      <h4 className="text-xl px-4 pt-4">Case Details</h4>
      {casex ? (
        <CaseDetails
          className="p-4 border-l-4"
          setLoading={setLoading}
          casex={casex}
        />
      ) : (
        <div>
          {status === 0 ? (
            <div className="flex h-48 justify-center items-center">
              <ThreeDots width={40} color="rgba(202, 101, 38)" />
            </div>
          ) : status === 404 ? (
            <div>
              <Error404 className="py-4" imageClassName="mx-auto max-w-xl">
                <div className="text-4xl text-center flex-grow py-8">
                  Case not found
                </div>
              </Error404>
            </div>
          ) : (
            <div>
              <h4 className="text-xl text-center px-4 py-6">
                Sorry! An error occured while fetching case details
              </h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { CaseDetailsWrapper };
