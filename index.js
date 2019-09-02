function trainfunc() {
    let num_episodes = Math.round(document.getElementById("num_epochs").value);
    let num_steps = Math.round(document.getElementById("num_steps").value);
    document.getElementById("training_text").innerHTML = "Training for " + num_episodes + " episodes with a maximum of " + num_steps + " Number of steps."

    agent.model.trainHandler(num_episodes, num_steps);
}

function testfunc() {
    document.getElementById("training_text").innerHTML = "Testing.";

    agent.model.testHandler(1000);
}