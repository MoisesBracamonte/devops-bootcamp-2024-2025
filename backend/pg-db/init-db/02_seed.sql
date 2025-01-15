-- Insert sample data into organizations
insert into
  organizations (name, industry, phone, address, num_employees)
values
  (
    'TechCorp',
    'Technology',
    '123-456-7890',
    '123 Tech Lane',
    200
  ),
  (
    'HealthPlus',
    'Healthcare',
    '987-654-3210',
    '456 Health St',
    150
  );

-- Insert sample data into users
insert into
  users (
    name,
    email,
    password,
    type_of_user,
    phone,
    is_active
  )
values
  (
    'Moises Rodriguez',
    'user@ebspa.com',
    '123123123',
    'organization',
    '555-1234',
    'actived'
  ),
  (
    'Bob Smith',
    'bob@example.com',
    'password456',
    'organization',
    '555-5678',
    'disabled'
  );

-- Insert sample data into categories
insert into
  categories (name, description, user_id)
values
  (
    'Software Development',
    'All software related services',
    1
  ),
  (
    'Medical Services',
    'Healthcare and medical services',
    2
  );

-- Insert sample data into services
insert into
  services (name, prices, percentage, status, user_id)
values
  ('Web Development', 1500.00, 10, 'active', 1),
  ('Consultation', 200.00, 5, 'inactive', 2);

-- Insert sample data into category_service
insert into
  category_service (category_id, service_id)
values
  (1, 1),
  (2, 2);

-- Insert sample data into clients
insert into
  clients (name, email, phone, user_id)
values
  (
    'Charlie Brown',
    'charlie@example.com',
    '555-9876',
    1
  ),
  (
    'Diana Prince',
    'diana@example.com',
    '555-4321',
    2
  );

-- Insert sample data into reservations
insert into
  reservations (
    start_date,
    end_date,
    status,
    payment,
    client_id,
    user_id
  )
values
  (
    '2023-11-01 10:00:00+00',
    '2023-11-01 12:00:00+00',
    'reserved',
    1500.00,
    1,
    1
  ),
  (
    '2023-11-02 14:00:00+00',
    '2023-11-02 15:00:00+00',
    'done',
    200.00,
    2,
    2
  );

-- Insert sample data into reservation_service
insert into
  reservation_service (reservation_id, service_id)
values
  (1, 1),
  (2, 2);

-- Insert sample data into organization_users
insert into
  organization_users (user_id, organization_id, role)
values
  (1, 1, 'owner'),
  (2, 2, 'owner');