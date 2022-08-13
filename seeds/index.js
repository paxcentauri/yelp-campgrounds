const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelpers');
const cities = require('./cities');
mongoose.connect('mongodb://localhost:27017/yelpCamp')
    .then(() => {
        console.log("Mongo Connection Successful!")
    }).catch(err => {
        console.log("Mongo Error!");
        console.log(err);
    })

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const cityIndex = Math.floor(Math.random() * 1000);
        const campPrice = Math.floor(Math.random() * 30) + 10;
        const descIndex = Math.floor(Math.random() * descriptors.length);
        const placeIndex = Math.floor(Math.random() * places.length);
        const camp = new Campground({
            author: '62f3aec79a226e9c14d27926',
            title: `${descriptors[descIndex]} ${places[placeIndex]}`,
            location: `${cities[cityIndex].city}, ${cities[cityIndex].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, corporis aliquam in quo molestias magnam modi non laudantium fugiat quidem accusantium voluptatem unde quasi ad exercitationem molestiae aspernatur ducimus tempore?',
            price: campPrice,
            geometry : {
                type : "Point",
                coordinates : [cities[cityIndex].longitude, cities[cityIndex].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dkaiqdije/image/upload/v1660223567/YelpCamp/khmrmv77qu6513nlznyg.png',
                    filename: 'YelpCamp/khmrmv77qu6513nlznyg'

                },
                {
                    url: 'https://res.cloudinary.com/dkaiqdije/image/upload/v1660223568/YelpCamp/xlbmlaxoxo8e9b6gxqdh.png',
                    filename: 'YelpCamp/xlbmlaxoxo8e9b6gxqdh'

                }
            ]

        });
        await camp.save();
    }

}
seedDB()
    .then(() => {
        mongoose.connection.close();
    })
