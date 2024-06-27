import { useMemo } from 'react';

interface usePaginationProps {
  rows: object[];
  page: number;
  pageSize: number;
}
const usePagination = ({rows, page, pageSize} : usePaginationProps) => {
  console.log("rows usePagination===>",rows.length,page,pageSize)
  return useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    console.log("start,end",start,end)
    return Array.isArray(rows) ? rows.slice(start, end) : [];
  }, [rows, page, pageSize]);
};

export default usePagination;
