const Queue = require("bull");
const config = require("../../config/env/develoment");

// Connect to Redis
const emailQueue = new Queue(
  "email",
  `redis://${config.db.redis_host}:${config.db.redis_port}`
);

emailQueue.process(async (job) => {
  const { email, message } = job.data;
  console.log(`Sending email to ${email}: ${message}`);
});

module.exports = emailQueue;
