\c agenda-db
create table organizations (
  id bigint primary key generated always as identity,
  name text,
  industry text,
  phone text,
  address text,
  num_employees int,
  created_at timestamp default null,
  updated_at timestamp default null
);

create table users (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null unique,
  password text not null,
  type_of_user text check (type_of_user in ('individual', 'organization')) not null,
  phone text default null,
  is_active text check (is_active in ('actived', 'disabled')) default 'disabled',
  hash_account text default null,
  is_validated text check (is_validated in('Y','N')) default 'N',
  created_at timestamp default null,
  updated_at timestamp default null
);

create table categories (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  user_id bigint default null,
  organization_id bigint default null,
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint categories_user_organization_check check (
    (
      user_id is not null
      and organization_id is null
    )
    or (
      user_id is null
      and organization_id is not null
    )
  ),
  constraint categories_user_id_foreign foreign key (user_id) references users (id) on delete cascade,
  constraint categories_organization_id_foreign foreign key (organization_id) references organizations (id) on delete cascade
);

create table services (
  id bigint primary key generated always as identity,
  name text not null,
  prices numeric(8, 2) not null,
  percentage int default null,
  status text check (status in ('active', 'inactive')) default 'inactive',
  user_id bigint default null,
  organization_id bigint default null,
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint services_user_organization_check check (
    (
      user_id is not null
      and organization_id is null
    )
    or (
      user_id is null
      and organization_id is not null
    )
  ),
  constraint services_user_id_foreign foreign key (user_id) references users (id) on delete cascade,
  constraint services_organization_id_foreign foreign key (organization_id) references organizations (id) on delete cascade
);

create table category_service (
  id bigint primary key generated always as identity,
  category_id bigint not null,
  service_id bigint not null,
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint category_service_category_id_foreign foreign key (category_id) references categories (id) on delete cascade,
  constraint category_service_service_id_foreign foreign key (service_id) references services (id) on delete cascade
);

create table clients (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null,
  phone text not null,
  user_id bigint default null,
  organization_id bigint default null,
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint clients_user_organization_check check (
    (
      user_id is not null
      and organization_id is null
    )
    or (
      user_id is null
      and organization_id is not null
    )
  ),
  constraint clients_user_id_foreign foreign key (user_id) references users (id) on delete cascade,
  constraint clients_organization_id_foreign foreign key (organization_id) references organizations (id) on delete cascade
  
);

create unique index unique_email_per_user on clients (email, user_id) where user_id is not null;
create unique index unique_email_per_organization on clients (email, organization_id) where organization_id is not null;

create table reservations (
  id bigint primary key generated always as identity,
  start_date timestamptz default null,
  end_date timestamptz default null,
  canceled_date timestamptz default null,
  note text,
  status text check (status in ('done', 'reserved', 'canceled')) default 'reserved',
  payment numeric(8, 2) not null,
  bgcolor text default null,
  hashsee text default null,
  client_id bigint not null,
  user_id bigint default null,
  organization_id bigint default null,
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint reservations_client_id_foreign foreign key (client_id) references clients (id) on delete cascade,
  constraint reservations_user_organization_check check (
    (
      user_id is not null
      and organization_id is null
    )
    or (
      user_id is null
      and organization_id is not null
    )
  ),
  constraint reservations_user_id_foreign foreign key (user_id) references users (id) on delete cascade,
  constraint reservations_organization_id_foreign foreign key (organization_id) references organizations (id) on delete cascade
);

create table reservation_service (
  id bigint primary key generated always as identity,
  reservation_id bigint not null,
  service_id bigint not null,
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint reservation_service_reservation_id_foreign foreign key (reservation_id) references reservations (id) on delete cascade,
  constraint reservation_service_service_id_foreign foreign key (service_id) references services (id) on delete cascade
);

create table organization_users (
  id bigint primary key generated always as identity,
  user_id bigint,
  organization_id bigint,
  role text check (role in ('owner', 'employee')),
  created_at timestamp default null,
  updated_at timestamp default null,
  constraint organization_users_user_id_foreign foreign key (user_id) references users (id),
  constraint organization_users_organization_id_foreign foreign key (organization_id) references organizations (id)
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL, -- Token JWT o UUID para identificar la sesión
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP, -- Se completa cuando el usuario cierra sesión
    revoked BOOLEAN DEFAULT FALSE, -- Si está en TRUE, indica que la sesión fue revocada
    FOREIGN KEY (user_id) REFERENCES users(id)
);