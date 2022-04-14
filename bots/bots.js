
class Bot {

    static RndEncounter = new Bot("RndEncounter");
    static RandomTechBot = new Bot("RandomTechBot");

    constructor(name) {
        this.name = name;
    }

    static StringToEnum(name) {
        let botEnum;
        switch (name) {
            case "RandomTechBot":
                botEnum = Bot.RandomTechBot;
                break;
            case "RndEncounter":
                botEnum = Bot.RndEncounter;
                break;
        }
        return botEnum;
    }
}

module.exports = Bot;