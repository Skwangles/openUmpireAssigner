## Umpires:
The umpires CSV, the only thing I don't have going with it is all the 'Teams' in the CSV don't correspond 1-for-1 with the actual team names, so they won't actually be considered - Jordan Walker does, so you can see what I mean.
I've gone through the Excel you sent me and put in the Levels for each umpire, you can kind of see how I've designed it - any columns with more than one thing needs to be comma separated.

## Games:
I have built the system to use the CSVs provided by playHQ, so theoretically any CSV of that format should do.
I have done some shortening things, like turf names from 'Lugtons Turf 2' -> 'Turf 2', or 'MR3 Super Long Name' -> "M3" - you should use the shortened ones if you are customising the Umpires CSV

## Features to come:
Specificable game length blockout (current is 75mins - 16x4 + 9mins break + 5 mins breathing room)

## Instructions for use:
- You need to load in the two CSVs i've provided you, in the top left of the tool, the 'Round 2 final 3 games Reserve.csv' is exactly the same as the one you sent me, so theoretically you could test it with any of those. (The third option is if you have 2 game list CSVs that you want to do simultaneously, for example, Mens and Womens come separately).
- The 'umpires list' csv is in a specialised format (i.e. the column names should not be touched), based on how the system works.
- You can modify the umpires information as you desire, but the important thing is anything >1 items has comma separated, and 'Grades' are M1, M2, M3, W1, W2, and All, (You can put anything else in here like 'out', but it will be ignored) - I haven't yet added support for prems as I need an example CSV to implement that.
- The 'Teams', 'Restricted Turfs' need to be 1-for-1 how they would appear in the draw, as I use a direct comparison - for testing I've loaded Jordan Walker's profile with the correct Team name so you can see what I mean - I just haven't gotten round to manually updating all of them
- To assign an umpire to a game, you drag and drop their row into the desired box (if you need to clear an accidental drop, drag and drop the special entry at the top of the 'umpires' list to clear)
- To see which games an umpire can umpire just click on them (umpire highlight mode - default), and the games should gray-out ---- alternatively --- you can click the 'game' highlight mode to click on the game, and gray-out the unavailable umpires

## Info on operation:
- Once you start a 'drag' that umpire you are dragging will be set as the 'selected' umpire & thus will filter the games accordingly
- Games of a 'incapable' Grade are determined based on if the grade name matches e.g. 'M1' or 'M2' - (FYI I convert the long MR2 x y z names -> M2)
- I strip the Turf names to just include the 'Turf #' and 'St Pauls' - so if you are adding those to 'Restricted Turf', make sure these are the values you put - I need an example of 'St Peters' in the CSV to properly parse it
- The blocking is based on any part of the game overlapping within 60 minutes of the start of the game (in future will provide an option to tweak this) - Date must match
- Games are 'eliminated' in the following order 1. Are they playing, 2. Does time overlap with one of the games they are playing in, 3. Is it one of their 'Levels' they can/want to umpire, 4. can they make the turf

## Steps:
1. Add umpires csv to 'file' input in top left
2. Add Games csv to 'file' input in the top left
3. (Optional) Add a second Games CSV - If you have womens/mens separately, or two different tournaments in different files
4. Drag and drop umpire columns into the'ump1' and 'ump2' columns to assign them (Disable by umpire is by default)
5. Click 'filter by game' to have the umpire rows grayed-out if unavailable for a particular game
6. Click 'Clear gray' to remove the selections

