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

SET FOREIGN_KEY_CHECKS = 0;
SELECT @@SQL_SAFE_UPDATES;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM customers;
DELETE FROM employees;
DELETE FROM dealers;
DELETE FROM admins;
delete from bookings;

SET FOREIGN_KEY_CHECKS = 1;


ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE employees AUTO_INCREMENT = 1;
ALTER TABLE dealers AUTO_INCREMENT = 1;
ALTER TABLE admins AUTO_INCREMENT = 1;

SELECT * FROM admins;
SELECT * FROM dealers;
SELECT * FROM employees;
SELECT * FROM customers;
select * from service_requests;
select * from test_drives;
select * from bookings;
DELETE FROM service_requests WHERE employee_id IS NULL;
show tables;
desc admins;
INSERT INTO admins (name, email, password, active, role)
VALUES (
  'Super Admin',
  'admin@test.com',
  '$2a$10$7QJzRkGzQk8pJ6z0XyXW7e7X0zWqz5VYkT9VqXbZx1zYp6RkQmW2K',
  1,
  'ADMIN'
);

SELECT * FROM admins;

update dealers 
Set password = '$2a$10$Ms.BMf5og.I8QvwumIiIo.3WEhwgjqbYjuhFkL93KwR3hel.K077S'
WHERE email= 'navpreet.singh@hyundai.com';

SELECT email, password FROM dealers;

describe customers;
ALTER TABLE customers ADD COLUMN variant_id BIGINT;

ALTER TABLE customers
ADD CONSTRAINT fk_customer_variant
FOREIGN KEY (variant_id) REFERENCES car_variant(variant_id);