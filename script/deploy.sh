echo {\"projects\": {\"default\": \"$REACT_APP_projectId\"}} > .firebaserc
echo {\"hosting\": {\"public\": \"build\",\"ignore\": [\"firebase.json\",\"**/.*\",\"**/node_modules/**\"],\"rewrites\": [{\"source\": \"**\",\"destination\": \"/index.html\"}]}} > firebase.json
