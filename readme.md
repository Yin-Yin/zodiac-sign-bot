# Zodiac Sign Bot #
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
The bot can give you horoscopes. Type "horoscope" to get the horoscope for pisces. The horoscopes are fetched from this API: http://sandipbgt.com/theastrologer-api/.
**Input Examples**: "horoscope pisces"; *with context*: "horoscope"

5. **Help**
I tried to make the help useful by providing quick actions that guide the user to the most important functionalities of the bot.
**Input Examples**: "help"

6. **Small Talk:**
The bot also knows a bit of small talk.
**Input Examples**: "Hi", "Tell me a joke,", "How are you?"

The code here on github is the webhook for dialogflow (api.ai). Dialogflow (api.ai) provides all the natural language processing and chat functionality for the user. This webhook provides all the additional functionality like calculating the zodiac signs for the provided dates.

**Known bugs**: 
- When there are quick actions visible and you are away for more than 10 (?) minutes the context is lost and the user will be asked for input again. 
- If there is no zodiac-sign context and the info intent is triggered by typing "info", the user is aske for a zodiac sign. Most inputs are fine, but if the user inputs "cancel" a request to the backend is send and the quick reply for a horoscope is returned. -> When we input "stop" it works and the question is cancelled. I think the problem is that "cancel" is very close to "cancer" and the machine learning model is confused.

**Improvements**
- Make quick responses smarter: I would like to not show the quick responses all the time. For example if I press the quick response for horoscope and then when I get the horoscope I press the info button, under the info text the horoscope button will appear again. I don't want to show the button again in this case, because it is redundant and gets the user in a kind of loop. 
- A way to achieve this would be to memorize which button we have shown with an output context. Or remember in the context out which button we don't want to show for the next 3 or something times. A concern about this is that the code gets really complicated. Also is this transparent for the user?
- I like the idea to give feedback directly from the chatbot itself.
- From the UX perspective it would be desirable to have a consistent feel to the chatbot. Like having the same type of pictures and same type of texts for all responses.

**to dos**:
- improve texts of zodiac signs
- improve pictures of zodiac signs: get smaller sizes of pictures to save bandwith of users and host them on own server to avoid hotlinking
- Code enhancements: Make functions smaller - only one functionality per function, for example: getting the contexts out