'use strict'
var moment = require('moment');
const Validator = use('Validator')

const Currency = use('App/Model/Currency')
const CurrencyLatest = use('App/Model/CurrencyLatest')

class ApiV1Controller {

    //-----------------------------------------------------------------
    *latest(request, response) {

        const updated_at = yield CurrencyLatest.sort('date_time', -1).findOne();

        var result = {
            base: "EUR",
            rate: {}
        };

        const latest = yield CurrencyLatest.all();
        var i = 0;
        var name;
        var value;
        for (var index in latest) {
            name = latest[index].get('to');
            value = latest[index].get('rate');
            result.rate[name] = {
                rate: value,
                date_time: latest[index].get('date_time')+" UTC",
                updated_at: latest[index].get('created_at'),
                ago: moment(latest[index].get('created_at')).fromNow(),
            };
            i++;
        }
        yield response.json(result);
        return;
    }
    //-----------------------------------------------------------------
    *convert(request, response)
    {
        let errors = [];
        let from =  request.param("from").toUpperCase();
        let to = request.param("to").toUpperCase();
        let date = request.param("date");

        if(date)
        {
            var valid_date  = moment(date, "YYYY-MM-DD").isValid();
            console.log(valid_date);
            if(!valid_date)
            {
                console.log("error");
                errors.push(date+" is not a valid date or date format. Use correct format: YYYY-MM-DD");
            }
        }

        let list = Currency.list();

        if(list[from] == undefined)
        {
            errors.push(from+" is not valid currency code");
        }

        if(errors.length)
        {
            yield response.json({errors: errors});
            return;
        }

        let test =  CurrencyLatest.where("date_time").equals('2017-04-26 19:06:00').find();

        yield response.json(test);

        let base_rate_from =  CurrencyLatest.where('from', 'EUR')
                                .where('to', from)

        if(date)
        {
            //base_rate_from.where({"date": {"$date": date}});
            base_rate_from.where("date", '2017-04-27 07:34:00');
        }
        base_rate_from = yield base_rate_from.sort('date_time', -1).findOne();

        yield response.json(base_rate_from);

        var to_array = to.split(",");

        let to_currency;
        let find_rate;
        var i = 0;
        let data = {
            from: from,
            to: {}
        };

        let converted;
        for (var index in to_array)
        {
            to_currency = to_array[index];
            if(list[to_currency] == undefined)
            {
                data["to"][to_currency] = {
                    error: to_currency+" is not valid currency code"
                };
            } else
            {
                find_rate = yield CurrencyLatest.where('from', 'EUR')
                    .where('to', to_array[index])
                    .sort('date_time', -1)
                    .findOne();

                if(!find_rate)
                {
                    data["to"][to_currency] = {
                        error: to_currency+" rates not available"
                    };
                }
                converted = find_rate.get("rate")/base_rate_from.get("rate");
                converted = converted.toFixed(4);

                data["to"][to_currency] = {
                    rate: converted,
                    updated_at: find_rate.get("date_time")+" UTC",
                };
            }
            i++;
        }

        yield response.json(data);
        return;

    }
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------

}

module.exports = ApiV1Controller
