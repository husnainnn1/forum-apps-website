# Create database script for myforum app

#CREATE DATABASE myforum;

# Create the database
USE myforum;

# Create the app user and give it access to the database
CREATE USER 'new.user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2028';
GRANT ALL PRIVILEGES ON myforum.* TO 'new.user'@'localhost';

# Remove the tables if they already exist
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS membership;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS topic;

# Create the tables
CREATE TABLE user (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(15) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    email VARCHAR(45),
    PRIMARY KEY(user_id)
);

# Create the topics table to store a list of topics 
CREATE TABLE topic (
    topic_id INT NOT NULL AUTO_INCREMENT,
    topic_name VARCHAR(20),
    topic_description VARCHAR(100),
    PRIMARY KEY(topic_id)
);

# Create the membership table to say which users are members of which topics
CREATE TABLE membership (
    user_id INT,
    topic_id INT,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

# Create a posts table to store the user posts
CREATE TABLE posts (
	post_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    post_date DATETIME,
    post_title VARCHAR(30),
    post_content MEDIUMTEXT,
    user_id INT,
    topic_id INT,
    PRIMARY KEY(post_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
);

