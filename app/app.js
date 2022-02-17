$(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          window.client = _client;
          console.log("client at beg" , client);
          onAppInitialise();//for this full page app app.activated is not getting called
    });
});
function onAppInitialise(){
    console.log("for every time when app is initialised");
    document.getElementById("role").addEventListener("fwChange",autoFillTemplate);
    displayAllTemplates();

}
function onSave(){
    //let selected_roles_list = $("#role-list").value;
    let selected_role = document.getElementById("role").value;
    let template_sub = document.getElementById("template-subject").value;
    let template_body = document.getElementById("template-body").value;
   
    client.db.set(selected_role , {"subject":template_sub,"body":template_body}).then (
        function(data) {
            console.log("templated saved successfully", data);
        },
        function(error) {
          console.log(" failed to save template", error)
        });
    //for intialising app again
    onAppInitialise();
}
function autoFillTemplate(){
    let selected_role = document.getElementById("role").value;
    let template_sub = document.getElementById("template-subject");
    let template_body = document.getElementById("template-body");
    client.db.get(selected_role).then (
        function(data) {
            template_sub.value = data.subject;
            template_body.value = data.body;
        },
        function(error) {
            template_sub.value = "";
            template_body.value = "";
        });
}

function displayAllTemplates(){
    const roles = ["Software Engineer","Hiring Manager","Account Admin","Recruiter"];
    let temp = document.getElementById("saved-templates");
    let content = `<table id="templates">
      <tr>
        <th>Role</th>
        <th>Template Subject</th>
     </tr>`;
    for(let i=0;i<roles.length ; i++){
        client.db.get(roles[i]).then (
            function(data) {
                console.log("retrived data ", data  , data.subject);
                content += `<tr>
                <td><div onclick="redirectToEdit()" id="template-name">${roles[i]}</div></td>
                <td><div>${data.subject}</div></td>
                </tr>`;
                temp.innerHTML = content;
            },
            function(error) {
                console.log("erro" , error);
              // failure operation
            });
    }
}

function redirectToEdit(){
    console.log("redirect to edit is caleed");
    let tabsParent = document.getElementById("tabs-root");
    console.log("active tab ", tabsParent.active-tab-index);
}
