function MohrsSimulatorEquation(simulator){
  this.simulator = simulator;
  this.posLeft = 0;
  this.posTop = 0.55;
  this.width = 0.5;
  this.height = 0.45;
  this.scale = d3.scaleLinear();
  this.line_gen = d3.line().x(function(d){  return (d.x) }).y(function(d){ return (d.y) })

  this.create = function(){
    this.div = d3.select("body").append("div").attrs({ "data-step": 2, "data-intro": "<h2>Equations Pane</h2> The initial stress values can be changed using the three dials on the right." });
    this.svg = this.div.append("svg");

    this.dial_sigma_x_prime = new Dial();
    this.dial_sigma_x_prime.createDial({ svg: this.svg,
                                symbol: " <tspan>\u03C3</tspan><tspan style = \"baseline-shift: sub; dominant-baseline: alphabetic; font-size: 2vh \" >x'</tspan>",
                                dialValue: {min: null, max: null },
                                color: "rgb(63, 63, 244)",
                                unit: "",
                                userChange_allowed: false,
                                valueShown: true,
                                dispatchIdentifier: null,
                                dispatch_call: null });
    this.dial_sigma_y_prime = new Dial();
    this.dial_sigma_y_prime.createDial({ svg: this.svg,
                              symbol: " <tspan>\u03C3</tspan><tspan style = \"baseline-shift: sub; dominant-baseline: alphabetic; font-size: 2vh \" >y'</tspan>",
                              dialValue: { min: null, max: null },
                              color: "#f66d6d",
                              unit: "",
                              userChange_allowed: false,
                              valueShown: true,
                              dispatchIdentifier: null,
                              dispatch_call: null });
    this.dial_tau_xy_prime = new Dial();
    this.dial_tau_xy_prime.createDial({ svg: this.svg,
                              symbol: " <tspan>𝜏</tspan><tspan style = \"baseline-shift: sub; dominant-baseline: alphabetic; font-size: 2vh \" >x'y'</tspan>",
                              dialValue: { min: null, max: null },
                              color: "#269b26",
                              unit: "",
                              userChange_allowed: false,
                              valueShown: true,
                              dispatchIdentifier: null,
                              dispatch_call: null });

    this.equals_text = this.svg.append("text");
    this.bracket_opening = this.svg.append("path");

    this.text_1_1_expression = this.svg.append("text");
    this.text_1_1_value = this.svg.append("text");

    this.text_1_2_expression = this.svg.append("text");
    this.text_1_2_value = this.svg.append("text");

    this.text_1_3_expression = this.svg.append("text");
    this.text_1_3_value = this.svg.append("text");

    this.text_2_1_expression = this.svg.append("text");
    this.text_2_1_value = this.svg.append("text");

    this.text_2_2_expression = this.svg.append("text");
    this.text_2_2_value = this.svg.append("text");

    this.text_2_3_expression = this.svg.append("text");
    this.text_2_3_value = this.svg.append("text");

    this.text_3_1_expression = this.svg.append("text");
    this.text_3_1_value = this.svg.append("text");

    this.text_3_2_expression = this.svg.append("text");
    this.text_3_2_value = this.svg.append("text");

    this.text_3_3_expression = this.svg.append("text");
    this.text_3_3_value = this.svg.append("text");

    this.bracket_closing = this.svg.append("path");

    this.dial_sigma_x = new Dial();
    this.dial_sigma_x.createDial({ svg: this.svg,
                                symbol: " <tspan>\u03C3</tspan><tspan style = \"baseline-shift: sub; dominant-baseline: alphabetic; font-size: 2vh \" >x</tspan>",
                                dialValue: {min: this.simulator.sigma_x.min, max: this.simulator.sigma_x.max},
                                color: "rgb(63, 63, 244)",
                                unit: "",
                                userChange_allowed: true,
                                valueShown: true,
                                dispatchIdentifier: "sigma_x_change",
                                dispatch_call: this.simulator.dispatchSim });
    this.dial_sigma_y = new Dial();
    this.dial_sigma_y.createDial({ svg: this.svg,
                                symbol: " <tspan>\u03C3</tspan><tspan style = \"baseline-shift: sub; dominant-baseline: alphabetic; font-size: 2vh \" >y</tspan>",
                                dialValue: {min: this.simulator.sigma_y.min, max: this.simulator.sigma_y.max},
                                color: "#f66d6d",
                                unit: "",
                                userChange_allowed: true,
                                valueShown: true,
                                dispatchIdentifier: "sigma_y_change",
                                dispatch_call: this.simulator.dispatchSim });
    this.dial_tau_xy = new Dial();
    this.dial_tau_xy.createDial({ svg: this.svg,
                                symbol: " <tspan>𝜏</tspan><tspan style = \"baseline-shift: sub; dominant-baseline: alphabetic; font-size: 2vh \" >xy</tspan>",
                                dialValue: {min: this.simulator.tau_xy.min, max: this.simulator.tau_xy.max},
                                color: "#269b26",
                                unit: "",
                                userChange_allowed: true,
                                valueShown: true,
                                dispatchIdentifier: "tau_xy_change",
                                dispatch_call: this.simulator.dispatchSim });

    this.setup();
  }

  this.setup = function(){
    this.equals_text.styles({ "fill": "gray", "font-size": "3vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.bracket_opening.styles({ "stroke": "gray", "fill": "none" });

    this.text_1_1_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_1_1_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_1_2_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_1_2_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_1_3_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_1_3_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_2_1_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_2_1_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_2_2_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_2_2_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_2_3_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_2_3_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_3_1_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_3_1_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_3_2_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_3_2_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.text_3_3_expression.styles({ "fill": "black", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });
    this.text_3_3_value.styles({ "fill": "gray", "font-size": "2vh", "dominant-baseline": "middle", "text-anchor": "middle" });

    this.bracket_closing.styles({ "stroke": "gray", "fill": "none" });

    this.resize();
  }

  this.resize = function(){
    this.div.styles({ position: "absolute", top: this.posTop*innerHeight, left: this.posLeft*innerWidth, width: this.width*innerWidth, height: this.height*innerHeight });
    this.svg.styles({ width: "100%", height: "100%" });

    this.dial_sigma_x_prime.resizeDial({ posX: 0.1*this.width*innerWidth, posY: 0.2*this.height*innerHeight, dialRadius: 0.1*this.height*innerHeight });
    this.dial_sigma_y_prime.resizeDial({ posX: 0.1*this.width*innerWidth, posY: 0.5*this.height*innerHeight, dialRadius: 0.1*this.height*innerHeight });
    this.dial_tau_xy_prime.resizeDial({ posX: 0.1*this.width*innerWidth, posY: 0.8*this.height*innerHeight, dialRadius: 0.1*this.height*innerHeight });

    this.equals_text.attrs({ x: 0.2*this.width*innerWidth, y: 0.5*this.height*innerHeight }).text("=");
    temp_path = [{x: 0.25*this.width*innerWidth, y: 0.1*this.height*innerHeight},
                {x: 0.22*this.width*innerWidth, y: 0.1*this.height*innerHeight},
                {x: 0.22*this.width*innerWidth, y: 0.9*this.height*innerHeight},
                {x: 0.25*this.width*innerWidth, y: 0.9*this.height*innerHeight}];
    this.bracket_opening.attrs({ d: this.line_gen(temp_path) });

    this.text_1_1_expression.attrs({ x: 0.32*this.width*innerWidth, y: 0.18*this.height*innerHeight }).text("0.5(1+cos(2θ))")
    // temp_value = 0.5*(1+Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    // this.text_1_1_value.attrs({ x: 0.32*this.width*innerWidth, y: 0.25*this.height*innerHeight }).text(temp_value);

    this.text_1_2_expression.attrs({ x: 0.49*this.width*innerWidth, y: 0.18*this.height*innerHeight }).text("0.5(1-cos(2θ))")
    // temp_value = 0.5*(1-Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    // this.text_1_2_value.attrs({ x: 0.49*this.width*innerWidth, y: 0.25*this.height*innerHeight }).text(temp_value);

    this.text_1_3_expression.attrs({ x: 0.63*this.width*innerWidth, y: 0.18*this.height*innerHeight }).text("sin(2θ)")
    // temp_value = Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    // this.text_1_3_value.attrs({ x: 0.63*this.width*innerWidth, y: 0.25*this.height*innerHeight }).text(temp_value);

    this.text_2_1_expression.attrs({ x: 0.32*this.width*innerWidth, y: 0.47*this.height*innerHeight }).text("0.5(1-cos(2θ))")
    // temp_value = 0.5*(1-Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    // this.text_2_1_value.attrs({ x: 0.32*this.width*innerWidth, y: 0.54*this.height*innerHeight }).text(temp_value);

    this.text_2_2_expression.attrs({ x: 0.49*this.width*innerWidth, y: 0.47*this.height*innerHeight }).text("0.5(1+cos(2θ))")
    // temp_value = 0.5*(1+Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    // this.text_2_2_value.attrs({ x: 0.49*this.width*innerWidth, y: 0.54*this.height*innerHeight }).text(temp_value);

    this.text_2_3_expression.attrs({ x: 0.63*this.width*innerWidth, y: 0.47*this.height*innerHeight }).text("-sin(2θ)")
    // temp_value = -Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    // this.text_2_3_value.attrs({ x: 0.63*this.width*innerWidth, y: 0.54*this.height*innerHeight }).text(temp_value);

    this.text_3_1_expression.attrs({ x: 0.32*this.width*innerWidth, y: 0.75*this.height*innerHeight }).text("-0.5sin(2θ)")
    // temp_value = -0.5*Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    // this.text_3_1_value.attrs({ x: 0.32*this.width*innerWidth, y: 0.82*this.height*innerHeight }).text(temp_value);

    this.text_3_2_expression.attrs({ x: 0.49*this.width*innerWidth, y: 0.75*this.height*innerHeight }).text("0.5sin(2θ)")
    // temp_value = 0.5*Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    // this.text_3_2_value.attrs({ x: 0.49*this.width*innerWidth, y: 0.82*this.height*innerHeight }).text(temp_value);

    this.text_3_3_expression.attrs({ x: 0.63*this.width*innerWidth, y: 0.75*this.height*innerHeight }).text("cos(2θ)")
    // temp_value = Math.cos(2*this.simulator.rotationAngle*Math.PI/180);
    // this.text_3_3_value.attrs({ x: 0.63*this.width*innerWidth, y: 0.82*this.height*innerHeight }).text(temp_value);

    temp_path = [{x: 0.68*this.width*innerWidth, y: 0.1*this.height*innerHeight},
                {x: 0.70*this.width*innerWidth, y: 0.1*this.height*innerHeight},
                {x: 0.70*this.width*innerWidth, y: 0.9*this.height*innerHeight},
                {x: 0.68*this.width*innerWidth, y: 0.9*this.height*innerHeight}];
    this.bracket_closing.attrs({ d: this.line_gen(temp_path) });

    this.dial_sigma_x.resizeDial({ posX: 0.8*this.width*innerWidth, posY: 0.2*this.height*innerHeight, dialRadius: 0.1*this.height*innerHeight });
    this.dial_sigma_y.resizeDial({ posX: 0.8*this.width*innerWidth, posY: 0.5*this.height*innerHeight, dialRadius: 0.1*this.height*innerHeight });
    this.dial_tau_xy.resizeDial({ posX: 0.8*this.width*innerWidth, posY: 0.8*this.height*innerHeight, dialRadius: 0.1*this.height*innerHeight });

    this.update();
  }

  this.update = function(){
    this.dial_sigma_x.updateDial(this.simulator.sigma_x.value);
    this.dial_sigma_y.updateDial(this.simulator.sigma_y.value);
    this.dial_tau_xy.updateDial(this.simulator.tau_xy.value);

    this.simulate();
  }

  this.simulate = function(){
    this.dial_sigma_x_prime.updateDial( parseFloat(this.simulator.sigma_x_prime.value.toFixed(1)) );
    this.dial_sigma_y_prime.updateDial( parseFloat(this.simulator.sigma_y_prime.value.toFixed(1)) );
    this.dial_tau_xy_prime.updateDial( parseFloat(this.simulator.tau_xy_prime.value.toFixed(1)) );

    // this.text_1_1_expression.attrs({ x: 0.32*this.width*innerWidth, y: 0.18*this.height*innerHeight }).text("0.5(1+cos(2θ))")
    temp_value = 0.5*(1+Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    this.text_1_1_value.attrs({ x: 0.32*this.width*innerWidth, y: 0.25*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_1_2_expression.attrs({ x: 0.49*this.width*innerWidth, y: 0.18*this.height*innerHeight }).text("0.5(1-cos(2θ))")
    temp_value = 0.5*(1-Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    this.text_1_2_value.attrs({ x: 0.49*this.width*innerWidth, y: 0.25*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_1_3_expression.attrs({ x: 0.63*this.width*innerWidth, y: 0.18*this.height*innerHeight }).text("sin(2θ)")
    temp_value = Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    this.text_1_3_value.attrs({ x: 0.63*this.width*innerWidth, y: 0.25*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_2_1_expression.attrs({ x: 0.32*this.width*innerWidth, y: 0.47*this.height*innerHeight }).text("0.5(1-cos(2θ))")
    temp_value = 0.5*(1-Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    this.text_2_1_value.attrs({ x: 0.32*this.width*innerWidth, y: 0.54*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_2_2_expression.attrs({ x: 0.49*this.width*innerWidth, y: 0.47*this.height*innerHeight }).text("0.5(1+cos(2θ))")
    temp_value = 0.5*(1+Math.cos(2*this.simulator.rotationAngle*Math.PI/180));
    this.text_2_2_value.attrs({ x: 0.49*this.width*innerWidth, y: 0.54*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_2_3_expression.attrs({ x: 0.63*this.width*innerWidth, y: 0.47*this.height*innerHeight }).text("-sin(2θ)")
    temp_value = -Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    this.text_2_3_value.attrs({ x: 0.63*this.width*innerWidth, y: 0.54*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_3_1_expression.attrs({ x: 0.32*this.width*innerWidth, y: 0.75*this.height*innerHeight }).text("-0.5sin(2θ)")
    temp_value = -0.5*Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    this.text_3_1_value.attrs({ x: 0.32*this.width*innerWidth, y: 0.82*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_3_2_expression.attrs({ x: 0.49*this.width*innerWidth, y: 0.75*this.height*innerHeight }).text("0.5sin(2θ)")
    temp_value = 0.5*Math.sin(2*this.simulator.rotationAngle*Math.PI/180);
    this.text_3_2_value.attrs({ x: 0.49*this.width*innerWidth, y: 0.82*this.height*innerHeight }).text(temp_value.toFixed(2));

    // this.text_3_3_expression.attrs({ x: 0.63*this.width*innerWidth, y: 0.75*this.height*innerHeight }).text("cos(2θ)")
    temp_value = Math.cos(2*this.simulator.rotationAngle*Math.PI/180);
    this.text_3_3_value.attrs({ x: 0.63*this.width*innerWidth, y: 0.82*this.height*innerHeight }).text(temp_value.toFixed(2));

  }

}
