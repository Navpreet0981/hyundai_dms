package com.hyundai.dms.service;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DealerService {

    private final DealerRepository dealerRepository;

    public DealerService(DealerRepository dealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    // Save dealer
    public Dealer saveDealer(Dealer dealer) {
        return dealerRepository.save(dealer);
    }

    // Get all dealers
    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }

    // Get dealer by ID
    public Dealer getDealerById(Long id) {
        return dealerRepository.findById(id).orElse(null);
    }

    // Delete dealer
    public void deleteDealer(Long id) {
        dealerRepository.deleteById(id);
    }
}