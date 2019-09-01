let maze = null;
let block_radius = null;
let canvas_size = null;
let wall_color = null;
let agent_color = null;
let agent = null;

function setup() {
    block_radius = 10;
    canvas_size = [960, 720];

    maze = new Maze(canvas_size[0] / block_radius / 2, canvas_size[1] / block_radius / 2, complexity = 0.75, density = 0.75);
    agent = new Agent(maze.width, maze.height, maze);

    wall_color = color('red');
    agent_color = color('magenta');
    var plot = createCanvas(canvas_size[0] / 1.96, canvas_size[1] / 1.94);
    plot.parent("canvas");
}

function draw() {
    background(0);
    maze.draw(block_radius, wall_color);
    agent.draw(block_radius, agent_color);

}