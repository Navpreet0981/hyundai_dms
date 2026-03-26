package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByDealer_DealerId(Long dealerId);

    Optional<Inventory> findByDealer_DealerIdAndVariant_VariantId(Long dealerId, Long variantId);

    @Modifying
    @Query("UPDATE Inventory i SET i.quantity = i.quantity - 1 WHERE i.dealer.dealerId = :dealerId AND i.variant.variantId = :variantId AND i.quantity > 0")
    int decrementStock(@Param("dealerId") Long dealerId, @Param("variantId") Long variantId);

    @Modifying
    @Query("UPDATE Inventory i SET i.quantity = i.quantity + 1 WHERE i.dealer.dealerId = :dealerId AND i.variant.variantId = :variantId")
    void incrementStock(@Param("dealerId") Long dealerId, @Param("variantId") Long variantId);
}
