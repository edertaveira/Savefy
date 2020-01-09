echo {\"projects\": {\"default\": \"$FIREBASE_PROJECT\"}} > .firebaserc
echo {\"hosting\": {\"public\": \"build\",\"ignore\": [\"firebase.json\",\"**/.*\",\"**/node_modules/**\"],\"rewrites\": [{\"source\": \"**\",\"destination\": \"/index.html\"}]}} > firebase.json
