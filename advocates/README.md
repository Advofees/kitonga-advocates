<div className="text-xs px-2 pb-4">{casex.id}</div>
      {casey && (
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex gap-4">
              <div className="text-xl flex-grow font-bold text-amber-800 border-b px-2 border-amber-700/50">
                {casey.title}
              </div>
              <EditModal
                receiveNewRecord={(res) => {
                  setCasey(res);
                  if (typeof normalCrudManipulator === "function") {
                    normalCrudManipulator(res, 0);
                  }
                }}
                description="Edit Case"
                anchorText="Edit Case"
                dataEndpoint={endpoints.cases.getCase.replace(
                  "<:caseId>",
                  casey.id
                )}
                updateEndpoint={endpoints.cases.patchCase.replace(
                  "<:caseId>",
                  casey.id
                )}
                editableFields={[
                  {
                    name: "title",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "description",
                    as: "textarea",
                    required: true,
                  },
                  {
                    name: "case_no_or_parties",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "record",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "file_reference",
                    as: "text",
                    required: true,
                  },
                  {
                    name: "clients_reference",
                    as: "text",
                    required: true,
                  },
                ]}
              />
            </div>
            <div className="bg-white border-l-[10px] border-amber-600 rounded-r-2xl my-4">
              <div className="px-4 py-4 border-b text-gray-700 font-bold">
                {casey.description}
              </div>
              <PairView
                className="grid md:grid-cols-2 lg:grid-cols-4 pb-4"
                fields={[
                  "case_no_or_parties",
                  "record",
                  "file_reference",
                  "clients_reference",
                ].map((f) => ({ name: f, dir: "h" }))}
                obj={casey}
              />
            </div>
            <div className="bg-white border-l-[10px] border-amber-600 rounded-r-2xl">
              <h4 className="px-4 py-2 border-b font-bold text-xl">Client</h4>
              <PairView
                className="grid md:grid-cols-2 lg:grid-cols-4 pb-4"
                title={client.name}
                fields={["name", "email", "contact_number", "address"].map(
                  (f) => ({ name: f, dir: "h" })
                )}
                obj={client}
              />
            </div>
          </div>

          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md border-1 border-amber-800">
            <h4 className="text-lg bg-gray-200 py-2 px-4">
              Other assigned personel
            </h4>
            <div>
              {otherAssignedUsers.map((dt, index) => (
                <div key={index}></div>
              ))}
            </div>
          </div> */}

          {/*  Parties */}
          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md">
            <h4 className="text-lg bg-gray-200 py-2 px-4">Parties</h4>
            <div className="flex bg-gray-200 border-t border-b border-amber-700/75">
              <div className="w-1/3 flex items-center gap-2 px-1 py-2 justify-center border-r border-amber-700/75">
                <FontAwesomeIcon icon={faUserAlt} /> Party Type
              </div>

              <div className="w-2/3  flex items-center gap-2 px-2 py-2">
                Personal Details
              </div>
            </div>
            <div className="min-h-[5vh]">
              {parties.map((party, index) => (
                <div key={index} className="flex">
                  <div
                    className={`${
                      (index + 0) % 2 === 0 && "bg-white"
                    } w-1/3 flex items-center p-2 break-all justify-center border-r border-amber-700/75`}
                  >
                    {party.party_type}
                  </div>
                  <div
                    className={`w-2/3 grid ${
                      (index + 1) % 2 === 0 && "bg-white"
                    } p-2 lg:grid-cols-2`}
                  >
                    <div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faUserAlt} />
                        </span>
                        <div>{party.name}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faVoicemail} />
                        </span>
                        <div>{party.email}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faPhone} />
                        </span>
                        <div>{party.contact_number}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="scale-75 text-gray-800/50">
                          <FontAwesomeIcon icon={faLocation} />
                        </span>
                        <div>{party.address}</div>
                      </div>
                    </div>

                    <div className="pt-3 pb-2 px-4 flex gap-6 items-center">
                      <EditModal
                        description="Edit Party"
                        anchorText="Edit"
                        editableFields={[
                          { name: "party_type", as: "text" },
                          { name: "name", as: "text" },
                          { name: "email", as: "email" },
                          { name: "contact_number", as: "text" },
                          { name: "address", as: "textarea" },
                        ]}
                        receiveNewRecord={(updatedParty) => {
                          setParties(
                            parties.map((party) =>
                              party.id === updatedParty.id
                                ? updatedParty
                                : party
                            )
                          );
                        }}
                        updateEndpoint={endpoints.parties.crud.replace(
                          "<:id>",
                          party.id
                        )}
                        dataEndpoint={endpoints.parties.crud.replace(
                          "<:id>",
                          party.id
                        )}
                        displayFields={["id"]}
                      />
                      <DeleteModal
                        receiveResponse={() => {
                          setParties(parties.filter((p) => p.id !== party.id));
                        }}
                        endpoint={endpoints.parties.crud.replace(
                          "<:id>",
                          party.id
                        )}
                        anchorText="Delete"
                        description="Delete Party"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-2">
              <FormModal
                description="Add Case No/Parties"
                anchorText="Add Party"
                onSubmit={addParty}
                inputFields={[
                  {
                    name: "party_type",
                    as: "select",
                    required: true,
                    label: "Select Party Type",
                    options: [
                      { value: "plaintiff", label: "Plaintiff" },
                      { value: "defendant", label: "Defendant" },
                    ],
                  },
                  { name: "name", as: "text", required: true },
                  { name: "email", as: "email", required: true },
                  { name: "contact_number", as: "text", required: true },
                  { name: "address", as: "text", required: true },
                ]}
              />
            </div>
          </div> */}

          {/* Assigned Tasks */}
          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md">
            <h4 className="text-lg bg-gray-200 py-1 px-4">Assigned tasks</h4>
            <div>
              {tasks.map((dt, index) => (
                <div key={index}>Tasks</div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-2">
              <FormModal
                onSubmit={(payload) => {
                  console.log(payload);
                }}
                inputFields={[
                  {
                    name: "description",
                    as: "textarea",
                    required: true,
                  },
                  {
                    name: "due_date",
                    as: "date",
                    required: true,
                  },
                  {
                    name: "username",
                    as: "select",
                    label: "Select Staff",
                    options: users.map((usr) => ({
                      value: usr.username,
                      label: usr.name,
                    })),
                  },
                ]}
                description="Assign tasks"
                anchorText="Assign Task"
                icon={<FontAwesomeIcon icon={faTasks} />}
              />
            </div>
          </div> */}

          {/* Important Dates */}
          {/* <div className="bg-gray-100 overflow-hidden rounded shadow-md">
            <h4 className="text-lg bg-gray-200 py-2 px-4">Important Dates</h4>
            <div className="mb-2">
              {importantDates.map((dt, index) => (
                <div key={index}>Dates</div>
              ))}
            </div>
            <div className="px-4 pt-3 pb-2">
              <FormModal
                onSubmit={(payload) => {
                  console.log(payload);
                }}
                inputFields={[
                  {
                    name: "date",
                    as: "date",
                    required: true,
                  },
                  {
                    name: "time",
                    as: "time",
                    required: true,
                  },
                  {
                    name: "activity_description",
                    as: "textarea",
                    required: true,
                  },
                ]}
                description="Create an Important Date"
                anchorText="New Important Date"
              />
            </div>
          </div> */}

          {/* <>
            percentage=
            {(parseFloat(paymentInformation.paid_amount) /
              parseFloat(paymentInformation.total_fee)) *
              100}
          </> */}

          {paymentInformation?.id ? (
            <div className="bg-gray-100 overflow-hidden rounded">
              <h4 className="text-xl py-2 px-4">Payment Information</h4>
              <div className="p-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="rounded bg-white line-shadow p-4">
                  <div className="text-center pb-2">
                    Payment Completion status
                  </div>
                  <div className="px-4 max-w-[10rem] p-2 mx-auto">
                    <Progress
                      width={10}
                      completeColor="rgb(120 53 15)"
                      incompleteColor="white"
                      innerClassName="bg-gray-200 font-extrabold text-amber-800"
                      percentage={76}
                    />
                  </div>
                </div>
                <div className="grid gap-4 xl:grid-cols-2 xl:col-span-2 items-start">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faDiceD6} />
                      </div>
                      <div className="flex flex-col">
                        <span>Total Fee</span>
                        <span className="text-amber-800 font-bold px-2">
                          {paymentInformation.total_fee}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faWallet} />
                      </div>
                      <div className="flex flex-col">
                        <span>Payment Type</span>
                        <span className="text-amber-800 font-bold px-2 uppercase">
                          {paymentInformation.payment_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faMoneyCheck} />
                      </div>
                      <div className="flex flex-col">
                        <span>Balance</span>
                        <span className="text-amber-800 font-bold px-2">
                          {paymentInformation.balance_due}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center rounded bg-white line-shadow px-2 py-4">
                      <div className="text-2xl text-amber-800 h-12 w-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={faMoneyCheckDollar} />
                      </div>
                      <div className="flex flex-col">
                        <span>Settled</span>
                        <span className="text-amber-800 font-bold px-2">
                          {paymentInformation.paid_amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {paymentInformation.payment_type !== "full" && (
                <div className="p-2">
                  <div className="text-lg p-4 text-amber-800">
                    <div>Cummulative Payments</div>
                  </div>
                  <div className="">
                    <div className="flex border-b border-amber-800">
                      <div className="min-w-[12.5%] max-w-[12.5%] text-center px-1 truncate py-2 border-r border-amber-800"></div>
                      <div className="min-w-[25%] max-w-[25%] text-center px-1 truncate py-2 border-r border-amber-800">
                        Amount
                      </div>
                      <div className="min-w-[12.5%] max-w-[12.5%] text-center px-1 truncate py-2 border-r border-amber-800">
                        Payment Type
                      </div>
                      <div className="min-w-[25%] max-w-[25%] text-center px-1 truncate py-2 border-r border-amber-800">
                        Payment Method
                      </div>
                      <div className="min-w-[25%] max-w-[25%] text-center px-1 truncate py-2">
                        Time
                      </div>
                    </div>
                    <div className="grid">
                      <div className="">
                        {paymentInformation?.cummulative_payments?.map(
                          (payment, index) => (
                            <div
                              key={index}
                              className="flex items-center border-b border-amber-800"
                            >
                              <div className="flex-grow flex">
                                <div
                                  className={`${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[12.5%] max-w-[12.5%] px-1 font-bold flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  <div className="flex flex-wrap gap-2">
                                    <EditModal
                                      receiveNewRecord={
                                        handleCumulativePaymentChange
                                      }
                                      editableFields={[
                                        {
                                          name: "payment_method",
                                          as: "select",
                                          options: paymentMethods.map(
                                            (paymentMethod) => ({
                                              value: paymentMethod,
                                              label: paymentMethod,
                                            })
                                          ),
                                          label: "Payment Method",
                                        },
                                        {
                                          name: "payment_type",
                                          as: "select",
                                          options: [
                                            "final",
                                            "installment",
                                            "deposit",
                                          ].map((paymentMethod) => ({
                                            value: paymentMethod,
                                            label: capitalize(paymentMethod),
                                          })),
                                          label: "Payment Type",
                                        },
                                        { name: "amount", as: "number" },
                                      ]}
                                      updateEndpoint={endpoints.payments.crud.replace(
                                        "<:id>",
                                        payment.id
                                      )}
                                      dataEndpoint={endpoints.payments.crud.replace(
                                        "<:id>",
                                        payment.id
                                      )}
                                      anchorText=""
                                      description="Edit Payment Details"
                                      icon={<FontAwesomeIcon icon={faPen} />}
                                      anchorClassName="p-1 rounded line-shadow-on-hover"
                                    />
                                    <DeleteModal
                                      endpoint={endpoints.payments.crud.replace(
                                        "<:id>",
                                        payment.id
                                      )}
                                      receiveResponse={(res) => {
                                        setPaymentInformation(res);
                                      }}
                                      anchorText=""
                                      description="Delete Payment"
                                      anchorClassName="p-1 rounded line-shadow-on-hover"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    (index + 1) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[25%] max-w-[25%] px-1 flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  {payment.amount}
                                </div>
                                <div
                                  className={`${
                                    (index + 2) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[12.5%] max-w-[12.5%] px-1 flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  {payment.payment_type}
                                </div>
                                <div
                                  className={`${
                                    (index + 3) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[25%] max-w-[25%] px-1 flex items-center justify-center py-2 border-r border-amber-800`}
                                >
                                  {payment.payment_method}
                                </div>
                                <div
                                  className={`${
                                    (index + 4) % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-200 text-amber-900"
                                  } min-w-[25%] max-w-[25%] px-1 flex items-center justify-center py-2`}
                                >
                                  {payment.created_at}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex justify-end px-4 pt-3 pb-2">
                        <AddInstallment
                          {...{
                            id: casey.id,
                            title: casey.title,
                            description: casey.description,
                            addInstallment: addInstallment,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <AddPaymentInformation
                {...{
                  id: casey.id,
                  title: casey.title,
                  description: casey.description,
                  handleSubmit: submitPaymentInformation,
                }}
              />
            </div>
          )}
        </div>
      )}