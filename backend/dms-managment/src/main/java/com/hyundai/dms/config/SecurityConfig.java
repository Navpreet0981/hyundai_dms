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
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Public
                        .requestMatchers("/auth/**").permitAll()

                        // DEALER FIRST (VERY IMPORTANT)
                        .requestMatchers("/dealer/**").hasRole("DEALER")

                        // Admin APIs
                        .requestMatchers("/dealers/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Shared APIs
                        .requestMatchers(
                                "/employees/**",
                                "/cars/**",
                                "/variants/**"
                        ).hasAnyRole("ADMIN","DEALER","EMPLOYEE")

                        .requestMatchers(
                                "/customers/**",
                                "/testdrives/**",
                                "/bookings/**",
                                "/service-requests/**",
                                "/employee/**"
                        ).hasAnyRole("ADMIN","EMPLOYEE","DEALER")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}