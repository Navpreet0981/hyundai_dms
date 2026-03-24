use dms_db;
DESC employees;
ALTER TABLE employees ADD password VARCHAR(255);

ALTER TABLE dealers ADD password VARCHAR(255);
INSERT INTO employees(name,email,password,phone,role,dealer_id,active)
VALUES ('Karan','karan@hyundai.com','123456','9999999999','SALES_EXECUTIVE',1,true);

INSERT INTO dealers(dealer_name,email,password,phone,city,state,address,active)
VALUES ('Hyundai Haryana','dealer3@hyundai.com','123456','9999999999','Chennai','TN','Address',true);

UPDATE dealers
SET dealer_name = 'Hyundai Haryana',
    email = 'dealer3@hyundai.com',
    phone = '98765478210',
    city = 'Jind',
    state = 'Haryana',
    address = 'Model Town, Jind',
    active = true
WHERE email = 'dealer3@hyundai.com';

select * from admins;
INSERT INTO admins (name, email, password, role, active)
VALUES (
    'System Admin',
    'admin@hyundai.com',
    'admin123',
    'ADMIN',
    true
);
describe admins;
describe customers;

show tables;

select * from test_drives;
select * from admins;
select * from dealers;
UPDATE dealers
SET password = '123456',
    admin_id = 1
WHERE dealer_id = 2;

select * from customers;
select * from employees;

SET SQL_SAFE_UPDATES = 0;
UPDATE employees SET status = 'ACTIVE' WHERE status IS NULL;
SET SQL_SAFE_UPDATES = 1;
ALTER TABLE service_requests ADD COLUMN employee_id BIGINT;