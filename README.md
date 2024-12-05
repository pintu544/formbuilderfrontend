<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://stackedit.io/style.css" />
</head>

<body class="stackedit">
  <div class="stackedit__html"><h1 id="form-builder"><strong>Form Builder</strong></h1>
<p>A dynamic Form Builder application built using the <strong>MERN Stack</strong> (MongoDB, Express, React, Node.js) and <strong>Tailwind CSS</strong>. This app enables users to create, edit, and preview forms with three specific question types: <strong>Categorize</strong>, <strong>Cloze</strong>, and <strong>Comprehension</strong>. Users can also fill the forms via a generated link, with their responses securely stored in the backend.</p>
<h2 id="features"><strong>Features</strong></h2>
<h3 id="form-editor-ui"><strong>Form Editor UI</strong></h3>
<ul>
<li>Add multiple question types:
<ul>
<li><strong>Categorize</strong>: Allows categorization of items.</li>
<li><strong>Cloze</strong>: Fill-in-the-blank style questions.</li>
<li><strong>Comprehension</strong>: Questions related to understanding a passage.</li>
</ul>
</li>
<li>Add images to individual questions.</li>
<li>Include a header image at the top of the form.</li>
</ul>
<h3 id="form-preview-and-fill"><strong>Form Preview and Fill</strong></h3>
<ul>
<li>Generate a sharable <strong>preview/fill link</strong> for the form.</li>
<li>Users can fill the form, with their responses saved to the backend.</li>
</ul>
<h3 id="data-management"><strong>Data Management</strong></h3>
<ul>
<li>All form data, including questions and user responses, are saved in <strong>MongoDB</strong> with proper schemas.</li>
</ul>
<h2 id="tech-stack"><strong>Tech Stack</strong></h2>
<ul>
<li><strong>Frontend</strong>: React.js, Tailwind CSS</li>
<li><strong>Backend</strong>: Node.js, Express.js</li>
<li><strong>Database</strong>: MongoDB</li>
<li><strong>Hosting</strong>: Hosted on Vercel/Netlify (frontend) and Render/another service (backend).</li>
</ul>
<h2 id="setup-instructions"><strong>Setup Instructions</strong></h2>
<h3 id="prerequisites"><strong>Prerequisites</strong></h3>
<p>Ensure you have the following installed:</p>
<ul>
<li>Node.js</li>
<li>MongoDB</li>
</ul>
<h3 id="installation"><strong>Installation</strong></h3>
<ol>
<li>
<p>Clone the repository:</p>
<p>bash</p>
<p><code>git clone https://github.com/your-username/form-builder.git cd form-builder</code></p>
</li>
<li>
<p>Install dependencies for the frontend and backend:</p>
<p>bash</p>
<p>`# Frontend<br>
cd client<br>
npm install</p>
<h1 id="backend">Backend</h1>
<p>cd …/server<br>
npm install`</p>
</li>
<li>
<p>Set up environment variables:</p>
<ul>
<li>
<p>Create a <code>.env</code> file in the <code>/server</code> directory and provide the following:</p>
<p>env</p>
<p>Copy code</p>
<p><code>MONGO_URI=&lt;Your MongoDB Connection URI&gt; PORT=5000</code></p>
</li>
</ul>
</li>
<li>
<p>Start the application:</p>
<p>bash</p>
<p>Copy code</p>
<p>`# Backend<br>
cd server<br>
npm run start</p>
<h1 id="frontend">Frontend</h1>
<p>cd …/client<br>
npm start`</p>
</li>
<li>
<p>Access the app at <code>http://localhost:3000</code>.</p>
</li>
</ol>
<h2 id="usage"><strong>Usage</strong></h2>
<ol>
<li>
<p><strong>Form Creation</strong>:</p>
<ul>
<li>Navigate to the form editor and add questions of the desired types.</li>
<li>Upload a header image and add images to questions if required.</li>
<li>Save the form.</li>
</ul>
</li>
<li>
<p><strong>Form Preview/Fill</strong>:</p>
<ul>
<li>Generate a preview/fill link.</li>
<li>Share the link with users to fill out the form.</li>
<li>View saved responses in the backend database.</li>
</ul>
</li>
</ol>
<h2 id="folder-structure"><strong>Folder Structure</strong></h2>
<p>graphql</p>
<p>Copy code</p>
<p><code>form-builder/ ├── client/ # Frontend React application ├── server/ # Backend API with Express.js ├── .gitignore ├── README.md └── package.json</code></p>
<h2 id="endpoints"><strong>Endpoints</strong></h2>
<h4 id="forms-endpoints"><strong>Forms Endpoints</strong></h4>
<ul>
<li><strong>GET</strong> <code>/api/v1/forms?page_no=1&amp;page_size=10</code></li>
<li><strong>GET</strong> <code>/api/v1/forms/:id</code></li>
<li><strong>DELETE</strong> <code>/api/v1/forms/:id</code></li>
<li><strong>POST</strong> <code>/api/v1/forms</code></li>
<li><strong>GET</strong> <code>/api/v1/forms/client/:id</code></li>
</ul>
<h4 id="respondents-endpoints"><strong>Respondents Endpoints</strong></h4>
<ul>
<li><strong>GET</strong> <code>/api/v1/respondents/:formId?page_no=1&amp;page_size=10</code></li>
<li><strong>POST</strong> <code>/api/v1/respondents/:formId/check-valid-response</code></li>
<li><strong>POST</strong> <code>/api/v1/respondents/:formId</code></li>
<li><strong>GET</strong> <code>/api/v1/respondents/response/:responseId</code></li>
</ul>
<h2 id="live-demo"><strong>Live Demo</strong></h2>
<ul>
<li>Frontend: <a href="https://categoryformbuilder.netlify.app">Deployed Link</a></li>
<li>Backend: <a href="https://formbuilderbackend-n00t.onrender.com">Deployed Link</a></li>
</ul>
</div>
</body>

</html>
