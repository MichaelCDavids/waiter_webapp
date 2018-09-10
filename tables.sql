drop table if exists staff,weekdays,shifts;

create table staff
(
    id serial primary key not null,
    first_name text not null
);

create table weekdays
(
    id serial primary key not null,
    day_name text not null
);


create table shifts(
    id serial primary key not null,
    waiter_id int not null,
    weekday_id int not null,
    foreign key (waiter_id) references staff(id),
    foreign key (weekday_id) references weekdays(id)
);

INSERT into staff (first_name) values ('Michael');
INSERT into staff (first_name) values ('Unalo');
INSERT into staff (first_name) values ('Vusi');
INSERT into staff (first_name) values ('Schtoo');
INSERT into staff (first_name) values ('Pumlani');
INSERT into staff (first_name) values ('Lwando');
INSERT into staff (first_name) values ('Sibabalwe');

INSERT into weekdays (day_name) values ('Sunday');
INSERT into weekdays (day_name) values ('Monday');
INSERT into weekdays (day_name) values ('Tuesday');
INSERT into weekdays (day_name) values ('Wednesday');
INSERT into weekdays (day_name) values ('Thursday');
INSERT into weekdays (day_name) values ('Friday');
INSERT into weekdays (day_name) values ('Saturday');
