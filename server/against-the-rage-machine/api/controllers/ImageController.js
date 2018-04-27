/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const axios = require("axios");

module.exports = {
    sendFile: function(req, res) {
        // return res.ok("hello world");
        var image = req.param("imageData");
        var data = {
            api_key: "qapZyITSrsmbltM_APkK5EDO6utlirmf",
            api_secret: "p5XwMDtWcuYCKY1RlXmLzrKpGmrRcSOP",
            image_file: image
        };
        axios({
            method: "post",
            url: "https://api-us.faceplusplus.com/facepp/v3/detect",
            data: data,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(function(resp) {
            console.log("image response:", resp.data);
            return res.ok(resp.data);
        }).catch(function(err) {
            res.negotiate(err);
        });
    }

};

