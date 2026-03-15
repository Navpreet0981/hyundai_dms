package com.hyundai.dms.repository;

import com.hyundai.dms.dto.DealerDashboardDTO;

public interface DealerDashboardService {

    DealerDashboardDTO getDealerDashboard(Long dealerId);

}