// SVG Size

let margin = { top: 20, right: 20, bottom: 20, left: 30 };

let width = 650 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var rowConverter = function(d) {
  return {
    country: d.Country,
    lifeExpectancy: +d.LifeExpectancy,
    income: +d.Income,
    population: +d.Population,
    region: d.Region
  };
};

// Load CSV file
d3.csv("wealth-health-2014.csv", row => {
  // type conversion
  return rowConverter(row);
}).then(data => {
  data.sort(function(x, y) {
    return d3.descending(x.population, y.population);
  });

  let svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let div = d3
    .select(".container")
    .append("div")
    .attr("class", "detail")
    .style("opacity", "0");

  let title = d3.select(".detail").append("b");
  let detail = d3.select(".detail").append("p");

  // Income x-axis
  let incomeMin = d3.min(data, d => d.income);
  let incomeMax = d3.max(data, d => d.income);
  let incomeScale = d3
    .scaleLog()
    .domain([incomeMin, incomeMax])
    .range([0, width]);

  // Life Expectancy y-axis
  let lifeExpectancyMin = d3.min(data, d => d.lifeExpectancy);
  let lifeExpectancyMax = d3.max(data, d => d.lifeExpectancy);
  let lifeExpectancyScale = d3
    .scaleLinear()
    .domain([lifeExpectancyMin - 2, lifeExpectancyMax + 5])
    .range([height, 0]);

  // Population Scale
  let populationMin = d3.min(data, d => d.population);
  let populationMax = d3.max(data, d => d.population);
  let populationScale = d3
    .scaleLinear()
    .domain([populationMin, populationMax])
    .range([4, 30]);

  // Region Scale
  let regions = Array.from(new Set(data.map(d => d.region)));

  let colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
  colorPalette.domain(regions);

  // Encode countries into SVG circles
  let circles = d3
    .select("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => {
      return incomeScale(d.income);
    })
    .attr("cy", d => {
      return lifeExpectancyScale(d.lifeExpectancy);
    })
    .attr("r", d => {
      return populationScale(d.population);
    })
    .attr("fill", d => {
      return colorPalette(d.region);
    })
    .attr("opacity", 0.67)
    .attr("stroke", "black")
    .on("mouseenter", (e,d) => {

      const pos = d3.pointer(event,window)
      
      console.log(pos)
      console.log(e)
      console.log(d)

      
      d3.select(".tooltip")  
        .style("display",'block')
        .style("opacity", 0.8)
        .style("left",(pos[0] + "px"))
        .style("top", (pos[1] + "px"))
        .html(`<div> Country:  ${d.country} <br> Region:  ${d.region} <br> Population:  ${format(d.population)} <br> Income:  ${format(d.income)} <br> Life Expectancy:  ${d.lifeExpectancy} <br> </div>`);    
          
    })
    .on("mouseleave", function(d) {

        d3.select(".tooltip")
        .style("display", 'hidden')
        .style("opacity", 0)
        .html('')
    });

  let xAxis = d3
    .axisBottom()
    .scale(incomeScale)
    .ticks(5)
    .tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000])
    .tickFormat(d3.format(",.0f"));

  let yAxis = d3
    .axisLeft()
    .scale(lifeExpectancyScale);

  // Draw the axis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(" + 0 + ", " + height + ")")
    .call(xAxis);

  let xLabel = d3
    .select("g")
    .append("text")
    .text("Income")
    .attr("class", "axis-label")
    .attr("x", width - 3 * margin.left)
    .attr("y", height - 10)
    .style("fill","black");

  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + -5 + ", 0 )")
    .call(yAxis);

  let yLabel = d3
    .select("g")
    .append("text")
    .text("Life Expectancy")
    .attr("class", "axis-label")
     .attr("x", margin.left -21)
    .attr("y", margin.top - 10)
    .attr("writing-mode","vertical-lr")
    .style("fill","black");

  // Legends
  var size = 17  
  svg
    .selectAll("mydots")
    .data(regions)
    .enter()
    .append("rect")
      .attr("x", 75)
      .attr("y", function(d,i){return 110 + i*(size+5)})
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d) {return colorPalette(d)})
      .attr("transform", "translate(" + 400 + ", 150 )")

  svg
    .selectAll("mylabels")
    .data(regions)
    .enter()
    .append("text")
      .attr("x",75 + size*1.2)
      .attr("y", function(d,i){return 110 + i*(size+5) + (size/2)})
      .text(function(d){return d})
      .attr("text-anchor","left")
      .style("alignment-baseline","middle")
      .attr("transform", "translate(" + 400 + ", 150 )")
});
