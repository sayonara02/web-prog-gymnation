const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://marcdarylladress_db_user:WmY8YKVUcoLNd1Y0@cluster0.u1mmbmk.mongodb.net/pridefitgym?retryWrites=true&w=majority';

console.log('Testing connection to:', uri);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Connection failed:');
  console.error('Name:', err.name);
  console.error('Message:', err.message);
  if (err.name === 'MongoServerSelectionError') {
    console.error('\n💡 Common causes:');
    console.error('1. IP not whitelisted in Atlas Network Access');
    console.error('2. Wrong credentials (username/password)');
    console.error('3. Cluster is paused or doesn\'t exist');
    console.error('4. Network/firewall blocking connection');
    console.error('5. DNS issues - try using the full connection string from Atlas');
  }
  process.exit(1);
});
