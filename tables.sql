drop table if exists staff,weekdays,shifts;

create table staff
(
    id serial primary key not null,
    first_name text not null,
    position text not null
);

create table weekdays
(
    id serial primary key not null,
    week_days text not null
);

create table shifts
(
    id serial primary key not null,
    waiter_id int not null,
    shift_id int not null,
    foreign key (waiter_id) references staff(id),
    foreign key (shift_id) references weekdays(id)
);

INSERT into staff (first_name, position) values ('Michael','Owner');
INSERT into staff (first_name, position) values ('Unalo','Waiter');
INSERT into staff (first_name, position) values ('Vusi','Waiter');
INSERT into staff (first_name, position) values ('Schtoo','Waiter');
INSERT into staff (first_name, position) values ('Pumlani','Waiter');
INSERT into staff (first_name, position) values ('Lwando','Waiter');
INSERT into staff (first_name, position) values ('Sibabalwe','Waiter');

INSERT into weekdays (week_days) values ('Sunday');
INSERT into weekdays (week_days) values ('Monday');
INSERT into weekdays (week_days) values ('Tuesday');
INSERT into weekdays (week_days) values ('Wednesday');
INSERT into weekdays (week_days) values ('Thursday');
INSERT into weekdays (week_days) values ('Friday');
INSERT into weekdays (week_days) values ('Saturday');