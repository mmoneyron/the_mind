#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "MQTTClient.h"
#define ADDRESS     "tcp://localhost:1883"
#define QOS         1
#define TIMEOUT     500L

MQTTClient client;
MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
MQTTClient_message pubmsg = MQTTClient_message_initializer;
MQTTClient_deliveryToken token;

volatile MQTTClient_deliveryToken deliveredtoken;
int compteur=0;
int start = 0;
int card = 0;
char clientid[10];

int sendMessage(char *payload, char *topic) {
	int rc;
	pubmsg.payload = payload;
	pubmsg.payloadlen = strlen(payload);
	pubmsg.qos = QOS;
  pubmsg.retained = 0;
	MQTTClient_publishMessage(client, topic, &pubmsg, &token);
  printf("Waiting for up to %d seconds for publication of %s\n"
         "on topic %s for client with ClientID: %s\n",
         (int)(TIMEOUT/1000), payload, topic, clientid);
  rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);
  printf("Message with delivery token %d delivered\n", token);
}

void delivered(void *context, MQTTClient_deliveryToken dt) {
  printf("Message with token value %d delivery confirmed\n", dt);
  deliveredtoken = dt;
}

int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message) {
  int i;
	char * payloadptr;
  printf("Message arrived\n");
  printf("     topic: %s\n", topicName);
  printf("   message: ");
	payloadptr = message->payload;
	for (i = 0; i < message->payloadlen; i++) {
		putchar(*payloadptr++);
	}
	putchar('\n');

	if (strcmp(topicName, "infos") == 0 && strcmp(message->payload, "start") == 0) {
		printf("START\n");
		start = 1;
	} else if (strcmp(topicName, clientid) == 0) {
		sscanf(message->payload, "%d", &card);
		printf("Card received : %d\n", card);
	}
  MQTTClient_freeMessage(&message);
  MQTTClient_free(topicName);
  return 1;
}

void connlost(void *context, char *cause) {
	printf("\nConnection lost\n");
  printf("     cause: %s\n", cause);
}

int main(int argc, char* argv[]) {
  int rc;
  int ch;
	char buffer[10];

  compteur=0;
	strcpy(clientid, argv[1]);

  MQTTClient_create(&client, ADDRESS, clientid, MQTTCLIENT_PERSISTENCE_NONE, NULL);
  conn_opts.keepAliveInterval = 200;
  conn_opts.cleansession = 1;
  MQTTClient_setCallbacks(client, NULL, connlost, msgarrvd, delivered);
  if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS) {
	  printf("Failed to connect, return code %d\n", rc);
    exit(EXIT_FAILURE);
  }
	
  /*printf("Subscribing to topic %s\nfor client %s using QoS%d\n\n"
         "Press Q<Enter> to quit\n\n", clientid, clientid, QOS);*/
  MQTTClient_subscribe(client, clientid, QOS);
  MQTTClient_subscribe(client, "infos", QOS);
	sendMessage(clientid, "connect");
	do {
		ch = getchar();
		if (start == 1) {
			switch (ch) {
				case 'p': // play
					printf("PLAY\n");
					sprintf(buffer, "%d", card);
					sendMessage(buffer, "game");
					break;
				case 's': // shuriken
					break;
				default:
					break;
			}
		}
	}	while(ch!='Q' && ch != 'q');
  MQTTClient_disconnect(client, 10000);
  MQTTClient_destroy(&client);
  return rc;
}
