import { apiCalls } from "../../assets/apiCalls";

export function usePagination() {
  const handlePagination = ({
    paginationEndpoint,
    populationEndpoint,
    pageOverlapReseter,
    pageNumber = 1,
    pagePopulation = 10,
    setEndpointPopulation,
    successCallback = () => {},
    errorCallback = () => {},
  }) => {
    apiCalls.getRequest({
      endpoint: populationEndpoint,
      httpMethod: "GET",
      httpHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
      },
      successCallback: (populationResponse) => {
        const population = parseInt(populationResponse?.count);
        if (population >= 0) {
          const topPage = Math.ceil(population / pagePopulation);
          pageNumber = pageNumber < topPage ? pageNumber : topPage;
          pageOverlapReseter(pageNumber)
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
          apiCalls.getRequest({
            endpoint: paginationEndpoint + pageNumber + "/" + pagePopulation,
            httpMethod: "GET",
            httpHeaders: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              Accept: "application/json",
            },
            successCallback: successCallback,
          });
        }
      },
      errorCallback,
    });
  };

  return [handlePagination];
}
