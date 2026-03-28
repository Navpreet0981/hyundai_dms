package com.hyundai.dms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDTO {
    private Long id;
    private String actorEmail;
    private String actorRole;
    private Long dealerId;
    private String dealerName;
    private String action;
    private String entity;
    private String entityId;
    private String description;
    private LocalDateTime timestamp;
}
