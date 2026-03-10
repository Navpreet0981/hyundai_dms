package com.hyundai.dms.config;

import com.hyundai.dms.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // Admin APIs
                        .requestMatchers("/dealers/**").hasRole("ADMIN")

                        // Dealer + Admin APIs
                        .requestMatchers("/employees/**").hasAnyRole("ADMIN", "DEALER")

                        // Employee APIs
                        .requestMatchers(
                                "/customers/**",
                                "/testdrives/**",
                                "/bookings/**",
                                "/service-requests/**"
                        ).hasRole("EMPLOYEE")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // Add JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}