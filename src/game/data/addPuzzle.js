const admin = require("firebase-admin");
const serviceAccount = require("./firebase_key.json");
const puzzles = require("./new_puzzle.json");
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
function isCollection(data, path, depth) {
  if (
    typeof data != 'object' ||
    data == null ||
    data.length === 0 ||
    isEmpty(data)
  ) {
    return false;
  }

  for (const key in data) {
    if (typeof data[key] != 'object' || data[key] == null) {
      // If there is at least one non-object item in the data then it cannot be collection.
      return false;
    }
  }

  return true;
}

// Checks if object is empty.
function isEmpty(obj) {
  for(const key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

async function upload(data, path) {
  return await admin.firestore()
    .doc(path.join('/'))
    .set(data)
    .then(() => console.log(`Document ${path.join('/')} uploaded.`))
    .catch(() => console.error(`Could not write document ${path.join('/')}.`));
}

/**
 *
 */
async function resolve(data, path = []) {
  if (path.length > 0 && path.length % 2 == 0) {
    // Document's length of path is always even, however, one of keys can actually be a collection.

    // Copy an object.
    const documentData = Object.assign({}, data);

    for (const key in data) {
      // Resolve each collection and remove it from document data.
      if (isCollection(data[key], [...path, key])) {
        // Remove a collection from the document data.
        delete documentData[key];
        // Resolve a colleciton.
        resolve(data[key], [...path, key]);
      }
    }

    // If document is empty then it means it only consisted of collections.
    if (!isEmpty(documentData)) {
      // Upload a document free of collections.
      await upload(documentData, path);
    }
  } else {
    // Collection's length of is always odd.
    for (const key in data) {
      // Resolve each collection.
      await resolve(data[key], [...path, key]);
    }
  }
}

resolve(puzzles);
