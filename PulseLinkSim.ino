// simulated some heart rate sensor data on Arduino 
void setup() {
  Serial.begin(9600);
  // idk why i need this random number generator but its here
  randomSeed(analogRead(A0));
}

void loop() {
  int simulatedHeartRate = random(60, 100); // simulates reading between 60-100
  Serial.println(simulatedHeartRate);
  delay(1000);  // wait for 1 second
}
