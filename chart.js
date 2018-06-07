// Recieves the array from the server side and displays the data using chart.js on the client side
$.get('/visualizations', function(data) {
  var dataset = data;
  // dataset:
  // index | content
  //   0     screen Name
  //   1     # following
  //   2     # followers
  //   3     time created
  //   4     # of tweets

  // GRAPH 1: Scatterplot - Plotting the number of friends to followers by user
  // Format data to data point format
  var datapoints = [];

  for (var i=0; i<dataset[1].length; i++) {
    datapoints.push({
      x: dataset[1][i],
      y: dataset[2][i]
    })
  }

  window.ctx = document.getElementById("chart1").getContext('2d');
  var scatterChart = new Chart(ctx, {
    type: "scatter",
    data: {
      label: dataset[0],
      datasets: [{
        data: datapoints,
        pointBackgroundColor: "#719a97"
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          scaleLabel: {
            display: true,
            labelString: 'Number Following'
          }
        }],
        yAxes: [{
          type: 'linear',
          scaleLabel: {
            display: true,
            labelString: 'Number of Followers'
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: true
      }
    }
  });

  // GRAPH 2: Polar area pie chart of # of Tweets by users
  // Random color function to pick out colors for graph
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Get random colors for each user in the dataset
  var colors = [];
  for (var i=0; i<dataset[4].length; i++) {
    colors.push(getRandomColor());
  };

  window.ctx2 = document.getElementById("chart2").getContext('2d');
  var polarChart = new Chart(ctx2, {
    type: 'polarArea',
    data: {
      labels: dataset[0],
      datasets: [{
        data: dataset[4],
        backgroundColor: colors
      }]
    },
    options:{
      legend: {
        display: false
      }
    }
  });

  // GRAPH 3: The year the user account was created
  
  // Format data to extract years
  var yrs = [];
  for (var i=0; i< dataset[3].length; i++) {
    var temp = dataset[3][i].split(" ");
    var tempArr = new Array();
    for (var j=0; j<temp.length; j++) {
      tempArr.push(temp[j]);
    }
    yrs.push(tempArr[tempArr.length-1]);
  };

  // Calculate the follower/following ratio for bubble size, multiply by 7 so
  // it is easier to see
  var ratio = [];
  for (var i=0; i<dataset[1].length; i++) {
    var dot = (dataset[2][i]/dataset[1][i])*7;
    // If the ratio is very high--cap it at 20 so the bubble is not too big
    if (dot > 20) {
      ratio[i] = 20;
    } else {
      ratio[i] = dot;
    }
  }

  // Format data into data points
  var bubbpoints = [];
  for (var i=0; i<dataset[1].length; i++) {
    bubbpoints.push({
      x: yrs[i],
      y: dataset[4][i],
      r: ratio[i]
    })
  }

  window.ctx3 = document.getElementById("chart3").getContext('2d');
  var bubbleChart = new Chart(ctx3, {
    type: "bubble",
    data: {
      datasets: [{
        backgroundColor: "#719a97",
        data: bubbpoints
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          scaleLabel: {
            display: true,
            labelString: 'Year Joined'
          }
        }],
        yAxes: [{
          type: 'linear',
          scaleLabel: {
            display: true,
            labelString: 'Number of Tweets'
          }
        }]
      },
      legend: {
        display: false
      }
    }
  });
});
