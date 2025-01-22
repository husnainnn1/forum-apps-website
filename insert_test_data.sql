# Insert data into the tables

USE myforum;

INSERT INTO user (user_id,full_name,username,email)
VALUES(1, 'daniel','daniel1','daniel123@outlook.com'),
      (3, 'fred','fred1','fred1@outlook.com'),
      (4, 'anna','anna2','anna@gmail.com');

INSERT INTO topic (topic_id,topic_name,topic_description )
VALUES (1, 'fruit','Advice on fruits'),
       (2, 'vegetables','About Vegetables'),
       (3, 'cars','Car brands'),
       (4,'books','Favourite Books'),
       (5, 'music','Artist songs');

INSERT INTO myforum.membership(user_id,topic_id)
VALUES(1,1),
      (1,2),
      (1,3);

INSERT INTO myforum.membership(user_id,topic_id)
VALUES(3,1),
      (3,4),
      (3,5);

INSERT INTO myforum.membership(user_id,topic_id)
VALUES(4,1);

INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
VALUES ('2023-12-12 12:53', 'How to peel an orange', 'What is the best way to peel an orange?', 1, 1);

INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
VALUES ('2023-12-15 10:34', "Cutting vegetables", "Which is the correct way?", 1, 2);

INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
VALUES ('2023-12-11 16:26', "How to peel a grape", "Is this even possible?", 3, 1);

INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
VALUES ('2023-12-06 17:01', "Favourite books", "I like reading educational books", 3, 4);

INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
VALUES ('2023-12-01 19:45', "Is apple a fruit", "I urgently need more information on fruits", 4, 1);

INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
VALUES ('2023-12-08 13:32', "Car brands", "List of all car brands as if 2023", 1, 3);



SELECT username,topic.topic_name FROM user
JOIN membership
ON membership.user_id=user.user_id
JOIN topic
ON membership.topic_id=topic.topic_id