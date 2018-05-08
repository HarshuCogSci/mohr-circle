function idealModelMohrsSimlator(simulator){
  this.simulator = simulator;
  this.posTop = 0.55;
  this.posLeft = 0.5;
  this.width = 0.5;
  this.height = 0.45;
  this.arc_gen = d3.arc();

  /****************************************************************************/

  this.create = function(){
    this.div = d3.select("body").append("div").attrs({ "data-step": 1, "data-intro": "<h2>Arbitrary Body</h2> This pane shows a stress element in an arbitrary body(the green circle). The default orientation of xy axes can be set by rotating the axes" });;
    this.svg = this.div.append("svg");
    this.origin = this.svg.append("g");

    this.arbitraryBody = this.origin.append("circle");
    this.arbitraryBody_text = this.origin.append("text");

    this.xy_g = this.origin.append("g");

    this.x_line = this.xy_g.append("line");
    this.x_line_left_circle = this.xy_g.append("circle");
    this.x_line_left_text_g = this.xy_g.append("g");
    this.x_line_left_text = this.x_line_left_text_g.append("text");
    this.x_line_right_circle = this.xy_g.append("circle");
    this.x_line_right_text_g = this.xy_g.append("g");
    this.x_line_right_text = this.x_line_right_text_g.append("text");

    this.y_line = this.xy_g.append("line");
    this.y_line_top_circle = this.xy_g.append("circle");
    this.y_line_top_text_g = this.xy_g.append("g");
    this.y_line_top_text = this.y_line_top_text_g.append("text");
    this.y_line_bottom_circle = this.xy_g.append("circle");
    this.y_line_bottom_text_g = this.xy_g.append("g");
    this.y_line_bottom_text = this.y_line_bottom_text_g.append("text");

    this.arc = this.xy_g.append("path");
    this.theta_text_g = this.xy_g.append("g");
    this.theta_text = this.theta_text_g.append("text");
    this.xy_prime_g = this.origin.append("g");

    this.x_prime_line = this.xy_prime_g.append("line");
    this.x_prime_line_left_circle = this.xy_prime_g.append("circle");
    this.x_prime_line_left_text_g = this.xy_prime_g.append("g");
    this.x_prime_line_left_text = this.x_prime_line_left_text_g.append("text");
    this.x_prime_line_right_circle = this.xy_prime_g.append("circle");
    this.x_prime_line_right_text_g = this.xy_prime_g.append("g");
    this.x_prime_line_right_text = this.x_prime_line_right_text_g.append("text");

    this.y_prime_line = this.xy_prime_g.append("line");
    this.y_prime_line_top_circle = this.xy_prime_g.append("circle");
    this.y_prime_line_top_text_g = this.xy_prime_g.append("g");
    this.y_prime_line_top_text = this.y_prime_line_top_text_g.append("text");
    this.y_prime_line_bottom_circle = this.xy_prime_g.append("circle");
    this.y_prime_line_bottom_text_g = this.xy_prime_g.append("g");
    this.y_prime_line_bottom_text = this.y_prime_line_bottom_text_g.append("text");

    this.element = this.xy_prime_g.append("rect");

    this.setup();
    this.createEvents();
  }

  /****************************************************************************/

  this.setup = function(){
    this.svg.styles({ "background": "#a8f1d8" })

    this.arbitraryBody.styles({ "stroke": "#8dc6b3", "stroke-opacity": 1, "fill": "#8dc6b3", "fill-opacity": 0.7 });
    this.arbitraryBody_text.styles({ "font-family": "opensans", "font-size": "1.8vh", "fill": "#555", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.x_line.styles({ "stroke": "gray", "stroke-width": 1.5, "stroke-opacity": 0.8, "stroke-dasharray": "6,3" });
    this.x_line_left_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.x_line_left_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "gray" });
    this.x_line_right_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.x_line_right_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "gray" });

    this.y_line.styles({ "stroke": "gray", "stroke-width": 1.5, "stroke-opacity": 0.8, "stroke-dasharray": "6,3" });
    this.y_line_top_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.y_line_top_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "gray" });
    this.y_line_bottom_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.y_line_bottom_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "gray" });

    this.arc.styles({ "fill": "#dc1f9e", "stroke": "none" });
    this.theta_text.styles({ "font-family": "opensans", "font-size": "2.5vh", "fill": "#dc1f9e", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.x_prime_line.styles({ "stroke": "#555", "stroke-width": 1.5, "stroke-opacity": 0.8, "stroke-dasharray": "6,3" });
    this.x_prime_line_left_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.x_prime_line_left_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "#555" });
    this.x_prime_line_right_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.x_prime_line_right_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "#555" });

    this.y_prime_line.styles({ "stroke": "#555", "stroke-width": 1.5, "stroke-opacity": 0.8, "stroke-dasharray": "6,3" });
    this.y_prime_line_top_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.y_prime_line_top_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "#555" });
    this.y_prime_line_bottom_circle.attrs({ r: 4, class: "idealModel_circle" });
    this.y_prime_line_bottom_text.styles({ "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle", "fill": "#555" });

    this.element.styles({ "fill": "#BBB", "stroke": "#AAA" });

    this.resize();
  }

  /****************************************************************************/

  this.resize = function(){
    this.div.styles({ position: "absolute", left: this.posLeft*innerWidth, top: this.posTop*innerHeight, width: this.width*innerWidth, height: this.height*innerHeight });
    this.svg.styles({ width: "100%", height: "100%" });

    this.origin.attrs({ transform: "translate(" +0.5*this.width*innerWidth+ "," +0.5*this.height*innerHeight+ ")" });
    this.arbitraryBody.attrs({ cx: 0, y: 0, r: 80 });
    this.arbitraryBody_text.attrs({ x: 0*this.width*innerWidth, y: -0.4*this.height*innerHeight }).text("Stress element in an arbitrary body");

    this.cx = (0.5*this.width)*innerWidth;
    this.cy = (0.5*this.height)*innerHeight;

    this.update();
  }

  /****************************************************************************/

  this.update = function(){
    this.xy_g.attrs({ "transform": "rotate(" +(-this.simulator.xy_angle)+ ")" })

    temp_dist_xy = 180;
    this.x_line.attrs({ x1: -temp_dist_xy, x2: temp_dist_xy, y1: 0, y2: 0 })
    this.x_line_left_circle.attrs({ cx: -temp_dist_xy, cy: 0 })
    this.x_line_left_text_g.attrs({ transform: "translate(" +(temp_dist_xy+20)+ ",0) rotate(" +this.simulator.xy_angle+ ")"  })
    this.x_line_left_text.text("x");
    this.x_line_right_circle.attrs({ cx: temp_dist_xy, cy: 0 })
    this.x_line_right_text_g.attrs({ transform: "translate(" +(-temp_dist_xy-20)+ ",0) rotate(" +this.simulator.xy_angle+ ")"  })
    this.x_line_right_text.text("x");

    temp_dist_xy = 100;
    this.y_line.attrs({ y1: -temp_dist_xy, y2: temp_dist_xy, x1: 0, x2: 0 })
    this.y_line_bottom_circle.attrs({ cy: -temp_dist_xy, cx: 0 })
    this.y_line_bottom_text_g.attrs({ transform: "translate(0," +(temp_dist_xy+20)+ ") rotate(" +this.simulator.xy_angle+ ")"  })
    this.y_line_bottom_text.text("y");
    this.y_line_top_circle.attrs({ cy: temp_dist_xy, cx: 0 })
    this.y_line_top_text_g.attrs({ transform: "translate(0," +(-temp_dist_xy-20)+ ") rotate(" +this.simulator.xy_angle+ ")"  })
    this.y_line_top_text.text("y");

    this.element.attrs({ x: -10, y: -10, width: 20, height: 20 })
    this.simulate();
  }

  /****************************************************************************/

  this.simulate = function(){
    this.xy_prime_g.attrs({ "transform": "rotate(" +(-(this.simulator.xy_angle + this.simulator.rotationAngle))+ ")" })

    temp_dist_xy = 150;
    this.x_prime_line.attrs({ x1: -temp_dist_xy, x2: temp_dist_xy, y1: 0, y2: 0 })
    this.x_prime_line_left_circle.attrs({ cx: -temp_dist_xy, cy: 0 })
    this.x_prime_line_left_text_g.attrs({ transform: "translate(150,20) rotate(" +(this.simulator.xy_angle + this.simulator.rotationAngle)+ ")"  })
    this.x_prime_line_left_text.text("x'");
    this.x_prime_line_right_circle.attrs({ cx: temp_dist_xy, cy: 0 })
    this.x_prime_line_right_text_g.attrs({ transform: "translate(-150,20) rotate(" +(this.simulator.xy_angle + this.simulator.rotationAngle)+ ")"  })
    this.x_prime_line_right_text.text("x'");

    this.arc_gen.innerRadius(30).outerRadius(32.5).startAngle(0.5*Math.PI).endAngle(0.5*Math.PI-this.simulator.rotationAngle*Math.PI/180);
    this.arc.attrs({ d: this.arc_gen });
    this.theta_text_g.attrs({ "transform": " rotate(" +(-0.5*this.simulator.rotationAngle)+ ") translate(50,0) rotate(" +(0.5*this.simulator.rotationAngle)+ ")" })
    this.theta_text.text("θ");
    if(this.simulator.rotationAngle < 1){ this.theta_text.text(""); }

    // this.y_prime_line.attrs({ y1: -temp_dist_xy, y2: temp_dist_xy, x1: 0, x2: 0 })
    // this.y_prime_line_bottom_circle.attrs({ cy: -temp_dist_xy, cx: 0 })
    // this.y_prime_line_bottom_text_g.attrs({ transform: "translate(20,150) rotate(" +(this.simulator.xy_angle + this.simulator.rotationAngle)+ ")"  })
    // this.y_prime_line_bottom_text.text("y'");
    // this.y_prime_line_top_circle.attrs({ cy: temp_dist_xy, cx: 0 })
    // this.y_prime_line_top_text_g.attrs({ transform: "translate(20,-150) rotate(" +(this.simulator.xy_angle + this.simulator.rotationAngle)+ ")"  })
    // this.y_prime_line_top_text.text("y'");
  }

  /****************************************************************************/

  this.createEvents = function(){
    parent_idealModel = this;
    this.svg.call(d3.drag()
      .on("start", function(){
        this.startPos = {x: d3.event.x, y: d3.event.y};
        this.xy_angle_start = parent_idealModel.simulator.xy_angle;
        this.angleChange_start = Math.atan2(d3.event.y-parent_idealModel.cy, d3.event.x-parent_idealModel.cx);
        update_start();
      })
      .on("drag", function(){
        angleChange_change = Math.atan2(d3.event.y-parent_idealModel.cy, d3.event.x-parent_idealModel.cx);
        parent_idealModel.simulator.xy_angle = this.xy_angle_start - (angleChange_change - this.angleChange_start)*180/Math.PI;
        update();
      })
      .on("end", function(){
        update_end();
      })
    )
  }

  /****************************************************************************/

}
