/*
  # Add sold status to accounts

  1. Changes
    - Add `sold` column to accounts table with boolean default false
*/

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS sold boolean DEFAULT false;