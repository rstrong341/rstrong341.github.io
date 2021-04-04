//Build metadata function
function buildMetadata(sample){
    //Connect to data and begin a function
    d3.json("samples.json").then(function(data){
        //set a variable to manipulate metadata specifically
        var metadata = data.metadata;
        //Set up filter to have the id link to the sample        
        var resultsArray = metadata.filter(function(data){
            return data.id == sample;
        })
        console.log(resultsArray)
        var result = resultsArray[0];
        //Set up variable to represent the correct section of html
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        //Seperate and print values for ID, Ethinicity, Gender ... 
        Object.entries(result).forEach(function([key,value]){
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })
    })
}

//Build function for charts
function buildCharts(sample){
    // Link to data and the setup a new function
    d3.json("samples.json").then(function(data){
        //set a variable to manipulate samples specifically
        var samples = data.samples;
        console.log(samples);
        //If (example) 940 is passed through then this will provide the correspoding sample data
        var resultsArray = samples.filter(function(data){
            return data.id === sample;
        })
        //Set a variable to equal the first item of the array
        var result = resultsArray[0];
        console.log(result)
        //Set variables for the three different types of data in samples
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values);
        //Set up bubble layout
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {
                title: 'OTU ID',
                titlefont: {
                  family: 'Arial, sans-serif',
                  size: 18,
                  color: 'lightgrey'
                }},
            yaxis: {
                title: 'Sample Values',
                titlefont: {
                  family: 'Arial, sans-serif',
                  size: 18,
                  color: 'lightgrey'
                }},
            margin: {t:30}
        }
        //Set up graph
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "YlOrRd"
                }
            }
        ];
        //call  bubble functions using plotly
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        var yticks = otu_ids.slice(0,10).map(function(otuID) {
            return `OTU ${otuID}`;
        }).reverse();

        var barData = [
            {
                y: yticks,
                x:sample_values.slice(0,10).reverse(),
                text:otu_labels,
                type: "bar",
                orientation: "h",
                marker: {
                    color: 'rgb(142,124,195)'
                  }
            }
        ];

        var barLayout = {
            title: "Top Bacteria Cultures Found",
            yaxis: {
                title: 'OTU ID',
                titlefont: {
                  family: 'Arial, sans-serif',
                  size: 18,
                  color: 'lightgrey'
                }},
            margin: {t:30, l: 150}
        };
        //Call barfunctions using plotly
        Plotly.newPlot("bar", barData, barLayout);
    })
}

//Set ID function to adapt to Test subject ID being changed
function optionChanged(id){
    console.log(id)
    buildCharts(id)
    buildMetadata(id)
}

// Start Here

function init(){
    //Select where in html to add fuction
    var selector = d3.select("#selDataset");
    // Link to data and the setup a new function
    d3.json("samples.json").then(function(data) {
        // console.log(data);

        //set a variable to manipulate names specifically
        var sampleNames = data.names;
        // Loop through names and grab the values
        sampleNames.forEach(function(name) {
                selector
                .append("option")
                .text(name)
                .property("value", name)
            })

            // Set a variable to the first name
            var firstSample = sampleNames[0];
            
            //Call functions built above
            buildCharts(firstSample);
            buildMetadata(firstSample)

    })
}

init()