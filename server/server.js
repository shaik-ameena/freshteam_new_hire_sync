const nodemailer = require("nodemailer");
exports = {
    onAppInstallCallback:  function(payload) {
        const options = {
            headers :{
                Authorization:"Bearer <%= iparam.freshteam_api_key %>",
                accept: "application/json",
            }
        }
        $request.get("https://<%= iparam.freshteam_subdomain %>.freshteam.com/api/employees", options).then(function(data) {
           if(data.status == 200)
               renderData();
        },
        function(error) {
           renderData({message:"Domain Validation failed!!!"});
           
        });
    },
    onEmployeeCreateCallback: function(payload) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: { 
              user:payload.iparams.email, 
              pass:payload.iparams.email_passw
            },
        });
        let roles = payload.data.associations.roles;
        //employee may have multiple designations
        for(let i=0; i<roles.length ; i++){
          $db.get(roles[i].name).then (
            function(data) {
                console.log("retrived data ", data  , data.subject);
                let options = {
                  from: payload.iparams.email,
                  //to:payload.data.actor.email,
                  to:"ameena.shaik@freshworks.com",
                  subject: data.subject,
                  text: data.body,
                  //html: "<b>Hello world?</b>",
                };
                transporter.sendMail(options, function(error, info){
                  if (error) {
                    console.log("error is " , error);
                  } else {
                    console.log('Email sent successfully : ' + info.response);
                  }
                });
            },
            function(error) {
                console.log("role template no found" , error);
            });
        }  
    }
};