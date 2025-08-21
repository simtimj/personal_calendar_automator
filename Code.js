/**
 * Lists 10 upcoming events in the user's calendar.
 * @see https://developers.google.com/calendar/api/v3/reference/events/list
 * 
 * 
 * 
 * calendar IDs:
 * personal: "ad287b8a5121bf79b35b5f4a5da6b8efaeca21d4212c57ae628e5abc0d579438@group.calendar.google.com"
 * dawg walking: "7c1ds1imbi41pvta3nggef7ov3r23e2g@import.calendar.google.com"
 * 
 * 
 * 
 */
function listUpcomingEvents() {

  const personalCalID = "ad287b8a5121bf79b35b5f4a5da6b8efaeca21d4212c57ae628e5abc0d579438@group.calendar.google.com";
  const dawgWalkingID = "7c1ds1imbi41pvta3nggef7ov3r23e2g@import.calendar.google.com";
  let blockEvents = [];

  const calendarId = dawgWalkingID;
  // Add query parameters in optionalArgs
  const optionalArgs = {
    timeMin: (new Date()).toISOString(), // new Date() is current time. '2025-08-16T04:04:21.680Z' year-month-dayTtime
    showDeleted: false,
    singleEvents: true,
    maxResults: 5,
    orderBy: 'startTime'
    // use other optional query parameter here as needed.
  };

  // console.log(1,, "today:" , optionalArgs.timeMin);

  try {
    // call Events.list method to list the calendar events using calendarId optional query parameter
    const response = Calendar.Events.list(calendarId, optionalArgs);   // calls for all events, need day. 
    const events = response.items;
    if (events.length === 0) {
      console.log('No upcoming events found');
      return;
    }
    // Print the calendar events
    let today = String(Number(optionalArgs.timeMin.split("-")[2].slice(0, 2)) + 2); // 2 days in future
    // console.log(2, "today" ,today)

    let todayEvents = [];

    for (const event of events) {
      let eventStartTime = event.start.dateTime; // '2025-08-16T04:32:23.263Z'
      let eventEndTime = event.end.dateTime;
      // let day = eventStartTime.split("-")[2].slice(0, 2);   // 
      let day = String(Number(eventStartTime.split("-")[2].slice(0, 2)));  // 3 days in future
      // console.log(3, "day", day)

      if (!eventStartTime) { 
        eventStartTime = event.start.date;
      }

      // events today only
      if (day !== today) { // looking for today
        break;
      } else {
        let name = event.summary.split(",")[0];
        let mappedEvent = {
          'name': name,
          'eventStartTime': eventStartTime,
          'eventEndTime': eventEndTime
        }
        blockEvents.push(mappedEvent) // need to add eventEndTime
        // console.log('%s (%s)', event.summary, eventStartTime);
      }
      
    }
  } catch (err) {
    console.log('Failed with error %s', err.message);
  }

  


  //! Need to find block
  let block = []; // [startTime, endTime]    blockEvents
  console.log(1, blockEvents)


  // subtract 15 mins
  const findStartTime = () => {
    const driveLength = {
      'Brittany Beston' : 15,
      'David Schwartz' : 15, 
      'Catherine Cobb-von Husen': 15
    }
    
    let startTime = blockEvents[0].eventStartTime.split("T")[1].split(":");   // '19:00:00Z
    console.log("original time:", startTime)
    let hours = Number(startTime[0]);
    let mins = Number(startTime[1]);
    console.log(6, hours, mins)

    if (mins <= 15) {
      hours -= 1;
      mins += 45;  // driveLength
    }

    return startTime;
  }
  console.log(2, findStartTime());

  const findEndTime = () => {

  }

  
  let endTime;


  // today events
  
  // find start time via firstEventStartTime - driveLength


  let firstEventStartTime;


}



// find block start by finding first event, and going back 15 minutes
// then block end by finding last event and adding
// as long as events are linked with a rest no more than 1 hour




















