package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeadSourceDTO {

    private String source;

    private long totalLeads;
}