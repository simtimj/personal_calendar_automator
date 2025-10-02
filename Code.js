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
  const personalCalID = "ad287b8a5121bf79b35b5f4a5da6b8efaeca21d4212c57ae628e5abc0d579438@group.calendar.google.com";
  const employmentID = "2148af807c75a62df01b5bac3d4b64f584fd89d402b34b661b74089c363b47da@group.calendar.google.com";
  const dawgWalkingID = "7c1ds1imbi41pvta3nggef7ov3r23e2g@import.calendar.google.com";
  let walksForDay = [];
  const driveLength = {
        'Brittany Beston' : 15,
        'David Schwartz' : 15, 
        'Catherine Cobb-von  Husen': 15, // yes... 2 spaces is what's received...
        'Devin Satterfield': 5,
        'Julie Modenos': 10,
        'LaDonna Adam' : 15,
        'Brenda Coleman' : 5
      }

  const findDogWalkingEvents = () => {
    
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
      if (events.length === 0) {
        console.log('No upcoming events found');
        return;
      }
      // Print the calendar events
      let today = String(Number(optionalArgs.timeMin.split("-")[2].slice(0, 2))); // 2 days in future
      // let today = "26"
      // console.log("today:", today)
      console.log("events:", events)
      let todayEvents = [];

      for (const event of events) {
        // console.log("event:", event)
        let eventStartTime = event.start.dateTime; // '2025-08-16T04:32:23.263Z'
        let eventEndTime = event.end.dateTime;
        // let day = eventStartTime.split("-")[2].slice(0, 2);   // 
        let day = String(Number(eventStartTime.split("-")[2].slice(0, 2)));  //

        if (!eventStartTime) { 
          eventStartTime = event.start.date;
        }

        // console.log(4, today, day);

        // events today only
        if (day !== today) { // looking for today
          break;
        } else {
          console.log(1234)
          let name = event.summary.split(",")[0];
          let mappedEvent = {
            'name': name,
            'eventStartTime': eventStartTime,
            'eventEndTime': eventEndTime
          }
          blockEvents.push(mappedEvent) // need to add eventEndTime
        }
        
      }
    } catch (err) {
      console.log('Failed with error %s', err.message);
    }
    walksForDay = blockEvents;
    console.log("Walks for Day:", walksForDay)
    return walksForDay;
  }
  findDogWalkingEvents();

  const findStartTime = () => {
    let startTimeRaw = walksForDay[0].eventStartTime.split("T")[1]
    // console.log("startTimeRaw:", startTimeRaw)
    let startHourAndMin = startTimeRaw.slice(0, startTimeRaw.length - 4);   // '19:00:00Z   cut last 3 chars
    return startHourAndMin;
  }

  const findEndTime = () => {
    let endTimeRaw = walksForDay[walksForDay.length - 1].eventEndTime.split("T")[1]; // find last
    let endHourAndMin = endTimeRaw.slice(0, endTimeRaw.length - 4);
    // console.log("1 endHourAndMin:", endHourAndMin);
    return endHourAndMin;
  }

  const minutesToTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    let mins = totalMinutes % 60;
    
    if (mins < 10) {
      mins = "0" + mins ;
    }
    return String(hours) + ":" + String(mins);
  }
  
  const findAdjustedStartTime = () => {

    let startHourAndMinRaw = findStartTime().split(":");

    let adjuster = driveLength[walksForDay[0].name];

    let hours = Number(startHourAndMinRaw[0]);
    let mins = Number(startHourAndMinRaw[1]);

    let totalMinutes = ((hours * 60) + mins) - adjuster;
    return minutesToTime(totalMinutes);
  }

  //DONE
  const adjustEndTime = () => {
    console.log(5, )
    let endHourAndMinRaw = findEndTime().split(":");

    let adjuster = driveLength[walksForDay[walksForDay.length - 1].name]; 

    let hours = Number(endHourAndMinRaw[0]);
    let mins = Number(endHourAndMinRaw[1]);

    let totalMinutes = ((hours * 60) + mins) + adjuster;
    return minutesToTime(totalMinutes);
  }



  const deleteAllWorkEventsToday = () => {
    // should return array of work events
    let cal = CalendarApp.getOwnedCalendarById(employmentID);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    let todayEvents = cal.getEvents(start,end);

    try {
      todayEvents.forEach(event => {
        event.deleteEvent();
      })
    } catch(error) {
      console.log(error)
    }
    
    return "Deleted all work events";
  }


  const createWorkBlockEvent = () => {
    if (walksForDay.length == 0) {
      return "No walks"
    }

    let timeStrMinusStr = walksForDay[0].eventStartTime.split("T")[0] + "T";

    let eventToCreate = {
      eventName : "Work Block",
      startTime : walksForDay[0].eventStartTime.split("T")[1],
      endTime : walksForDay[0].eventEndTime.split("T")[1]
    }

    let toReplaceSectionStart = walksForDay[0].eventStartTime.split("T")[1].slice(0, 5); // is 19:00, replace with adjusted
    let toReplaceSectionEnd = walksForDay[0].eventEndTime.split("T")[1].slice(0, 5); // is 19:00, replace with adjusted
    
    console.log("1, Start Time:", eventToCreate.startTime)
    console.log("1, End Time:", eventToCreate.endTime)

    console.log(3.1, eventToCreate.startTime, " _____ " , findAdjustedStartTime())   // adjustments are both working properly
    console.log(3.2, eventToCreate.endTime, " _____ " , adjustEndTime())

    eventToCreate.startTime = timeStrMinusStr + eventToCreate.startTime.replace(toReplaceSectionStart, findAdjustedStartTime());
    eventToCreate.endTime   = timeStrMinusStr + eventToCreate.endTime.replace(toReplaceSectionEnd, adjustEndTime());          

    console.log("2, Start Time:", eventToCreate.startTime)
    console.log("2, End Time:", eventToCreate.endTime);

    eventToCreate.startTime = new Date(eventToCreate.startTime);
    eventToCreate.endTime = new Date(eventToCreate.endTime);

    // catch for invalid final start and end times
    if (eventToCreate.startTime == "Invalid Date" || eventToCreate.endTime == "Invalid Date") {
      console.log("202 eventToCreate.startTime:", eventToCreate.startTime);
      console.log("202 eventToCreate.endTime:", eventToCreate.endTime)
      return "Invalid Date"
    }

    // select employment cal
    let cal = CalendarApp.getOwnedCalendarById(employmentID);

    deleteAllWorkEventsToday();
    cal.createEvent(eventToCreate.eventName, eventToCreate.startTime, eventToCreate.endTime);

    let successMsg = "Work Block added: " +  eventToCreate.startTime + "\n" + eventToCreate.endTime
    console.log(successMsg)
    return successMsg;
  }
  createWorkBlockEvent();
}

function onEventOpen(e) {
  return CardService.newActionResponseBuilder()
    .setNavigation(
      CardService.newNavigation().pushCard(createEventCard(e))
    ).build();
}

function createEventCard(e) {
  const card = CardService.newCardBuilder();
  
  const section = CardService.newCardSection();
  
  const button = CardService.newTextButton()
    .setText("Auto")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("calendarAutomation"));
  
  section.addWidget(button);
  card.addSection(section);
  return card.build();
}






















