package com.hyundai.dms.service;

import com.hyundai.dms.dto.AuditLogDTO;
import com.hyundai.dms.entity.AuditLog;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.AuditLogRepository;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final DealerRepository dealerRepository;

    public AuditService(AuditLogRepository auditLogRepository, DealerRepository dealerRepository) {
        this.auditLogRepository = auditLogRepository;
        this.dealerRepository = dealerRepository;
    }

    /**
     * Core log method — called from any service/controller.
     * dealerId/dealerName can be null for admin-level actions.
     */
    public void log(String actorEmail, String actorRole,
                    Long dealerId, String dealerName,
                    String action, String entity,
                    String entityId, String description) {
        AuditLog log = AuditLog.builder()
                .actorEmail(actorEmail)
                .actorRole(actorRole)
                .dealerId(dealerId)
                .dealerName(dealerName)
                .action(action)
                .entity(entity)
                .entityId(entityId)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    /**
     * Convenience — resolves actor from SecurityContext automatically.
     * For employee actions, dealer context is not set here — use logWithDealer instead.
     */
    public void logFromContext(String action, String entity, String entityId, String description) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            String role  = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().iterator().next().getAuthority()
                    .replace("ROLE_", "");

            Long dealerId = null;
            String dealerName = null;

            if (role.equals("DEALER")) {
                Dealer dealer = dealerRepository.findByEmail(email).orElse(null);
                if (dealer != null) {
                    dealerId = dealer.getDealerId();
                    dealerName = dealer.getDealerName();
                }
            }

            log(email, role, dealerId, dealerName, action, entity, entityId, description);
        } catch (Exception ignored) {
            // Never let audit failure break the main flow
        }
    }

    /**
     * Convenience with explicit dealer context (for employee actions).
     */
    public void logWithDealer(String action, String entity, String entityId,
                               String description, Long dealerId, String dealerName) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            String role  = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().iterator().next().getAuthority()
                    .replace("ROLE_", "");
            log(email, role, dealerId, dealerName, action, entity, entityId, description);
        } catch (Exception ignored) {}
    }

    // ─── Query methods ────────────────────────────────────────────────────────

    public Page<AuditLogDTO> getAdminLogs(String search, Pageable pageable) {
        return auditLogRepository.searchAll(search, pageable).map(this::toDTO);
    }

    public Page<AuditLogDTO> getDealerLogs(Long dealerId, String search, Pageable pageable) {
        return auditLogRepository.searchByDealer(dealerId, search, pageable).map(this::toDTO);
    }

    private AuditLogDTO toDTO(AuditLog a) {
        return AuditLogDTO.builder()
                .id(a.getId())
                .actorEmail(a.getActorEmail())
                .actorRole(a.getActorRole())
                .dealerId(a.getDealerId())
                .dealerName(a.getDealerName())
                .action(a.getAction())
                .entity(a.getEntity())
                .entityId(a.getEntityId())
                .description(a.getDescription())
                .timestamp(a.getTimestamp())
                .build();
    }
}
