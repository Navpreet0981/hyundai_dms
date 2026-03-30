-- ============================================================
-- DMS Migration: Multi-table roles → Single users table
-- Run this ONCE against your existing dms_db database
-- IMPORTANT: Take a full backup before running
-- ============================================================

-- STEP 1: Create the users table
CREATE TABLE IF NOT EXISTS users (
    user_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    system_role ENUM('ADMIN','DEALER','EMPLOYEE') NOT NULL,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- STEP 2: Create the roles table (3 roles only for now)
CREATE TABLE IF NOT EXISTS roles (
    role_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name    VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description  VARCHAR(500),
    active       BOOLEAN NOT NULL DEFAULT TRUE
);

-- STEP 3: Seed the 3 system roles
INSERT IGNORE INTO roles (role_name, display_name, description, active) VALUES
('ADMIN',    'Administrator', 'Full system access — manages dealers and platform',    TRUE),
('DEALER',   'Dealer',        'Manages dealership operations and employees',           TRUE),
('EMPLOYEE', 'Employee',      'Works under a dealer — handles leads and bookings',    TRUE);

-- STEP 4: Migrate admins → users
INSERT INTO users (name, email, password, system_role, active)
SELECT name, email, password, 'ADMIN', COALESCE(active, TRUE)
FROM admins;

-- STEP 5: Migrate dealers → users
INSERT INTO users (name, email, password, system_role, active)
SELECT dealer_name, email, password, 'DEALER', COALESCE(active, TRUE)
FROM dealers;

-- STEP 6: Migrate employees → users
INSERT INTO users (name, email, password, system_role, active)
SELECT name, email, password, 'EMPLOYEE', COALESCE(active, TRUE)
FROM employees;

-- STEP 7: Add user_id FK to admins table
-- STEP 7: Add user_id to admins
ALTER TABLE admins ADD COLUMN user_id BIGINT;

UPDATE admins a
    JOIN users u ON u.email = a.email AND u.system_role = 'ADMIN'
    SET a.user_id = u.user_id;

ALTER TABLE admins ADD CONSTRAINT fk_admins_user FOREIGN KEY (user_id) REFERENCES users(user_id);

-- STEP 8: Add user_id and managed_by to dealers
ALTER TABLE dealers ADD COLUMN user_id BIGINT;
ALTER TABLE dealers ADD COLUMN managed_by BIGINT;

UPDATE dealers d
    JOIN users u ON u.email = d.email AND u.system_role = 'DEALER'
    SET d.user_id = u.user_id;

UPDATE dealers d
    JOIN admins a ON a.admin_id = d.admin_id
    SET d.managed_by = a.user_id;

ALTER TABLE dealers ADD CONSTRAINT fk_dealers_user       FOREIGN KEY (user_id)    REFERENCES users(user_id);
ALTER TABLE dealers ADD CONSTRAINT fk_dealers_managed_by FOREIGN KEY (managed_by) REFERENCES users(user_id);

-- STEP 9: Add user_id to employees
ALTER TABLE employees ADD COLUMN user_id BIGINT;

UPDATE employees e
    JOIN users u ON u.email = e.email AND u.system_role = 'EMPLOYEE'
    SET e.user_id = u.user_id;

ALTER TABLE employees ADD CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(user_id);

-- ============================================================
-- STEP 10: Drop old auth columns (run AFTER verifying data)
-- Uncomment these once you've confirmed everything works
-- ============================================================
-- ALTER TABLE dealers   DROP COLUMN email;
-- ALTER TABLE dealers   DROP COLUMN password;
-- ALTER TABLE dealers   DROP COLUMN admin_id;
-- ALTER TABLE employees DROP COLUMN name;
-- ALTER TABLE employees DROP COLUMN email;
-- ALTER TABLE employees DROP COLUMN password;
-- ALTER TABLE employees DROP COLUMN active;
-- DROP TABLE admins;
