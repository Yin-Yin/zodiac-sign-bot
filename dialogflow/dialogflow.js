/*

'use strict';
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const zodiacSignModule = require('../zodiac-sign/zodiac-sign.js')

module.exports = {
    handleRequest: (request, response) => {
        const agent = new WebhookClient({ request, response });

        // An action is a string used to identify what needs to be done in fulfillment
        let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
        // Parameters are any entites that Dialogflow has extracted from the request.
        let parameters = request.body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
        // Contexts are objects used to track and store conversation state
        let inputContexts = request.body.queryResult.contexts; // https://dialogflow.com/docs/contexts
        // Get the request source (Google Assistant, Slack, API, etc)
        let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined;
        // Get the session ID to differentiate calls from different users
        let session = (request.body.session) ? request.body.session : undefined;

        let intent = request.body.queryResult.intent.displayName; // toDo: is it cleaner to add here something in case it is undefined?

        console.log("intent:" + " ---------------- " + intent + " ---------------- ")

        // Uncomment and edit to make your own intent handler
        // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
        // below to get this function to be run when a Dialogflow intent is matched
        function yourFunctionHandler(agent) {
            agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
            agent.add(new Card({
                title: `Title: this is a card title`,
                imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
                text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
                buttonText: 'This is a button',
                buttonUrl: 'https://assistant.google.com/'
            }));
            agent.add(new Suggestion(`Quick Reply`));
            agent.add(new Suggestion(`Suggestion`));
            agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
        }

        /* 
        If a user enters a date we calculate the zodiac sign.
        */
        function zodiacCheck(agent) {

            let date = parameters.date;
            console.log("get zodiac for date: " + date);

            let zodiacSign = zodiacSignModule.getZodiacSign(date);

            let responseMessageText = "Your zodiac sign is " + zodiacSign + "."
            agent.add(responseMessageText);

            //let quickRepliesTitle = "To find out more about " + zodiacSign + ", select from the buttons below.";
            //let quickRepliesButtons = '';

            //let contextOut = [];
            //let zodiacSignParameters = { "zodiacsign": zodiacSign }
            //contextOut.push(this.getContextOutObject("zodiac-sign", zodiacSignParameters, 4))
            agent.setContext({ name: 'zodiac-sign', lifespan: 4, parameters: { "zodiacsign": zodiacSign } });

            // also get chinese zodiac sign if a date in the past is provided
            let parameterDate = new Date(date);
            let currentYear = new Date().getFullYear();
            let dateYear = parameterDate.getFullYear();
            if (dateYear < currentYear) { // if a year is provided that is in the past give the user also the option to find out about the chinese zodiac sign of that year
                agent.add(new Suggestion(`Horoscope`));
                agent.add(new Suggestion(`Info`));
                agent.add(new Suggestion(`Chinese zodiac`));
                // quickRepliesButtons = ["Horoscope", "Info", "Chinese zodiac"]
                // save the year as context that is available later for querying the chinese zodiac
                //let yearParameters = { "age": { "amount": dateYear } }
                //contextOut.push(this.getContextOutObject("year", yearParameters, 3))
                agent.setContext({ name: 'year', lifespan: 3, parameters: { "age": { "amount": dateYear } } });
            }
            else { // make sure there is no year context if no year is given by the user
                agent.add(new Suggestion(`Horoscope`));
                agent.add(new Suggestion(`Info`));
                //quickRepliesButtons = ["Horoscope", "Info"]
                //let yearParameters = { "age": { "amount": dateYear } }
                //contextOut.push(this.getContextOutObject("year", yearParameters, 0))
                agent.setContext({ name: 'year', lifespan: 0, parameters: { "age": { "amount": dateYear } } });
            }
            /*
            response.speech = responseMessageText
            response.displayText = responseMessageText
            response.messages = [this.getResponseMessageObject(responseMessageText), this.getQuickRepliesObject(quickRepliesTitle, quickRepliesButtons)];
            response.contextOut = contextOut;
            return response;



            agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
            agent.add(new Card({
                title: `Title: this is a card title`,
                imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
                text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
                buttonText: 'This is a button',
                buttonUrl: 'https://assistant.google.com/'
            }));
            agent.add(new Suggestion(`Quick Reply`));
            agent.add(new Suggestion(`Suggestion`));
            agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
            */
        }

        /* 
        Give the user a picture and information about a zodiac sign. 
        */
       /*
        function zodiacInfo(agent) {
            let zodiacSign = parameters.zodiacsign;
            console.log("getting infor for zodiac sign: ", zodiacSign);
            let contexts = inputContexts;
            console.log("getting infor for context: ", contexts);

            //     getZodiacSignInfoResponse: function(zodiacSign, contexts) {
            let responseMessageText = zodiacSignModule.getZodiacSignInfo(zodiacSign);
            let zodiacSignPicturUrl = zodiacSignModule.getZodiacSignPictureUrl(zodiacSign); //toDo: rename to Image to be conssitent


            //let quickRepliesTitle = "Select 'horoscope' below or type it out to get the horoscope for " + zodiacSign + "."
            //let quickRepliesButtons = ["Horoscope"]
            agent.add(new Suggestion(`Horoscope`));

            // add more quick reply buttons if a context is given
            for (var i = 0; i < contexts.length; i++) {
                if (contexts[i].name === "year") {
                    // quickRepliesButtons.push("Chinese Zodiac")
                    agent.add(new Suggestion(`Chinese Zodiac`));
                    //quickRepliesTitle = "You can get the horoscope for " + zodiacSign + " or find out the Chinese Zodiac Sign for the date. (Tap on one of the buttons below.)"
                }
            }

            let zodiacSignParameters = { "zodiacsign": zodiacSign }

            //response.speech = responseMessageText;
            //response.displayText = responseMessageText;
            //response.messages = [this.getImageObject(zodiacSignPicturUrl), this.getResponseMessageObject(responseMessageText), this.getQuickRepliesObject(quickRepliesTitle, quickRepliesButtons)];
            agent.add(new Card({
                title: zodiacSign,
                imageUrl: zodiacSignPicturUrl,
                text: responseMessageText
            }));
            // response.contextOut = [this.getContextOutObject("zodiac-sign", zodiacSignParameters, 4)]
            agent.setContext({ name: 'zodiac-sign', lifespan: 4, parameters: { "zodiacsign": zodiacSign } });
            //return response;
            //},

        }


        function zodiacInfoContext(agent) {
            //parameters.zodiacsign, contexts
            inputContexts

            /*
            let chineseZodiacSign = zodiacSignModule.getChineseZodiacSign(year);
            let chineseZodiacSignPicturUrl = zodiacSignModule.getChineseZodiacSignPictureUrl(year);

            let responseMessageText = "Your chinese zodiac sign is " + chineseZodiacSign + "."
            let yearParameters = { "age": { "amount": year } }

            response.speech = responseMessageText
            response.displayText = responseMessageText
            response.messages = [this.getImageObject(chineseZodiacSignPicturUrl), this.getResponseMessageObject(responseMessageText)];
            // don't give any contextOut year at the moment (lifespan is 0)
            response.contextOut = [this.getContextOutObject("year", yearParameters, 0)]
            return response;
            */
        }

        /* 
        Give the user the chinese zodiac sign for a year or age he provides. 
        */
       /*
        function zodiacYear(agent) {
            //parameters.age.amount

        }

        /* 
          This is the same function as getZodiacSignYearResponse with the difference, that we want to take the year from the context (user has given it before)
          and we want to leave the user the possibility to get more information about the zodiac sign from the context.
        */
       /*
        function zodiacYearContext(agent) {
            // contexts

        }

        /*
          Get a list of all zodiac signs to enhance user experience: the user can just select the zodiac sign that he likes. 
          It is done here in the backend, because in dialogflow (api.ai) the maximum list number is limited to 10 and we have 12 zodiac signs.
        */
       /*
        function zodiacList(agent) {

        }

        /*
        Fetch the horoscope for a provided zodiac sign from an API.
        */
       /*
        function zodiacHoroscope(agent) {
            // parameters.zodiacsign, contexts

        }

        function zodiacHoroscopeContext(agent) {
            // parameters.zodiacsign, contexts

        }


        // Run the proper function handler based on the matched Dialogflow intent name
        let intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        // intentMap.set('Default Fallback Intent', fallback);
        intentMap.set('zodiacsign.check', zodiacCheck);
        intentMap.set('zodiacsign.info', zodiacInfo);
        intentMap.set('zodiacsign.info.context', zodiacInfoContext);
        intentMap.set('zodiacsign.year', zodiacYear);
        intentMap.set('zodiacsign.year.context', zodiacYearContext);
        intentMap.set('zodiacsign.list', zodiacList);
        intentMap.set('zodiacsign.horoscope', zodiacHoroscope);
        intentMap.set('zodiacsign.horoscope.context', zodiacHoroscopeContext);
        agent.handleRequest(intentMap);
    }

}

/*
____

switch (intentName) {
    // ## zodiac signs ##
    case 'zodiacsign.check':
        resolve(this.getZodiacSignCheckResponse(parameters.date))
        break;

    case 'zodiacsign.info':
        resolve(this.getZodiacSignInfoResponse(parameters.zodiacsign, contexts))
        break;

    case 'zodiacsign.info.context':
        resolve(this.getZodiacSignInfoResponse(parameters.zodiacsign, contexts))
        break;

    case 'zodiacsign.year':
        resolve(this.getZodiacSignYearResponse(parameters.age.amount))
        break;

    case 'zodiacsign.year.context':
        resolve(this.getZodiacSignYearContextResponse(contexts))
        break;

    case 'zodiacsign.list':
        resolve(this.getZodiacSignList())
        break;

    case 'zodiacsign.horoscope':
        this.getZodiacSignHoroscopeResponse(parameters.zodiacsign, contexts).
        then((response) => {
            resolve(response)
        })
        break;

    case 'zodiacsign.horoscope.context':
        this.getZodiacSignHoroscopeResponse(parameters.zodiacsign, contexts).
        then((response) => {
            resolve(response)
        })
        break;

    default:
        console.log("Something went wrong. The default switch case was triggered. This means there was a intent triggered from api.ai that is not yet implemented in the webhook You triggered the intent: " + intentName + ", with the parameters: " + parameters)
        reject("Something went wrong. Sorry about that.")
        break;
}
})
},

// ### Build the responses (messages, pictures and quick replies) for the intents ### 
*/
/*
getZodiacSignInfoResponse: function(zodiacSign, contexts) {
        let responseMessageText = zodiacSignModule.getZodiacSignInfo(zodiacSign);
        let zodiacSignPicturUrl = zodiacSignModule.getZodiacSignPictureUrl(zodiacSign); //toDo: rename to Image to be conssitent

        let quickRepliesTitle = "Select 'horoscope' below or type it out to get the horoscope for " + zodiacSign + "."
        let quickRepliesButtons = ["Horoscope"]

        // add more quick reply buttons if a context is given
        for (var i = 0; i < contexts.length; i++) {
            if (contexts[i].name === "year") {
                quickRepliesButtons.push("Chinese Zodiac")
                quickRepliesTitle = "You can get the horoscope for " + zodiacSign + " or find out the Chinese Zodiac Sign for the date. (Tap on one of the buttons below.)"
            }
        }

        let zodiacSignParameters = { "zodiacsign": zodiacSign }

        response.speech = responseMessageText;
        response.displayText = responseMessageText;
        response.messages = [this.getImageObject(zodiacSignPicturUrl), this.getResponseMessageObject(responseMessageText), this.getQuickRepliesObject(quickRepliesTitle, quickRepliesButtons)];
        response.contextOut = [this.getContextOutObject("zodiac-sign", zodiacSignParameters, 4)]
        return response;
    },*/

