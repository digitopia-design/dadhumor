-- ============================================================
-- dadhumor.app - Seed Data: 50 Dad Jokes
-- ============================================================
-- Run this in the Supabase SQL Editor.
-- Assumes the schema alterations below have been applied.
-- ============================================================

-- Step 1: Add category and rating columns (run once)
alter table jokes add column if not exists category text;
alter table jokes add column if not exists rating text default 'G';

-- Step 2: Insert 50 jokes
insert into jokes (setup, punchline, category, rating) values

-- ========== PUNS (15) ==========
('I told my wife she was drawing her eyebrows too high.', 'She looked surprised.', 'pun', 'G'),
('Why don''t scientists trust atoms?', 'Because they make up everything.', 'pun', 'G'),
('I''m reading a book about anti-gravity.', 'It''s impossible to put down.', 'pun', 'G'),
('What do you call a fake noodle?', 'An impasta.', 'pun', 'G'),
('Why did the scarecrow win an award?', 'He was outstanding in his field.', 'pun', 'G'),
('I used to hate facial hair.', 'But then it grew on me.', 'pun', 'G'),
('What do you call cheese that isn''t yours?', 'Nacho cheese.', 'pun', 'G'),
('Why don''t eggs tell jokes?', 'They''d crack each other up.', 'pun', 'G'),
('I only know 25 letters of the alphabet.', 'I don''t know y.', 'pun', 'G'),
('What did the ocean say to the shore?', 'Nothing, it just waved.', 'pun', 'G'),
('Why did the math book look sad?', 'Because it had too many problems.', 'pun', 'G'),
('I''m terrified of elevators.', 'I''m taking steps to avoid them.', 'pun', 'G'),
('What do you call a bear with no teeth?', 'A gummy bear.', 'pun', 'G'),
('Why don''t skeletons fight each other?', 'They don''t have the guts.', 'pun', 'G'),
('I would tell you a construction joke, but', 'I''m still working on it.', 'pun', 'G'),

-- ========== WORDPLAY (10) ==========
('Did you hear about the guy who invented Lifesavers?', 'They say he made a mint.', 'wordplay', 'G'),
('I''m on a seafood diet.', 'I see food and I eat it.', 'wordplay', 'G'),
('What do you call a dinosaur with an extensive vocabulary?', 'A thesaurus.', 'wordplay', 'G'),
('Why did the coffee file a police report?', 'It got mugged.', 'wordplay', 'G'),
('How does a penguin build its house?', 'Igloos it together.', 'wordplay', 'G'),
('What do you call a factory that makes okay products?', 'A satisfactory.', 'wordplay', 'G'),
('I don''t trust stairs.', 'They''re always up to something.', 'wordplay', 'G'),
('Why did the bicycle fall over?', 'Because it was two-tired.', 'wordplay', 'G'),
('What do you call a sleeping bull?', 'A bulldozer.', 'wordplay', 'G'),
('How do you organise a space party?', 'You planet.', 'wordplay', 'G'),

-- ========== ANTI-HUMOUR (8) ==========
('I was going to tell a time-travelling joke...', 'But you didn''t like it.', 'anti-humour', 'G'),
('My wife told me to stop acting like a flamingo.', 'I had to put my foot down.', 'anti-humour', 'G'),
('I bought shoes from a drug dealer.', 'I don''t know what he laced them with, but I''ve been tripping all day.', 'anti-humour', 'PG'),
('I told my suitcases there would be no vacation this year.', 'Now I''m dealing with emotional baggage.', 'anti-humour', 'G'),
('Why did I divorce my wife?', 'She kept making me things like ''The Wrong Sandwich.'' I wanted ham. She made tuna.', 'anti-humour', 'G'),
('I just got fired from the calendar factory.', 'All I did was take a day off.', 'anti-humour', 'G'),
('My therapist says I have a preoccupation with vengeance.', 'We''ll see about that.', 'anti-humour', 'PG'),
('I''m writing a book about reverse psychology.', 'Please don''t buy it.', 'anti-humour', 'G'),

-- ========== OBSERVATIONAL (8) ==========
('Whoever invented the knock knock joke...', 'Should get a no-bell prize.', 'observational', 'G'),
('My dog used to chase people on a bike a lot.', 'It got so bad I had to take his bike away.', 'observational', 'G'),
('Parallel lines have so much in common.', 'It''s a shame they''ll never meet.', 'observational', 'G'),
('The shovel was a groundbreaking invention.', 'But everyone was blown away by the leaf blower.', 'observational', 'G'),
('I used to be a banker.', 'But I lost interest.', 'observational', 'G'),
('Velcro - what a rip off.', '', 'observational', 'G'),
('The rotation of Earth really makes my day.', '', 'observational', 'G'),
('I''m reading a book on the history of glue.', 'I just can''t seem to put it down.', 'observational', 'G'),

-- ========== SO BAD THEY'RE GOOD (9) ==========
('What''s brown and sticky?', 'A stick.', 'so-bad', 'G'),
('Why can''t you hear a pterodactyl go to the bathroom?', 'Because the P is silent.', 'so-bad', 'PG'),
('What do you call a pile of cats?', 'A meow-tain.', 'so-bad', 'G'),
('Why did the golfer bring two pairs of trousers?', 'In case he got a hole in one.', 'so-bad', 'G'),
('What did the buffalo say to his son when he left for college?', 'Bison.', 'so-bad', 'G'),
('What''s orange and sounds like a parrot?', 'A carrot.', 'so-bad', 'G'),
('Why did the cookie go to the hospital?', 'Because he felt crummy.', 'so-bad', 'G'),
('What do you get when you cross a snowman with a vampire?', 'Frostbite.', 'so-bad', 'G'),
('Did you hear the rumour about butter?', 'Well, I''m not going to spread it.', 'so-bad', 'G');

-- ============================================================
-- Verify the insert
-- ============================================================
select category, count(*) as total from jokes group by category order by category;
-- Expected: anti-humour 8, observational 8, pun 15, so-bad 9, wordplay 10 = 50
