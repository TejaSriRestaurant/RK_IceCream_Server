const mongoose = require('mongoose');
const fs = require('fs');

// Define the schema
const orderSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    data: {
        type: [Number], // Assuming each element in the array is an integer
        required: true
    }
});

// Define the Order model
const Order = mongoose.model('Order', orderSchema);

const orderSchema2 = new mongoose.Schema({
    ipaddress: {
        type: String,
        required: true
    },
    data: [{
        item: [{
            item_no: Number,
            quantity: Number,
            name: String,
            price: Number
        }],
        name: String,
        email: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        AddressLink: String,
        accepted: Boolean,
        delivered: Boolean,
    }]
});

// Define the Order model
const Order2 = mongoose.model('outorders', orderSchema2);

// Functions 

// Function to insert or update data
async function insertOrCreate(ipAddress, data) {
    try {
        let order = await Order.findOne({ ip: ipAddress });

        if (order) {
            order.data.push(data);
            await order.save();
            console.log('Data updated successfully');
        } else {
            order = new Order({ ip: ipAddress, data: [data] });
            await order.save();
            console.log('New data inserted successfully');
        }
    } catch (err) {
        console.error('Error inserting or updating data:', err.message);
    }
}

// Function to get data for a specific IP address
async function getData(ipAddress) {
    try {
        const order = await Order.findOne({ ip: ipAddress });
        console.log(order.data)
        return order ? order.data : [];
    } catch (err) {
        console.error('Error getting data:', err.message);
        return [];
    }
}

// Function to remove a specific value from the data array associated with an IP address
async function removeData(ipAddress, valueToRemove) {
    try {
        const order = await Order.findOne({ ip: ipAddress });
        if (order) {
            order.data = order.data.filter(item => item !== valueToRemove);
            await order.save();
            return `Removed all occurrences of ${valueToRemove} from the array associated with IP address ${ipAddress}.`;
        } else {
            return "No data found for the specified IP address.";
        }
    } catch (err) {
        console.error('Error removing data:', err.message);
        return "Error occurred while removing data.";
    }
}

// Function to clear all data associated with a specific IP address
async function clearAllData(ipAddress) {
    try {
        const deletedOrder = await Order.findOneAndDelete({ ip: ipAddress });
        if (deletedOrder) {
            return `All data cleared for IP address ${ipAddress}.`;
        } else {
            return "No data to clear for the specified IP address.";
        }
    } catch (err) {
        console.error('Error clearing data:', err.message);
        return "Error occurred while clearing data.";
    }
}

// orders 2
// Function to store products (orders)
async function StoreProducts(ipAddress, data) {
    try {
        await Order2.create({ ipaddress: ipAddress, data: [data] });
        console.log('Order stored successfully');
    } catch (error) {
        console.error('Error storing order:', error.message);
    }
}

// Function to retrieve all orders
async function getorders() {
    try {
        return await Order2.find();
    } catch (error) {
        console.error('Error retrieving orders:', error.message);
        return [];
    }
}

// Function to update 'accepted' field to true based on IP address
async function updateAcceptedStatus(ipAddress) {
    try {
        const result =  await Order2.updateMany(
            { 'ipaddress': ipAddress }, // Match documents with the given IP address
            { $set: { 'data.$[].accepted': true } } // Update the 'accepted' field inside the 'data' array to true
        );
        console.log('Accepted status updated successfully');
        return result.nModified; // Number of documents modified
    } catch (error) {
        console.error('Error updating accepted status:', error.message);
        return 0;
    }
}

// Function to remove data based on IP address
async function delivarDataByIP(ipAddress) {
    data =  await Order2.find({ ipaddress: ipAddress });
    console.log(data);
    fs.readFile('data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            // Parse the JSON data into a JavaScript object
            let existingData = JSON.parse(jsonString);
    
            // Check if existingData is an array
            if (!Array.isArray(existingData)) {
                existingData = []; // If not an array, initialize it as an empty array
            }
    
            // Modify the array by adding the new data
            existingData.push(data);
    
            // Convert the modified JavaScript object back to JSON
            const updatedJsonString = JSON.stringify(existingData, null, 2);
    
            // Write the updated JSON data back to the file
            fs.writeFile('data.json', updatedJsonString, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('Data inserted into data.json successfully');
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    try {
        const result = await Order2.deleteMany({ 'ipaddress': ipAddress });
        console.log('Data removed successfully');
        return result.deletedCount; // Number of documents deleted
    } catch (error) {
        console.error('Error removing data:', error.message);
        return 0;
    }
}

// MongoDB Atlas connection
const uri = 'mongodb+srv://RKIce:RK123@rk.slcb4rr.mongodb.net/?retryWrites=true&w=majority'; // Replace 'your_mongodb_atlas_uri' with your actual MongoDB Atlas connection string
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err.message);
});


module.exports = { insertOrCreate, getData, removeData, clearAllData, StoreProducts, getorders , updateAcceptedStatus, delivarDataByIP };
