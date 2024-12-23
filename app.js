// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
mongoose.connect('mongodb://127.0.0.1:27017/MST', { useNewUrlParser: true, 
useUnifiedTopology: true });

 // Create a Mongoose model (schema)
 const events = mongoose.model('events', {
    fname: String,
    lname: String,
    gender:String,
    UserID: String,
    email: String,
    password: String
 });
 const enquiry = mongoose.model('enquiry', {
  name: String,
  email: String,
  question: String
});
 const booking =  mongoose.model('booking',{
  name: String,
  email: String,
  phone: Number,
  eventType: String,
  eventplace: String,
  guests: Number,
  eventdate: Date
});


 // Middleware for parsing form data
 app.use(bodyParser.urlencoded({ extended: true }));

 app.use(express.static(path.join(__dirname, 'public')));
 
 // Serve the Sign-up form
 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/home.html'));
 });
 // Handle form submission
 app.post('/Sign-up', (req, res) => {
  const { fname, lname,gender,user_name,email,password } = req.body;
  
  // Create a new User document and save it to MongoDB
  const user = new events({ fname, lname,gender,user_name,email,password });
     user.save()
     .then(() => {
         
         const errorMessage = 'Registration Done Successfully!';
         return res.status(400).send(`
         <script>
             alert("${errorMessage}");
             window.location.href = "/book.html";
         </script>
         `);
  })
 
  .catch((err) => {
  console.error(err);
     res.status(500).send('Error saving data to MongoDB.');
  });
  });
  // Serve the login form

// Serve the login form
app.post('/SignIn', (req, res) => {
  const { email, password } = req.body; // Use req.body to get data from the POST request

  // Check if the entered details exist in the database
  events.findOne({ email, password }).exec()
    .then(data => {
      if (data) {
        const errorMessage = 'Login Successfully!';
        res.status(200).send(`
          <script>
            alert("${errorMessage}");
            window.location.href = "/book.html";
          </script>
        `);
      } else {
        const errorMessage = 'INVALID LOGIN CREDENTIALS';
        res.status(400).send(`
          <script>
            alert("${errorMessage}");
            window.location.href = "/login.html";
          </script>
        `);
      }
    })
    .catch(err => {
      console.error(err);
      const errorMessage = 'An error occurred while checking login details';
      res.status(500).send(`
        <script>
          alert("${errorMessage}");
          window.location.href = "/login.html";
        </script>
      `);
    });
});
// updating value via browser
app.post('/forgot', (req, res) => {
  try {
    const { email, newpassword } = req.body;
    console.log(email,newpassword);
    // Find the user by username and update their email
    events.findOneAndUpdate(
      { email },
      { password: newpassword },
      { new: true }
    )
    .then(updatedUser => {
      if (updatedUser) {
        const errorMessage="Updated Succesfully !";
        res.status(400).send(`
        <script>
            alert("${errorMessage}");
            window.location.href = "/login.html";
        </script>`);
      } else {
        const errorMessage="INVALID DETAILS !";
        res.status(400).send(`
        <script>
            alert("${errorMessage}");
            window.location.href = "/login.html";
        </script>`);
      }
    }).catch(err => {
      console.error(err);
      const errorMessage="An error occurred while updating user data.";
        res.status(400).send(`
        <script>
            alert("${errorMessage}");
            window.location.href = "/login.html";
        </script>`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating user data.');
  }
});
//Delete account
app.post('/Delete', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await events.findOneAndDelete({ email, password });

    if (!user) {
      const errorMessage = 'User not found';
      return res.status(400).send(`
        <script>
          alert("${errorMessage}");
          window.location.href = "/"; // Redirect to the same page
        </script>
      `);
    }

    const successMessage = 'Record deleted successfully!';
    return res.status(200).send(`
      <script>
        alert("${successMessage}");
        window.location.href = "/home.html"; // Redirect to the same page
      </script>
    `);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//enquiry
app.post('/enquiry', (req, res) => {
  const { name, email, question } = req.body;
  
  // Create a new Booking model with data from the form
  const user = new enquiry({ name, email, question });
     user.save()
     .then(() => {
         
         const errorMessage = 'Shortly you will recieve mail!';
         return res.status(400).send(`
         <script>
             alert("${errorMessage}");
             window.location.href = "/book.html";
         </script>
         `);
  })
 
  .catch((err) => {
  console.error(err);
     res.status(500).send('Error saving data to MongoDB.');
  });
  });
//booking
app.post('/submit_booking', (req, res) => {
  const { name, email, phone, eventtype, eventplace,guests, eventdate } = req.body;
  
  // Create a new Booking model with data from the form
  const user = new booking({ name, email, phone, eventtype, eventplace,guests, eventdate });
     user.save()
     .then(() => {
         
         const errorMessage = 'Event booked  Successfully! conformation will be recieved shortly through mail';
         return res.status(400).send(`
         <script>
             alert("${errorMessage}");
             window.location.href = "/book.html";
         </script>
         `);
  })
 
  .catch((err) => {
  console.error(err);
     res.status(500).send('Error saving data to MongoDB.');
  });
  });
  //viewing
  app.get('/bookings', (req, res) => {
    // Fetch all booking records from the MongoDB database
    booking.find({})
      .then(data => {
        // Create an HTML table
        let tableHtml = `<h2 align='center'>Booking Details</h2>
          <table border="1" align='center'>
            <thead>
              <tr align='center'>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event Type</th>
                <th>Event Place</th>
                <th>Guests</th>
                <th>Event Date</th>
              </tr>
            </thead>
            <tbody>
        `;
  
        // Loop through the data and add rows to the table
        data.forEach(booking => {
          tableHtml += `
            <tr align='center'>
              <td>${booking.name}</td>
              <td>${booking.email}</td>
              <td>${booking.phone}</td>
              <td>${booking.eventType}</td>
              <td>${booking.eventplace}</td>
              <td>${booking.guests}</td>
              <td>${booking.eventdate}</td>
            </tr>
          `;
        });
  
        // Close the table HTML
        tableHtml += `
            </tbody>
          </table>
        `;
  
        // Send the HTML as a response
        res.send(tableHtml);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error retrieving booking data from MongoDB.');
      });
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});