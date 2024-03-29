# CSAT Maintenance Planner
[![Netlify Status](https://api.netlify.com/api/v1/badges/2eea8b97-1504-4f69-be1a-efe298a9d1fc/deploy-status)](https://app.netlify.com/sites/magical-cranachan-80d5d3/deploys)

The CSAT Plan Manager is a cooperation project between CTU and CSAT. The Maintenance Planner gives a visual, easy and practical way for CSAT employees to have an overview of passed, ongoing and future maintenance plans.
This project is frontend application that works over REST API provided by [Aircraft Maintenance Planning System](https://github.com/kbss-cvut/aircraft-maintenance-planning-system).

## For developers

The CSAT Maintenance Planner is written in [TypeScript](https://www.typescriptlang.org/) using [React](https://reactjs.org/). 

This project was bootstrapped with [Create React App](https://github.com/wmonk/create-react-app-typescript), TypeScript version.

### Requirements
- tested on nodejs version 14

### Formating
This project was formatted with [Prettier](https://prettier.io/) with **no configuration**.
If you are using **IntellJ IDEA**, it is recommended to follow [this guide](https://www.jetbrains.com/help/idea/prettier.html#ws_prettier_install) to configure Prettier.

### Dockerization
The docker image of CSAT Plan Manager can be built with `docker build -t csat-plan-manager .`.
Then, it can be run and exposed at `8090/plan-manager` as `docker run -e SERVER_URL_REVISION_LIST=<BACKEND_REVISIONS_URL> SERVER_URL_REVISION_ID=<BACKEND_PLAN> -p 8090:80 plan-manager`, or from the [deploy](https://github.com/kbss-cvut/csat-maintenance-planner/tree/main/deploy) folder with `docker compose -f docker-compose.yaml up`.

-----
This work has been supported by the grant [No. CK01000204 "Improving effectiveness of aircraft maintenance planning and execution"](https://starfos.tacr.cz/en/project/CK01000204) of Technology Agency of the Czech Republic.
