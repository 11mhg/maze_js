class Maze {

    constructor(width = 10, height = 10, complexity = .75, density = .75) {
        if (width % 2 == 0) {
            width += 1;
        }
        if (height % 2 == 0) {
            height += 1;
        }

        this.width = width;
        this.height = height;

        this.complexity = Math.round(complexity * (5 * (this.height + this.width)));
        this.density = Math.round(density * (Math.round(height / 2) * Math.round(width / 2)));

        this.initialize_array();
    }

    get maze() {
        return this.array;
    }

    initialize_array() {
        this.array = nj.zeros([this.width, this.height]);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if ((x == 0) || (y == 0)) {
                    this.array.set(x, y, 1);
                }
                if ((x == this.width - 1) || (y == this.height - 1)) {
                    this.array.set(x, y, 1);
                }
            }
        }

        for (let i = 0; i < this.density; i++) {
            let x = Math.round(Math.random() * this.width / 2) * 2;
            let y = Math.round(Math.random() * this.height / 2) * 2;
            this.array.set(x, y, 1);

            for (let j = 0; j < this.complexity; j++) {
                let neighbours = [];
                if (x > 1) {
                    neighbours.push([x - 2, y]);
                }
                if (x < this.width - 2) {
                    neighbours.push([x + 2, y]);
                }
                if (y > 1) {
                    neighbours.push([x, y - 2]);
                }
                if (y < this.height - 2) {
                    neighbours.push([x, y + 2]);
                }
                if (neighbours.length > 0) {
                    let random_ind = Math.round(Math.random() * (neighbours.length - 1))
                    let x_ = neighbours[random_ind][0];
                    let y_ = neighbours[random_ind][1];

                    if (this.array.get(x_, y_) == 0) {
                        this.array.set(x_, y_, 1);
                        this.array.set(x_ + Math.round((x - x_) / 2), y_ + Math.round((y - y_) / 2), 1);
                        x = x_;
                        y = y_;
                    }
                }
            }
        }

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if ((x == 0) || (y == 0)) {
                    this.array.set(x, y, 1);
                }
                if ((x == this.width - 1) || (y == this.height - 1)) {
                    this.array.set(x, y, 1);
                }
            }
        }

        let start_x = Math.round(Math.random() * this.width - 2) + 1;
        let start_y = Math.round(Math.random() * this.height - 2) + 1;

        while (this.array.get(start_x, start_y) == 1) {
            let dir_x = Math.round(Math.random() * 2) - 1;
            let dir_y = Math.round(Math.random() * 2) - 1;
            if ((start_x + dir_x > 0) && (start_x + dir_x < this.width - 1)) {
                start_x += dir_x;
            }
            if ((start_y + dir_y > 0) && (start_y + dir_y < this.height - 1)) {
                start_y += dir_y;
            }
        }
        this.start_x = start_x;
        this.start_y = start_y;
        this.array.set(this.start_x, this.start_y, 2);

        //Set the end goal
        let end_x = Math.round(Math.random() * this.width - 2) + 1;
        let end_y = Math.round(Math.random() * this.height - 2) + 1;

        while (this.array.get(end_x, end_y) == 1 || (this.array.get(end_x, end_y) == 2)) {
            let dir_x = Math.round(Math.random() * 2) - 1;
            let dir_y = Math.round(Math.random() * 2) - 1;
            if ((end_x + dir_x > 0) && (end_x + dir_x < this.width - 1)) {
                end_x += dir_x;
            }
            if ((end_y + dir_y > 0) && (end_y + dir_y < this.height - 1)) {
                end_y += dir_y;
            }
        }
        this.end_x = end_x;
        this.end_y = end_y;
        this.array.set(this.end_x, this.end_y, 3);
    }

    draw(block_radius = 10, fill_color = color('red')) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {

                if (this.array.get(x, y) == 1) {
                    fill(fill_color);
                } else if (this.array.get(x, y) == 0) {
                    fill(color('white'));
                } else if (this.array.get(x, y) == 2) {
                    fill(color('green'));
                } else if (this.array.get(x, y) == 3) {
                    fill(color('blue'));
                }
                rect(x * block_radius, y * block_radius, block_radius, block_radius);
            }
        }
        fill(color('black'));
    }
}