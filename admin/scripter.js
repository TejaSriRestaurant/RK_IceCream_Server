// Function to populate orders in the respective tables
    let ordersData = '';
    async function populateOrders() {
        // Create a link element
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

      // Append the link element to the head of the document
      document.head.appendChild(linkElement);
      const response = await fetch('https://rk-icecream-server.onrender.com/admindata');
      ordersData = await response.json();
      console.log(ordersData);
      const notAcceptedOrdersTable = document.getElementById("notAcceptedOrders");
      const acceptedNotDeliveredOrdersTable = document.getElementById("acceptedNotDeliveredOrders");
    
      notAcceptedOrdersTable.innerHTML = '';
      acceptedNotDeliveredOrdersTable.innerHTML = '';
   
      Object.keys(ordersData).forEach(ip => {
        const order = ordersData[ip];
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${order.ipaddress}</td>
        <td><a href="${order.data[0].AddressLink}" target="_blank">View on Map</a></td>
        <td>${order.data[0].item.reduce((total, currentItem) => total + (currentItem.price * currentItem.quantity), 0)}</td>
        <td>
            ${!order.data[0].accepted && !order.data[0].delivered ? `<button class="btn btn-primary" onclick="acceptOrder('${order.ipaddress}')">Accept</button>` : ''}
            ${order.data[0].accepted && !order.data[0].delivered ? `<button class="btn btn-success" onclick="deliverOrder('${order.ipaddress}')">Deliver</button>` : ''}
            <button id="shareButton" style="
               background-color: #007bff;
               color: #fff;
               justify-content: center;
               align-items: center;"
             class ="btn btn-success"
             onclick="shareViaWhatsApp('${ip}')">
               <i class="fa fa-share-alt"></i>
             </button>
            <button class="btn btn-info" onclick="showOrderDetails('${ip}')">Info</button>
        </td>   
    `;

        if (!order.data[0].accepted && !order.data[0].delivered) {
          notAcceptedOrdersTable.appendChild(row);
        } else if (order.data[0].accepted && !order.data[0].delivered) {
          acceptedNotDeliveredOrdersTable.appendChild(row);
        } 
      });
    }

    // Function to accept an order
    async function acceptOrder(ip) {
        console.log(ip)
        const data = {
            ip: ip
        };
        
        // Define the options for the fetch request
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        // Make the fetch request
        await fetch('https://rk-icecream-server.onrender.com/adminaccept', options)
        location.reload();
    }

    // Function to mark an order as delivered
    async function deliverOrder(ip) {
        console.log(ip)
        const data = {
            ip: ip
        };
        
        // Define the options for the fetch request
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        // Make the fetch request
        await fetch('https://rk-icecream-server.onrender.com/admindelivar', options)
        location.reload();
    }

    // Function to show order details in a modal
    function showOrderDetails(no) {
    const order = ordersData[no].data[0];
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

    function shareViaWhatsApp(no) {
      console.log(ordersData[no].data[0])
      const order = ordersData[no].data[0];
      const itemList = order.item.map(item => `Item No: ${item.item_no}, Name: ${item.name}, Quantity: ${item.quantity}, Price: ${item.price}`).join('\n');
      const message = `
        Name: ${order.name}
        Email: ${order.email}
        Phone: ${order.phone}
        Address Line 1: ${order.addressLine1}
        Address Line 2: ${order.addressLine2}
        Address Location : ${order.AddressLink}
        Ordered Items:
        ${itemList}
`;
      var encodedMessage = encodeURIComponent(message);
      var whatsappUrl = "https://wa.me/?text=" + encodedMessage;
      window.open(whatsappUrl, "_blank");
    }

    // Call the function to populate orders when the page loads
    window.onload = populateOrders;

