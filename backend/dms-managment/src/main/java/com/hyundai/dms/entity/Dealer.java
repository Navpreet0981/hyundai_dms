package com.hyundai.dms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dealers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dealer {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    // WRITE_ONLY: Jackson accepts it in request body but never serializes it in response
    // @JsonIgnore on field blocks Lombok getter from being seen by Jackson — causes null reads
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dealerId;

    @Column(nullable = false)
    private String dealerName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String city;
    private String state;
    private String address;
    private Boolean active;
}
