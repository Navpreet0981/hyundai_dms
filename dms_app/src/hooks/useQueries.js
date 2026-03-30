import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosClient';

// ─── helpers ────────────────────────────────────────────────────────────────
const fetcher = (url) => api.get(url).then(r => r.data);

// ─── ADMIN ──────────────────────────────────────────────────────────────────
export const useAdminDashboard   = () => useQuery({ queryKey: ['admin-dashboard'],        queryFn: () => fetcher('/admin/dashboard') });
export const useAdminMonthlySales= () => useQuery({ queryKey: ['admin-monthly-sales'],    queryFn: () => fetcher('/admin/sales/monthly') });
export const useAdminLeadSources = () => useQuery({ queryKey: ['admin-lead-sources'],     queryFn: () => fetcher('/admin/lead-source-analytics') });
export const useAdminLeadConv    = () => useQuery({ queryKey: ['admin-lead-conversion'],  queryFn: () => fetcher('/admin/lead-conversion') });
export const useAdminDealerPerf  = () => useQuery({ queryKey: ['admin-dealer-perf'],      queryFn: () => fetcher('/admin/dealer-performance') });
export const useAdminDealerSales = () => useQuery({ queryKey: ['admin-dealer-sales'],     queryFn: () => fetcher('/admin/sales/dealers') });
export const useAdminSalesSummary= () => useQuery({ queryKey: ['admin-sales-summary'],    queryFn: () => fetcher('/admin/sales/summary') });

export const useDealersPaged = (page, size, search) =>
  useQuery({
    queryKey: ['dealers-paged', page, size, search],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      return fetcher(`/dealers/paged?${params}`);
    },
    placeholderData: (prev) => prev,   // keep previous page data while loading next
  });

export const useEmployeesPaged = (page, size, search, sort) =>
  useQuery({
    queryKey: ['employees-paged', page, size, search, sort],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      if (sort) params.set('sort', sort);
      return fetcher(`/employees/paged?${params}`);
    },
    placeholderData: (prev) => prev,
  });

export const useCustomersPaged = (page, size, search, sort) =>
  useQuery({
    queryKey: ['customers-paged', page, size, search, sort],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      if (sort) params.set('sort', sort);
      return fetcher(`/customers/paged?${params}`);
    },
    placeholderData: (prev) => prev,
  });

export const useCars = () => useQuery({ queryKey: ['cars'], queryFn: () => fetcher('/cars') });
export const useVariants = (carId) =>
  useQuery({ queryKey: ['variants', carId], queryFn: () => fetcher(`/variants/car/${carId}`), enabled: !!carId });

// ─── DEALER ─────────────────────────────────────────────────────────────────
export const useDealerDashboard   = () => useQuery({ queryKey: ['dealer-dashboard'],       queryFn: () => fetcher('/dealer/dashboard') });
export const useDealerMonthlyRev  = () => useQuery({ queryKey: ['dealer-monthly-rev'],     queryFn: () => fetcher('/dealer/revenue/monthly') });
export const useDealerPerformance = () => useQuery({ queryKey: ['dealer-performance'],     queryFn: () => fetcher('/dealer/performance') });

export const useDealerLeads = () => useQuery({ queryKey: ['dealer-leads'], queryFn: () => fetcher('/customers') });

export const useDealerLeadsPaged = (page, size, search) =>
  useQuery({
    queryKey: ['dealer-leads-paged', page, size, search],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      return fetcher(`/customers/paged?${params}`);
    },
    placeholderData: (prev) => prev,
  });

export const useBookingsPaged = (page, size) =>
  useQuery({
    queryKey: ['bookings-paged', page, size],
    queryFn: () => fetcher(`/bookings/paged?page=${page}&size=${size}`),
    placeholderData: (prev) => prev,
  });

export const useTestDrivesPaged = (page, size) =>
  useQuery({
    queryKey: ['testdrives-paged', page, size],
    queryFn: () => fetcher(`/testdrives/paged?page=${page}&size=${size}`),
    placeholderData: (prev) => prev,
  });

// ─── EMPLOYEE ───────────────────────────────────────────────────────────────
export const useEmployeeDashboard  = () => useQuery({ queryKey: ['employee-dashboard'],    queryFn: () => fetcher('/employee/dashboard') });
export const useEmployeeMonthlySales=() => useQuery({ queryKey: ['employee-monthly-sales'],queryFn: () => fetcher('/employee/sales/monthly') });
export const useEmployeeLeads      = () => useQuery({ queryKey: ['employee-leads'],        queryFn: () => fetcher('/customers') });

export const useEmployeeLeadsPaged = (page, size, search) =>
  useQuery({
    queryKey: ['employee-leads-paged', page, size, search],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      return fetcher(`/customers/paged?${params}`);
    },
    placeholderData: (prev) => prev,
  });
export const useServiceRequests    = () => useQuery({ queryKey: ['service-requests'],      queryFn: () => fetcher('/service-requests') });
export const useAllTestDrives      = () => useQuery({ queryKey: ['all-testdrives'],        queryFn: () => fetcher('/testdrives') });
export const useAllBookings        = () => useQuery({ queryKey: ['all-bookings'],          queryFn: () => fetcher('/bookings') });

// ─── INVENTORY ───────────────────────────────────────────────────────────────
export const useDealerInventory = () => useQuery({ queryKey: ['dealer-inventory'], queryFn: () => fetcher('/dealer/inventory') });

// ─── AUDIT ───────────────────────────────────────────────────────────────────
export const useAdminAudit = (page, size, search) =>
  useQuery({
    queryKey: ['admin-audit', page, size, search],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      return fetcher(`/admin/audit?${params}`);
    },
    placeholderData: (prev) => prev,
  });

export const useDealerAudit = (page, size, search) =>
  useQuery({
    queryKey: ['dealer-audit', page, size, search],
    queryFn: () => {
      const params = new URLSearchParams({ page, size });
      if (search?.trim()) params.set('search', search.trim());
      return fetcher(`/dealer/audit?${params}`);
    },
    placeholderData: (prev) => prev,
  });

// ─── MUTATIONS (invalidate cache on success) ─────────────────────────────────
export const useInvalidate = () => {
  const qc = useQueryClient();
  return (keys) => {
    const list = Array.isArray(keys) ? keys : [keys];
    list.forEach(k => qc.invalidateQueries({ queryKey: [k] }));
  };
};
