function MohrsSimulatorCircle(simulator){
  this.simulator = simulator;
  this.posLeft = 0;
  this.posTop = 0.05;
  this.width = 0.5;
  this.height = 0.5;
  this.scale = d3.scaleLinear();
  this.arc_gen = d3.arc();

  this.create = function(){
    this.div = d3.select("body").append("div").attrs({ "data-step": 3, "data-intro": "<h2>Mohr's Stress Circle</h2>The Mohr's circle for the corresponding stress values" });
    this.svg = this.div.append("svg").attrs({ "data-step": 5, "data-intro": "<h2>Mohr's Stress Circle</h2>The corresponding chnages can be seen in the Mohr's Circle." });
    this.origin = this.svg.append("g");
    this.xAxis = this.origin.append("line");
    this.yAxis = this.origin.append("line");
    this.circle = this.origin.append("circle");

    this.markerCircles = {};
    this.markerCircles.sigma_max = this.origin.append("circle");
    this.markerCircles.sigma_min = this.origin.append("circle");
    this.markerCircles.tau_max_x = this.origin.append("circle");
    this.markerCircles.tau_max_y = this.origin.append("circle");

    this.xy_line = this.origin.append("line");
    this.xy_prime_line = this.origin.append("line");

    this.x_circle = this.origin.append("circle");
    this.y_circle = this.origin.append("circle");

    this.xy_direction_g = this.origin.append("g");
    this.arc_path = this.xy_direction_g.append("path");
    this.arc_text_g = this.origin.append("g");
    this.arc_text = this.arc_text_g.append("text");

    this.tau_x = {};
    this.tau_x.line = this.origin.append("line");
    this.tau_y = {};
    this.tau_y.line = this.origin.append("line");
    this.sigma_y = {};
    this.sigma_y.line = this.origin.append("line");
    this.sigma_x = {};
    this.sigma_x.line = this.origin.append("line");
    this.tau_x.circle = this.origin.append("circle");
    this.tau_y.circle = this.origin.append("circle");
    this.sigma_y.circle = this.origin.append("circle");
    this.sigma_x.circle = this.origin.append("circle");

    // this.x_text = this.origin.append("text");
    // this.y_text = this.origin.append("text");
    this.x_prime_text_g = this.origin.append("g");
    this.x_prime_text = this.x_prime_text_g.append("text");
    this.y_prime_text_g = this.origin.append("g");
    this.y_prime_text = this.y_prime_text_g.append("text");

    this.path = this.origin.append("path");
    this.circle_centre = this.origin.append("circle");
    this.origin_centre = this.origin.append("circle");

    this.setup();
  }

  this.setup = function(){
    this.svg.styles({ "background": "#dcf0ff" })

    this.xAxis.styles({ "stroke": "#CCC", "stroke-width": 1, "stroke-dasharray": "3,3" });
    this.yAxis.styles({ "stroke": "#CCC", "stroke-width": 1, "stroke-dasharray": "3,3" });
    this.circle.styles({ "stroke": "#BBB", "stroke-width": 1, "fill": "none", "stroke-dasharray": "6,3" });

    this.markerCircles.sigma_max.styles({ "stroke": "none", "fill": "#CCC" });
    this.markerCircles.sigma_min.styles({ "stroke": "none", "fill": "#CCC" });
    this.markerCircles.tau_max_x.styles({ "stroke": "none", "fill": "#CCC" });
    this.markerCircles.tau_max_y.styles({ "stroke": "none", "fill": "#CCC" });

    this.arc_path.styles({ "fill": "#dc1f9e", "stroke": "none" });
    this.arc_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "#dc1f9e" });

    this.xy_line.styles({ "stroke": "gray", "stroke-dasharray": "0,0", "stroke-width": 1 })
    this.xy_prime_line.styles({ "stroke": "gray", "stroke-dasharray": "0,0", "stroke-width": 1 })
    this.circle_centre.styles({ "stroke": "none", "stroke-width": 1, "fill": "gray" });
    this.origin_centre.styles({ "stroke": "none", "stroke-width": 1, "fill": "gray" });
    this.path.styles({ "fill": "lightgreen", "fill-opacity": 0.2, "stroke": "none" });

    this.sigma_x.circle.styles({ "stroke": "blue", "stroke-width": 1, "fill": "blue" });
    this.sigma_x.line.styles({ "stroke": "blue", "stroke-width": 2, "stroke-opacity": 0.4, "stroke-dasharray": "0,0" });
    this.sigma_y.circle.styles({ "stroke": "red", "stroke-width": 1, "fill": "red" });
    this.sigma_y.line.styles({ "stroke": "red", "stroke-width": 2, "stroke-opacity": 0.6, "stroke-dasharray": "0,0", "stroke-dashoffset": 0 });
    this.tau_x.circle.styles({ "stroke": "green", "stroke-width": 1, "fill": "green" });
    this.tau_x.line.styles({ "stroke": "green", "stroke-width": 2, "stroke-dasharray": "3,3" });
    this.tau_y.circle.styles({ "stroke": "green", "stroke-width": 1, "fill": "green" });
    this.tau_y.line.styles({ "stroke": "green", "stroke-width": 2, "stroke-dasharray": "3,3" });

    this.x_circle.styles({ "stroke": "none", "stroke-width": 1, "fill": "#BBB" });
    this.y_circle.styles({ "stroke": "none", "stroke-width": 1, "fill": "#BBB" });

    this.x_prime_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "gray" });
    this.y_prime_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "gray" });

    this.resize();
  }

  this.resize = function(){
    this.div.styles({ position: "absolute", left: this.posLeft*innerWidth, top: this.posTop*innerHeight, width: this.width*innerWidth, height: this.height*innerHeight });
    this.svg.styles({ width: "100%", height: "100%" });
    this.origin.attrs({ transform: "translate(" +0.5*this.width*innerWidth+ "," +0.5*this.height*innerHeight+ ")" });
    this.xAxis.attrs({ x1: -0.45*this.width*innerWidth, x2: 0.45*this.width*innerWidth, y1: 0, y2: 0 });
    this.yAxis.attrs({ y1: -0.45*this.width*innerWidth, y2: 0.45*this.width*innerWidth, x1: 0, x2: 0 });
    this.scale.domain([0, 10]).range([0, 0.45*this.height*innerHeight]);

    this.update();
  }

  this.update = function(){
    sigma_x = this.scale(this.simulator.sigma_x.value);
    sigma_y = this.scale(this.simulator.sigma_y.value);
    tau_xy = this.scale(this.simulator.tau_xy.value);
    this.centre = 0.5*(sigma_x+sigma_y);
    temp_radius_squared = Math.pow(0.5*(sigma_x-sigma_y), 2) + Math.pow(tau_xy, 2);
    this.radius = Math.sqrt(temp_radius_squared);
    this.circle.attrs({ cx: this.centre, cy: 0, r: this.radius });

    this.xy_angle = Math.atan2(-tau_xy, 0.5*(sigma_x-sigma_y)) * 180/Math.PI;

    this.markerCircles.sigma_max.attrs({ cx: this.centre+this.radius, cy: 0, r: 4 });
    this.markerCircles.sigma_min.attrs({ cx: this.centre-this.radius, cy: 0, r: 4 });
    this.markerCircles.tau_max_x.attrs({ cx: this.centre, cy: this.radius, r: 4 });
    this.markerCircles.tau_max_y.attrs({ cx: this.centre, cy: -this.radius, r: 4 });

    this.circle_centre.attrs({ cx: this.centre, cy: 0, r: 3 });
    // this.path.attrs({ d: "M " +sigma_x+ " 0 L " +sigma_x+ " " +tau_xy+ " L " +sigma_y+ " " +(-tau_xy)+ " L " +sigma_y+ " 0 z" })

    // this.sigma_x.circle.attrs({ cx: sigma_x, cy: 0, r: 3 })
    // this.sigma_x.line.attrs({ x1: 0, y1: 0, x2: sigma_x, y2: 0 })
    // this.sigma_y.circle.attrs({ cx: sigma_y, cy: 0, r: 3 })
    // this.sigma_y.line.attrs({ x1: 0, y1: 0, x2: sigma_y, y2: 0 })
    // this.tau_x.circle.attrs({ cx: sigma_x, cy: tau_xy, r: 3 })
    // this.tau_x.line.attrs({ x1: sigma_x, y1: 0, x2: sigma_x, y2: tau_xy })
    // this.tau_y.circle.attrs({ cx: sigma_y, cy: -tau_xy, r: 3 })
    // this.tau_y.line.attrs({ x1: sigma_y, y1: 0, x2: sigma_y, y2: -tau_xy })

    this.xy_line.attrs({ x1: sigma_x, y1: tau_xy, x2: sigma_y, y2: -tau_xy })

    this.xy_direction_g.attrs({ transform: "translate(" +this.centre+ ",0) rotate(" +(-this.xy_angle)+ ")" });

    // this.x_text.attrs({ x: this.centre + (this.radius+20)*Math.cos(-this.xy_angle*Math.PI/180), y: 0 + (this.radius+20)*Math.sin(-this.xy_angle*Math.PI/180) }).text("x");
    // this.y_text.attrs({ x: this.centre + (this.radius+20)*Math.cos(-(this.xy_angle + 180)*Math.PI/180), y: 0 + (this.radius+20)*Math.sin(-(this.xy_angle + 180)*Math.PI/180) }).text("y");

    this.x_circle.attrs({ cx: sigma_x, cy: tau_xy, r: 3 });
    this.y_circle.attrs({ cx: sigma_y, cy: -tau_xy, r: 3 });

    this.simulate();
  }

  this.simulate = function(){
    // sigma_x_prime = this.centre + this.radius*Math.cos((this.xy_angle+2*this.simulator.rotationAngle)*Math.PI/180);
    // sigma_y_prime = this.centre + this.radius*Math.cos((this.xy_angle+2*this.simulator.rotationAngle+180)*Math.PI/180);
    // tau_xy_prime = -this.radius*Math.sin((this.xy_angle+2*this.simulator.rotationAngle)*Math.PI/180);

    sigma_x_prime = this.scale(this.simulator.sigma_x_prime.value);
    sigma_y_prime = this.scale(this.simulator.sigma_y_prime.value);
    tau_xy_prime = this.scale(this.simulator.tau_xy_prime.value);

    this.path.attrs({ d: "M " +sigma_x_prime+ " 0 L " +sigma_x_prime+ " " +tau_xy_prime+ " L " +sigma_y_prime+ " " +(-tau_xy_prime)+ " L " +sigma_y_prime+ " 0 z" })

    this.arc_gen.innerRadius(30).outerRadius(33).startAngle(0.5*Math.PI).endAngle(0.5*Math.PI-2*this.simulator.rotationAngle*Math.PI/180);
    this.arc_path.attrs({ d: this.arc_gen });
    this.arc_text_g.attrs({ transform: "translate(" +this.centre+ ") rotate(" +(-this.xy_angle-this.simulator.rotationAngle)+ ") translate(" +(45)+ ", 0) rotate(" +(-(-this.xy_angle-this.simulator.rotationAngle))+ ")" })
    this.arc_text.text("2θ");
    if(this.simulator.rotationAngle < 1){ this.arc_text.text(""); }

    this.sigma_x.circle.attrs({ cx: sigma_x_prime, cy: 0, r: 3 })
    this.sigma_x.line.attrs({ x1: 0, y1: 0, x2: sigma_x_prime, y2: 0 })
    this.sigma_y.circle.attrs({ cx: sigma_y_prime, cy: 0, r: 3 })
    this.sigma_y.line.attrs({ x1: 0, y1: 0, x2: sigma_y_prime, y2: 0 })
    this.tau_x.circle.attrs({ cx: sigma_x_prime, cy: tau_xy_prime, r: 3 })
    this.tau_x.line.attrs({ x1: sigma_x_prime, y1: 0, x2: sigma_x_prime, y2: tau_xy_prime })
    this.tau_y.circle.attrs({ cx: sigma_y_prime, cy: -tau_xy_prime, r: 3 })
    this.tau_y.line.attrs({ x1: sigma_y_prime, y1: 0, x2: sigma_y_prime, y2: -tau_xy_prime })

    this.xy_prime_line.attrs({ x1: sigma_x_prime, y1: tau_xy_prime, x2: sigma_y_prime, y2: -tau_xy_prime })

    this.x_prime_text_g.attrs({ transform: " translate(" +this.centre+ ",0) rotate(" +(-this.xy_angle-2*this.simulator.rotationAngle)+ ") translate(" +(this.radius+60)+ ",0) rotate(" +(this.xy_angle+2*this.simulator.rotationAngle)+ ")" })
    temp_text = "x' (";
    temp_text += "<tspan style=\"fill: blue; font-size: 2.5vh; \">σ</tspan><tspan style=\"fill: blue; baseline-shift: sub; font-size: 1.5vh; \">x'</tspan>"
    temp_text += " , ";
    temp_text += "<tspan style=\"fill: green; font-size: 2.5vh; \">𝜏</tspan><tspan style=\"fill: green; baseline-shift: sub; font-size: 1.5vh; \">x'y'</tspan>"
    temp_text += ")";
    this.x_prime_text.html(temp_text);
    if(this.radius == 0){ this.x_prime_text.html(""); }

    this.y_prime_text_g.attrs({ transform: " translate(" +this.centre+ ",0) rotate(" +(-this.xy_angle-2*this.simulator.rotationAngle+180)+ ") translate(" +(this.radius+60)+ ",0) rotate(" +(this.xy_angle+2*this.simulator.rotationAngle-180)+ ")" })
    temp_text = "y' (";
    temp_text += "<tspan style=\"fill: red; font-size: 2.5vh; \">σ</tspan><tspan style=\"fill: red; baseline-shift: sub; font-size: 1.5vh; \">y'</tspan>"
    temp_text += " , ";
    temp_text += "<tspan style=\"fill: green; font-size: 2.5vh; \">𝜏</tspan><tspan style=\"fill: green; baseline-shift: sub; font-size: 1.5vh; \">x'y'</tspan>"
    temp_text += ")";
    this.y_prime_text.html(temp_text);
    if(this.radius == 0){ this.y_prime_text.html(""); }

  }

}
