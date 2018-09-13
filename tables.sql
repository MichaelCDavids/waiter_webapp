drop table if exists staff,weekdays,shifts;

create table staff
(
    id serial primary key not null,
    first_name text not null,
    username text not null UNIQUE
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

INSERT into staff (first_name, username) values ('Michael','Mike');
INSERT into staff (first_name, username) values ('Vusi','Vtrev');
INSERT into staff (first_name, username) values ('Sibabalwe','Siba');
INSERT into staff (first_name, username) values ('Unalo','Tso');
INSERT into staff (first_name, username) values ('Cwenga','Schtoo');
INSERT into staff (first_name, username) values ('Pumlani','Lani');

INSERT into weekdays (day_name) values ('Sunday');
INSERT into weekdays (day_name) values ('Monday');
INSERT into weekdays (day_name) values ('Tuesday');
INSERT into weekdays (day_name) values ('Wednesday');
INSERT into weekdays (day_name) values ('Thursday');
INSERT into weekdays (day_name) values ('Friday');
INSERT into weekdays (day_name) values ('Saturday');