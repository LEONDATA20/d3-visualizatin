// console.log(d3.select("#sample-metadata"));
const tbody = d3.select("#sample-metadata").append('table').append('tbody');

function table(tableshow){
  Object.entries(tableshow).forEach(([key,value])=>{    //[key,value] can be oneword THEN value=data[1]
    var row = tbody.append('tr');
    var cell = row.append('td').attr('class','text-wrap').style("font-weight", "bold");
      cell.text(`${key[0].toUpperCase()+key.slice(1)}: ${value}`);
  });
};
// also work for table
// function table(tableshow){
//   for (let [key, value] of Object.entries(tableshow)) {
//     d3.select("#sample-metadata").append("p")
//       .style("font-weight", "bold")
//       .text(`${key}: ${value}`);
//   }
// };

function removeTable(){ d3.select('tbody').html('') };
function defaultPrevent(){ d3.event.preventDefault();}

function initChart() {
  d3.json("./samples.json").then(function(importedData) {   //the same level with html file
    // prettify json                                 // ./ means current folder
    // console.log(JSON.stringify(importedData.samples[0], undefined, 3))

    // console.log(importedData.samples);
    // console.log(importedData.metadata);

    // all id array and append to option
    var sampleId = importedData.samples.map(sample => sample.id);
    console.log(sampleId);
    sampleId.forEach(function(x) {
      d3.select("#selDataset").append("option").text(x).property("value");
    });

    var tmdIds = importedData.samples[0].otu_ids;// already sorted
    var tmdValues = importedData.samples[0].sample_values;
    var tmdLabels = importedData.samples[0].otu_labels;

    var top10Ids = tmdIds.slice(0,10).reverse();// already sorted
    var stringIds = top10Ids.map(id=>`OTU ${id}`);
    console.log(stringIds);

    // following also work for string !!!
    // stringIds = [];
    // top10Ids.forEach(function(data, index) {
    //   this[index] = "OTU" + "\xa0" + data
    // }, stringIds);

    var top10Values = tmdValues.slice(0,10).reverse();
    console.log(top10Values);
    var top10labels = tmdLabels.slice(0,10).reverse();
    console.log(top10labels);

    // create a bar chart:
    var trace = {
      x: top10Values,
      y: stringIds,
      text: top10labels,
      type:"bar",
      orientation: "h",
      marker: {color: '#00aeff'} //"RoyalBlue", "LightSalmon", "DarkOrange", "MediumSlateBlue","MidnightBlue", "IndianRed", "MediumPurple", "Gold", "Crimson",
      // "LightSeaGreen",
    };

  // create data variable
    var data = [trace];

  // create layout variable to set plots layout
    var layout = {
      title: "Top 10 OTU",
      yaxis:{
        tickmode:"linear",  
      },
      width: 500,
      height: 700,
    };
    Plotly.newPlot("bar", data, layout);

    // create a bubble chart:
    var mathRandom = [];
    for (var i = 0; i < tmdIds.length; i++){
      mathRandom.push(Math.random())
    };
    // console.log(mathRandom);

    var trace1 = {
      x: tmdIds,
      y: tmdValues,
      mode: 'markers',
      marker: {
        color: tmdIds,
        opacity: mathRandom,
        size: tmdValues
      },
      text: tmdLabels
    };
    
    var data1 = [trace1];
    
    var layout = {
      title: 'Belly Button Biodiversity',
      showlegend: false,
      height: 600,
      width: 1000
    };
    
    Plotly.newPlot('bubble', data1, layout);

    // create gauge chart:
    var wreqArry = importedData.metadata.map(y => y.wfreq)[0];
    // console.log(wreqArry);

    var data_g = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: parseFloat(wreqArry),
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" ,    //!!! 
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 0, increasing: { color: "LightSeaGreen" } },
      // text: ["8-9", "7-8", "6-7", "5-6", "4-5", "",],//???
      // textinfo: "text",
      // textposition: "inside",
      gauge: { 
               axis: { range: [null, 10] },
               bar: { color: "Crimson" },
               steps: [
                  { range: [0, 2], color: "rgba(232, 226, 202, .5)"},
                  { range: [2, 4], color: "rgba(210, 206, 145, .5)"},
                  { range: [4, 6], color: "rgba(202, 209, 95, .5)"},
                  { range: [6, 8], color: "rgba(170, 202, 42, .5)"},
                  { range: [8, 9], color: "rgba(110, 154, 22, .5)"},
                  { range: [9, 10], color: "rgba(14, 127, 0, .5)" }],
               threshold: {
               line: { color: "Crimson", width: 4 },
               thickness: 0.75,
               value: 9}
              }
      }];

    var layout_g = { 
      width: 450, 
      height: 500, 
      margin: { t: 20, b: 20, l:20, r:25 } 
    };
    Plotly.newPlot("gauge", data_g, layout_g);

    // append table!!!
    table(importedData.metadata[0]);

  }).catch(function (err) {console.error(err);});
}  //  function initChart end