/*
getZodiacSignYearResponse: function(year) {

    },


    getZodiacSignYearContextResponse: function(contexts) {
        let providedYear = '';
        let zodiacSign = '';
        for (var i = 0; i < contexts.length; i++) { // get values from contexts
            console.log("Iterating over contexts ... ")
            if (contexts[i].name === "year") {
                providedYear = contexts[i].parameters.age.amount
                console.log("providedYear is " + providedYear)
            }
            if (contexts[i].name === "zodiac-sign") {
                zodiacSign = contexts[i].parameters.zodiacsign
                console.log("Zodiac SIgn from Context: ", zodiacSign)
            }
        }

        let quickRepliesTitle = "You can find out more about " + zodiacSign + ". Select below or type 'info' for more information or 'horoscope' to get the horoscope."
        let quickRepliesButtons = ["Horoscope", "Info"]

        response = this.getZodiacSignYearResponse(providedYear);
        response.messages.push(this.getQuickRepliesObject(quickRepliesTitle, quickRepliesButtons))
        return response;
    },


    getZodiacSignList: function() {
        let quickRepliesTitle = "Select a zodiac sign to get information about it:"
        let quickRepliesButtons = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius']

        response.speech = "These are all the zodiac signs: Capricorn, Aquarius, Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius";
        response.displayText = "Here is a list of all the zodiac signs: Capricorn, Aquarius, Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius";;
        response.messages = [this.getQuickRepliesObject(quickRepliesTitle, quickRepliesButtons)]
        return response;
    },


    getZodiacSignHoroscopeResponse: function(zodiacSign, contexts) {
        return new Promise((resolve, reject) => {
            zodiacSignModule.getHoroscope(zodiacSign).then(
                (horoscope) => {

                    let quickRepliesTitle = "To know more about " + zodiacSign + " type 'info' or tap on the button below."
                    let quickRepliesButtons = ["Info"]

                    for (var i = 0; i < contexts.length; i++) {
                        // console.log("Iterating over contexts ... ")
                        if (contexts[i].name === "info-shown") { // it would be nice to also check if the info for the zodiac sign has already been shown, however '&& contexts[i].parameters.zodiacsign === zodiacSign' doesnt work, because the zodiac sign value here is filled from other intents as well. We could fix this by assigning a new value that is only filled when the info or info-context intent is invoked, like "zodiacsigninfo", which contains the paramater value for the zodiacsign that has been shown 
                            quickRepliesTitle = ""
                            quickRepliesButtons = []
                        }
                    }

                    for (var i = 0; i < contexts.length; i++) {
                        // console.log("Iterating over contexts ... ")
                        if (contexts[i].name === "year") {
                            quickRepliesTitle = "You can get more information on " + zodiacSign + " or find out your Chinese Zodiac Sign."
                            quickRepliesButtons.push("Chinese Zodiac")
                        }
                    }

                    let zodiacSignParameters = { "zodiacsign": zodiacSign }

                    response.speech = horoscope;
                    response.displayText = horoscope;
                    response.messages = [this.getResponseMessageObject(horoscope), this.getQuickRepliesObject(quickRepliesTitle, quickRepliesButtons)]
                    response.contextOut = [this.getContextOutObject("zodiac-sign", zodiacSignParameters, 4)]
                    resolve(response)
                }
            )
        })
    },

    // ### construct the reponse objects for dialogflow (api.ai) ###

    getResponseMessageObject: function(messageText) {
        return {
            "type": 0,
            "speech": messageText
        }
    },

    getQuickRepliesObject: function(title, replies) {
        return {
            "type": 2,
            "title": title,
            "replies": replies
        }
    },

    getImageObject: function(imageUrl) {
        return {
            "type": 3,
            "imageUrl": imageUrl
        }
    },

    getContextOutObject: function(name, paremeters, lifespan) {
        return {
            "name": name,
            "parameters": paremeters,
            "lifespan": lifespan
        }
    },

}

*/
