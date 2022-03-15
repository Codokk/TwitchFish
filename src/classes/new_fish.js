export default class fish {
    constructor(params) {
        //Animation Params
        this.tailIsGrowing = true;
        this.tailMultiplier = 0;
        // Drawing Parameters;
        this.c = document.getElementById("Aquarium");
        this.ctx = this.c.getContext("2d");
        this.color = params.color;
        this.name = params.name;
        //Movement parameters
        this.x;
        this.y;
        this.to_x;
        this.to_y;
        //RPG Parameters
        this.str;
        this.dex;
        this.const;
        this.int;
        this.wis;
        this.char;
        this.lvl;
        this.xp;
        this.cur_hp;
        this.max_hp;
        this.cur_mana;
        this.max_mana;
        this.hunger = 100;
        //Utility Parameters
        this.id = params.id;
    }
}