# Stop Thief: Electronic Cops and Robbers: Electronic Crime Scanner App

Web app that recreates the behavior of the Electronic Crime Scanner(TM) from the board game Stop Thief: Electronic Cops and Robbers published by Parker Brothers in 1979.

# Demo

http://wolfesoftware.com/stop-thief/

![screenshot](https://user-images.githubusercontent.com/87436/209446532-e92e00e8-7ca4-4a80-af9b-c5ae896d1030.png)

# Roadmap

## 1.1

Better feature parity with the original device:

* Press number buttons to replay recent history.
* Building/street numbers no longer hidden during RUN.
* (Sound test mode???)

# Version History

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
