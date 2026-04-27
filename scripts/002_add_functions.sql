-- Function to increment QR code scan count
CREATE OR REPLACE FUNCTION increment_qr_scan(qr_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE relic_qr_codes 
  SET scan_count = scan_count + 1 
  WHERE code = qr_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
