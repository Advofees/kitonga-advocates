// Connect to the admin database
db = db.getSiblingDB('admin')

// Create a root user with admin privileges
db.createUser({
   user: 'admin',
   pwd: 'admin-password',
   roles: [{ role: 'root', db: 'admin' }]
});

// Switching to the desired database
db = db.getSiblingDB('advoc')

// Create a user with readWrite privileges for the specified database
db.createUser({
   user: 'advoc',
   pwd: 'advoc',
   roles: [{ role: 'readWrite', db: 'advoc' }]
});