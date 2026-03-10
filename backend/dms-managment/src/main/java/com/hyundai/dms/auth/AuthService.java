package com.hyundai.dms.auth;

import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.repository.AdminRepository;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import com.hyundai.dms.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final AdminRepository adminRepository;
    private final EmployeeRepository employeeRepository;
    private final DealerRepository dealerRepository;

    public AuthService(JwtService jwtService,
                       AdminRepository adminRepository,
                       EmployeeRepository employeeRepository,
                       DealerRepository dealerRepository) {

        this.jwtService = jwtService;
        this.adminRepository = adminRepository;
        this.employeeRepository = employeeRepository;
        this.dealerRepository = dealerRepository;
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();
        String role = request.getRole();

        switch (role.toUpperCase()) {

            case "ADMIN":

                Admin admin = adminRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Admin not found"));

                if (!admin.getPassword().equals(password)) {
                    throw new RuntimeException("Invalid password");
                }

                break;

            case "EMPLOYEE":

                Employee employee = employeeRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Employee not found"));

                if (!employee.getPassword().equals(password)) {
                    throw new RuntimeException("Invalid password");
                }

                break;

            case "DEALER":

                Dealer dealer = dealerRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Dealer not found"));

                if (!dealer.getPassword().equals(password)) {
                    throw new RuntimeException("Invalid password");
                }

                break;

            default:
                throw new RuntimeException("Invalid role");
        }

        String token = jwtService.generateToken(email, role);

        return new LoginResponse(token);
    }
}