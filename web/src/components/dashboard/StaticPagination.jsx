import React, { useEffect, useState } from "react";
import { PageBadges } from "../common/Pagination";

function StaticPagination({
  items,
  itemHost,
  itemHostProps = {},
  perPage,
  className,
}) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = perPage || 10;
  const ItemHost = itemHost;

  useEffect(() => {
    setCurrentPage(1);
    if (items?.length > 0) {
      setPages(
        new Array(Math.ceil(items.length / itemsPerPage))
          .fill(0)
          .map((_, i) => i)
          .reduce((acc, curr) => {
            acc.push(
              items.slice(
                curr * itemsPerPage,
                curr * itemsPerPage + itemsPerPage
              )
            );

            return acc;
          }, [])
      );
    } else {
      setPages([]);
    }
  }, [items]);

  return (
    <div className={`${className}`}>
      <div>
        {pages[currentPage - 1]?.map((item, idx) => {
          return ItemHost ? (
            <ItemHost {...itemHostProps} key={idx} item={item} />
          ) : null;
        })}
      </div>
      <PageBadges
        setNextPage={(n) => setCurrentPage(n)}
        population={items?.length || 0}
        itemsPerPage={itemsPerPage}
        nextPage={currentPage}
      />
    </div>
  );
}

export { StaticPagination };
