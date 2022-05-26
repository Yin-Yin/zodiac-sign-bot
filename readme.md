# Zodiac Sign Bot #
Fullfillment webhook for the dialogflow api.

# DEPRECATED #
Due to many changes to dialogflow, this project is put on ice. It was a fun idea and nice to see it in the wild. However the value it gives to the world in relation to the costs does not make it feasible anymore. Anyway, it was just a fun project. 



This conversational chatbot teaches the user all about zodiac signs. 

You can talk to the bot on Telegram: _'@zodiacsignbot'_ and on kik: _'zodiacsignbot'_.
A web demo of the bot can be found here: https://bot.dialogflow.com/zodiacsignbot.

The bot can do the following at the moment: 

1. **Get the zodiac sign for a date:**
Input a date and the bot will calculate the zodiac sign for that date.
**Input Examples**: "April 20", "Get the zodiac sign for April 20th", "12.03.2003", "11/02/1992", "September five", etc. 

2. **Get information about a zodiac sign:**
Provide a specific zodiac sign to get information about this zodiac sign. To have a simpler user experience you can choose from a list by typing "list" or "choose from list" If you have provided a date or a zodiac sign before the last zodiac sign from the context will be taken. Then it is enough to just write: "info"
**Input Examples**: "Aries", "Tell me something about pisces.", "info taurus"; *with context*: "info", "information"

3. **Get the chinese zodiac sign for a year or age:**
Give the bot a year or an age, and the bot will thell you the correlating chinese zodiac sign for this date. Chinese zodiac signs repeat every 12 years and are dependent on the year you are born.
**Input Examples**: "1992", "21", "age 41" "chinese zodiac 1965"; *with context*: "chinese zodiac"

4. **Horoscope.**
The bot can give you horoscopes. Type "horoscope" to get the horoscope for pisces. The horoscopes are fetched from this API: http://sandipbgt.com/theastrologer-api/ (which fetches horoscopes from https://new.theastrologer.com/).
**Input Examples**: "horoscope pisces"; *with context*: "horoscope"

5. **Help**
I tried to make the help useful by providing quick actions that guide the user to the most important functionalities of the bot.
**Input Examples**: "help"

6. **Small Talk:**
The bot also knows a bit of small talk.
**Input Examples**: "Hi", "Tell me a joke,", "How are you?"

The code here on github is the webhook for dialogflow (api.ai). Dialogflow (api.ai) provides all the natural language processing and chat functionality for the user. This webhook provides all the additional functionality like calculating the zodiac signs for the provided dates.

**Known bugs**
- When there are quick actions visible and you are away for more than 10 (?) minutes the context is lost and the user will be asked for input again. This is a limitation from the dialogflow plattform and cannot easily be avoided at the moment.
- Telegram: the buttons are cut off, when there are more than I think three buttons on the screen. Could be avoided by sending specific payload with instructions for Telegram. (Fixed for the 'help' command)

**Improvements**
- I like the idea to give feedback directly from the chatbot itself.
- UX improvement: it would be desirable to have a consistent feel to the chatbot. Like having the same type of pictures and same type of texts for all responses.
- Daily Horoscope: Sending a daily horoscope to the user would be a great feature. However for this we would need persistence, which would require a database.
- New feature idea: compability of star signs

**to dos**
- Improve texts of quick reply buttons (the same text for all quickreply-texts to make it easier for the user to choose)
- Improve texts of zodiac signs
- Improve pictures of zodiac signs: get smaller sizes of pictures to save bandwith of users 
- Host the pictures on own server to avoid hotlinking
- Code enhancements: 
    - Make functions smaller - only one functionality per function, for example: getting the contexts out
    - don't build the response in index.js - prone to errors
    - clearer separation of responsibilities - have express in own folder/file
 
**Questions**
- __Deplyoment__: I received a question about an error about an error on deployment: As far as I could tell the code was deployed on google. I have deployed this code only on Heroku, where it was working like this. If you want to deploy it on another plattform the configuration might need to be adapted.
