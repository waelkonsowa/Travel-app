## Travel App

This application helps you to manage your travel details
. It will look for the Boarding city, Destination City, Date. It will show the expected wheqher of the destition station on the travel date.


## APIs Used

1. Pixabay
1. GeoNames
1. WeatherBit

###  Architecture of the Project

```shell script
- Root:
  - `package.json`
  - `readme.md`
  - `webpack.dev.js`
  - `webpack.prod.js`
  - src folder
    - server folder
      - `server.js` 
    - client folder
      - `index.js`
      - html/views folder
        - img
          - `img1.jpg`
          - `img3.jpg`
          - `logo.png`
        - `index.html`
      - js folder
        - `app.js` 
        - `handleSubmit.js` 
      - styles folder
        - `style.scss` 
        - `footer.scss` 
        - `nav.scss` 
        - `reset.scss` 
        - `layout.scss` 
```

### Install

```shell script
    npm run build-dev
    npm run build-prod
    npm start
```

