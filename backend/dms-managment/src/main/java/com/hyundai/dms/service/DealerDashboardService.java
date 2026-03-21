package com.hyundai.dms.service;

import com.hyundai.dms.dto.DealerDashboardDTO;

public interface DealerDashboardService {

    DealerDashboardDTO getDealerDashboard(Long dealerId);

}