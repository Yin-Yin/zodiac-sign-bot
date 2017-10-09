var request = require('request');

const zodiacSignMap = new Map();
zodiacSignMap.set('capricorn', 'Capricorn\nDates: December 22 – January 19 \nThey are really cool animals! They can climb like badasses and are very cheeky');
zodiacSignMap.set('aquarius', 'Aquarius\nDates: January 20 – February 18\nAs the name suggests, they like water a lot. Their best abilities lie in watering plants as they have so much. ');
zodiacSignMap.set('pisces', 'Pisces\nDates: February 19 – March 20\nPisces are fishes. Living in the water is a cool thing.');
zodiacSignMap.set('aries', 'Aries\nDates: March 21 – April 19\nAries are animals that have a very strong will, as they have two horns to ram everyone. Harharhar.');
zodiacSignMap.set('taurus', 'Taurus\nDates: April 20 – May 20\nThese animals are very big and strong. Altough most of the time they are very peaceful and just graze.');
zodiacSignMap.set('gemini', 'Gemini\nDates: May 21 – June 20\nGemini is cool, because it means sth. like siblings and to have a sibling is a wonderful thing. Even if you may be not have a sibling, with your star sign you do! :)');
zodiacSignMap.set('cancer', 'Cancer\nDates: June 21 – July 22\nCancer have two scissors on their hands, which is pretty badass!');
zodiacSignMap.set('leo', 'Leo\nDates: July 23 – August 22\nLions are so cool! They are like the kings of animal kingdom!');
zodiacSignMap.set('virgo', 'Virgo\nDates: August 23 – September 22\nVirgos are very intelligent! And beautiful! Your are great!');
zodiacSignMap.set('libra', 'Libra\nDates: September 23 – October 22\nLibra means sth. like a scale. So they are very harmonious.');
zodiacSignMap.set('scorpio', 'Scorpio\nDates: October 23 – November 21\nScorpions are so cool! They have a tail with a sting and two scissor hands!!! Wow! ...');
zodiacSignMap.set('sagittarius', 'Sagittarius\nDates: November 22 – December 21\nSagittarius is like bow and arrow. So they know whre to aim.');

const chineseZodiacMap = new Map();
chineseZodiacMap.set(0, 'Rat');
chineseZodiacMap.set(1, 'Ox');
chineseZodiacMap.set(2, 'Tiger');
chineseZodiacMap.set(3, 'Rabbit');
chineseZodiacMap.set(4, 'Dragon');
chineseZodiacMap.set(5, 'Snake');
chineseZodiacMap.set(6, 'Horse');
chineseZodiacMap.set(7, 'Goat');
chineseZodiacMap.set(8, 'Monkey');
chineseZodiacMap.set(9, 'Rooster');
chineseZodiacMap.set(10, 'Dog');
chineseZodiacMap.set(11, 'Pig');

var response = {}

