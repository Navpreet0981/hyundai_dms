import { useEffect } from "react";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { useTestDrivesPaged } from "../../hooks/useQueries";

export default function DealerTestDrives() {
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  // Fetch paginated test drives — backend scopes to this dealer's test drives automatically
  const { data, isLoading: loading } = useTestDrivesPaged(page, size);
  const testDrives = data?.content ?? [];

  // Sync total pages from query response into pagination hook
  useEffect(() => { if (data?.totalPages !== undefined) setTotalPages(data.totalPages); }, [data?.totalPages, setTotalPages]);

  return (
    <DealerLayout>
      <div className="space-y-6">
        <h1 className="apple-title">Test Drives</h1>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>{["Customer","Variant","Employee","Date","Status"].map((h, i) => <th key={i} className="apple-table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {testDrives.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 text-[#86868b] text-sm">No test drives found</td></tr>
                ) : testDrives.map(t => (
                  <tr key={t.testDriveId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{t.customerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.variantName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.employeeName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.testDriveDate}</td>
                    {/* Status badge — REQUESTED / CONFIRMED / COMPLETED / CANCELLED */}
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
    </DealerLayout>
  );
}
