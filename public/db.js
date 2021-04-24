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

// 
