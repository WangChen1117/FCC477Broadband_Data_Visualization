// dataset = {
//     "children": [{"Name":"Olives","Count":4319},
//         {"Name":"Tea","Count":4159},
//         {"Name":"Mashed Potatoes","Count":2583},
//         {"Name":"Boiled Potatoes","Count":2074},
//         {"Name":"Milk","Count":1894},
//         {"Name":"Chicken Salad","Count":1809},
//         {"Name":"Vanilla Ice Cream","Count":1713},
//         {"Name":"Cocoa","Count":1636},
//         {"Name":"Lettuce Salad","Count":1566},
//         {"Name":"Lobster Salad","Count":1511},
//         {"Name":"Chocolate","Count":1489},
//         {"Name":"Apple Pie","Count":1487},
//         {"Name":"Orange Juice","Count":1423},
//         {"Name":"American Cheese","Count":1372},
//         {"Name":"Green Peas","Count":1341},
//         {"Name":"Assorted Cakes","Count":1331},
//         {"Name":"French Fried Potatoes","Count":1328},
//         {"Name":"Potato Salad","Count":1306},
//         {"Name":"Baked Potatoes","Count":1293},
//         {"Name":"Roquefort","Count":1273},
//         {"Name":"Stewed Prunes","Count":1268}]
// };

d3.csv("./data/whole_nation_state.csv",function(error, data){
    drawBubbles(data,"6")
})

// drawBubbles(dataset)

function reformatData(dataset) {
    let output = {children:[]};
    dataset = dataset.map(function(d){
        return {"Name":d.tech+"-"+d.type, "Count":d.providername, "Type":d.type}
    })
    output.children = dataset;
    // console.log(output)
    return output
}

function drawBubbles(dataset, statecode) {
    // var diameter = 600;
    d3.select(".bubbles").html('')
    dataset = dataset.filter(d => d.statecode == statecode)
    dataset = reformatData(dataset)
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    let fillColor = d3.scaleOrdinal()
      .domain(['business', 'consumer', 'mobile'])
      .range(['#257FE7', '#F3AD21', '#F13521']);

    var bubble = d3.pack(dataset)
        .size([425, 300])
        .padding(1.5);

    var svg = d3.select(".bubbles")
        .append("svg")
        .attr("width", 425)
        .attr("height", 300)
        .attr("class", "bubble");

    var types = ["business", "consumer", "mobile"];
    for(let i=0; i<types.length; i++){
        svg.append("rect")
        .attr("x",20)
        .attr("y",20+17.5*i)
        .attr("width",10)
        .attr("height",10)
        .attr("fill",fillColor(types[i]));

        svg.append("text")
        .attr("x",35)
        .attr("y",28.5+17.5*i)
        .attr("font-size",12)
        .text(types[i])
    }
    

    var nodes = d3.hierarchy(dataset)
        .sum(function(d) { return d.Count; });

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + (d.y + 10) + ")";
        });

    node.append("title")
        .text(function(d) {
            return d.Name + ": " + d.Count;
        });

    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return fillColor(d.data.Type);
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Name.split("-")[0];
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/3;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Count;
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", 300 + "px");
}

