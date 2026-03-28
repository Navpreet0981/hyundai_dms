package com.hyundai.dms.auth;

import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.repository.AdminRepository;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import com.hyundai.dms.security.JwtService;
import com.hyundai.dms.service.AuditService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final AdminRepository adminRepository;
    private final EmployeeRepository employeeRepository;
    private final DealerRepository dealerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AuthService(JwtService jwtService,
                       AdminRepository adminRepository,
                       EmployeeRepository employeeRepository,
                       DealerRepository dealerRepository,
                       PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.jwtService = jwtService;
        this.adminRepository = adminRepository;
        this.employeeRepository = employeeRepository;
        this.dealerRepository = dealerRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {

        String email    = request.getEmail();
        String password = request.getPassword();
        String role     = request.getRole();

//        System.out.println(passwordEncoder.encode("navv@123"));

        if (email == null || password == null || role == null) {
            throw new RuntimeException("Email, password and role are required");
        }

        switch (role.toUpperCase()) {

            case "ADMIN":
                Admin admin = adminRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Admin not found"));
                if (!passwordEncoder.matches(password, admin.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }
                auditService.log(email, "ADMIN", null, null, "LOGIN", "Auth", null, "Admin logged in");
                break;

            case "EMPLOYEE":
                Employee employee = employeeRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Employee not found"));
                if (!passwordEncoder.matches(password, employee.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }
                Long empDealerId = employee.getDealer() != null ? employee.getDealer().getDealerId() : null;
                String empDealerName = employee.getDealer() != null ? employee.getDealer().getDealerName() : null;
                auditService.log(email, "EMPLOYEE", empDealerId, empDealerName, "LOGIN", "Auth", null,
                        "Employee logged in");
                break;

            case "DEALER":
                Dealer dealer = dealerRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Dealer not found"));
                if (!passwordEncoder.matches(password, dealer.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }
                auditService.log(email, "DEALER", dealer.getDealerId(), dealer.getDealerName(),
                        "LOGIN", "Auth", null, "Dealer logged in");
                break;

            default:
                throw new RuntimeException("Invalid role");
        }

        String token = jwtService.generateToken(email, role);

        return new LoginResponse(token);

    }
}