export default class Server_Fish {
    constructor(params) {
        // Movement Vars
        this.x;
        this.y;
        this.to_x;
        this.to_y;
        // For testing purposes
        this.actions = [
            {
                name:"Move",
                weight: 10
            }
        ];
        this.actionsMaxWeight = generateMaxActionWeight();
    }
    think() {
        // Eat, Sleep, Poop, Swim, Sleep
        if (this.isMoving == false && this.timeout <= 0) {
            this.setMove();
        } else if (this.isMoving == false && this.timeout > 0) {
            this.draw();
            this.timeout--;
        } else {
            this.move();
        }
        this.collisionCheck();
    }
    generateMaxActionWeight() {
        let weight = 0;
        this.actions.forEach((a)=>{weight += a.weight;})
        return weight;
    }
}