-- Add images array column to portfolio_items
ALTER TABLE public.portfolio_items 
ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing single image_url to images array
UPDATE public.portfolio_items 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Keep image_url for backward compatibility (will store the first image)
