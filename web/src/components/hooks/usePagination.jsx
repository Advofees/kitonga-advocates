import { apiCalls } from "../../assets/apiCalls";

export function usePagination() {
  const handlePagination = ({
    endpoint,
    pageOverlapReseter,
    pageNumber = 1,
    pagePopulation = 10,
    setEndpointPopulation,
    successCallback = () => {},
    errorCallback = () => {},
  }) => {
    const popApiCall =
      endpoint.count.method === "POST"
        ? apiCalls.postRequest
        : apiCalls.getRequest;
    const dataApiCall =
      endpoint.data.method === "POST"
        ? apiCalls.postRequest
        : apiCalls.getRequest;

    popApiCall({
      endpoint: endpoint.count.endpoint,
      httpMethod: endpoint.count.method,
      httpHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      httpBody: endpoint.payload,
      successCallback: (populationResponse) => {
        const population = parseInt(populationResponse?.count);
        if (population >= 0) {
          const topPage = Math.ceil(population / pagePopulation);
          pageNumber = pageNumber < topPage ? pageNumber : topPage;
          pageOverlapReseter(pageNumber);
        }
        if (population && setEndpointPopulation) {
          setEndpointPopulation(population);
        } else {
          setEndpointPopulation(0);
        }
        if (
          population &&
          pageNumber <= Math.ceil(population / pagePopulation)
        ) {
          dataApiCall({
            endpoint:
              endpoint.data.endpoint + pageNumber + "/" + pagePopulation,
            httpMethod: endpoint.data.method,
            httpHeaders: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            httpBody: endpoint.payload,
            successCallback: successCallback,
          });
        }
      },
      errorCallback,
    });
  };

  return [handlePagination];
}
