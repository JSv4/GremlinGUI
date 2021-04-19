### Welcome to Gremlin GUI

Gremlin is the open source, low-code microservice framework designed for legal engineering, data extraction, and document analysis. Gremlin GUI is a React-based frontend for the separate Gremlin Server. It is licensed under the AGPL and is free and open source.

### ENV Variables (Development and Non-Heroku Deploys)

You need to configure the target URL for the Gremlin backend. Create a file .env in the same folder as server.js. In production, you need this variable:

    REACT_APP_PRODUCTION_API_URL="<backend URL>"

When you're not in production, system will look for the target URL in the following env variable:

    REACT_APP_DEVELOPMENT_API_URL="<development bakend URL>"

Define both to have the system switch as appropriate depending on where you deploy it.

### ENV Variables (Heroku Deploys)

If you're deploying on Heroku, you need to set the REACT_APP_PRODUCTION_API_URL environment variable in Heroku. You can do this via the *[Heroku Dashboard](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard)* or via the Heroku CLI (again, this assumes you've configured the Heroku CLI):

    heroku config:set REACT_APP_PRODUCTION_API_URL=[your gremlin backend url]

### Run the Development Server 

You can run the Gremlin GUI locally and point it at any valid Gremlin backend. To run a deployment version, try the following:

    git clone https://github.com/JSv4/GremlinGUI.git
    cd GremlinGUI
    npm install
    npm run start

You'll need to configure environment variables to point API requests at a Gremlin Backend. This requires you separately have a Gremlin Backend. For more information, see the separate repository at https://github.com/JSv4/GremlinServer.

### Production Deployment

The recommended way to deploy the GUI is via Heroku. The Gremlin GUI has much lower system requirements
than the backend. Whereas the backend is not a good fit for Heroku as we need more control over the build 
process and more system resources, the free or hobby instance of Heroku is perfect for our GUI. In the future,
we plan to add an option to deploy the GUI as part of the same docker compose setup that deploys the backend.

This repository is pre-configured for Heroku, so deployment should be easy. In order to deploy, however, we assume you have alreay have a Heroku account and have setup the Heroku CLI. If you haven't set up the Heroku CLI, follow the instructons here first: https://devcenter.heroku.com/articles/heroku-cli

Now, in the same directory as server.js, execute the following commands in your terminal:

    heroku git: remote -a [application name]
    git push heroku master

You will see the installation progress in the terminal. Once the application has been successfully deployed, you will be able to access it at [application name].herokuapp.com. 

### Heroku Configuration

NOTE, if you want to use https and you have deployed to Heroku, you must upgrade to at least a hobby dyno. Heroku provides SSL certificates only for paid apps. A hobby dyno costs under $10 a month, so not a bad price to pay for a faster server and https. If you want to provide your own SSL certificate, you can, but it is fairly involved. Follow instructions here: https://devcenter.heroku.com/articles/ssl

### LESS Styling

I was using a library that was heavily dependent on less style sheets. Rather than eject my webpack config, I used an approach instead would watch for changes to .less files and compile them to css. Instructions
on how this setup works are here: https://www.folio3.com/using-less-in-react-without-ejecting. It's still in place here, but I'm not really using less style sheets anymore, so I may remove it.

### Acknowledgements

- Icons

  - *[Starting Flags](https://thenounproject.com/search/?q=start+flag&i=314735)* - By Xela Ub, VN (*[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)*)
  - *[Step Arrows](https://thenounproject.com/search/?q=steps&i=1677173)* - BY luca fruzza, IT (*[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)*)
  - *[Split Arrows](https://thenounproject.com/search/?q=many+arrows&i=498877)* - By Hea Poh Lin, MY (*[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)*)
  - *[Nodes Icon](https://thenounproject.com/search/?q=node&i=159043)* - By Gregor Cresnar (*[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)*)

- Main Software Libraries

  - Node
  - React
  - React-Diagrams
  - Semantic-UI-React
  - Json Schema
  - Axios
  - Redux
  - Redux-Thunk

- Other Acknowledgements
  - Special thanks to the *[logossim](https://github.com/renato-bohler/logossim)* project for the design inspirations in how use react-diagrams to power the pipeline editor.
  - The form builder is based on *[react-json-schema-form-builder](https://github.com/ginkgobioworks/react-json-schema-form-builder)*. The GUI has been recoded for Semantic-UI with some structural changes
  to support Sematic's default css styling. 