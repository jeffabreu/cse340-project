--insert Tony Stark Data
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Modify the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Delete the Tony Stark record from the database:
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--Modify the "GM Hummer" record using the PostgreSQL Replace function:
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Use an inner join to select specific fields from the inventory and classification tables for items in the "Sport" category:
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM public.inventory inv
INNER JOIN public.classification cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

--Update all records in the inventory table to add "/vehicles" to the file path in inv_image and inv_thumbnail columns:
UPDATE public.inventory
SET inv_image = CONCAT('/images/vehicles', SUBSTRING(inv_image FROM 8)),
    inv_thumbnail = CONCAT('/images/vehicles', SUBSTRING(inv_thumbnail FROM 8));

