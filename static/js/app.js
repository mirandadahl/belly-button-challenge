// Define function to initialize the dashboard
function init() {
    // Load the data from samples.json
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      // Populate the dropdown menu with subject IDs
      var dropdown = d3.select("#selDataset");
      data.names.forEach((name) => {
        dropdown.append("option").text(name).property("value", name);
      });
  
      // Initialize the dashboard with the first subject ID
      var initialSubjectID = data.names[0];
      updateCharts(initialSubjectID);
      updateGaugeChart(initialSubjectID);
    });
  }
  
  // Define function to update charts and metadata
  function updateCharts(subjectID) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      // Filter data for the selected subject ID
      var sampleData = data.samples.filter((sample) => sample.id === subjectID)[0];
      var metadata = data.metadata.filter((meta) => meta.id == subjectID)[0];
  
      // Create the horizontal bar chart
      var barTrace = {
        x: sampleData.sample_values.slice(0, 10).reverse(),
        y: sampleData.otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse(),
        text: sampleData.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
  
      var barData = [barTrace];
  
      var barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
  
      // Create the bubble chart
      var bubbleTrace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: "markers",
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale: "Earth"
        }
      };
  
      var bubbleData = [bubbleTrace];
  
      var bubbleLayout = {
        title: "OTU ID vs. Sample Values",
        xaxis: { 
            title: "OTU ID" },
            range: [0, 35000],
        yaxis: { title: "Sample Values" }
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Display the sample metadata
      var metadataPanel = d3.select("#sample-metadata");
      metadataPanel.html(""); // Clear previous data
  
      Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
      });
    });
  }
  
  // Define function to update the gauge chart
function updateGaugeChart(subjectID) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      var metadata = data.metadata.filter((meta) => meta.id == subjectID)[0];
  
      // Key in metadata called "wfreq" for the gauge value
      var gaugeValue = metadata.wfreq;
  
      var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: gaugeValue,
          title: { text: "Belly Button Washing Frequency", font: { size: 24, weight: "bold" } },
          subtitle: { text: "Scrubs per Week", font: { size: 16 } },
          gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "grey" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#FFF5E1" },
              { range: [1, 2], color: "#FFEBC6" },
              { range: [2, 3], color: "#FFE1A1" },
              { range: [3, 4], color: "#FFD777" },
              { range: [4, 5], color: "#FFCC52" },
              { range: [5, 6], color: "#BDBC70" },
              { range: [6, 7], color: "#808000" },
              { range: [7, 8], color: "#556b2f" },
              { range: [8, 9], color: "#235347" },
            ],
          },
        },
      ];
  
      var gaugeLayout = { width: 400, height: 300, margin: { t: 0, r: 25, l: 25, b: 0 } };
  
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }

  // Define function to handle dropdown change
  function optionChanged(newSubjectID) {
    updateCharts(newSubjectID);
    updateGaugeChart(newSubjectID);
  }
  
  // Initialize the dashboard
  init();
  