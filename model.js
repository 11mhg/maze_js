class Model{

    constructor(agent,input_shape=[10,10],actions=4){
        this.agent = agent;
        const inp = tf.input({shape: [input_shape[0],input_shape[1],1]});
        const c1 = tf.layers.conv2d({filters:32,kernelSize:[3,3],
            strides:1,padding:'same'});
        const f1 = tf.layers.flatten();
        const o1 = tf.layers.dense({units:actions});
        console.log(o1);

        const out = o1.apply(f1.apply(c1.apply(inp)));
        this.model = tf.model({inputs: inp, outputs: out});

        this.y = .99;
        this.e = 0.1;
        this.num_episodes = 2000;
        this.jList = [];
        this.rList = [];
    }

    trainstep(){
        this.agent.init_state();
        let rAll = 0;
        let d=false;
        let j = 0;
        while (j < 99){
            j+=1;
            let in_s = tf.tensord2d(this.agent.state.maze.tolist()).expandDims(-1).expandDims(0);
            let out = this.model.predict(in_s);
            
            console.log(in_s);
            
        }
    }


}