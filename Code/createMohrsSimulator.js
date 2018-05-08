function createMohrsSimulator(){
  this.createNewDataVectors();
}

createMohrsSimulator.prototype.createNewDataVectors = function(){
    this.sigma_x = { value: 0, min: -10, max: 10 };
    this.sigma_y = { value: 0, min: -10, max: 10 };
    this.tau_xy = { value: 0, min: -10, max: 10 };

    this.sigma_x_prime = { value: this.sigma_x.value };
    this.sigma_y_prime = { value: this.sigma_y.value };
    this.tau_xy_prime = { value: this.tau_xy.value };

    this.xy_angle = 0;
    this.rotationAngle = 0;

    this.update = function(){
      this.rotationAngle = 0;
      this.sigma_x_prime.value = this.sigma_x.value;
      this.sigma_y_prime.value = this.sigma_y.value;
      this.tau_xy_prime.value = this.tau_xy.value;
    }

    this.simulate = function(){
      sigma_x = this.sigma_x.value;
      sigma_y = this.sigma_y.value;
      tau_xy = this.tau_xy.value;
      angle = this.rotationAngle*Math.PI/180;
      this.sigma_x_prime.value = 0.5*(sigma_x+sigma_y) + 0.5*(sigma_x-sigma_y)*Math.cos(2*angle) + tau_xy*Math.sin(2*angle);
      this.sigma_y_prime.value = 0.5*(sigma_x+sigma_y) + 0.5*(sigma_x-sigma_y)*Math.cos(2*(angle+0.5*Math.PI)) + tau_xy*Math.sin(2*(angle+0.5*Math.PI));
      this.tau_xy_prime.value = -0.5*(sigma_x-sigma_y)*Math.sin(2*angle) + tau_xy*Math.cos(2*angle);
    }

    this.dispatchSim = d3.dispatch("change_start", "change_end", "sigma_x_change", "sigma_y_change", "tau_xy_change", "theta_change");
    parent_createMohrsSimulator = this;
    this.dispatchSim
      .on("sigma_x_change", function(data){
        if(data.value != parent_createMohrsSimulator.sigma_x.value){
          parent_createMohrsSimulator.sigma_x.value = parseFloat(data.value.toFixed(1));
          // parent_createMohrsSimulator.sigma_x_prime.value = parent_createMohrsSimulator.sigma_x.value;
          // parent_createMohrsSimulator.rotationAngle = 0;
          update();
        }
      })

      .on("sigma_y_change", function(data){
        if(data.value != parent_createMohrsSimulator.sigma_y.value){
          parent_createMohrsSimulator.sigma_y.value = parseFloat(data.value.toFixed(1));
          // parent_createMohrsSimulator.sigma_y_prime.value = parent_createMohrsSimulator.sigma_y.value;
          // parent_createMohrsSimulator.rotationAngle = 0;
          update();
        }
      })

      .on("tau_xy_change", function(data){
        if(data.value != parent_createMohrsSimulator.tau_xy.value){
          parent_createMohrsSimulator.tau_xy.value = parseFloat(data.value.toFixed(1));
          // parent_createMohrsSimulator.tau_xy_prime.value = parent_createMohrsSimulator.tau_xy.value;
          // parent_createMohrsSimulator.rotationAngle = 0;
          update();
        }
      })

      .on("theta_change", function(data){
        if(data.value != parent_createMohrsSimulator.rotationAngle){
          parent_createMohrsSimulator.rotationAngle = parseFloat(data.value.toFixed(1));
          simulate();
        }
      })

};
