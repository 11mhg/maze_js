class Agent{

    constructor(state_width=10,state_height=10,maze){
        this.state_width=state_width;
        this.state_height=state_height;
        this.state = maze;
        this.actions = [[1,0],[0,1],[-1,0],[0,-1]]; //left right up down (remember y is upside down)
        this.x = 0;
        this.y = 0;
        this.init_state();
        this.model = new Model(this,[this.state_width,this.state_height],this.actions.length);
    }

    hasChanged(){
        return ((this.prev_x != this.x) && (this.prev_y != this.y));
    }

    init_state(){
        let start_x = Math.round(Math.random()*this.state_width-2) + 1;
        let start_y = Math.round(Math.random()*this.state_height-2) + 1;
        
        while(this.state.maze.get(start_x,start_y)==1){
            let dir_x = Math.round(Math.random()*2) - 1;
            let dir_y = Math.round(Math.random()*2) - 1;
            if ((start_x+dir_x > 0) && (start_x+dir_x < this.state_width-1)){
                start_x += dir_x;
            }
            if ((start_y+dir_y > 0) && (start_y+dir_y < this.state_height-1)){
                start_y += dir_y;
            }
        }
        this.start_x = start_x;
        this.start_y = start_y;
        this.x = this.start_x;
        this.y = this.start_y;
        this.prev_x = this.x;
        this.prev_y = this.y;
    }

    update(action){
        this.prev_x = this.x;
        this.prev_y = this.y;
        let temp_x = this.x + action[0];
        let temp_y = this.y + action[1];

        if (this.state.maze.get(temp_x,temp_y)!=0){
            if (this.state.maze.get(temp_x,this.y)!=0){
                if (this.state.maze.get(this.x,temp_y)!=0){
                    temp_x = this.x;
                    temp_y = this.y;
                }else{
                    temp_x = this.x;
                }
            }else{
                temp_y = this.y;
            }
        }
        if (this.state.maze.get(temp_x,temp_y)!=1){
            this.x = temp_x;
            this.y = temp_y;
        }

        return this.distance();
    }

    //0 if we are at the goal
    //>1 if we are not.
    distance(){
        let dist = Math.abs(this.x - this.state.end_x) + Math.abs(this.y - this.state.end_y);
        return dist;
    }

    isdone(){
        return this.distance()==0;
    }

    draw(block_radius=10,agent_color=color('magenta')){
        fill(agent_color);
        rect(this.x*block_radius,this.y*block_radius,block_radius,block_radius);
        fill(color('black'));
    }


}