
$(document).ready( function() {
    app.initialized()
        .then(function(client) {
          window.client = client;
          console.log("client object is ", client);
          onAppInitialise();

    });
});
function onAppInitialise(){
     getAllDesignations();
     displayAllTemplates();
     displayAllSentMails();
     displayAllFailedMails();
     autoFillTemplate(true);
}

function onTemplateSave(){
    let selected_role = document.getElementById("role").value;
    let template_sub = document.getElementById("template-subject").value;
    let template_body = document.getElementById("template-body").value;
    client.db.get("allSavedRolesTemplates").then (
        function(data) {
          let savedOnes = data.savedRolesTemplate;
          const dupEntry = (savedOne) => savedOne.role === selected_role;
          let dupEntryIndex = savedOnes.findIndex(dupEntry);
          if(dupEntryIndex == -1 && selected_role !== '#'){
            savedOnes.push({"role":selected_role, "subject":template_sub,"body":template_body});
          }
          else{
              savedOnes[dupEntryIndex].subject = template_sub;
              savedOnes[dupEntryIndex].body = template_body;
          }
          client.db.set("allSavedRolesTemplates", {"savedRolesTemplate" : savedOnes}).then (
            function(data) {
               console.log("successfully updated ", data );
               onAppInitialise();
            },
            function(error) {
              console.log("updation failed ",error)
            });
        
        },
        function(error) {
          console.log("failed to get templates  ", error);
          client.db.set( "allSavedRolesTemplates",{"savedRolesTemplate":[]}).then (
            function(data) { console.log("templates data store initialised",data);
            },function(error) {console.log("failed to initialise  " , error);
            });
    });
}

function autoFillTemplate(manualCall){
    console.log("auto fill template ", manualCall);
    let selected_role = document.getElementById("role").value;
    let template_sub = document.getElementById("template-subject");
    let template_body = document.getElementById("template-body");
    if(!manualCall){
    client.db.get("allSavedRolesTemplates").then (
        function(data) {
            let {savedRolesTemplate} = data;
            let matchedTemplate = savedRolesTemplate.filter(savedOne=>savedOne.role === selected_role);
            if(matchedTemplate.length != 0){
                template_sub.value = matchedTemplate[0].subject;
                template_body.value = matchedTemplate[0].body;
            }
            else{
                template_sub.value = "";
                template_body.value = "";
            }      
        },
        function(error) {
            console.log("error while getting templates", error);
        });
    }
    else{
        setTimeout(() => {
            template_sub.value = "";
            template_body.value = "";
        }, 1000);
    }
}

function getAllDesignations(){
    let selectContainer = document.getElementById('designation');
    const options = {
        headers :{
            Authorization:"Bearer <%= iparam.freshteam_api_key %>",
            accept: "application/json",
        }
    }
    let content = `<select name="cars" id="role" onChange = autoFillTemplate()><option value="#">-----------select role----------</option>` ;
    client.request.get("https://ameenashaik.freshteam.com/api/job_postings" , options).then(function(data) {
        if(data.status == 200){
            const response = JSON.parse(data.response);
            for(let i=0;i<response.length ; i++){
                content += `<option value="${response[i].title}">${response[i].title}</option>`;
            }
            content += `</select>`;
            selectContainer.innerHTML = content;
        }
     },
     function(error) {
       console.log("failed to get roles ", error);
     });
}
function displayAllTemplates(){
    client.db.get("allSavedRolesTemplates").then (
        function( {savedRolesTemplate} ) {
            let savedTemplatesTab = document.getElementById('saved-templates');
            let content = generateDynamicTable(savedRolesTemplate,["Designation","Template Subject"],["role","subject"],["","",""],true,"role");
            savedTemplatesTab.innerHTML = content;
        },
        function(error) {
            console.log("failed to get templates ",error)
        });
}

function displayAllFailedMails(){
    client.db.get("allFailedMailLogs").then (
        function( {failedMailLogs} ) {
          let failedMailsTab = document.getElementById('failed-mails');
          let content = generateDynamicTable(failedMailLogs,["New Hire Email","Role","Message","Date"],["email","role","status_msg","date"],["20%","15%","","15%"],false,"");
          failedMailsTab.innerHTML = content;
        },
        function(error) {
           console.log("error while fetching failed mail logs ",error);
    });
}
function displayAllSentMails(){
    client.db.get("allSentMailLogs").then (
        function({sentMailLogs}) {
          let sentMailsTab = document.getElementById('sent-mails');
          let content = generateDynamicTable(sentMailLogs,["New Hire Email","Role","Message","Date"],["email","role","status_msg","date"],["20%","15%","","15%"],false,"");
          sentMailsTab.innerHTML = content;
        },
        function(error) {
            console.log("sent mails logs not found ",error);
    });
}
function generateDynamicTable(data , titles , attributes ,widths, deleteOption,deleteKey){
    let content = `<table id="templates">
    <tr><th>#</th>`;
    for(let i=0 ; i< titles.length ; i++){
        content += `<th style="width:${widths[i]}">${titles[i]}</th>`;
    }
    if(deleteOption){
        content += `<th style="width:7%"></th>`;
    }
    content += `</tr>`;
    for(let j=0;j< data.length ; j++){
        content += `<tr><td>${j+1}</td>`;
        for(let k=0; k< attributes.length ; k++){
            content += `<td><div>${data[j][attributes[k]]}</div></td>`       
        }
        if(deleteOption){
            let roleToBeDeleted = data[j][deleteKey];
            content += `<td><div><button value='${roleToBeDeleted}' onclick=onTemplateDelete(this)>Remove</button></div></td>`;
            //content += `<i class="fa fa-remove" style="font-size:24px"></i>`;
        }
        content += `</tr>`;
    }
    content += `</table`;
    return content;
}
function onTemplateDelete(e){
    let deleteKey = e.value;
    console.log("request raised for deleting template ", deleteKey);
    client.db.get("allSavedRolesTemplates").then (
        function( {savedRolesTemplate} ) {
          const filteredRolesTemplates = savedRolesTemplate.filter(savedOne=>savedOne.role !== deleteKey);
          client.db.set( "allSavedRolesTemplates", { "savedRolesTemplate": filteredRolesTemplates }).then (
            function(data) {
              console.log("successfully stored updated role templates ", data);
              onAppInitialise();
            },
            function(error) {
              console.log( " failed to store updated role templates",error)
            });
        },
        function(error) {
            console.log("error while fetchinh roles from store ",error);
     });
}




