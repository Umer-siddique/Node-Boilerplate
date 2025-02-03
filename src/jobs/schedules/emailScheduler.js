const cron = require("node-cron");
const emailQueue = require("../workers/emailWorker");

cron.schedule("0 9 * * *", () => {
  emailQueue.add({
    email: "user@example.com",
    message: "Good morning!",
  });
});
