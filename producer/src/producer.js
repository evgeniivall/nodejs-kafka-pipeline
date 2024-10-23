require("dotenv").config();
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "producer-service",
  brokers: [process.env.KAFKA_BROKER_URL],
});

const producer = kafka.producer();

const produceMessage = async () => {
  const message = `Message [${new Date().toISOString()}]`;
  await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [{ value: message }],
  });
  console.log(`Produced: ${message}`);
};

const runProducer = async () => {
  await producer.connect();
  console.log("Producer connected, starting to send messages...");

  const intervalId = setInterval(produceMessage, process.env.INTERVAL_MS);

  const shutdown = async () => {
    console.log("Shutting down producer...");
    clearInterval(intervalId);
    await producer.disconnect();
    console.log("Producer disconnected, exiting...");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

runProducer().catch(console.error);
// docker exec -it kafka-pipeline-kafka-1 kafka-consumer-groups --bootstrap-server kafka:9092 --describe --group test-group
// docker exec -it kafka-pipeline-kafka-1 kafka-consumer-groups --bootstrap-server kafka:9092 --group test-group --topic test-topic --reset-offsets --to-earliest --execute