// toDO: put this code in its own module
module.exports = {
  // ## API.ai intents ##
  getResponse: function(parameters, intentName) {
    return new Promise((resolve, reject) => {

      switch (intentName) {

        // ## zodiac signs ##
        case 'zodiacsign.check':
          resolve(this.getZodiacSignCheckResponse(parameters.date))
          break;

        case 'zodiacsign.info':
          resolve(this.getZodiacSignInfoResponse(parameters.zodiacsign))
          break;

        case 'zodiacsign.info.context':
          resolve(this.getZodiacSignInfoResponse(parameters.zodiacsign))
          break;

        case 'zodiacsign.year':
          resolve(this.getZodiacSignYearResponse(parameters.age.amount))
          break;

        case 'zodiacsign.horoscope':
          this.getZodiacSignHoroscopeResponse(parameters.zodiacsign).
          then((horoscope) => {
              resolve(horoscope)
            })
          break;

        case 'zodiacsign.horoscope.context':
          this.getZodiacSignHoroscopeResponse(parameters.zodiacsign).
          then((horoscope) => {
              resolve(horoscope)
            })
          break;

        default:
          console.log("Something went wrong. The default switch case was triggered. This means there was a intent triggered from api.ai that is not yet implemented in the webhook You triggered the intent: " + intentName + ", with the parameters: " + parameters)
          reject("Something went wrong. Sorry about that.")
          break;
      }
    })
  },

  // ## build the responses for the intents ##
  // Here we construct the messages and buttons that go back to api.ai
  getZodiacSignCheckResponse: function(date) {
    console.log("Triggerd intent *zodiacSign.check with params, date: ", date);
    if (!date) {
      console.error("Intent: zodiacsign.check, Error: The date is missing.")
    }
    let zodiacSign = this.getZodiacSign(date);

    // build the response
    response.speech = "Your zodiac sign is " + zodiacSign
    response.displayText = "Your zodiac sign is " + zodiacSign

    response.messages = [{
        "type": 0,
        "speech": "Your zodiac sign is " + zodiacSign
      },
      /*
      {
      "type": 3,
      "imageUrl": "https://farm2.staticflickr.com/1523/26246892485_fc796b57df_h.jpg"
      }
      ,
      */
    ]

    //toDo: Delete this. I makes the code and the app more complicated. When I see the two responses I get confused.
    // also get chinese zodiac sign if a date in the past is provided
    let parameterDate = new Date(date);
    let currentYear = new Date().getFullYear(); // I use this in another place as well => declare on top for whole module
    let dateYear = parameterDate.getFullYear();
    if (dateYear < currentYear) {
      console.log("Year is different: ", dateYear)
      console.log("CHinese Zodiac", this.getChineseZodiacSign(dateYear))
      response.messages.push({ "type": 0, "speech": "Your chinese zodiac sign is " + this.getChineseZodiacSign(dateYear) })
    }
    else {
      console.log("The date is from this year; ", dateYear);
    }

    response.messages.push({
      "type": 2,
      "title": "Want to know more?",
      "replies": ["horoscope", "info"]
    })
    response.contextOut = [{
      "name": "zodiac-sign",
      "parameters": {
        "zodiacsign": zodiacSign.toLowerCase()
      },
      "lifespan": 20
    }]

    return response;
  },

  getZodiacSignInfoResponse: function(zodiacsign) {
    console.log("Triggerd intent zodiacSign.info with params: ", zodiacsign);
    let zodiacInfo = this.getZodiacSignInfo(zodiacsign)
    let response = {}
    response.speech = zodiacInfo;
    response.displayText = zodiacInfo;
    response.messages = [{
        "type": 0,
        "speech": zodiacInfo
      },
      /*
      {
      "type": 3,
      "imageUrl": "https://farm2.staticflickr.com/1523/26246892485_fc796b57df_h.jpg"
      }
      ,
      */
      {
        "type": 2,
        "title": "Do you want to know the horoscope?",
        "replies": ["horoscope"]
      }
    ]
    return response;
  },

  getZodiacSignYearResponse: function(year) {
    console.log("Triggered intent zodiacSign.year with params: ", year);
    let chineseZodiacSign = this.getChineseZodiacSign(year)
    let response = {}
    response.speech = "Your chinese zodiac sign is " + chineseZodiacSign;
    response.displayText = "Your chinese zodiac sign is " + chineseZodiacSign;;
    response.messages = [{
        "type": 0,
        "speech": "Your chinese zodiac sign is " + chineseZodiacSign
      },
      /*
      {
      "type": 3,
      "imageUrl": "https://farm2.staticflickr.com/1523/26246892485_fc796b57df_h.jpg"
      }
      ,

      {
      "type": 2,
      "title": "Do you want to know more about this sign?",
      "replies": ["Info Chinese Zodiac Sign"]
      }
      */
    ]
    return response;
  },

  getZodiacSignHoroscopeResponse: function(zodiacsign) {
    // toDo: we have three promises now. Only because of the asynchronous API call to the horoscope API. Is there a better way to tackle this?
    console.log("Triggerd intent zodiacSign.horoscope with params: ", zodiacsign);
    return new Promise((resolve, reject) => {
      let response = {}
      this.getHoroscope(zodiacsign).then(
        (horoscope) => {
          response.speech = horoscope;
          response.displayText = horoscope;
          response.messages = [{
              "type": 0,
              "speech": horoscope
            },
            /*
            {
            "type": 3,
            "imageUrl": "https://farm2.staticflickr.com/1523/26246892485_fc796b57df_h.jpg"
            }
            ,
            {
            "type": 2,
            "title": "Do you want to know more?",
            "replies": ["Info"]
            }
            */
          ]
          resolve(response)
        }
      )
    })
  },

  // toDO: add debugging, wether with console.logs or with a loghinh tool. THen add logging for the input and output to make sure I can debug errors later
  // toDo: make the documentation better
  // toDO: take apart the code into logical modules
  // toDO: add a bug report intent
  // to do: one functionality per one function!! Take apart the part where the message is constructed and the logic about the star sign


  getZodiacSign: function(parameterDate) {
    // returns the zodiac sign according to day and month
    let date = new Date(parameterDate);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const zodiac = ['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
    const last_day = ['', 19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21, 19];
    let zodiacSign = (day > last_day[month]) ? zodiac[month * 1 + 1] : zodiac[month];
    return zodiacSign;
  },

  getZodiacSignInfo: function(zodiacSign) {
    console.log("Getting zodiacSign Info for: ", zodiacSign);
    let zodiacInfo = zodiacSignMap.get(zodiacSign);
    return zodiacInfo;
  },

  // Calculate the chinese zodiac sign, which is dependent on the year
  getChineseZodiacSign: function(year) {
    let chineseZodiacSign = ''
    if (year < 120) { // calculate the birthday if user gives his age and not a year
      let currentYear = new Date().getFullYear();
      let birthdayYear = currentYear - year;
      chineseZodiacSign = chineseZodiacMap.get((birthdayYear - 4) % 12) + ".";
    }
    else {
      chineseZodiacSign = chineseZodiacMap.get((year - 4) % 12) + ".";
    }
    return chineseZodiacSign;
  },

  getHoroscope: function(zodiacSign) {
    return new Promise((resolve, reject) => {
      console.log("Requesting horoscope for zodiac sign: ", zodiacSign);
      let requestUrl = 'http://sandipbgt.com/theastrologer/api/horoscope/' + zodiacSign + '/today'
      request(requestUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let parsedBody = JSON.parse(body);
          // console.log(body + '/n' + requestUrl);
          console.log("Horoscope for " + zodiacSign + "requested successfully.")
          let horoscope = "The horoscope for " + zodiacSign + " for today is: \n" + parsedBody.horoscope;
          resolve(horoscope);
        }
        else {
          reject("There was an error retrieving your horoscope for " + zodiacSign + ".");
        }
      })
    })
  }
}
