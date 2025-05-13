import { PuzzleSolution } from "@/game/model/model";
import admin from "firebase-admin";
import serviceAccount from "./firebase_key.json";
import puzzles from "./puzzles.json";
const { project_id: projectId, private_key: privateKey, client_email: clientEmail } = serviceAccount;
admin.initializeApp({
  credential: admin.credential.cert({projectId, privateKey, clientEmail}),
  databaseURL: "connections-d6358.firebaseio.com"
});


/**
 * Data is a collection if
 *  - it has a odd depth
 *  - contains only objects or contains no objects.
 */
const isObject = (input: unknown): input is Record<string, unknown> => {
  return typeof input === 'object' && input !== null;
};

function isCollection(data : unknown) : data is Record<string, object> {
  if (
    !isObject(data)
  ) {
    return false;
  }

  for (const key in data) {
    if (!isObject(data[key])) {
      // If there is at least one non-object item in the data then it cannot be collection.
      return false;
    }
  }
  return true;
}

// Checks if object is empty.
function isEmpty(obj : Record<string, unknown>) {
  for(const key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

async function upload(data : Record<string, unknown> , path : string[]) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}

/**
 *
 */
async function resolve(data : Record<string, unknown>, path : string[] = []) {
  if (path.length > 0 && path.length % 2 == 0) {
    // Document's length of path is always even, however, one of keys can actually be a collection.

    // Copy an object.
    const documentData = Object.assign({}, data);

    for (const key in data) {
      // Resolve each collection and remove it from document data.
      if (isCollection(data[key])) {
        // Remove a collection from the document data.
        delete documentData[key];
        // Resolve a collection.
        resolve(data[key], [...path, key]);
      }
    }

    // If document is empty then it means it only consisted of collections.
    if (!isEmpty(documentData)) {
      // Upload a document free of collections.
      await upload(documentData, path);
    }
  } else {
    for (const key in data) {
      if(!isObject(data[key])){
        throw new Error("Expected object, got " + typeof(data[key]))
      }
      // Resolve each collection.
      await resolve(data[key], [...path, key]);
    }
  }
}

function generateTrackers(puzzles : PuzzleSolution[]){
  
}

resolve(puzzles);
