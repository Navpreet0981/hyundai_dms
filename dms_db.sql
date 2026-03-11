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