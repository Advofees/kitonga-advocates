import { useEffect, useRef, useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { ScaleButton } from "./ScaleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilter } from "@fortawesome/free-solid-svg-icons";
import { VscLayers } from "react-icons/vsc";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { utilityFunctions } from "../../assets/functions";
import { Dropdown, Form, InputGroup, Tab, Tabs } from "react-bootstrap";
import { NoResults } from "./NoResults";

export function Pagination({
  paginationConfig: {
    modelName = "Record",
    paginationEndpoint,
    populationEndpoint,
    itemsPerPage = 4,
    itemsPrimaryKey,
    componentName,
    detailsComponent,
    detailsProps,
    generalProps,
    dataKey = "data",
    create: { NewRecordComponent, newRecordProps, interceptCreation } = {},
    destroy: { DeleteComponent, deleteProps, interceptDestruction } = {},
    update: {
      UpdateComponent,
      updateProps,
      interceptUpdate,
      updateDataSource,
    } = {},
    filterSupport: {
      filterSupport,
      filterBy,
      filterPopulationEndpoint,
      filterPaginationEndpoint,
      payloadTransformer,
    } = {
      filterPopulationEndpoint: "",
      filterPaginationEndpoint: "",
      filterSupport: false,
      filterBy: [],
      payloadTransformer: () => {},
    },
    searchSupport: {
      support,
      searchFields,
      searchPopulationEndpoint,
      searchPaginationEndpoint,
    } = {
      searchPopulationEndpoint: "",
      searchPaginationEndpoint: "",
      support: false,
      searchFields: [],
    },
  },
  items: [items, setItems] = useState([]),
  direction = "vertical",
  selfVScroll: { vScroll, vStyle, vClasses } = {
    vScroll: false,
    vStyle: {},
    vClasses: "",
  },
  pageTracker: [nextPage, setNextPage] = useState(1),
  childClassName,
  recordsHeader,
}) {
  const [containerRef, scrollWrapperRef, scrollDownRef] = [
    useRef(),
    useRef(),
    useRef(),
  ];
  const PaginationChild = componentName;
  const ChildDetails = detailsComponent;
  const [refresher, setRefresher] = useState(0);
  const [stagedItems, setStagedItems] = useState([]);
  const [handlePagination] = usePagination();
  const [pagePopulation, setPagePopulation] = useState(itemsPerPage);
  const [endpointPopulation, setEndpointPopulation] = useState(0);
  const [endpoint, setEndpoint] = useState({
    data: paginationEndpoint,
    count: populationEndpoint,
  });

  const [search, setSearch] = useState({
    q: searchFields ? searchFields[0] : "",
    v: "",
  });
  const [filter, setFilter] = useState({
    q: filterBy ? filterBy[0]?.name || "" : "",
    v: filterBy ? (filterBy[0]?.rangeable ? ["", ""] : [""]) : [""],
  });

  const updateStagedItems = (id, action) => {
    if (action > 0) {
      setStagedItems([id, ...stagedItems]);
    } else if (action < 0) {
      setStagedItems(stagedItems.filter((c) => c !== id));
    } else {
    }
  };

  const handlePageFetch = (n, s) => {
    handlePagination({
      endpoint,
      pageNumber: n,
      pagePopulation: s,
      errorCallback: (error) => {
        console.log(error)
      },
      setEndpointPopulation,
      pageOverlapReseter: (newPage) => {
        setNextPage(newPage);
      },
      successCallback: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          setItems(res);
        }
      },
    });
  };

  const handlePopulationChange = (newPopulation) => {
    setPagePopulation(newPopulation);
  };

  const handleChange = (entity, k, v) => {
    if (entity === "search") {
      setSearch({
        ...search,
        [k]: v,
      });
    } else if (entity === "filter") {
      setFilter({
        ...filter,
        [k]: v,
      });
    }
  };

  const handleFilterTabChange = (k) => {
    const tab = filterBy.find((f) => f.name === k);
    if (tab) {
      setFilter({
        q: k,
        v: tab.rangeable ? ["", ""] : [""],
      });
    }
  };

  const normalCrudManipulator = (newItem, state) => {
    if (state === 0) {
      // Add a new record
      setItems([newItem, ...items]);
    } else if (state < 0) {
      // Deleted Record
      setItems((itms) => itms.filter((i) => i[itemsPrimaryKey] !== newItem));
    } else {
      // Update the item
      setItems((itms) =>
        itms.map((i) =>
          i[itemsPrimaryKey] === newItem[itemsPrimaryKey] ? newItem : i
        )
      );
    }
    setStagedItems([]);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setNextPage(1);
    setItems([]);
    setEndpoint({
      data: filterPaginationEndpoint,
      count: filterPopulationEndpoint,
      payload: payloadTransformer(filter),
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setNextPage(1);
    setItems([]);
    const newPaginationEndpoint = {
      endpoint: searchPaginationEndpoint.endpoint
        .replace("<:q>", search.q)
        .replace("<:v>", search.v),
      method: searchPaginationEndpoint.method,
    };

    const newPopulationEndpoint = {
      endpoint: searchPopulationEndpoint.endpoint
        .replace("<:q>", search.q)
        .replace("<:v>", search.v),
      method: searchPopulationEndpoint.method,
    };

    setEndpoint({
      data: newPaginationEndpoint,
      count: newPopulationEndpoint,
    });
  };

  const triggerRefresh = () => {
    setRefresher((p) => p + 1);
  };

  // Register an event listener on the closest scrollable element
  // useEffect(() => {
  //   const endOfScrollDetector = (e) => {
  //     // const [scrollTop, clientHeight, scrollHeight] =
  //     //   direction === "vertical"
  //     //     ? [e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight]
  //     //     : [e.target.scrollLeft, e.target.clientWidth, e.target.scrollWidth];
  //     // if (scrollTop + clientHeight >= scrollHeight) {
  //     //   triggerRefresh();
  //     // }
  //   };

  //   const windowResizeHandler = (e) => {
  //     const currentNumberOfChildren = containerRef.current.children.length;
  //     const childW = containerRef.current.firstElementChild?.offsetWidth;
  //   };

  //   const mouseOverHandler = (e) => {
  //     scrollDownRef.current.style.top =
  //       ((e.clientY - scrollWrapperRef.current.getBoundingClientRect().top) /
  //         scrollWrapperRef.current.offsetHeight) *
  //         90 +
  //       "%";
  //   };

  //   scrollWrapperRef.current.addEventListener("mousemove", mouseOverHandler);

  //   containerRef.current
  //     ?.closest(direction === "vertical" ? ".scroll_y" : ".scroll_x")
  //     ?.addEventListener("scroll", endOfScrollDetector);

  //   window.addEventListener("resize", windowResizeHandler);

  //   return () => {
  //     containerRef.current
  //       ?.closest(direction === "vertical" ? ".scroll_y" : ".scroll_x")
  //       ?.removeEventListener("scroll", endOfScrollDetector);
  //     window.removeEventListener("resize", windowResizeHandler);
  //   };
  // }, []);

  // Automatically fetch the next page when the page count increases
  useEffect(() => {
    handlePageFetch(nextPage, pagePopulation);
    if (direction === "vertical") {
      containerRef.current.closest(".scroll_y")?.scrollBy({
        top: -2000,
        behavior: "smooth",
      });
    } else {
      scrollWrapperRef.current.scrollBy({
        left: -200000,
        behavior: "smooth",
      });
    }
  }, [refresher, endpoint, pagePopulation]);

  return (
    <div className="">
      <div className="py-2 px-4 flex items-center gap-4">
        {/* Create Support */}
        {typeof NewRecordComponent === "function" && (
          <NewRecordComponent
            {...newRecordProps}
            {...{
              onSubmit: (payload) => {
                if (typeof interceptCreation === "function") {
                  interceptCreation(payload, normalCrudManipulator);
                }
              },
            }}
          />
        )}

        {(typeof UpdateComponent === "function" ||
          typeof DeleteComponent === "function") && (
          <Dropdown>
            <Dropdown.Toggle className="px-4 bg-transparent text-black border-[1px] border-amber-800">
              {stagedItems.length > 0 ? "Actions" : `Select ${modelName}`}
            </Dropdown.Toggle>
            {stagedItems.length == 1 && (
              <Dropdown.Menu>
                {typeof DeleteComponent === "function" && (
                  <>
                    {stagedItems.length == 1 && (
                      <Dropdown.Item className="group">
                        {/* Destroy Support */}
                        <DeleteComponent
                          recordPrimaryKey={stagedItems[0]}
                          {...{
                            interceptDestruction: interceptDestruction
                              ? (id) => {
                                  if (
                                    typeof interceptDestruction === "function"
                                  ) {
                                    interceptDestruction(
                                      id,
                                      normalCrudManipulator
                                    );
                                  } else {
                                    normalCrudManipulator(id, -1);
                                  }
                                }
                              : undefined,
                          }}
                          {...normalCrudManipulator}
                          {...deleteProps}
                        />
                      </Dropdown.Item>
                    )}
                  </>
                )}

                {/* Destroy Support */}
                {typeof UpdateComponent === "function" && (
                  <>
                    {stagedItems.length == 1 && (
                      <Dropdown.Item className="group">
                        <UpdateComponent
                          {...{
                            interceptUpdate: (payload) => {
                              interceptUpdate(
                                {
                                  payload: payload,
                                  [itemsPrimaryKey || "index"]: itemsPrimaryKey
                                    ? items.find(
                                        (i) =>
                                          i[itemsPrimaryKey] === stagedItems[0]
                                      )[itemsPrimaryKey]
                                    : items.indexOf(stagedItems[0]),
                                },
                                normalCrudManipulator
                              );
                            },
                          }}
                          {...updateProps}
                          {...{
                            dataEndpoint: updateDataSource.replace(
                              `<:${itemsPrimaryKey}>`,
                              stagedItems[0]
                            ),
                          }}
                        />
                      </Dropdown.Item>
                    )}
                  </>
                )}
              </Dropdown.Menu>
            )}
          </Dropdown>
        )}
      </div>
      {(support || filterSupport) && (
        <div className="px-4 pt-2">
          <Tabs
            unmountOnExit={true}
            justify
            defaultActiveKey={support ? "search" : "filter"}
            className="px-8"
          >
            {support && searchFields?.length > 0 && (
              <Tab
                title={
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSearch} />
                    <span>Search</span>
                  </div>
                }
                eventKey="search"
              >
                <form onSubmit={handleSearch} className="flex-grow px-4 py-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 rounded overflow-hidden px-4">
                    {searchFields.map((p, i) => (
                      <div className="flex gap-2" key={i}>
                        <input
                          name="q"
                          checked={search.q === p}
                          value={p}
                          type="radio"
                          onChange={(e) =>
                            handleChange("search", "q", e.target.value)
                          }
                        />
                        <span>{utilityFunctions.snakeCaseToTitleCase(p)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex shadow-md shadow-amber-900/50 rounded overflow-hidden">
                    <input
                      required
                      className="flex-grow py-2 px-4 outline-none"
                      placeholder={`Search by ${
                        search.v
                          ? utilityFunctions.snakeCaseToTitleCase(search.v)
                          : "..."
                      }`}
                      type="text"
                      value={search.v}
                      onChange={(e) =>
                        handleChange("search", "v", e.target.value)
                      }
                    />
                    <button className="px-4 bg-amber-800 text-white hover:bg-amber-900 duration-300">
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </form>
              </Tab>
            )}
            {filterSupport && filterBy?.length > 0 && (
              <Tab
                title={
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} />
                    <span>Filter</span>
                  </div>
                }
                eventKey="filter"
              >
                <div className="py-2">
                  <Tabs
                    justify
                    className="px-6"
                    onSelect={(key) => {
                      handleFilterTabChange(key);
                    }}
                    defaultActiveKey={filterBy[0]?.name}
                  >
                    {filterBy.map((fp, i) => (
                      <Tab
                        onClick={() => handleChange("filter", "q", fp.name)}
                        title={utilityFunctions.snakeCaseToTitleCase(
                          fp.name || ""
                        )}
                        eventKey={fp.name}
                        className="flex gap-2"
                        key={i}
                      >
                        {fp.rangeable ? (
                          <form
                            onSubmit={handleFilter}
                            className="flex flex-col md:flex-row gap-2 items-start py-2"
                          >
                            <div className="grid grid-cols-2 gap-4 flex-grow">
                              <InputGroup>
                                <InputGroup.Text>From</InputGroup.Text>
                                <Form.Control
                                  type={fp.type}
                                  style={{ outline: "" }}
                                  rows={4}
                                  name={fp.name}
                                  onChange={(e) => {
                                    handleChange("filter", "v", [
                                      e.target.value,
                                      filter?.v[1] || "",
                                    ]);
                                  }}
                                  value={filter?.v[0] || ""}
                                  required
                                />
                              </InputGroup>
                              <InputGroup>
                                <InputGroup.Text>To</InputGroup.Text>
                                <Form.Control
                                  type={fp.type}
                                  style={{ outline: "none" }}
                                  rows={4}
                                  name={fp.name}
                                  onChange={(e) => {
                                    handleChange("filter", "v", [
                                      filter?.v[0] || "",
                                      e.target.value,
                                    ]);
                                  }}
                                  value={filter?.v[1] || ""}
                                  required
                                />
                              </InputGroup>
                            </div>
                            <button className="line-shadow py-2 px-3 rounded-lg bg-amber-800 hover:bg-white text-[#fff] hover:text-black duration-300">
                              Go
                            </button>
                          </form>
                        ) : (
                          <form
                            onSubmit={handleFilter}
                            className="pt-2 flex gap-2 items-center"
                          >
                            <InputGroup className="flex-grow">
                              <Form.Control
                                placeholder={`Input ${utilityFunctions.snakeCaseToTitleCase(
                                  fp.name || ""
                                )}`}
                                type={fp.type}
                                style={{ outline: "none" }}
                                rows={4}
                                name={fp.name}
                                onChange={() => {
                                  handleChange("filter", "v", [e.target.value]);
                                }}
                                value={filter?.v[0] || ""}
                                required
                              />
                            </InputGroup>
                            <button className="line-shadow py-2 px-3 rounded-lg bg-amber-800 hover:bg-white text-[#fff] hover:text-black duration-300">
                              Go
                            </button>
                          </form>
                        )}
                      </Tab>
                    ))}
                  </Tabs>
                </div>
              </Tab>
            )}
          </Tabs>
        </div>
      )}

      <div className="px-4 pt-2">
        <InputGroup className="w-max">
          <InputGroup.Text>Records per page</InputGroup.Text>
          <Form.Select
            onChange={(e) => {
              handlePopulationChange(parseInt(e.target.value));
            }}
            value={pagePopulation}
          >
            {[5, 10, 25, 50, 75, 100].map((c, k) => (
              <option key={k} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </InputGroup>
      </div>
      {recordsHeader}
      <div className="relative">
        {items.length > 0 && direction !== "vertical" && (
          <ScaleButton
            onClick={() => {
              scrollWrapperRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            className={`absolute z-40 top-[50%] left-1 bg-gray-100 hover:bg-yellow-600 hover:text-white`}
            text={<FontAwesomeIcon icon={faArrowLeft} />}
          />
        )}
        {/* {items.length > 0 && direction !== "vertical" && (
          <ScaleButton
            onClick={() => {
              triggerRefresh();
              scrollWrapperRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            className={`absolute z-40 top-[50%] right-1 bg-gray-100 hover:bg-yellow-600 hover:text-white`}
            text={<FontAwesomeIcon icon={faArrowRight} />}
          />
        )}
        {direction === "vertical" && (
          <div
            ref={scrollDownRef}
            className="scroll_down_button absolute z-40 duration-200 right-2"
          >
            <ScaleButton
              onClick={() => {
                triggerRefresh();
              }}
              className={`bg-gray-100 hover:bg-yellow-600 hover:text-white`}
              text={<FontAwesomeIcon icon={faArrowDown} />}
            />
          </div>
        )} */}
        <div
          style={direction === "vertical" ? (vScroll ? vStyle : {}) : {}}
          ref={scrollWrapperRef}
          className={`${
            direction === "vertical"
              ? vScroll
                ? vClasses + " scroll_y"
                : ""
              : "scroll_x"
          }`}
        >
          <div
            ref={containerRef}
            className={`${
              direction === "vertical"
                ? "flex flex-col flex-grow w-full"
                : "flex p-4"
            }`}
          >
            {items.length > 0 ? (
              items.map((componentData, index) => {
                const dt = { [dataKey]: componentData };
                return typeof UpdateComponent === "function" ||
                  typeof DeleteComponent === "function" ? (
                  <Item
                    {...{
                      items,
                      primaryKey: itemsPrimaryKey,
                      stagedItems,
                      updateStagedItems,
                    }}
                    key={index}
                    index={index}
                    item={componentData}
                  >
                    <PaginationChild
                      className={`z-10 ${childClassName}`}
                      {...dt}
                      {...generalProps}
                      {...{ items, setItems }}
                    />
                  </Item>
                ) : (
                  <PaginationChild
                    className={`z-10 ${childClassName}`}
                    {...dt}
                    {...generalProps}
                    {...{ items, setItems }}
                    key={index}
                  />
                );
              })
            ) : (
              <NoResults
                className="border bg-white text-gray-600"
                content={
                  <div className="min-h-[20vh] flex items-center justify-center border gap-4">
                    <VscLayers className="text-2xl" /> No records
                  </div>
                }
              />
            )}
          </div>
        </div>

        <PageBadges
          population={endpointPopulation}
          nextPage={nextPage}
          itemsPerPage={pagePopulation}
          setNextPage={setNextPage}
          triggerRefresh={triggerRefresh}
        />
      </div>

      <div>
        {typeof ChildDetails === "function" &&
          items
            .filter((item, index) =>
              stagedItems.includes(
                itemsPrimaryKey ? item[itemsPrimaryKey] : index
              )
            )
            .map((item, idx) => (
              <ChildDetails
                normalCrudManipulator={normalCrudManipulator}
                key={idx}
                primaryKey={item[itemsPrimaryKey]}
                {...{ [dataKey]: item }}
                {...detailsProps}
              />
            ))}
      </div>
    </div>
  );
}

function Item({
  children,
  item,
  primaryKey,
  index,
  items,
  stagedItems,
  updateStagedItems,
}) {
  const [staged, setStaged] = useState(false);

  useEffect(() => {
    for (let item of items.map((itm) => itm.id)) {
      const cs = stagedItems.map((c) => c.id).find((c) => c === item);
      if (cs) {
        setStaged(true);
      } else {
        setStaged(false);
        break;
      }
    }
  }, [items]);

  return (
    <div className="flex">
      <div className="flex items-center justify-center min-w-[2.5rem] ">
        <input
          onChange={(e) => {
            e.stopPropagation();
            setStaged((staged) => !staged);
            if (!e.target.checked) {
              updateStagedItems(item[primaryKey] || index, -1);
            } else {
              updateStagedItems(item[primaryKey] || index, 1);
            }
          }}
          className="scale-125 origin-center"
          type="checkbox"
          style={{ margin: 0 }}
          value={staged}
          checked={staged}
        />
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}

export function PageBadges({
  itemsPerPage,
  nextPage,
  population,
  setNextPage = () => {},
  triggerRefresh = () => {},
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(nextPage || 1);
  }, [nextPage]);

  const N = Math.ceil(population / itemsPerPage);

  const pages = new Array(N).fill(0).map((n, i) => i + 1);
  const [first, last] = [
    pages.slice(0, pages.indexOf(parseInt(nextPage))).slice(0, 4),
    pages.slice(pages.indexOf(parseInt(nextPage)) + 1).slice(-4),
  ];

  return (
    <div className="py-2">
      <div className="flex items-center justify-center gap-1 font-bold">
        <span>Page</span>
        <span className="font-bold">{nextPage}</span>
        <span>of</span>
        <span>{N}</span>
      </div>
      <div className="flex gap-3 p-2 items-end font-bold duration-300 relative">
        <div className="flex flex-grow justify-end gap-3">
          <div className="flex gap-2">
            {first.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setNextPage(page);
                  triggerRefresh();
                }}
                className="py-2 px-3 rounded bg-white text-amber-900 hover:ring-1 hover:ring-amber-800 duration-300"
              >
                {page}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            {new Array(4 - first.length).fill("_").map((dash, i) => (
              <span key={i} className="font-bold text-amber-800">
                {dash}
              </span>
            ))}
          </div>
        </div>
        <div className="text-amber-800 relative flex flex-col gap-2 items-stretch justify-between">
          {nextPage > 1 && (
            <button
              onClick={() => {
                if (nextPage > 1) {
                  setNextPage(nextPage - 1);
                  triggerRefresh();
                }
              }}
              className="absolute right-[100%] -translate-x-4 p-1 min-w-[8rem] rounded bg-white text-amber-900 hover:ring-1 hover:ring-amber-800 duration-300"
            >
              Previous
            </button>
          )}
          <input
            type="number"
            min={1}
            max={N}
            placeholder="N"
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(e.target.value);
            }}
            className="outline-none w-max shadow-sm border-1 border-amber-800 rounded py-1 px-2 text-center font-bold"
          />

          <button
            onClick={() => {
              if (currentPage < 1) {
                setNextPage(1);
                triggerRefresh();
              } else if (currentPage > N) {
                setNextPage(N);
                triggerRefresh();
              } else {
                setNextPage(currentPage);
                triggerRefresh();
              }
            }}
            className="p-2 rounded bg-white text-amber-800 hover:ring-1 hover:ring-amber-800 duration-300"
          >
            <span className="">Go</span>
          </button>

          {nextPage < N && (
            <button
              onClick={() => {
                if (nextPage < N) {
                  setNextPage(nextPage + 1);
                  triggerRefresh();
                }
              }}
              className="absolute left-[100%] translate-x-4 p-1 min-w-[8rem] rounded bg-white text-amber-900 hover:ring-1 hover:ring-amber-800 duration-300"
            >
              Next
            </button>
          )}
        </div>
        <div className="flex flex-grow gap-3 items-end">
          <div className="flex gap-2">
            {new Array(4 - last.length).fill("_").map((dash, i) => (
              <span key={i} className="text-amber-800">
                {dash}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {last.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setNextPage(page);
                  triggerRefresh();
                }}
                className="py-2 px-3 rounded bg-white text-amber-900 hover:ring-1 hover:ring-amber-800 duration-300"
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
