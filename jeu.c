#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "MQTTClient.h"
#define ADDRESS     "tcp://localhost:1883"
#define CLIENTID    "GAME"
#define QOS         0
#define TIMEOUT     500L

MQTTClient client;
MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
MQTTClient_message pubmsg = MQTTClient_message_initializer;
MQTTClient_deliveryToken token;

volatile MQTTClient_deliveryToken deliveredtoken;

int compteur=0;
int start = 0;
int nb_player = 0;
int nb[4];
char messg[20];
char topc[20];

int sendMessage(char *payload, char* topic) {
	int rc;
	pubmsg.payload = payload;
	pubmsg.payloadlen = (int)strlen(pubmsg.payload);
  pubmsg.qos = QOS;
  pubmsg.retained = 0;
 	MQTTClient_publishMessage(client, topic, &pubmsg, &token);
 	printf("Waiting for up to %d s for publication of %s\n"
         "on topic %s ClientID: %s\n",
         (int)(TIMEOUT/1000), payload, topic, CLIENTID);
  rc = MQTTClient_waitForCompletion(client, token, TIMEOUT);
  printf("Message with delivery token %d delivered\n", token);
	return rc;
}

void delivered(void *context, MQTTClient_deliveryToken dt) {
	printf("Message with token value %d delivery confirmed\n", dt);
  deliveredtoken = dt;
}

void connlost(void *context, char *cause) {
	printf("\nConnection lost\n");
	printf("     cause: %s\n", cause);
}

int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message) {
	int i;
	char *payloadptr;
  printf("Message arrived\n");
  printf("     topic: %s\n", topicName);
  printf("   message: ");
	payloadptr = message->payload;
	printf("%s\n", payloadptr);
	/*for (i = 0; i < message->payloadlen; i++) {
		putchar(*payloadptr++);
	}
	putchar('\n');*/

	if (strcmp(topicName, "connect") == 0) {
		char p[10];
		char t[10];
		sprintf(p, "%d", nb[nb_player]);
		sprintf(t, "%s", (char *)message->payload);
		sendMessage(p, t);
		nb_player++;
		if (nb_player == 4) {
			printf("Nb joueurs complet\n");
			sendMessage("start", "infos");

		}
	}

	if (strcmp(topicName, "game") == 0) {
		int n;
		char player[10];
		sscanf(message->payload, "%d %s\n", &n, player);
		if (n == nb[compteur]) {  // pas dans le bon ordre
			printf("Nb OK\n");
		} else {
			printf("Nb KO\n");
		}
		compteur++;
	}
  MQTTClient_freeMessage(&message);
  MQTTClient_free(topicName);

  return 1;
}


int main(int argc, char* argv[]) {
	int rc;
  int ch;
  int i;
  compteur=0;
  MQTTClient_create(&client, ADDRESS, CLIENTID, MQTTCLIENT_PERSISTENCE_NONE, NULL);
  conn_opts.keepAliveInterval = 200;
  conn_opts.cleansession = 1;
  MQTTClient_setCallbacks(client, NULL, connlost, msgarrvd, delivered);
  if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS) {
		printf("Failed to connect, return code %d\n", rc);
    exit(EXIT_FAILURE);
  }

  printf("Press Q<Enter> to quit\n");

  MQTTClient_subscribe(client, "connect", QOS);
	MQTTClient_subscribe(client, "game", QOS);

	// 4 nb alea
	srand(time(NULL));
	char payload[4], topic[10];
	nb[0] = rand() % 100 + 1;
	do {
		nb[1] = rand() % 100 + 1;
	} while (nb[1] == nb[0]);
	do {
		nb[2] = rand() % 100 + 1;
	} while (nb[0] == nb[2] || nb[1] == nb[2]);
	do {
		nb[3] = rand() % 100 + 1;
	} while (nb[0] == nb[3] || nb[1] == nb[3] || nb[2] == nb[3]);
	printf("[ %d %d %d %d ]\n", nb[0], nb[1], nb[2], nb[3]);
	if (start == 1) {
		for (i = 0; i < 4; i++) {
			sprintf(payload, "%d\n", nb[i]);
			sprintf(topic, "p/%d\n", i);
			sendMessage(payload, topic);
		}
	}
	// start
	//sendMessage("start", "infos");

	do {
		ch = getchar();
  } while(ch!='Q' && ch != 'q');
  MQTTClient_disconnect(client, 10000);
  MQTTClient_destroy(&client);
  return rc;
}
