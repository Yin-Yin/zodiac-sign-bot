const zodiacSignModule = require('../zodiac-sign/zodiac-sign.js')
const chai = require('chai');
const assert = chai.assert;

describe('Get Zodiac Sign', function() {
    it('Should equal "Virgo"', function() {
        let date = '2019-09-10T13:17:58.689Z';
        let zodiacSign = zodiacSignModule.getZodiacSign(date);
        assert.equal(zodiacSign, 'Virgo', 'Value was not Virgo');
    });
});

describe('Get Zodiac Sign Image Url', function() {
    it('Should return a value', function() {
        let zodiacSign = 'Virgo';
        let zodiacPictureUrl = zodiacSignModule.getZodiacSignPictureUrl(zodiacSign);
        //console.log("zodiacPictureUrl is: ", zodiacPictureUrl);
        assert.isNotNull(zodiacPictureUrl, 'return value is empty');
    });
});

describe('Get Chinese Zodiac Sign', function() {
    it('Year 2019 should return "Pig"', function() {
        let date = '2019';
        let zodiacSign = zodiacSignModule.getChineseZodiacSign(date);
        console.log(zodiacSign);
        assert.equal(zodiacSign, 'Pig', 'Value was not Pig');
    });
});

describe('Get Chinese Zodiac Sign Picture Url', function() {
    it('Should return a value', function() {
        let year = '2019';
        let chineseZodiacPictureUrl = zodiacSignModule.getChineseZodiacSignPictureUrl(year);
        //console.log("chineseZodiacPictureUrl is: ", chineseZodiacPictureUrl);
        assert.isNotNull(chineseZodiacPictureUrl, 'return value is empty');
    });
});

// Commented to avoid requests to API
/* 
describe('Request Horoscope from API', function() {
    it('Result should include "horoscope" and zodiac sign', function(done) {
        let zodiacSign = 'Virgo';
        let horoscopeText = zodiacSignModule.getHoroscope(zodiacSign).then(
            function (result) {
                //console.log("result", result);
                assert.include(result, "horoscope");
                assert.include(result, zodiacSign);
                done();
            },
            function (err) {
               done(err);
            }
        );
    });
});
*/