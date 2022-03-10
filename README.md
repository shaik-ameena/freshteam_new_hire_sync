<h1>New Hire Kick Start</h1>
<p>New Hire Kick Start App</p>
<h2>Purpose</h2>
<p>
    The purpose of this app is to send a mail to the newhire depending the role. The intention is, before the newhire is onboarded as employee if we send them with     some useful info, let say about the company, about their role or any related info to the hire, that will definitely help them to have a good start at the company.
</p>
<h2>Functionalities</h2>
<ul>
    <li>Allows to store different mail content depending on their role</li>
    <li>When a new hire is added in the portal, send them newhire email based on their role</li>
    <li>Displays sent mail and failed mail logs</li>
</ul>
<h2>Screenshots</h2>
<h3>New/Edit Template Tab</h3>
<img src="https://github.com/shaik-ameena/freshteam_new_hire_sync/blob/main/screenshots/image_1a.png">
<h3>Saved Templates List</h3>
<img src="https://github.com/shaik-ameena/freshteam_new_hire_sync/blob/main/screenshots/image_1b.png">
<h3>Sent Mail Logs</h3>
<img src="https://github.com/shaik-ameena/freshteam_new_hire_sync/blob/main/screenshots/Screenshot%202022-03-10%20at%202.06.11%20PM.png">
<h3>Failed Mail Logs</h3>
<img src="https://github.com/shaik-ameena/freshteam_new_hire_sync/blob/main/screenshots/failed_mails_1d.png" >
<h2>Features Demonstrated</h2>
<p>Product: Freshteam App location: full_page_app on Global Navigation Pane</p>
<table>
    <tr>
        <th>Feature</th>
        <th>Notes</th>
    </tr>
    <tr>
        <td><code><a href="https://developers.freshteam.com/docs/installation-parameters/#">Installation Parameters</a></code></td>
        <td>Installation parameters used to let admins configure senders email, password, domain name and api key. </td>
    </tr>
    <tr>
        <td><code><a href="https://developers.freshteam.com/docs/request-method/">Request Method</a></code></td>
        <td>Request Method has been used to make API call to retrive the designations of the domain. </td>
    </tr>
    <tr>
        <td><code><a href="https://developers.freshteam.com/docs/request-method/">Data Method</a></code></td>
        <td>Data Method has been used to get the domainName of the account. </td>
    </tr>
    <tr>
        <td><code><a href="https://developers.freshteam.com/docs/data-storage/">Key-Value Storage</a></code></td>
        <td>Data storage is used to store info of mail templates and logs.</td>
    </tr>
    <tr>
        <td><code><a href="https://developers.freshteam.com/docs/app-setup-events/#onappinstall">App Setup Events</a></code></td>
        <td>Did the Domain validation, on triggering of onAppInstall event .</td>
    </tr>
    <tr>
        <td><code><a href="https://developers.freshteam.com/docs/product-events/">Product Events</a></code></td>
        <td>When a newhire is added in the portal,on onNewHireCreate event app will send email to them.</td>
    </tr>
</table>
<h2>Prerequisites</h2>
<ol>
    <li>Make sure you have a trial Freshteam account created</li>
    <li>A properly configured <a href="https://developers.freshteam.com/docs/quick-start/#">Development environment</a> along with the <a href="https://developers.freshteam.com/docs/freshworks-cli/">FDK (Freshworks Development Kit)</a>.</li>
</ol>
<h2>Procedure to run the app</h2>
<ol>
    <li>Run the app locally using the <a href="https://developers.freshteam.com/docs/freshworks-cli/#run">fdk run</a> command.</li>
    <li>Go to <code>http://localhost:10001/custom_configs</code> in your browser to set up the installation parameters.</li>
    <li>Go to Freshteam, Append ?dev=true to the URL to see the changes .</li>
    <li>Navigate to the custom app in Global Nav Bar and test the functionalities </li>
</ol>
<h2>Additional Notes</h2>
<ul>
    <li>you can get the API key of Freshteam in following way</li>
    <ul>
        <li>Log in to your support portal.</li>
        <li>Click on your profile picture on the top right corner of your portal.</li>
        <li>Your API key will be available on the right side below Email Sync settings.</li>
    </ul>
</ul>
