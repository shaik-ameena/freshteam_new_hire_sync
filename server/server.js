const nodemailer = require("nodemailer");

exports = {  
    onAppInstallCallback:  function(payload) {
        console.log("on app install called " , payload);
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
           renderData({message:`Domain Validation failed!!! , ${error}`});  
        });
    },
    onNewHireCreateCallback: function(payload) {
        //console.log("new hire create called " , JSON.stringify(payload));
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: { 
              user:payload.iparams.email, 
              pass:payload.iparams.email_passw,
           },
        });
        let newHireDesignation = payload.data.newhire.designation;
        $db.get("allSavedRolesTemplates").then (
          function(data) {
              let {savedRolesTemplate} = data;
                const matchedRole = (savedRole) => savedRole.role === newHireDesignation;
                let matchedRoleIndex = savedRolesTemplate.findIndex(matchedRole);
                if(matchedRoleIndex != -1){
                    let options = {
                      from: payload.iparams.email,
                      //to:payload.data.actor.email,
                      to:payload.data.newhire.personal_email,
                      subject: savedRolesTemplate[matchedRoleIndex].subject,
                      text: savedRolesTemplate[matchedRoleIndex].body,
                    };
                    transporter.sendMail(options, function(error, info){
                      if (!error) {
                        console.log("email sent successfully " , info.response , options);
                        $db.get("allSentMailLogs").then (
                          function(data) {
                          let mails = data.sentMailLogs;
                          let today = new Date().toLocaleString();
                          mails.push({ role:savedRolesTemplate[matchedRoleIndex].role ,email:payload.data.newhire.personal_email,status_msg:"Email sent successfully",  sent:true ,date:today});
                          $db.set( "allSentMailLogs", {"sentMailLogs":mails}).then (
                            function(data) { console.log("updated sent mails at db",data);},
                            function(error) { console.log("failed to update sent mails at db " , error); });
                        },
                        function(error) {
                          let today = new Date().toLocaleString();
                          console.log("first sent mail error ", error , savedRolesTemplate[matchedRoleIndex].role);
                          $db.set( "allSentMailLogs",{"sentMailLogs":[{ role:savedRolesTemplate[matchedRoleIndex].role ,email:payload.data.newhire.personal_email,status_msg:"Email sent successfully",  sent:true ,date:today}]}).then (
                            function(data) { console.log("sent mails db initialised",data); },
                            function(error) { console.log("failed to initalise sent mails db" , error); })
                        });
                      }
                      else{
                        console.log("error is failed to send mail ", error.response);
                        $db.get("allFailedMailLogs").then (
                          function(data) {
                          let mails = data.failedMailLogs;
                          let today = new Date().toLocaleString();
                          mails.push({ role:savedRolesTemplate[matchedRoleIndex].role ,email:payload.data.newhire.personal_email,status_msg:error.response,  sent:false ,date:today});
                          $db.set( "allFailedMailLogs", {"failedMailLogs":mails}).then (
                            function(data) { console.log("updated failed mails at db",data);},
                            function(error) { console.log("failed to update failed mails at db " , error); });
                        },
                        function(err) {
                          console.log("error is ",err);
                          let today = new Date().toLocaleString();
                          $db.set( "allFailedMailLogs",{"failedMailLogs":[{role:newHireDesignation ,email:payload.data.newhire.personal_email,status_msg:error.response,  sent:false ,date:today}]}).then (
                            function(data) { console.log("failed mails db initialised",data); },
                            function(error) { console.log("failed to initalise failed mails db" , error); })
                        });
                      }
                    })
                }
                else{
                  //template not found case
                  $db.get("allFailedMailLogs").then (
                    function(data) {
                    let mails = data.failedMailLogs;
                    let today = new Date().toLocaleString();
                    mails.push({ role:newHireDesignation ,email:payload.data.newhire.personal_email,status_msg:"Template not found",  sent:false ,date:today});
                    $db.set( "allFailedMailLogs", {"failedMailLogs":mails}).then (
                      function(data) { console.log("no template found at db",data);},
                      function(error) { console.log("failed to update failed mails at db at template nt found " , error); });
                  },
                  function(error) {
                    let today = new Date().toLocaleString();
                    console.log("first failed mails ", error);
                    $db.set( "allFailedMailLogs",{"failedMailLogs":[{ role:newHireDesignation  ,email:payload.data.newhire.personal_email,status_msg:"Template not found",  sent:false ,date:today}]}).then (
                      function(data) { console.log("failed mails db initialised",data); },
                      function(error) { console.log("failed to initalise failed mails db" , error); })
                  });
                }
              //}
          },
          function(error) {
              console.log("failed to get saved templates ", error);
          });
       
    }
};
