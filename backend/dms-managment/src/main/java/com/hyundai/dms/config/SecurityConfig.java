package com.hyundai.dms.config;

import com.hyundai.dms.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Fix #3: Removed dead /admin/register rule — already covered by /auth/**
                .requestMatchers("/auth/**").permitAll()

                // DEALER routes first (order matters)
                .requestMatchers("/dealer/inventory/check").hasAnyRole("DEALER","EMPLOYEE","ADMIN")
                .requestMatchers("/dealer/**").hasRole("DEALER")

                // Admin-only
                .requestMatchers("/dealers/**").hasRole("ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // Employee creation: ADMIN or DEALER only
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/employees").hasAnyRole("ADMIN","DEALER")
                .requestMatchers("/employees/**").hasAnyRole("ADMIN","DEALER","EMPLOYEE")

                // Cars & variants
                    .requestMatchers("/cars/**", "/variants/**")
                    .hasAnyRole("ADMIN","DEALER","EMPLOYEE")

                    .requestMatchers("/cars", "/variants")
                    .hasAnyRole("ADMIN","DEALER","EMPLOYEE")
                // Shared ops
                .requestMatchers(
                    "/customers/**", "/testdrives/**", "/bookings/**",
                    "/service-requests/**", "/employee/**"
                ).hasAnyRole("ADMIN","EMPLOYEE","DEALER")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
