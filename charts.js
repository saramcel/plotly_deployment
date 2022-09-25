function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArr = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // see next
    //  5. Create a variable that holds the first sample in the array.
    var result = samplesArr.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(result);
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids; 
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    console.log("otu ids: "+ otu_ids);
    console.log("otu labels: "+ otu_labels);
    console.log("sample values: "+ sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    ////////// this comment above in the starter code is SO misleading because ASCENDING means the larger numbers are last, yet it asks for DESCENDING
    //Hint: Chain the slice() method with the map() and reverse() functions 
    //  to retrieve the top 10 otu_ids sorted in descending order.
   
    // Assign the yticks
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks);
    console.log(sample_values.slice(0,10).reverse());
    console.log(otu_labels.slice(0,10).reverse());

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    },];
      
  
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria in Subject's Belly Button",
      xaxis: { title: "Amount in Sample"},
      yaxis: { title: "Type of Bacteria (OTU ID)" },
      paper_bgcolor: "rgba(0,0,0,0)",     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

   //Bubble Chart
   
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    },];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "All Bacteria Samples in Subject's Belly Button",
      showlegend: false,
      xaxis: { title: "Type of Bacteria (OTU ID)"},
      yaxis: { title: "Amount in Sample" },
      margin: {t:40},
      width: window.width,
      hovermode: "closest",
      paper_bgcolor:"rgba(0,0,0,0)",
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Gauge Chart OF SHAME
    // How often do these filthy people wash their belly buttons?

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    // Create a variable that holds the first sample in the array.
  
    var result2 = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    washFreq = result2.wfreq;
    console.log("washing frequency for subject "+ sample+ " is " + washFreq);
    
    // create the trace for the gauge 

    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "yellowgreen"},
            { range: [8, 10], color: "green"}
          ],
          
        }
      }
    ];
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 }, paper_bgcolor:'rgba(0,0,0,0)', };
    Plotly.newPlot('gauge', data, layout);

  
  });
}
