class Model {

    constructor(agent, input_shape = [10, 10], actions = 4) {
        this.agent = agent;
        const inp = tf.input({ shape: [input_shape[0], input_shape[1], 1] });
        const c1 = tf.layers.conv2d({
            filters: 32,
            kernelSize: [3, 3],
            strides: 1,
            padding: 'same'
        });
        const f1 = tf.layers.flatten();
        const o1 = tf.layers.dense({ units: actions });

        const out = o1.apply(f1.apply(c1.apply(inp)));
        this.model = tf.model({ inputs: inp, outputs: out });

        this.actions = actions;
        this.y = .99;
        this.e = 0.1;
        this.num_episodes = 2000;
        this.jList = [];
        this.rList = [];

        this.optimizer = tf.train.sgd(0.1);
    }

    async optim(s, targetQ) {
        let loss = (pred, label) => pred.sub(label).square().sum();
        this.optimizer.minimize(() => loss(this.model.predict(s), targetQ));
    }

    async trainstep(count = 0, num_steps = 99) {
        this.agent.init_state();
        let rAll = 0;
        let j = 0;
        while (j < num_steps) {
            j += 1;

            let s = tf.tidy(() => { return tf.tensor2d(this.agent.state.maze.tolist()).expandDims(-1).expandDims(0) });
            let allQ = this.model.predict(s);
            let a = tf.argMax(allQ, -1);

            if (Math.random() < this.e) {
                tf.dispose({
                    a
                })
                a = tf.tensor([
                    [Math.round(Math.random() * (this.actions - 1))]
                ]);
            }
            let prev_dist = this.agent.distance();
            let a_val = await a.dataSync()[0];
            let dist = this.agent.update(a_val);
            let s1 = tf.tidy(() => { return tf.tensor2d(this.agent.state.maze.tolist()).expandDims(-1).expandDims(0) });
            let r = -1;
            if (prev_dist > dist) {
                r = 1;
            } else if (prev_dist == dist) {
                r = 0;
            }

            let Q1 = this.model.predict(s1);
            let maxQ1 = Q1.max();
            let maxQ1_val = await maxQ1.dataSync()[0];

            let targetQ = await allQ.dataSync();
            targetQ[a_val] = r + this.y * maxQ1_val;
            targetQ = tf.tensor2d([targetQ]);
            await this.optim(s, targetQ);
            rAll += r;

            tf.dispose({
                s,
                allQ,
                a,
                s1,
                Q1,
                maxQ1,
                targetQ
            })

            if (dist == 0) {
                e = 1. / ((count / 50) + 10);
                break;
            }
            await tf.nextFrame();
        }
        this.jList.push(j);
        this.rList.push(rAll);
        return rAll / j;
    }

    async train(num_episodes = 10, num_steps = 99) {
        for (let i = 0; i < num_episodes; i++) {
            await this.trainstep(i, num_steps);
        }
        return nj.array(this.rList).sum() / num_episodes;
    }

    trainHandler(num_episodes = 10, num_steps = 99) {
        console.log(num_episodes, num_steps);
        this.train(num_episodes, num_steps);
    }

}