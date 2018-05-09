let connectivityBarMargin = {
    top:40,
    bottom:10,
    left:10,
    right:40
}

let width = 212.5,
    height = 300,
    visWidth = width - connectivityBarMargin.left - connectivityBarMargin.right,
    visHeight = height - connectivityBarMargin.top - connectivityBarMargin.bottom;

idList = ["twentyfiveWealth", "hundredWealth","twentyfiveAccess", "hundredAccess"];



let xScale = d3.scaleLinear()
                .range([0,visWidth])

let yScale = d3.scaleBand()
                .range([0,visHeight])
                

let fillColor = d3.scaleOrdinal()
                .domain(['business', 'consumer', 'mobile'])
                .range(['#257FE7', '#F3AD21', '#F13521']);

d3.csv("./data/whole_nation_state.csv", function(error, data){
    data.map(function(d){
        d.twentyfiveWealth = +d.twentyfive_three/195574;
        d.twentyfiveAccess = +d.bc_twentyfive/195574;
        d.hundredWealth = +d.hundred_fifty/195574;
        d.hundredAccess = +d.bc_hundred/195574;
        return d;
    })

    for(let name of idList){
        //WA as Default 
        drawBars("53", name , data)
    }
    
})

function drawBars(state, name, data) {
    d3.select("#"+name).html("")
    let svg = d3.select("#"+ name)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

    let chart = svg.append("g")
            .attr("transform","translate("+ connectivityBarMargin.left + "," + connectivityBarMargin.top +")")
            .attr("width", visWidth)
            .attr("height", visHeight)
    let xMax = d3.max(data, function(d){ return d[name]})
    data = data.filter((d) => d.statecode == state)
    data.sort(function(a,b){return b[name]-a[name]})
    
    yScale.domain(data.map(function(d) {
        return d.type+"-"+d.tech;
    }))
    .paddingInner(0.1)
    xScale.domain([0,4])
    if(/access/i.test(name)) {
        xScale.domain([0,1])
    }
    // console.log(data)

    chart.selectAll('.backbar')
    .data(data)
    .enter().append("rect")
    .attr("class","backbar")
    .attr("id", function(d) {return ("back"+d.type+"-"+d.tech).replace(" ","")})
    .attr("x",0)
    .attr("height", yScale.bandwidth())
    .attr("y",function(d) { return yScale(d.type+"-"+d.tech)})
    .attr("width", visWidth)
    // .text(function(d){return d.type+"-"+d.tech})

    chart.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class","bar")
    .attr("id", function(d) {return (d.type+"-"+d.tech).replace(" ","")})
    .attr("x",0)
    .attr("height", yScale.bandwidth())
    .attr("y",function(d) { return yScale(d.type+"-"+d.tech)})
    .attr("width", function(d) {return xScale(d[name])})
    .attr("fill", function(d){return fillColor(d.type)})

    chart.selectAll(".text")
    .data(data)
    .enter().append("text")
    .attr("x", 5)
    .attr("y", function(d) { return yScale(d.type+"-"+d.tech)+yScale.bandwidth()-2.5})
    .text(function(d){return d.type+"-"+d.tech})
    .attr("font-size",10)

    chart.selectAll(".text")
    .data(data)
    .enter().append("text")
    .attr("x", visWidth+5)
    .attr("y", function(d) { return yScale(d.type+"-"+d.tech)+yScale.bandwidth()-2.5})
    .text(function(d){
        return /Access/i.test(name) ? (+d[name]*100).toFixed(2)+"%" : +d[name].toFixed(2)
    })
    .attr("font-size",10)
    .attr("fill","black")

    svg.append("text")
    .attr("x",10)
    .attr("y",30)
    .attr("font-size",14)
    .text(chartTitle(name))
    .attr("fill","black")
}

// chart.selectAll(".bar")
//     .data()
               
            //    svg.selectAll(".bar")
            //    .data(data)
            //    .enter().append("rect")
            //    .attr("class", "bar")
            //    .attr("id", function(d){return d.letter;})
            //    .attr("x", function(d) { return x_scale(d.letter)+1;})
            //    .attr("width", x_scale.rangeBand()-3)
            //    .attr("y", function(d) { return y_scale(d.frequency);})
            //    .attr("height", function(d) { return vis_height - y_scale(d.frequency);})
            //    .on("mouseover", function(){
            //        if($("#popup").css("opacity")==0){
            //            var x = d3.mouse(this)[0];
            //            var y = d3.mouse(this)[1]-30;
            //            var id_to_get = $(this).attr("id");
            //            var message = "";
            //            for (var i=0; i<data.length; i++){
            //                if(data[i]["letter"] == id_to_get){
            //                    message = "<span id='message'>"+data[i]["letter"];
            //                    message += "</br>" + data[i]["frequency"]+"</span>";
            //                }
            //            }
            //            $("#popup").append(message);
            //            $("#popup").css("opacity",1);
            //            $("#popup").css("left",x);
            //            $("#popup").css("top",y);
            //        }
            //    })
            //    .on("mousemove", function(){
            //        var x = d3.mouse(this)[0];
            //        var y = d3.mouse(this)[1]-30;
            //        $("#popup").css("left",x);
            //        $("#popup").css("top",y);
            //    })			
            //    .on("mouseout", function(){
            //        $("#popup").css("opacity",0);
            //        $("#message").remove();
            //    });
   