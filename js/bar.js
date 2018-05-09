let tractBarMargin = {
    top:60,
    bottom:32,
    left:10,
    right:40
}

let width1 = 425,
    height1 = 250,
    visWidth1 = width1 - tractBarMargin.left - tractBarMargin.right,
    visHeight1 = height1 - tractBarMargin.top - tractBarMargin.bottom;

disIdList = ["count_200kbps", "count_1mbps"];

let xScale1 = d3.scaleBand()
                .range([0,visWidth1])


let yScale1 = d3.scaleLinear()
                .range([0,visHeight1])


d3.csv("./data/residential_fixed_internet_access_service_connections.csv",function(error, data){

    for(let name of disIdList) {
        drawRangeBars("WA", name, data)
    }
})

function drawRangeBars(state, name, data) {
    d3.select("#"+ name).html("")
    let svg = d3.select("#"+ name)
            .append("svg")
            .attr("width", width1)
            .attr("height", height1)

    let chart = svg.append("g")
            .attr("transform","translate("+ tractBarMargin.left + "," + (visHeight1-tractBarMargin.top-tractBarMargin.bottom) +")")
            .attr("width", visWidth1)
            .attr("height", visHeight1)
    let yMax1 = d3.max(data, function(d){ return d[name]})
    data = data.filter((d) => d.state == state)
    // console.log(data)
    // data.sort(function(a,b){return b[name]-a[name]})
    // xScale1.domain(data.map(function(d){
    //     return d.subscriptionlevel;
    // }))
    xScale1.domain(['0%','0-20%','20-40%','40-60%','60-80%','80-100%'])
    .paddingInner(0.2)
    totalTractNum = d3.sum(data, function(d){return d[name]});
    for(let i=0; i<data.length; i++){
        data[i][name] = data[i][name]/totalTractNum;
    }

    yScale1.domain([0,1]);

    // chart.selectAll('.backbar')
    // .data(data)
    // .enter().append("rect")
    // .attr("class","backbar")
    // .attr("id", function(d) {return ("back"+d.type+"-"+d.tech).replace(" ","")})
    // .attr("x",0)
    // .attr("height", yScale.bandwidth())
    // .attr("y",function(d) { return yScale(d.type+"-"+d.tech)})
    // .attr("width", visWidth)
    // .text(function(d){return d.type+"-"+d.tech})

    chart.selectAll(".tractbar")
    .data(data)
    .enter().append("rect")
    .attr("class","tractbar")
    .attr("id", function(d) {return (d.subscriptionlevel)})
    .attr("x",function(d){ return xScale1(d.subscriptionlevel)})
    .attr("width", function(d) {return xScale1.bandwidth()})
    .attr("height", function(d) { return yScale1(d[name])})
    .attr("y",function(d) { return visHeight1-yScale1(d[name])})
    .attr("fill","grey")
    
    // .attr("fill", function(d){return fillColor(d.type)})

    chart.selectAll(".text")
    .data(data)
    .enter().append("text")
    .attr("x", function(d){ return xScale1(d.subscriptionlevel)+5})
    .attr("y", visHeight1+15)
    .text(function(d){return d.subscriptionlevel})
    .attr("font-size",10)
    .attr("fill","black")

    chart.selectAll(".text")
    .data(data)
    .enter().append("text")
    .attr("x", function(d){ return xScale1(d.subscriptionlevel)})
    .attr("y", function(d) { return visHeight1-yScale1(d[name])-5})
    .text(function(d){return (d[name]*100).toFixed(2)+"%"})
    .attr("font-size",10)
    .attr("fill","black")

    svg.append("text")
    .attr("x",10)
    .attr("y",30)
    .attr("font-size",16)
    .text(chartTitle(name))
    .attr("fill","black")
}

function chartTitle(name) {
    if(name == "count_200kbps") {
        return "Fixed Internet Subscription - 200kbps(%tracts)"
    } else if(name == "count_1mbps") {
        return "Fixed Internet Subscription - 10/1mbps(%tracts)"
    } else if(name == "twentyfiveWealth") {
        return "Connectivity Wealth (25/3)"
    } else if(name == "twentyfiveAccess") {
        return "Connectivity Access (25/3)"
    } else if(name == "hundredWealth") {
        return "Connectivity Wealth (100/50)"
    } else {
        return "Connectivity Access (100/50)"
    }
}



