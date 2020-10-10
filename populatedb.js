#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Categorie = require('./models/categorie')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function itemCreate(name, description, price, stock, categorie, cb) {
  var item = new Item({
    name: name,
    description: description,
    price: price,
    stock: stock,
    categorie: categorie
  });

  item.save(function(err){
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item);
  });
}

function categorieCreate(name, description, cb) {
  var categorie = new Categorie({ name: name, description: description });
       
  categorie.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Categorie: ' + categorie);
    categories.push(categorie)
    cb(null, categorie);
  }   );
}

function createCategories(cb) {
  async.parallel([
      function(callback) {
        categorieCreate('Clubs', `A player usually carries several clubs during the game (but no more than fourteen, the limit defined by the rules). There are three major types of clubs, known as woods, irons, and putters. Woods are played for long shots from the tee or fairway, and occasionally rough, while irons are for precision shots from fairways as well as from the rough. Wedges are irons used to play shorter shots. A new type of club called a hybrid combines the straight-hitting characteristics of irons with the easy-to-hit characteristics of higher-lofted woods. A hybrid is often used for long shots from difficult rough. Hybrids are also used by players who have a difficult time getting the ball airborne with long irons. Wedges are played from difficult ground such as sand or the rough and for approach shots to the green. Putters are mostly played on the green, but can also be useful when playing from bunkers or for some approach shots. Putters have minimal loft, forcing the ball to stay on the putting surface when struck. The most common clubs to find in a golfer's bag are the driver, 3-wood, numbered irons from 3 to 9 (with hybrids commonly replacing the 3 and 4 iron), pitching and sand wedges, and a putter. Players commonly also carry a 5-wood, and/or additional wedges such as a gap or lob wedge.`, callback);
      },
      function(callback) {
        categorieCreate('Shoes', `Many golfers wear special shoes. The shoes can be spikeless or with spikes attached to the soles. The spikes can be made of metal or plastic (plastic spikes are also known as "soft spikes") designed to increase traction thus helping the player to keep his/her balance during the swing, on greens, or in wet conditions. In an attempt to minimize the severity of spike marks made on greens, many golf courses have banned metal spikes, allowing only plastic spikes during play.

        Spikes on most golf shoes are replaceable, being attached using one of two common methods: a thread or a twist lock. Two sizes of thread are in common use, called a "large thread" and "small thread". There are two common locking systems: Q-LOK and Tri-LOK (also called "Fast Twist"). The locking systems use a plastic thread which takes only about a half turn to lock.[1]`, callback);
      },
      function(callback) {
        categorieCreate('Balls', `Originally, golf balls were made of a hardwood, such as beech. Beginning between the 14th and 16th centuries, more expensive golf balls were made of a leather skin stuffed with down feathers; these were called "featheries". Around the mid-1800s, a new material called gutta-percha, made from the latex of the East Asian sapodilla tree, started to be used to create more inexpensive golf balls nicknamed "gutties", which had similar flight characteristics as featheries. These then progressed to "brambles" in the later 1800s, using a raised dimple pattern and resembling bramble fruit, and then to "meshies" beginning in the early 1900s, where ball manufacturers started experimenting with latex rubber cores and wound mesh skins that created recessed patterns over the ball's surface. Recessed circular dimples were patented in 1910, but didn't become popular until the 1940s after the patents expired.`, callback);
      },
      function(callback) {
        categorieCreate('Bags', `A golfer typically transports golf clubs in a golf bag. Modern golf bags are made of nylon, canvas and/or leather, with plastic or metal reinforcement and framing, but historically bags have been made from other materials. Golf bags have several pockets designed for carrying various equipment and supplies required over the course of a round of golf. Virtually all bags are sectioned off with rigid supports at the top opening, both for rigidity and to separate clubs of various types for easier selection. More expensive bags have sleeves or pockets within the main compartment for each individual club, allowing for the desired club to be more easily removed from the bag and then returned without interference from the grips of the other clubs or internal hardware of the bag.

        Carry bags are generally designed to be carried by the player while on the course; they have single or dual shoulder straps, and are generally of lightweight construction to reduce the burden on the player or caddy.
        Sunday bags are commonly advertised as "minimalist" carry bags; they have very light weight and flexible construction allowing the bag to be rolled up or folded for storage without clubs, and have storage pockets for the essentials of play (clubs, balls, tees) but often lack more advanced features like segregated club storage, insulated pockets for drinks, stand legs etc.
        Stand bags are in the family of carry bags but additionally feature rigid internal reinforcement and retractable fold-out legs, which make the bag a tripod allowing it to be securely placed on the turf. Modern carry bags are very commonly stand bags even at low pricepoints.
        Cart bags are generally designed to be harnessed to a two-wheeled pull cart or a motorized golf cart during play of a round. They often have only a rudimentary carry strap or handle for loading and transporting the bag, and no stand legs, but may feature extra storage or more durable construction, as weight of the loaded bag is a lesser concern.
        Staff bags are the largest class of golf bags, and are generally seen carried by caddies or other assistants to professional or high-level amateur players. Staff bags are generally the same size or larger than a cart bag, and typically feature a single shoulder strap, a large amount of storage for equipment and even spare attire, and large logo branding designed for product placement on televised events.
        Travel bags are available with many combinations of size and features, but are distinguished by rigid and/or heavily padded construction, including the clubhead cover (which on most other bags is simply an unpadded "rain fly"), and locks on the zippers and bag cover. These features protect the clubs from abuse and theft, and generally makes the bag suitable for checked airline luggage. Travel bags are generally used by amateur players that travel occasionally, such as business executives; rigid flight cases that enclose the actual golf bag are generally preferred by touring players, as these cases can enclose any golf bag, are more discreet as to their contents thus further deterring theft, and the case's weight and bulk can be left behind while on the course where it's not needed.`, callback);
      },
      function(callback) {
        categorieCreate('Rangefinders', `Rangefinders allow a golfer to measure exact distance to the hole from their current position; they are illegal according to Rule 14-3 of the rules of golf, but the USGA allows individual course clubs to institute a local rule permitting rangefinders, and they are common among recreational golfers. The typical rangefinder is an optical device that is aimed by sighting the scope on the flag and using the calibrated gauge in the optics to estimate the distance based on the flagstick's apparent height. Other rangefinders estimate range using a calibrated focus or parallax control; the user sights the target, brings it into focus, and reads the distance mark on the control. Newer laser rangefinders operate by simply sighting any target and pressing a switch to take a very precise distance reading using an invisible laser. Newer golf carts often include GPS tracking which, combined with an electronic map of the course, can serve a similar function.`, callback);
      },
      function(callback) {
        categorieCreate('Cart', `Golf carts are vehicles used to transport golf bags and golfers along the golf course during a round of golf. Hand carts are designed to hold only the bag, and are used by players while walking along the course to relieve them of the weight of the bag. Carts that carry both player and bag are more common on public golf courses; most of these are powered by a battery and electric motors, though gasoline-powered carts are sometimes used by course staff, and some courses and players are beginning to explore alternatives such as bicycle-drawn carts.

        The traditional way to play was to walk, but the use of golf carts is very common due to a number of factors. Chief among them is the sheer length of the modern course, and the required "pace of play" instituted by many courses to prevent delays for other golfers and maintain a schedule of tee times. A typical par-72 course would "measure out" at between 6,000 and 7,000 total yards, which does not count the distance between the green of one hole and the tee of the next, nor the additional distance caused by errant shots. A player walking a 7,000-yard course might traverse up to 5 miles (8 km). With a typical required pace of play of 4 hours, a player would spend 1.6 hours of that time simply walking to their next shot, leaving an average of only two minutes for all players to make each of the 72 shots for a par score (and most casual players do not score the course par). Economics is another reason why carts have become prevalent at many courses; the fee for renting a cart is less expensive than paying a caddie to carry the bags, and the private club gets the money for the cart rentals. A golf cart also enables physically handicapped people to play the game. Carts are also popular with golfers who are too lazy to walk the course.
        
        The use of carts may be restricted by local rules. Courses may institute rules such as "90 degree paths", where drivers must stay on the cart path until level with their ball, and then may turn onto the course. This typically reduces the effect that the furrows from the cart wheels will have on balls. Soft ground due to rain or recent maintenance work may require a "cart path only" driving rule to protect the turf, and a similar policy may apply in general to the areas around tee boxes and greens (and on shorter par-3 holes where fairway shots are not expected). The use of carts is banned altogether at most major PGA tournaments; players walk the course assisted by a caddy who carries equipment.`, callback);
      },
      function(callback) {
        categorieCreate('Tees', `A tee is an object (wooden or plastic) that is pushed into or placed on the ground to rest a ball on top of for an easier shot; however, this is only allowed for the first stroke (tee shot or drive) of each hole. Conventional golf tees are basically spikes with a small cup on the head to hold the ball, and are usually made of wood or plastic. Wooden tees are generally very inexpensive and quite disposable; a player may damage or break many of these during the course of a round. Plastic tees are generally more expensive but last longer. The length of tees varies according to the club intended to be used and by personal preference; longer tees (3-3.5") allow the player to position the ball higher off the ground while remaining stable when planted, and are generally used for modern deep-faced woods. They can be planted deeper for use with other clubs but then tend to break more often. Shorter tees (1.5-2.5") are suitable for irons and are more easily inserted and less easily broken than long tees. Other designs of tee exist; the "step tee" is milled or molded with a spool-shaped upper half, and so generally provides a consistent ball height from shot to shot. The "brush tee" uses a collection of stiff bristles instead of a cup to position the ball; the design is touted by its manufacturer as providing less interference to the ball or club at impact, for a straighter, longer flight.

        Alternately, the rules allow for a mound of sand to be used for the same function, also only on the first shot. Before the invention of the wooden spike tee, this was the only accepted method of lifting the ball for the initial shot. This is rarely done in modern times, as a tee is easier to place, hit from, and recover, but some courses prohibit the use of tees either for traditional reasons, or because a swing that hits the tee will drive it into or rip it out of the ground, resulting in damage to the turf of the tee-box. Tees also create litter if discarded incorrectly when broken.`, callback)
      }
      ],
      // optional callback
      cb);
}

