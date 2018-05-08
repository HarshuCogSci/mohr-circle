function createSchematic(simulator){
  this.simulator = simulator;
  this.posTop = 0.05;
  this.posLeft = 0.5;
  this.width = 0.5;
  this.height = 0.5;
  this.scale = d3.scaleLinear();

  /****************************************************************************/

  this.create = function(){
    this.div = d3.select("body").append("div").attrs({ "data-step": 4, "data-intro": "<h2>Stress Element</h2>Change the orientation of the stress element using the dial or by dragging around in the pane" });
    this.svg = this.div.append("svg");
    this.origin = this.svg.append("g");

    this.svg.append("marker").attrs({ id: "arrow", viewBox: "0 0 10 10", refX: 9.3, refY: 5, markerWidth: 5, markerHeight: 5, orient: "auto" })
            .append("path").attrs({ id: "arrow-path", d: "M 0 0 L 10 5 L 0 10 z" }).styles({ "stroke": "black", "fill": "black" });

    this.element_g = this.origin.append("g");
    this.element = this.element_g.append("rect");

    this.element_sides = [];
    for(i = 0; i < 4; i++){
      this.element_sides[i] = {};
      this.element_sides[i].g = this.element_g.append("g");
      this.element_sides[i].sigma_line = this.element_sides[i].g.append("line");
      this.element_sides[i].tau_line = this.element_sides[i].g.append("line");
    }

    this.dial_theta = new Dial();
    this.dial_theta.createDial({ svg: this.svg,
                                symbol: "θ",
                                dialValue: {min: 0, max: 180 },
                                color: "#dc1f9e",
                                unit: "°",
                                userChange_allowed: true,
                                valueShown: true,
                                dispatchIdentifier: "theta_change",
                                dispatch_call: this.simulator.dispatchSim });

    this.setup();
    this.createEvents();
  }

  /****************************************************************************/

  this.setup = function(){
    this.element.styles({ "fill": "#BBB", "fill-opacity": 0.5, "stroke": "#AAA" });
    for(i = 0; i < 4; i++){
      temp_color = "";
      if(i%2 == 0){ temp_color = "blue"; } else{ temp_color = "red"; }
      this.element_sides[i].sigma_line.styles({ "stroke": temp_color, "stroke-width": 1.5 });
      this.element_sides[i].tau_line.styles({ "stroke": "green", "stroke-width": 1.5 });
    }

    this.resize();
  }

  /****************************************************************************/

  this.resize = function(){
    this.div.styles({ position: "absolute", left: this.posLeft*innerWidth, top: this.posTop*innerHeight, width: this.width*innerWidth, height: this.height*innerHeight });
    this.svg.styles({ width: "100%", height: "100%" });
    this.origin.attrs({ transform: "translate(" +0.5*this.width*innerWidth+ "," +0.5*this.height*innerHeight+ ")" });

    this.cx = (0.5*this.width)*innerWidth;
    this.cy = (0.5*this.height)*innerHeight;

    this.scale.domain([0, 10]).range([0, 0.3*this.height*innerHeight]);
    for(i = 0; i < 4; i++){
      this.element_sides[i].g.attrs({ "transform": "rotate(" +i*90+ ") translate(60,0)" });
    }

    this.dial_theta.resizeDial({ posX: 0.1*this.width*innerWidth, posY: 0.8*this.height*innerHeight, dialRadius: 0.09*this.height*innerHeight });

    this.update();
  }

  /****************************************************************************/

  this.update = function(){
    this.element.attrs({ x: -50, y: -50, width: 100, height: 100 })

    this.simulate();
  }

  /****************************************************************************/

  this.simulate = function(){
    this.element_g.attrs({ "transform": "rotate(" +(-this.simulator.xy_angle-this.simulator.rotationAngle)+ ")" })
    for(i = 0; i < 4; i++){
      temp_data = null;
      if(i%2 == 0){ temp_data = this.simulator.sigma_x_prime; } else{ temp_data = this.simulator.sigma_y_prime; }
      if(temp_data.value >= 0){ this.element_sides[i].sigma_line.attrs({ x1: 0, y1: 0, x2: this.scale(temp_data.value), y2: 0 }) }
      else{ this.element_sides[i].sigma_line.attrs({ x1: -this.scale(temp_data.value), y1: 0, x2: 0, y2: 0 }) }

      if( parseFloat(temp_data.value.toFixed(1)) != 0){ this.element_sides[i].sigma_line.attrs({ "marker-end": "url(#arrow)" }); }
      else{ this.element_sides[i].sigma_line.attrs({ "marker-end": "" }); }

      temp_data = this.scale(this.simulator.tau_xy_prime.value);
      if(i%2 != 0){ temp_data = -temp_data; }
      this.element_sides[i].tau_line.attrs({ x1: 0, y1: 0.5*temp_data, x2: 0, y2: -0.5*temp_data });

      if( parseFloat(this.simulator.tau_xy_prime.value.toFixed(1)) != 0){ this.element_sides[i].tau_line.attrs({ "marker-end": "url(#arrow)" }); }
      else{ this.element_sides[i].tau_line.attrs({ "marker-end": "" }); }
    }

    this.dial_theta.updateDial(this.simulator.rotationAngle);
  }

  /****************************************************************************/

  this.createEvents = function(){
    parent_schematic = this;
    this.svg.call(d3.drag()
      .on("start", function(){
        this.startPos = {x: d3.event.x, y: d3.event.y};
        this.rotationAngle_start = parent_schematic.simulator.rotationAngle;
        this.angleChange_start = Math.atan2(d3.event.y-parent_schematic.cy, d3.event.x-parent_schematic.cx);
      })
      .on("drag", function(){
        angleChange_change = Math.atan2(d3.event.y-parent_schematic.cy, d3.event.x-parent_schematic.cx);
        angle_temp = this.rotationAngle_start - (angleChange_change - this.angleChange_start)*180/Math.PI;
        if(angle_temp < 0){ angle_temp += 360 };
        angle_temp = angle_temp%180;
        parent_schematic.simulator.dispatchSim.call("theta_change", this, {value: angle_temp});
        // parent_schematic.simulator.rotationAngle = angle_temp;
        // simulate();
      })
    )
  }

  /****************************************************************************/

}
