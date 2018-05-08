function Dial(){

	this.arc = d3.arc();
	this.dial_knobCenter = {};
	this.dialAngle = { min: -0.8*Math.PI, max: 0.8*Math.PI, value: 0 };
	this.dialValue = {};
	this.changeActive = false;

	/*************************************************************/

	this.createDial = function(data){
		this.svg = data.svg;
		this.symbol = data.symbol;
		this.dialValue.min = data.dialValue.min;
		this.dialValue.max = data.dialValue.max;
		this.color = data.color;
		this.unit = data.unit;
		this.userChange_allowed = data.userChange_allowed;
		this.valueShown = data.valueShown;
		this.dispatchIdentifier = data.dispatchIdentifier;
		this.dispatch_call = data.dispatch_call;
		// console.log(data.dispatchIdentifier, this.dispatch_call)

		this.dial_value_to_angle_scale = d3.scaleLinear().domain([this.dialValue.min, this.dialValue.max]).range([this.dialAngle.min, this.dialAngle.max]);
		this.dial_angle_to_value_scale = d3.scaleLinear().range([this.dialValue.min, this.dialValue.max]).domain([this.dialAngle.min, this.dialAngle.max]);

		this.dial_g = this.svg.append("g");
		this.circle = this.dial_g.append("circle");
		this.arc_1 = this.dial_g.append("path");
		this.arc_2 = this.dial_g.append("path");
		this.knob = this.dial_g.append("circle");

		this.symbol_text = this.dial_g.append("text");
		this.value_text = this.dial_g.append("text");

		if(this.userChange_allowed){ this.createDialEvents(); }
		this.setupDial();
	}

	this.setupDial = function(){
		if(this.userChange_allowed){ this.dial_g.styles({ "cursor": "col-resize" }); }
		this.symbol_text.styles({ "dominant-baseline": "middle", "text-anchor": "middle" });
		this.value_text.styles({ "dominant-baseline": "middle", "text-anchor": "middle" });
		this.circle.styles({ "fill": "#EEE", "fill-opacity": 0.4, "stroke": this.color, "stroke-width": 1, "stroke-opacity": 0 });
		this.arc_1.style("fill", this.color);
		this.arc_2.styles({ "fill": this.color, "fill-opacity": 0.6});
		this.knob.styles({ "stroke": this.color, "stroke-width": 2 })
		if(!this.userChange_allowed){ this.knob.style("display", "none"); }
	}

	/*************************************************************/

	this.resizeDial = function(data){
		this.posX = data.posX;
		this.posY = data.posY;
		this.dialRadius = data.dialRadius;

		this.dial_g.attr("transform", "translate(" +this.posX+ "," +this.posY+ ")");
		this.circle.attrs({ cx: 0, cy: 0, r: this.dialRadius });
	}

	/*************************************************************/

	this.updateDial = function(dialValue){
		this.dialValue.value = dialValue;
		this.dialAngle.value = this.dial_value_to_angle_scale(dialValue);

		if(this.userChange_allowed){
			this.arc.innerRadius(this.dialRadius).outerRadius(1.05*this.dialRadius).startAngle(-0.8*Math.PI).endAngle(this.dialAngle.value);
			this.arc_1.attr("d", this.arc);
			this.arc.innerRadius(this.dialRadius).outerRadius(1.05*this.dialRadius).startAngle(this.dialAngle.value).endAngle(0.8*Math.PI);
			this.arc_2.attr("d", this.arc);

			this.dial_knobCenter.x = 1.025*this.dialRadius * Math.sin(this.dialAngle.value);
			this.dial_knobCenter.y = -1.025*this.dialRadius * Math.cos(this.dialAngle.value);
			this.knob.attrs({ cx: this.dial_knobCenter.x, cy: this.dial_knobCenter.y });
		} else{
			this.arc.innerRadius(this.dialRadius).outerRadius(1.05*this.dialRadius).startAngle(this.dialAngle.min).endAngle(this.dialAngle.max);
			this.arc_1.attr("d", this.arc);
		}

		if(this.valueShown){
			this.symbol_text.attrs({y: -0.3*this.dialRadius}).styles({"font-size": 0.6*this.dialRadius});
			this.value_text.attrs({y: 0.4*this.dialRadius}).styles({ "display": null, "font-size": 0.5*this.dialRadius, "fill": "gray"});
		} else{
			this.symbol_text.attrs({ x: 0, y: 0 }).styles({"font-size": 0.7*this.dialRadius});
			this.value_text.style("display", "none");
		}

		if(this.changeActive){
			this.knob.attr("r", 0.2*this.dialRadius).styles({ "fill": "#DDD" });
		} else{
			this.knob.attr("r", 0.12*this.dialRadius).styles({ "fill": "#FFF" });
		}

		this.symbol_text.html(this.symbol);
		this.value_text.html(this.dialValue.value + this.unit);
	}

	/*************************************************************/

	this.updateValue = function(dialValue){
		this.dialValue = dialValue;
		this.value_text.text(this.dialValue + this.unit);
	}

	/*************************************************************/

	this.createDialEvents = function(){
		this.dial_g.data([this]);
		this.dial_g.call(d3.drag()
			.on("start", function(d){ d.dragStart(d3.event);  })
			.on("drag", function(d){ d.dragDrag(d3.event); })
			.on("end", function(d){ d.dragEnd(d3.event);  })
		)
	}

	/*************************************************************/

	this.startPos = {};

	this.dragStart = function(event){
		this.startPos.x = event.x;
		this.startPos.y = event.y;
		this.startPos.initialValue = this.dialValue.value;
		this.svg.style("cursor", "col-resize");
		this.changeActive = true;
		this.knob.attr("r", 0.2*this.dialRadius).styles({ "fill": "#DDD" });
		this.scale = (this.dialValue.max - this.dialValue.min)/(3*this.dialRadius);
		this.dispatch_call.call("change_start", this, {});
	}

	/*************************************************************/

	this.dragDrag = function(event){
		dx = this.scale*(event.x - this.startPos.x);
		if(this.startPos.initialValue+dx < this.dialValue.max && this.startPos.initialValue+dx > this.dialValue.min){
			dataValue = this.startPos.initialValue+dx;
			this.dispatch_call.call(this.dispatchIdentifier, this, {value: dataValue});
		} else
		if(this.startPos.initialValue+dx < this.dialValue.min){
			dataValue = this.dialValue.min;
			this.dispatch_call.call(this.dispatchIdentifier, this, {value: dataValue});
		} else
		if(this.startPos.initialValue+dx > this.dialValue.max){
			dataValue = this.dialValue.max;
			this.dispatch_call.call(this.dispatchIdentifier, this, {value: dataValue});
		}
	}

	/*************************************************************/

	this.dragEnd = function(event){
		this.svg.style("cursor", "default");
		this.changeActive = false;
		this.knob.attr("r", 0.12*this.dialRadius).styles({ "fill": "#FFF" });
		this.startPos = {};
		this.dispatch_call.call("change_end", this, {});
	}

	/*************************************************************/

}
