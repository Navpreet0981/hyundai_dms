import { useState, useCallback } from "react";

const usePagination = (initialPage = 0, initialSize = 5) => {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  // stable reference — size never changes, wrap setTotalPages so it's stable too
  const size = initialSize;
  const updateTotalPages = useCallback((n) => setTotalPages(n), []);

  return {
    page,
    size,
    totalPages,
    setPage,
    setTotalPages: updateTotalPages,
  };
};

export default usePagination;