'use strict'

class HomeController {

    //-----------------------------------------------------------------
    * index (request, response) {
        yield response.send({"response": "working"})
        return;
    }
    //-----------------------------------------------------------------
    *loaderIOverification(request, response) {
            yield response.send("loaderio-6903aed1b486387ac31b1e92971901ab");
    }
    //-----------------------------------------------------------------
    //-----------------------------------------------------------------

}

module.exports = HomeController