function createItems(cb) {
    async.series([
        function(callback) {
          itemCreate(`G410 DRIVER PLUS`, `A new line of PING created in 2019, the Driver is unique by having an adjustable center of gravity, trajectory tuning, and with weight optimized features throughout, all while having a high forgiveness threshold. The G410 Driver Plus is engineered to outperform other similar drivers through the advanced technology it utilizes in its form.`, 399.98, 13, [categories[0],],callback);
        },
        function(callback) {
          itemCreate(`SIM MAX IRON SET W/ STEEL SHAFTS`, `Revolutionary Speed Bridge technology strategically supports the topline of the iron to unlock explosive distance and forgiveness with improved sound and feel. Designed with energy channeling geometry to quickly eliminate harsh vibrations at impact delivering better feel without sacrificing face flexibility`, 899.99, 9, [categories[0],],callback);
        },
        function(callback) {
          itemCreate(`SCOTTY CAMERON SPECIAL SELECT NEWPORT 2 PUTTER`, `Arguably the most famous putter head shape in the world, with scores of professional titles won, the iconic Newport 2 blade leads the Special Select lineup with tour-inspired refinements to every design aspect and component including a flatter, narrower topline with an insert-free, solid milled putter head, redesigned plumbing neck that provides more visibility to align with the leading edge at address, interchangeable tungsten sole weights and a new soft tri-sole setup carrying through the familiar—yet refined—three red dot back cavity pattern in an alignment-friendly setup that ushers in the latest model of this legendary design.`, 399.99, 23, [categories[0],],callback);
        },
        function(callback) {
          itemCreate(`RTX ZIPCORE TOUR SATIN WEDGE`, `Revolutions need revolutionary technology, so Cleveland tore their flagship RTX wedge down to its core and rebuilt it from the inside out. This is the RTX ZipCore wedge. Featuring their new ZipCore technology, UltiZip Grooves, and a new heat treatment process, the RTX ZipCore delivers enhanced control, more spin, and unmatched durability to last you round after round.`, 149.99, 8, [categories[0],],callback);
        },
        function(callback) {
          itemCreate(`PRO|SL CARBON MEN'S GOLF SHOE - WHITE`, `Pro|SL men's golf shoes provide superior feel with Fine Tuned Foam (FTF) for supple cushioning and a infinity outsole design for superior stability. FJ, The #1 Shoe in Golf.

          MORE STABILITY. MORE TRACTION. MORE COMFORT. MORE CHOICE.
          
          Against the advice of our trusted Tour Ambassadors, we’ve completely redesigned the hottest shoe on Tour. The new Pro|SL is built on the all-new Infinity Outsole that boasts 30% more points of traction, a reimagined PowerHarness to wrap your foot in comfort and release power into your golf swing, and the Dual-Density (D2) midsole for the perfect balance of stability and comfort.`, 199.99, 18, [categories[1],],callback);
        },
        function(callback) {
          itemCreate(`CODECHAOS MEN'S GOLF SHOE - GREY/BLUE`, `Work on your swing. Perfect your form. Inspire your game with the high-performance design of the spikeless adidas Codechaos Golf Shoes. Every step is light and energized. Each swing secure and confident.`, 149.99, 9, [categories[1],],callback);
        },
        function(callback) {
          itemCreate(`PRO V1 GOLF BALLS`, `Pro V1 golf balls are recognized as one of the top used ball on Tours and are engineered with speed, low spin, and short game control along with a super soft feel.`, 47.99, 35, [categories[2],],callback);
        },
        function(callback) {
          itemCreate(`SUPERSOFT GOLF BALLS`, `The Supersoft golf balls are the soft-feel, straight, long distance ball that many golfers can’t get enough of. The optimized core and aerodynamics make this the perfect ball for fast speeds and low spin on the green.`, 22.99, 53, [categories[2],],callback);
        },
        function(callback) {
          itemCreate(`FAIRWAY 14 STAND BAG`, `Combines outstanding storage with an all-new 14-way top, allowing Fairway 14 to double as both a cart bag and a lightweight stand bag.`, 229.99, 6, [categories[3],],callback);
        },
        function(callback) {
          itemCreate(`C-130 CART BAG`, `The C-130, Sun Mountain’s best-selling cart bag, was created to work optimally on a cart. All of the features are designed with cart use in mind, starting with the reverse orientation top with three utility handles, the Smart Strap System and a convenient, velour-lined rangefinder pocket. In addition, all pockets are forward-facing and accessible when the bag is on a cart. For 2019, Sun Mountain has redesigned the rangefinder pocket to be roomier and have a quick-access, magnetic closure system.`, 249.99, 7, [categories[3],],callback);
        },
        function(callback) {
          itemCreate(`TOUR V5 SHIFT`, `Size, speed and accuracy evolved with a new generation of tech — featuring PinSeeker with Visual JOLT, BITE Magnetic Mount, and next level clarity and brightness — plus patented slope compensation that will change your game.`, 399.99, 16, [categories[4],],callback);
        },
        function(callback) {
          itemCreate(`GARMIN Z80 RANGEFINDER`, `The Garmin Approach Z80 laser rangefinder is one of the most accurate rangefinders on the market. Capable of measuring distances from up to 350 yards and providing a realistic color view of the course in 2-D. In addition, Garmin Z80 rangefinders contain data from 41,000 golf courses worldwide, so you are familiarized with the course before even stepping on the green. This innovative device not only gives you a precise reading of distances but also of the terrain of the course including slopes or downhill shots. Furthermore, this feature can be turned on/off in order to conform to tournament legal play rules. Below we have included a few specifications and details of the Garmin Approach Z80 laser rangefinders.`, 499.98, 3, [categories[4],],callback);
        },
        function(callback) {
          itemCreate(`Madjax 01-008 Genesis 150`, `High Strength Molded Polyethylene Cargo Bed with Diamond Plate Texture
          High Grade "Innova" Marine Molded Vinyl Cushions with OEM Pattern that Resists Mildew and Fading
          Non-Warping Cargo Bed Design
          High Quality Durable and Long Lasting Products Are What You Can Expect From The "Golf Cart King"
          Fits the Following Carts: 1994-Up Gas and Electric EZGO TXT/Medalist Golf Carts; Will not fit on Pre-1994 Marathon or 2008-Up RXV model Carts;`, 369.95, 11, [categories[5],],callback);
        },
        function(callback) {
          itemCreate(`NovaCaddy Remote Control Electric Golf Trolley Cart`, `Digital control panel offering "On-Off" and 7 speed settings for ease of use. 3 preset distance cruise function (10m,20m,30m)(10, 20, 30 yards). Electronic brake and Go/Stop function
          Remote control up to 130 yard: Forward, Backward, Left Turn, Right Turn, Pause in 7 speeds.
          Max. 8km/hr (5 MPH), 7 speed adjustable. Climbing capability: 25 degree. Max. Load capacity: 40kg (88lb)
          2 x 200W (400W) noiseless 12V DC motor. 12V 35Ah Lead-acid rechargeable battery included. Battery life time: >300 charge. Charge AC adapter: 110~240V, 50/60Hz
          High quality aluminum alloy frame, dual stainless steel gear box, durable polymer component. Airless, rubberized thread. Silver, brushed aluminum finish. Full size: 112 x 100 x 60 cm (44 x 39 x 24 inch). Folding size: 86 x 60 x 36 cm (32 x 24 x 14 inch). Quick Release Wheels. Detachable seat is optional`, 789.99, 1, [categories[5],],callback);
        },
        function(callback) {
          itemCreate(`PRECISION GOLF TEES - 2 3/4" - 100 PACK`, `Precision Golf Tees are durable and biodegradable. They are made of premium hardwood and are designed to withstand some of the biggest hitters.`, 6.99, 73, [categories[6],],callback);
        },
        function(callback) {
          itemCreate(`PRIDE GOLF BAG OF 100-PROLENGTH (2 3/4") WHITE TEES`, `Pride Professional Tee System is a proprietary system of color coded golf tees that allows for easy identification of length and appropriateness for various golf clubs.`, 6.99, 65, [categories[6],],callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
  createCategories,
  createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



