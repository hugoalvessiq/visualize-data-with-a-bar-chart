const {
  json,
  timeFormat,
  tickFormat,
  ticks,
  tooltip,
  format,
  scaleBand,
  scaleLinear,
  max,
  min,
  axisBottom,
  axisLeft,
} = d3;

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then(({ data }) => {
  const w = 900;
  const h = 500;
  const padding = 50;

  const tooltip = d3
    .select("body")
    .append("div")
    .data(data)
    .style("position", "absolute")
    .attr("id", "tooltip")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "grey")
    .style("padding", "10px")
    .style("opacity", 1)
    .style("color", "white")
    .style("border-radius", "5px")
    .text((d) => d[0]);

  const x_scale = scaleBand().range([padding, w - padding]);
  const y_scale = scaleLinear().range([h - padding, padding]);

  x_scale.domain(data.map((d) => d[0]));
  y_scale.domain([0, max(data, (d) => d[1])]);

  const xScale = d3
    .scaleTime()
    .domain([
      new Date(min(data, (d) => d[0])),
      new Date(max(data, (d) => d[0])),
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, max(data, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .append("text")
    .attr("x", 300)
    .attr("y", 40)
    .style("font-size", "30")
    .attr("id", "title")
    .text("United States GDP");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -300)
    .attr("y", 80)
    .text("Gross Domestic Product");

  svg
    .append("text")
    .attr("x", w - 680)
    .attr("y", h - 12)
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
    .style("font-size", "12");

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .style("fill", "#0fa196")
    .attr("class", "bar")
    .attr("value", "hello")
    .attr("data-date", (d, i) => d[0])
    .attr("data-gdp", (d, i) => d[1])
    .attr("x", (d) => x_scale(d[0]))
    .attr("y", (d) => y_scale(d[1]))
    .attr("width", x_scale.bandwidth())
    .attr("height", (d) => h - y_scale(d[1]) - padding)
    .on("mouseover", (d, i) => {
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", (d, i) => {
      tooltip
        .text(`${i[0]} - ${format("($,")(i[1])} Billion`)
        .attr("data-date", `${i[0]}`)
        .style("left", d.pageX + 10 + "px")
        .style("top", d.pageY + 20 + "px");

      return tooltip.style("visibility", "visible");
    })
    .on("mouseout", (d, i) => {
      return tooltip.style("visibility", "hidden");
    });

  const xAxis = axisBottom(xScale).tickFormat(timeFormat("%Y"));

  const yAxis = axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});
