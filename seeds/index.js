const mongoose = require('mongoose');
const Campground = require('../models/campGround');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelpCamp');

//TO CHECK DATABASE CONNECTIVITY
const db = mongoose.connection;
db.once("connected", () => {
    console.log("Database connected")
})
db.on("error", (err) => {
    console.log("Connection failed: " + err)
});
//

//PICK A RANDOM ARRAY
function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
};
//

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        // console.log(`${sample(descriptors)} ${sample(places)}`)
        const camp = new Campground({
            authur: '6304d7050a791b5389aeeb3e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente deserunt consectetur quas, sunt temporibus, itaque optio dignissimos praesentium ullam officia, illum esse possimus maiores. Vitae dignissimos similique ex quasi consequatur.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },

            image: [
                {
                    url: "https://res.cloudinary.com/vhortex17/image/upload/v1662588342/YelpCamp/byln7vfnmd6211mb1sf1.jpg",
                    filename: "YelpCamp/byln7vfnmd6211mb1sf1",

                },
                {
                    url: "https://res.cloudinary.com/vhortex17/image/upload/v1662588347/YelpCamp/bqjih4oflmvqzkuljpaq.jpg",
                    filename: "YelpCamp/bqjih4oflmvqzkuljpaq",
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})