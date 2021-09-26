CREATE TABLE ticket_settings(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    guild varchar(255) DEFAULT 'None Set',
    channel varchar(255) DEFAULT 'None Set',
    message_id varchar(255) DEFAULT 'None Set',
    descr varchar(255) DEFAULT 'None Set',
    button_id varchar(255) DEFAULT 'None Set'
);

CREATE TABLE open_tickets(
    user varchar(255) DEFAULT 'None Set',
    usertag varchar(255) DEFAULT 'None Set',
    channel varchar(255) DEFAULT 'None Set',
    time_open varchar(255) DEFAULT 'None Set',
    ticket_id varchar(255) DEFAULT 'None Set'
);
