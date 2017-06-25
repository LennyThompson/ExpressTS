"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var superAgent = require("superagent");
var when = require("when");
var rally_api_1 = require("./rally-api");
var xmlParser = require("superagent-xml2jsparser");
var ApiRouter = (function () {
    function ApiRouter() {
    }
    ApiRouter.registerApi = function (app) {
        var router = express.Router();
        var apiRouter = new ApiRouter();
        //IndexRoute
        apiRouter.create(app, router);
    };
    ApiRouter.prototype.create = function (app, router) {
        var _this = this;
        router.get("/", function (request, response, next) {
            _this.updateIncidents()
                .then(function (json) {
                console.log("response: ", json);
                response.send(json);
            })
                .catch(function (error) { return response.json = error; });
        });
        rally_api_1.RallyApi.registerApi(router);
        //use router middleware
        app.use("/api", router);
    };
    ApiRouter.prototype.updateIncidents = function () {
        console.log("updateIncidents", xmlParser);
        return when.promise(function (resolve, reject) {
            superAgent.get("http://www.news.com.au/rss")
                .accept("xml")
                .buffer(true)
                .parse(xmlParser)
                .end(function (error, response) {
                if (error) {
                    console.log("error", error);
                    reject(error);
                }
                else {
                    console.log("rss response: ", JSON.stringify(response.body));
                    resolve(response.body);
                }
            });
        });
    };
    return ApiRouter;
}());
exports.ApiRouter = ApiRouter;
