CREATE OR REPLACE FUNCTION increment_booked_slots(payment_id UUID, amount DECIMAL, currency VARCHAR, paypal_transaction_id VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE bookings
  SET status = 'completed',
      amount = amount,
      currency = currency,
      paypal_transaction_id = paypal_transaction_id,
      booked_slots = booked_slots + 1
  WHERE payment_id = payment_id;
END;
$$ LANGUAGE plpgsql;