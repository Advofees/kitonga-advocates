// export const baseUrl = "https://advocate-ce23ad253984.herokuapp.com/api/v1";
export const baseUrl = "http://localhost:4000/api/v1";

export const endpoints = {
  getAccessToken: `${baseUrl}/auth/access-token`,
  getLoggedInUserProfile: `${baseUrl}/current/user`,
  statistics: {
    casesCount: `${baseUrl}/stats/cases/count`,
    clientsCount: `${baseUrl}/stats/clients/count`,
    searchCasesCount: `${baseUrl}/stats/search/cases/count/<:q>/<:v>/`,
    searchClientsCount: `${baseUrl}/stats/search/clients/count/<:q>/<:v>/`,
    showClientCaseStatusTally: `${baseUrl}/stats/clients/<:clientId>/cases/status/tally`,
  },
  pagination: {
    getCases: `${baseUrl}/pages/cases/`,
    getClients: `${baseUrl}/pages/clients/`,
    search: {
      searchCases: `${baseUrl}/search/cases/<:q>/<:v>/`,
      searchClients: `${baseUrl}/search/clients/<:q>/<:v>/`,
    },
  },
  filter: {
    filterCases: `${baseUrl}/filter/cases/<:criteria>`,
    filterClientCases: `${baseUrl}/filter_pages/cases/<:criteria>/<:response>`,
    filterClients: `${baseUrl}/filter/clients/<:criteria>`,
  },
  users: {
    getBriefUsers: `${baseUrl}/users/brief`,
  },
  clients: {
    getAllClients: `${baseUrl}/clients/all`,
    postClient: `${baseUrl}/clients/new`,
    patchClient: `${baseUrl}/clients/<:clientId>/update`,
    getClient: `${baseUrl}/clients/<:clientId>/get`,
    deleteClient: `${baseUrl}/clients/<:clientId>/delete`,
  },
  parties: {
    crud: `${baseUrl}/parties/<:id>`,
  },
  payments: {
    crud: `${baseUrl}/payments/<:id>`,
  },
  cases: {
    getCase: `${baseUrl}/cases/<:caseId>`,
    getPaymentInformation: `${baseUrl}/cases/<:caseId>/payment_information`,
    patchPaymentInformation: `${baseUrl}/cases/<:caseId>/payment_information`,
    getImportantDates: `${baseUrl}/cases/<:caseId>/important_dates`,
    getHearings: `${baseUrl}/cases/<:caseId>/hearings`,
    getTasks: `${baseUrl}/cases/<:caseId>/tasks`,
    getParties: `${baseUrl}/cases/<:caseId>/parties`,
    postCase: `${baseUrl}/cases/new`,
    patchCase: `${baseUrl}/cases/<:caseId>/update`,
    initializePaymentInformation: `${baseUrl}/cases/<:caseId>/initialize_payment_information`,
    addInstallment: `${baseUrl}/cases/<:caseId>/add_installment`,
    addParty: `${baseUrl}/cases/<:caseId>/add_party`,
    deleteCase: `${baseUrl}/cases/<:caseId>`,
    bulkDestruction: `${baseUrl}/cases/destroy/multiple`
  },
  dash: {
    deepSearch: `${baseUrl}/dashboard/deep/search/<:q>`,
    getCasesPerClient: `${baseUrl}/dashboard/cases/per/client`,
    getDashConuts: `${baseUrl}/dashboard/counts`,
    getEnforcementCases: `${baseUrl}/dashboard/cases/enforcement`
  },
};
