package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Role;
import com.hyundai.dms.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Role management — ADMIN only.
 * Currently manages 3 roles: ADMIN, DEALER, EMPLOYEE.
 */
@RestController
@RequestMapping("/admin/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // GET /admin/roles — all roles
    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // GET /admin/roles/active — only active roles
    @GetMapping("/active")
    public List<Role> getActiveRoles() {
        return roleRepository.findByActiveTrue();
    }

    // PUT /admin/roles/{id}/status — toggle active/inactive
    @PutMapping("/{id}/status")
    public ResponseEntity<Role> toggleStatus(@PathVariable Long id,
                                              @RequestBody Map<String, Boolean> body) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        role.setActive(body.get("active"));
        return ResponseEntity.ok(roleRepository.save(role));
    }

    // PUT /admin/roles/{id} — update description only (roleName is immutable)
    @PutMapping("/{id}")
    public Role updateRole(@PathVariable Long id, @RequestBody Role updated) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        role.setDisplayName(updated.getDisplayName());
        role.setDescription(updated.getDescription());
        return roleRepository.save(role);
    }
}
