require("dotenv").config();
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "consumer-service",
  brokers: [process.env.KAFKA_BROKER_URL],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

const runConsumer = async () => {
  await consumer.connect();
  console.log("Consumer connected, starting to consume messages...");

  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Consumed: { partition: ${partition}, offset: ${
          message.offset
        }, value: ${message.value.toString()}}`
      );
    },
  });

  const shutdown = async () => {
    console.log("Shutting down consumer...");
    await consumer.disconnect();
    console.log("Consumer disconnected, exiting...");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

runConsumer().catch(console.error);

// docker exec -it kafka-1 kafka-consumer-groups --bootstrap-server kafka:9092 --describe --group test-group
