let db; // Declaring DB

// db request for budget
const request = indexedDB.open('budget', 1);

// create db object store everytime the database is updated
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('transactions', { autoIncrement: true });
};
// If there's no database, catch the error
request.onerror = (event) => {
    console.log("Error Alert!" + event.target.errorCode);
};

request.onsuccess = (event) => {
    db = event.target.result;

    // check cache offline
    if (navigator.onLine) {
        checkDatabase();
    } 
};

// Adding data to DB
function saveRecord(item) {
    // new transaction created using the cache stored item
    const transaction = db.transaction(["storedItem"], "readwrite");
    // access the stored items
    const newStore = transaction.objectStore("storedItem");
    // save that new item to the the new store
    newStore.add(item);
  }

function checkDatabase() {
    const transaction = db.transaction(["storedItem"], "readwrite");
    const newStore = transaction.objectStore("storedItem");
    // put all the stored items into a new variable with the getAll method
    const getAll = newStore.getAll();

        // on success, fetch the json from the api bulk transaction url
        getAll.onsuccess = function() {
            if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["storedItem"], "readwrite");
                const newStore = transaction.objectStore("storedItem");
                // clear all items in the pending transactions store when the function runs
                newStore.clear();
            });
            }
        };
};

// when the window is online, run checkdatabase to update
window.addEventListener('online', checkDatabase);
