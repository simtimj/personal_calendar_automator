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
function calendarAutomation() {

  let walksForDay = [];
  const driveLength = {
        'Brittany Beston' : 15,
        'David Schwartz' : 15, 
        'Catherine Cobb-von Husen': 15, 
        'Devin Satterfield': 5
      }

  // DONE
  // return today's (can change date) dog walking events in chronological order 
  const findDogWalkingEvents = () => {
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

    try {
      // call Events.list method to list the calendar events using calendarId optional query parameter
      const response = Calendar.Events.list(calendarId, optionalArgs);   // calls for all events, need day. 
      const events = response.items;
      // console.log("events:", events)
      if (events.length === 0) {
        console.log('No upcoming events found');
        return;
      }
      // Print the calendar events
      // let today = String(Number(optionalArgs.timeMin.split("-")[2].slice(0, 2)) - 1); // 2 days in future
      let today = "25"
      // console.log("today:", today)
      let todayEvents = [];

      for (const event of events) {
        let eventStartTime = event.start.dateTime; // '2025-08-16T04:32:23.263Z'
        let eventEndTime = event.end.dateTime;
        // let day = eventStartTime.split("-")[2].slice(0, 2);   // 
        let day = String(Number(eventStartTime.split("-")[2].slice(0, 2)));  //

        if (!eventStartTime) { 
          eventStartTime = event.start.date;
        }

        // console.log(4, today, day)

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
    walksForDay = blockEvents;
    return walksForDay;
  }
  console.log("findDogWalkingEvents:", findDogWalkingEvents());

  // DONE
  const findStartTime = () => {
    let startTimeRaw = walksForDay[0].eventStartTime.split("T")[1]
    // console.log("startTimeRaw:", startTimeRaw)
    let startHourAndMin = startTimeRaw.slice(0, startTimeRaw.length - 4);   // '19:00:00Z   cut last 3 chars
    return startHourAndMin;
  }


  const findEndTime = () => {
        let endTimeRaw = walksForDay[walksForDay.length - 1].eventStartTime.split("T")[1]; // find last
        console.log("0 endTimeRaw:", endTimeRaw)
        let endHourAndMin = endTimeRaw.slice(0, endTimeRaw.length - 4);
        console.log("1 endHourAndMin:", endHourAndMin)

  }
  console.log("findEndTime:", findEndTime());

  // DONE
  const minutesToTime = (totalMinutes) => {
    // example 600 minutes to 6:00
    let hours = Math.floor(totalMinutes / 60);
    let mins = totalMinutes % 60;

    // console.log("totalMinutes:", totalMinutes)
    // console.log("1 hours and minutes:", hours, mins)
    
    if (mins < 10) {
      mins = "0" + mins ;
    }
    // console.log("2 hours and minutes:", hours, mins)
    return String(hours) + ":" + String(mins);
  }
  
  //DONE
  const findAdjustedStartTime = () => {
    let startHourAndMinRaw = findStartTime().split(":");
    console.log("0, startHourAndMinRaw:", startHourAndMinRaw)   // 18:00 

    let adjuster = driveLength[walksForDay[0].name]; // good

    let hours = Number(startHourAndMinRaw[0]);
    let mins = Number(startHourAndMinRaw[1]);

    let totalMinutes = ((hours * 60) + mins) - adjuster;
    return minutesToTime(totalMinutes);

  }
  console.log("adjusted start time:", findAdjustedStartTime());


  const adjustEndTime = () => {

  }

  const createWorkBlocks = () => {
    // need adjusted start time
    // need adjusted end time
  }

  
}



// find block start by finding first event, and going back 15 minutes
// then block end by finding last event and adding
// as long as events are linked with a rest no more than 1 hour


























