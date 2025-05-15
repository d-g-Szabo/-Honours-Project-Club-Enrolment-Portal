ALTER TABLE bookings
ADD COLUMN status VARCHAR(50),
ADD COLUMN amount DECIMAL(10, 2),
ADD COLUMN currency VARCHAR(10); 

ALTER TABLE bookings
add column paypal_transaction_id VARCHAR(255);