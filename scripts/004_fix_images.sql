-- Fix incorrect image URLs for all relics
-- Run this SQL in your Supabase SQL editor to correct all image assignments

-- Kintsugi Bowl - needs golden-cracked bowl image
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800'
WHERE title ILIKE '%Kintsugi%';

-- Furoshiki - needs cloth wrapping / fabric image
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
WHERE title ILIKE '%Furoshiki%';

-- Ondol Korean underfloor heating - needs traditional ondol floor / hanok image
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1601314002592-b8734bca6604?w=800'
WHERE title ILIKE '%Ondol%';

-- Zellige Mosaic Tiles - needs Moroccan tile pattern image
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'
WHERE title ILIKE '%Zellige%';

-- Tagine - Moroccan cooking vessel
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800'
WHERE title ILIKE '%Tagine%';

-- Tibetan Singing Bowl (TPT / Tibetan singing bowl)
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=800'
WHERE title ILIKE '%Singing Bowl%' OR title ILIKE '%Tibetan Bowl%';

-- Dabba Wala - Tiffin box
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'
WHERE title ILIKE '%Dabba%' OR title ILIKE '%Dabbawala%';

-- Raksha Bandhan - hands tying Rakhi
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1598901865264-4f5f69b1d9d7?w=800'
WHERE title ILIKE '%Raksha%' OR title ILIKE '%Rakhi%';

-- Pongal - traditional rice dish, not Pav Bhaji
UPDATE relics SET primary_image_url = 'https://images.unsplash.com/photo-1606788075761-969bca9bc65c?w=800'
WHERE title ILIKE '%Pongal%';
