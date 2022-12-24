# Stop Thief: Electronic Cops and Robbers: Electronic Crime Scanner App

Web app that recreates the behavior of the Electronic Crime Scanner(TM) from the board game Stop Thief: Electronic Cops and Robbers published by Parker Brothers in 1979.

# Demo

http://wolfesoftware.com/stop-thief/

# Status

Mechanically, the app is technically feature complete, but looks terrible and has numerous usability issues.

* TODO: persist game state through refreshes.
* TODO: allow starting a new game without refreshing the page, including after a successful (and compliant) arrest.
    * TODO: game starts on new game button, not on Clue button.
* TODO: (optional) adjust AI to enable circling crime spaces but not moving away rather than immediately moving into them.
* TODO: thief should exit the subway immediately after entering it, not waiting for another clue.

# License

As far as I can tell, the trademarks and copyrights for the original game have expired.

This web app is under the MIT License.

Thanks to [Board Game Museum on YouTube](https://www.youtube.com/watch?v=WSwJkaSFeYc) for providing a recording of playing the game,
which I used as a reference to recreate all the sounds in this app using JavaScript and math.
