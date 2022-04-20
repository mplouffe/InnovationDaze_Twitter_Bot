
class Bot {

    static RndEncounter = new Bot("RndEncounter");
    static RandomTechBot = new Bot("RandomTechBot");
    static OutArtBot = new Bot("OutArtBot");

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
            case "OutArtBot":
                botEnum = Bot.OutArtBot;
                break;
        }
        return botEnum;
    }
}

module.exports = Bot;