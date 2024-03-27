let ordersData2 = "";
async function populateOrders() {
    const response = await fetch('../data.json');
    ordersData2 = await response.json();
    console.log(ordersData2)
  
  const deliveredOrdersTable = document.getElementById("deliveredOrders");
  
  deliveredOrdersTable.innerHTML = '';
  
  Object.keys(ordersData2).forEach(ip => {
    const order = ordersData2[ip][0];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.ipaddress}</td>
      <td><a href="${order.data[0].AddressLink}" target="_blank">View on Map</a></td>
      <td>${order.data[0].item.reduce((total, currentItem) => total + (currentItem.price * currentItem.quantity), 0)}</td>
      <td>
        <button class="btn btn-info" onclick="showOrderDetails11('${ip}')">Info</button>
      </td>
    `;
      deliveredOrdersTable.appendChild(row);
  });
  }
  
  // Function to show order details in a modal
 async function showOrderDetails11(ip) {
  const order = ordersData2[ip][0].data[0];
    // console.log(order)
    const orderDetailsContent = document.getElementById("orderDetailsContent");
      const itemList = order.item.map(item => `<li>Item No: ${item.item_no}, Name: ${item.name}, Quantity: ${item.quantity}, Price: ${item.price}</li>`).join('');
      orderDetailsContent.innerHTML = `
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address Line 1:</strong> ${order.addressLine1}</p>
        <p><strong>Address Line 2:</strong> ${order.addressLine2}</p>
        <h5>Ordered Items:</h5>
        <ul>${itemList}</ul>
      `;
      $('#orderDetailsModal').modal('show');
  }
  
  // Call the function to populate orders when the page loads
  populateOrders();
  