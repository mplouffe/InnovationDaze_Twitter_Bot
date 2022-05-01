class BotsBot {
    generateTweet(tweetType) {
        let tweet;
        switch (tweetType) {
            case "bot":
                tweet = this.generateBotTweet();
                break;
        }
    }

    generateBotTweet() {
        // procedurally generate an image of a mech
    }
}