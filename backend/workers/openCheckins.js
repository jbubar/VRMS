module.exports = (cron, fetch) => {

    // Check to see if any events are about to start,
    // and if so, open their respective check-ins

    const url = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';
    const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

    async function fetchEvents() {
        try {
            const res = await fetch(`${url}/api/events`, {
                headers: {
                  "x-customrequired-header": headerToSend
                }
            });
            const resJson = await res.json();
            return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function sortAndFilterEvents(currentTime, thirtyMinutes) {
        const events = await fetchEvents();

        // every 30m events are added to events array
        

        // Filter events if event date is after now but before thirty minutes from now
        if (events && events.length > 0) {
            const sortedEvents = events.filter(event => {
                return (event.date >= currentTime) && (event.date <= thirtyMinutes);
                // return (event.date > currentTime) && (event.date < thirtyMinutes) && (event.checkInReady === false);
            })
            console.log('Sorted events: ', sortedEvents);
            return sortedEvents;
        };
    };

    async function openCheckins(events) {
        if(events && events.length > 0) {
            events.forEach(event => {
                // console.log('Opening event: ', event);

                fetch(`${url}/api/events/${event._id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      "x-customrequired-header": headerToSend
                    },
                    body: JSON.stringify({ checkInReady: true })
                })
                    .then(res => {

                        const response = res;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        };
    };

    async function runTask() {
        console.log("Opening check-ins");

        // Get current time and set to date variable
        const currentTimeISO = new Date().toISOString();

        // Calculate thirty minutes from now
        const thirtyMinutesFromNow = new Date().getTime() + 1800000;
        const thirtyMinutesISO = new Date(thirtyMinutesFromNow).toISOString();

        const eventsToOpen = await sortAndFilterEvents(currentTimeISO, thirtyMinutesISO);
        await openCheckins(eventsToOpen);

        console.log("Check-ins opened");
    };

    const scheduledTask = cron.schedule('*/30 * * * *', () => {
        runTask();
    });
setTimeout(async () => {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nFILE RANNNN !*(@*#!(@AOJLSDHFLASDJFLKAJSDFPI@U#P$QUWEJDSFLKSANDLFK \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
    
    const startString = "2023-06-08T22:00:00.743Z";
    const extraTime = 1800000 * 1 //60m

    const targetISO = new Date(startString).toISOString()
    
    // const cISO = new Date(new Date(targetISO).getTime() - extraTime).toISOString()
    const cISO = new Date(new Date(targetISO).getTime()).toISOString()
    const tmISO = new Date(new Date(targetISO).getTime() + extraTime).toISOString()
    
    // fetch events
    const events =  await sortAndFilterEvents(cISO, tmISO)

    // open checkins
    await openCheckins(events)



    const getObj = async (events) => {
        const obj = {
            start: new Date().toLocaleDateString()
        }
        obj.EVENTS = []
        
        obj.ERRORS = []

        obj.raw = events
        
        obj.i = 0
        events.forEach(async (event) => {
            try {
                await fetch(`${url}/api/events/${event._id}`, {
                  method: 'GET',
                  headers: {
                    'x-customrequired-header': headerToSend,
                  },
                }).then((response) => {
                    obj.i++
                  if (response.ok) {
                    // setEvent(event);
                    // setIsCheckInReady(!isCheckInReady);
                    console.log(response)
                    obj.EVENTS.push(response)
                  }
                });
              } catch (error) { 
                // setIsLoading(!isLoading);
                obj.ERRORS.push(error)
              }
            
        })
        const fs = require('fs');
        fs.writeFile("getObj.txt", JSON.stringify(obj, null, 2), function(err) {
        if (err) {
            console.log(err);
        }
        });
        return obj
    }

    const OBJ = getObj(events)

    
    // sort events after fetch
    console.log(events)

    const fs = require('fs');
    fs.writeFile("eventsSortedData.txt", JSON.stringify(events, null, 2), function(err) {
    if (err) {
        console.log(err);
    }
    });



    // run the task on the events after sort
    
    // not yet not yet
    // runTask(); 

}, 6000
)

    return scheduledTask;
};