console.log(`==================================================================`)

d3.select("#selDataset").on("change", optionChanged);

//  Get id and data
function optionChanged(){        // must the same with in the html file
  // defaultPrevent();   // no this will loop twice????  has to use remove in if
  removeTable();

  d3.json("./samples.json").then(function(importedData) {
    var dropdownMenu = d3.select("#selDataset");
    var idNumber = dropdownMenu.property("value");
    console.log(idNumber)
    // Initialize an empty array for the country's data
    var x = [];
    var y = [];
    var sampleId = importedData.samples.map(sample => sample.id);
    // console.log(sampleId);   
    for (var i = 0; i < sampleId.length; i++){
      // var also can be used inside of if
      var topValues = importedData.samples[i].sample_values.slice(0,10).reverse();
      // console.log(topValues);
      var topIds = importedData.samples[i].otu_ids.slice(0,10).reverse();// already sorted
      var stringriIds = topIds.map(id=>`OTU ${id}`);
      var toplabels = importedData.samples[i].otu_labels.slice(0,10).reverse();

      if (idNumber === sampleId[i]){
     
        x = topValues;
        y = stringriIds;
        text = toplabels;

        var Bar = document.getElementById('bar');
        var Bubble = document.getElementById('bubble');
        // console.log(Bar)
        Plotly.restyle(Bar,'x',[x]);  
        Plotly.restyle(Bar,'y',[y]);
        // Plotly.restyle("bar",'y',[y]);  //both work!!!!
        Plotly.restyle(Bar,'text',[text]);
        Plotly.restyle(Bubble,'x',[importedData.samples[i].otu_ids]);
        Plotly.restyle("bubble",'y',[importedData.samples[i].sample_values]);
        Plotly.restyle("bubble",'text',[importedData.samples[i].otu_labels]);
        Plotly.restyle("bubble",'marker.size',[importedData.samples[i].sample_values]); // not sure???
        Plotly.restyle("bubble",'color',[importedData.samples[i].sample_values]); // not sure???
        Plotly.restyle("gauge",'value',[importedData.metadata.map(y => y.wfreq)[i]]);
        removeTable();  //  conflict with default!!!!?????

        // append new table
        table(importedData.metadata[i])
      

        //  why this does not work???????
        // var update = {
        //   marker: {
        //     color: [importedData.samples[i].otu_ids],
        //     size: [importedData.samples[i].sample_values],
        //     opacity: mathRandom // can not use???
        //   },
        //  };
        // Plotly.restyle('bubble',update); // not sure???
      };
    }; // loop end
  }).catch(function (err) {console.error(err);});// d3.json end 
}; // function end

initChart()












// var tbody = d3.select("#sample-metadata").append('table').append('tbody');
    // // var sampleMetadata = d3.select("#sample-metadata").append('p');// cannot use it for appending
    // tbody.append('tr').append('td').text(`id: ${importedData.metadata[0].id}` ); //property("value");
    // tbody.append('tr').append('td').text(`ethnicity: ${importedData.metadata[0].ethnicity}`);
    // tbody.append('tr').append('td').text(`gender: ${importedData.metadata[0].gender}`);
    // tbody.append('tr').append('td').text(`age: ${importedData.metadata[0].age}`);
    // tbody.append('tr').append('td').text(`location: ${importedData.metadata[0].location}`);
    // tbody.append('tr').append('td').text(`bbtype: ${importedData.metadata[0].bbtype}`);
    // tbody.append('tr').append('td').text(`ethnicity: ${importedData.metadata[0].wfreq}`);


    // // all value 
    // var value = importedData.samples.map(s => s.sample_values);
    // value.sort(function(a,b){ return b-a; });
    // console.log(value);  
    // // sort 10 value
    // var ten= value.map(xiao=>xiao.slice(0,10))[0];
    // console.log(ten);
    // //sort 10 id
    // var id = sampleA.map(goushi=>goushi.slice(0,10))[0] // the order of otu_ids also changes
    // var o=`OTU ${id}`
    // console.log(o);

    // var trace1 = {
        
    //     x: ten,
    //     y: o,
       
    //     // name: name,
    //     type: 'bar',
    //     orientation: 'h'
    //   };

    //   var data = [trace1];

    //   var layout = {
    //     title: `${stock} closing prices`,
    //     xaxis: {
    //       range: [startDate, endDate],
    //       type: "date"
    //     },
    //     yaxis: {
    //       autorange: true,
    //       type: "linear"
    //     }
    //   };
  
      // Plotly.newPlot("bar", data);
