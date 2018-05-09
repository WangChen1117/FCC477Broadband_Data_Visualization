var width = 350,
    height = 350,
    centered;

var projection =  d3.geoAlbersUsa();

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("./data/us-counties-github.json",function(json){
  console.log(json);
    

    var state = topojson.feature(json, json.objects.collection).features.filter(function(d) { return d.properties.state_fips == 36; })

    var states = topojson.feature(json, json.objects.collection).features

    for(let i=1; i<57; i++) {
        let state1 = states.filter(function(d) {
            return d.properties.state_fips == i;
        })
        // console.log(state1)
        let cen1 = path.centroid(state1[0]);
        let s1 = .09 / Math.max(cen1[0] / width, cen1[1] / height);
        let t1 = [(width - s1*cen1[0]) / 2, (height - s1 * cen1[1]) / 2]
        // console.log(s1*cen1[0])
        // console.log(s1)
        // console.log(t1)
    }
      
        // var states = topojson.feature(us, us.objects.states),
        //     state = states.features.filter(function(d) { return d.id === 06; })[0];

        console.log(state)
      
        projection.scale(1)
          .translate([0, 0]);
        
        var cen = path.centroid(state[0])
       
        var b = path.bounds(state[0]),
            s = 2 / Math.max(cen[0] / width, cen[1] / height);
            t = [(width - s * cen[0]) / 2, (height - s * cen[1]) / 2];

        //   console.log(cen)
        //   console.log(s)
          console.log(b)


       
        projection.scale(s)
          .translate([t[0]-width,t[1]+height/2]);


          svg.selectAll("path")
          .attr("id", "state_fips")
          .data(state)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("stroke","white")
          .attr("fill", "gray");
       
      
      
        // svg.append("path")
        //     .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        //     .attr("class", "mesh")
        //     .attr("d", path);
      
        // svg.append("path")
        //     .datum(state)
        //     .attr("class", "outline")
        //     .attr("d", path)
        //     .attr('id', 'land');
      
        //  svg.append("clipPath")
        //     .attr("id", "clip-land")
        //     .append("use")
        //     .attr("xlink:href", "#land");
      
        // svg.selectAll("path")
        //     .data(topojson.feature(us, us.objects.counties).features)
        //     .enter().append("path")
        //     .attr("d", path)
        //     .attr('county-id', function(d){
        //        return d.id
        //     }).attr("clip-path", "url(#clip-land)")
        //     .attr('class', 'county');



});