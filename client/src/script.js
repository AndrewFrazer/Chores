// import * as d3 from window.d3;

this.users = []
this.selectedUser = {}

window.onload = async function getUsers () {
    try {
//        fetch('http://192.168.1.79:4000/graphql', {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    {
                        users {
                            id,
                            name
                        }
                    }`
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson.data.users));
            return myJson.data.users;
        })
        .then(function(users) {
            this.users = users;

            let str = ''
            users.forEach(function(user) {
                str += '<button class="list-button" onclick="setUser(\'' + user.id + '\')">' + user.name + '</button><br>';
            });

            document.getElementById("dropdown-content").innerHTML = str;
        })
    } catch (e) {
        console.log('err', e);
    }
}

async function setUser (userId) {
    this.selectedUser = this.users.find(x => x.id == userId);
    try {
//        fetch('http://192.168.1.79:4000/graphql', {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query ($userId: ID!) {
                        user (id: $userId) {
                            points
                        }
                    }`,
                variables: {
                    userId: userId
                }
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson.data.user.points));
            return myJson.data.user.points;
        })
        .then(function(points) {
            this.selectedUser.points = points;

            let str = this.selectedUser.name + ' : ' + this.selectedUser.points;
            document.getElementById("dropbtn").innerHTML = str;
            document.getElementById("chore_buttons").style.display = 'block';

            document.getElementById("calendar").style.display = 'block';
            createCalendar()
        })
    } catch (e) {
        console.log('err', e);
    }
}

function createCalendar () {
    let calendar = d3.select('#calendar')
        .append('svg')
        .attr('viewBox', '0 0 960 500')
        .attr("preserveAspectRatio", "xMinYMin meet");

        let xpos = 0;
    let yinit = 0;
    let ypos = 0;
    let size = 15;
    let smallstep = 17;
    let bigstep = 20;
    let dayPosition = {
        1 : 50,  // Mon
        2 : 67,  // Tue
        3 : 84,  // Wed
        4 : 101, // Thu
        5 : 118, // Fri
        6 : 135, // Sat
        0 : 152, // Sun
    };
    // months could be the number of month, year in db
    // Can we make this 1-indexed?
    let months = Array.from(Array(12).keys());
    let year = 2019;

    // initDay could be the latest date in the db
    let initDay = new Date(year, 0, 1).getDay();
    console.log('initDay: ' + initDay);
    console.log('initDate: ' + new Date(year, 0, 1).toDateString());
    months.forEach(month => {
        // days are 0 indexed
        let days = Array.from(Array(daysInMonth(month, year)).keys());
        days.forEach(day => {
            ypos = yinit + dayPosition[initDay];
            // Should give this id of date
            calendar.append('rect')
                .attr('x', xpos)
                .attr('y', ypos)
                .attr('width', size)
                .attr('height', size)
                .attr('id', new Date(year, month, day+1).toDateString())
                .attr('class', 'rect-base');
                //.attr('fill', 'grey');
            if (initDay == 0)
                xpos += smallstep;
            initDay += 1;
            if (initDay == 7)
                initDay = 0;
        });
        // Don't double step at the end of the month
        if (initDay == 1)
            xpos -= smallstep;
        xpos += bigstep;
        // step down a row if overrunning
        if (xpos >= (document.getElementById('calendar').offsetWidth - 105)) {
            yinit += 172;
            xpos = 0
        }
    });
}

/**
 * Finds the number of days in a given month/year
 * Useful for finding leap months
 * Method is 1 indexed rather than 0 indexed
 * @param {Number} month 
 * @param {Number} year 
 */
function daysInMonth (month, year) {
    month += 1;
    console.log('month: ' + month);
    let date = new Date(year, month, 0);
    console.log('date: ' + date.toDateString());
    console.log('days: ' + date.getDate());
    return date.getDate();
}

async function setChore (choreName, chorePoints) {
    try {
//        fetch('http://192.168.1.79:4000/graphql', {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    mutation ($userId: ID!, $input: ChoreInput) {
                        setChore (userId: $userId, input: $input)
                    }`,
                variables: {
                    userId: this.selectedUser.id,
                    input: {
                        chore: choreName,
                        points: chorePoints,
                        time: Date.now(),
                    }
                }
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson.data.setChore));
            return myJson.data.setChore;
        })
        .then(function(points) {
            this.selectedUser.points += points;

            let str = this.selectedUser.name + ' : ' + this.selectedUser.points;
            document.getElementById("dropbtn").innerHTML = str;
            document.getElementById("dropbtn").style.display = 'block';
        })
    } catch (e) {
        console.log('err', e);
    }
}