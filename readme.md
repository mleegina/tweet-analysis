# Tweet Analysis

This is an application built on the MEAN stack that pulls tweets using the Twitter API. The tweets are stored in a database, and can be exported as a csv, json, or xml file. The tweets can be displayed and then plotted using graph.js.

# Installation

1. Set up config.js file
    - Add api key & secret to config/config.js file

2. Start Mongo on separate terminal window:
    ```sh
    $ brew services start mongodb
    ```

3. Navigate to directory then start server:
    ```sh
    $ npm install
    $ node server.js
    ```
4. Go to localhost:3000 on browser

5. Enter in subject, quantity, and then hit load.
    Then select a filetype, name the file, and download the dataset.
    Finally, display the tweets or visualize the dataset.

# Screenshots

![Screenshot of Page](https://github.com/mleegina/tweet-analysis/blob/master/public/img/screenshots/landing.png)

![Screenshot of Page](https://github.com/mleegina/tweet-analysis/blob/master/public/img/screenshots/display.png)

![Screenshot of Page](https://github.com/mleegina/tweet-analysis/blob/master/public/img/screenshots/graph.png)

![Screenshot of Page](https://github.com/mleegina/tweet-analysis/blob/master/public/img/screenshots/graph1.png)

![Screenshot of Page](https://github.com/mleegina/tweet-analysis/blob/master/public/img/screenshots/graph2.png)