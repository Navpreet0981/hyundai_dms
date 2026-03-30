package com.hyundai.dms.security.util;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserUtil {

    private final DealerRepository dealerRepository;

    public CurrentUserUtil(DealerRepository dealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    public Long getLoggedInDealerId() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Dealer dealer = dealerRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        return dealer.getDealerId();
    }
}