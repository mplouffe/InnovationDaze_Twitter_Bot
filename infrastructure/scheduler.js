class Scheduler {

    static nextScheduledTweet(bots) {
        let waitDuration = 400000;
        let nextBotUp = null;
        let tweetType = null;
        let currentDate = new Date();
        bots.forEach((bot) => {
            bot.timeTillNextTweet(currentDate)
                .then(([ timeTill, nextTweetType ]) => {
                    if (timeTill < waitDuration)
                    {
                        console.log("in if");
                        waitDuration = timeTill;
                        nextBotUp = bot;
                        tweetType = nextTweetType;
                    }
            });
        });

        return [nextBotUp, tweetType, waitDuration];
    }
}

module.exports = Scheduler;