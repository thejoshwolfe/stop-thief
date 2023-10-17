# Stop Thief: Electronic Cops and Robbers: Electronic Crime Scanner App

Web app that recreates the behavior of the Electronic Crime Scanner(TM) from the board game Stop Thief: Electronic Cops and Robbers published by Parker Brothers in 1979.

# Demo

http://wolfesoftware.com/stop-thief/

![screenshot](https://user-images.githubusercontent.com/87436/209446532-e92e00e8-7ca4-4a80-af9b-c5ae896d1030.png)

# Version History

## 1.3.1

* Fix bug where it was impossible to type in the number spinner.

## 1.3

* Added a house rule option to make the thief get tired after running too much.

## 1.2

* Added an option to force the thief to move to a new space after riding the SUBWAY.

## 1.1

Better feature parity with the original device:

* Press number buttons to replay recent history.
* Building/street numbers no longer hidden during RUN.
* Sound test mode. Press number buttons while game is not in progress (before pressing ON). The numbers play these sounds:
    1. `-Cr` Crime
    2. `-Fl` Floor
    3. `-dr` Door
    4. `-Gl` Window
    5. `-St` Street
    6. `-Sb` Subway
    7. `PL`, `--` Arrest (Wrong)
    8. `PL`, `Ar` Arrest (Comply)
    9. `PL`, `rn` Arrest (Run)

Changed features from the device:

* Pressing ON while the game is running prompts to abandon current game, and then turns off the current game (like the old OFF button). This can be useful to get back to sound test mode. (Previously in 1.0, the ON button during a game would start a new game without stopping in the intermediate no-game state.)
* (Difficult to verify) The number buttons replaying the clue history for a subway ride will include *only* the subway ride itself, not the street clue after exiting the subway; the street clue is the next numbered clue instead. This means that subway+street is a time (the only time) when two clues are added to the history for a single press of the CLUE button. (The subway ride does not count against the 5 or 6 times the thief does a MOVE after a RUN from a CORRECT ARREST.) A future improvement would probably be to effectively glue together the subway ride and the following street clue in the clue history and replay both with a single number press.

Minor updates:

* The default UI state is to hide all UI elements. I don't think people need to be shown the movement rules and probabilities by default. With the addition of the number keys for clue history, there is less need for a clue history in the settings panel, so that's hidden by default too. With the addition of a sound test mode, there is less need for verbose English descriptions of the LCD-and-sound clues.

## 1.0

Almost feature parity with the original device.
I'm not totally certain about the AI movement rules, because I don't have a working device to test with.
The random probabilities are all configured in the user interface in the settings.

Additional features this app adds:

* Option to disable sound.
* Game state and settings persist through page refreshes (using `localStorage`).
* Debug view that shows the thief moving through the map (spoilers).
* Adjustable probabilities as described above.
* Faster LCD blink cycle with more on time than off time. Should help readability.
* Additional intermediate LCD displays during animations such as the arrest sequence or using the subway. Should help the hearing impaired maybe.
* A full history of clues with plain English descriptions available in the settings in case you miss something (not spoilers).
* Keyboard hotkeys including number keys and Backspace support when entering the arrest prompt.
* Sound test UI for just playing the sounds.

Changed features relative to the original device:

* OFF button replaced by Settings button.
* ON button starts a new game, with confirmation prompt when you're mid-game.
* Building/street numbers are hidding during a RUN. This was an intentional albeit misguided attempt to be faithful to the original device based on a misunderstanding. (Fixed in version 1.1.)

Features missing relative to the original device:

* Press number buttons to replay recent clue history. (Added in version 1.1.)
* Sound test mode.

# License

As far as I can tell, the trademarks and copyrights for the original game have expired.

This web app is under the MIT License.

Thanks to [Board Game Museum on YouTube](https://www.youtube.com/watch?v=WSwJkaSFeYc) for providing a recording of playing the game,
which I used as a reference to recreate all the sounds in this app using JavaScript and math.
