// import * as d3 from window.d3;

this.users = [];
this.selectedUser = {};
this.maxPoints = 0;

window.onload = async function getUsers() {
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
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                console.log(JSON.stringify(myJson.data.users));
                return myJson.data.users;
            })
            .then(function (users) {
                this.users = users;

                let str = ''
                users.forEach(function (user) {
                    str += '<button class="list-button" onclick="setUser(\'' + user.id + '\')">' + user.name + '</button><br>';
                });

                document.getElementById("dropdown-content").innerHTML = str;
            })
    } catch (e) {
        console.log('err', e);
    }
}

async function setUser(userId) {
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
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                console.log(JSON.stringify(myJson.data.user.points));
                return myJson.data.user.points;
            })
            .then(function (points) {
                this.selectedUser.points = points;

                let str = this.selectedUser.name + ' : ' + this.selectedUser.points;
                document.getElementById("dropbtn").innerHTML = str;
                document.getElementById("chore_buttons").style.display = 'block';

                getChores(userId);
            })
    } catch (e) {
        console.log('err', e);
    }
}

async function getChores(userId) {
    try {
        //        fetch('http://192.168.1.79:4000/graphql', {
        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                            query ($userId: ID!) {
                                chores (userId: $userId) {
                                    points,
                                    time
                                }
                            }`,
                variables: {
                    userId: userId
                }
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                //console.log(JSON.stringify(myJson.data.chores.length));
                return myJson.data.chores;
            })
            .then(function (chores) {
                document.getElementById("calendar").style.display = 'block';

                let latestTime = Math.max.apply(null, chores.map(x => x.time));
                let earliestTime = Math.min.apply(null, chores.map(x => x.time));
                // dict or array of objects? arrays do have lots of nice functions
                let datesDict = {};
                chores.forEach(chore => {
                    let dateString = new Date(chore.time).toISOString().split('T')[0];
                    if (dateString in datesDict) {
                        datesDict[dateString] += chore.points;
                    } else {
                        datesDict[dateString] = chore.points;
                    }
                });

                createCalendar(datesDict, earliestTime, latestTime);
            })
    } catch (e) {
        console.log('err', e);
    }
}

/**
 * 
 * @param {Object} datesDict 
 * @param {Number} earliestTime 
 * @param {Number} latestTime
 */
function createCalendar(datesDict, earliestTime, latestTime) {
    let calendar = d3.select('#calendar')
        .append('svg')
        .attr('viewBox', '0 0 960 500')
        .attr("preserveAspectRatio", "xMinYMin meet");

    this.maxPoints = Math.max.apply(null, Object.values(datesDict));

    let latestDate = new Date(latestTime);
    let earliestDate = new Date(earliestTime);
    console.log(latestTime + ' : ' + latestDate.toDateString());
    console.log(earliestTime + ' : ' + earliestDate.toDateString());
    let initDate = new Date(latestDate.getUTCFullYear(), latestDate.getUTCMonth(), 1, 12);
    console.log('init: ' + initDate.getUTCDay());
    let monthYear = [];
    for (let d = latestDate; d > earliestDate; d.setMonth(d.getMonth() - 1)) {
        monthYear.push({
            "month": d.getMonth(),
            "year": d.getFullYear()
        });
        if (d.getMonth() == 0) {
            d.setMonth(12);
            d.setFullYear(d.getFullYear() - 1);
        }
    }

    let xpos = 0;
    let yinit = 0;
    let ypos = 0;
    let size = 15;
    let smallstep = 17;
    let bigstep = 20;
    let dayPosition = {
        1: 50,  // Mon
        2: 67,  // Tue
        3: 84,  // Wed
        4: 101, // Thu
        5: 118, // Fri
        6: 135, // Sat
        0: 152, // Sun
    };

    let initDay = initDate.getUTCDay();
    monthYear.forEach(({ month, year }) => {
        // Monday currently at bottom 
        let days = Array.from(Array(daysInMonth(month, year)).keys());
        days.forEach(day => {
            ypos = yinit + dayPosition[initDay];
            let current = new Date(Date.UTC(year, month, day + 1));
            let currentString = current.toISOString().split('T')[0];
            let cssClass = 'rect';
            let datePoints = 0
            if (currentString in datesDict) {
                datePoints = datesDict[currentString];
                cssClass = setCSSClass(this.maxPoints, datePoints);
            }
            calendar.append('rect')
                .attr('x', xpos)
                .attr('y', ypos)
                .attr('width', size)
                .attr('height', size)
                .attr('id', current.toDateString())
                .attr('data-points', datePoints)
                .attr('class', cssClass)
                .append("rect:title")
                    .text(current.toDateString() + ' : ' + datePoints);
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
 * @param {Number} month 
 * @param {Number} year 
 */
function daysInMonth(month, year) {
    month += 1;
    return new Date(year, month, 0).getDate();
}

/**
 * Compares the max number of points in the database against the
 * current date's points to set the cssClass and so colour of the entry
 * @param {Number} m The max points a date has in the database
 * @param {Number} p The number of points the current date has
 */
function setCSSClass(m, p) {
    let inc = Math.floor(m / 4);
    if (p < Math.floor(inc)) {
        return 'rect-bottom';
    } else if (p < 2 * inc) {
        return 'rect-bmiddle';
    } else if (p < m - inc) {
        return 'rect-tmiddle';
    } else {
        return 'rect-top';
    }
}

async function setChore(choreName, chorePoints) {
    let now = Date.now();
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
                        time: now,
                    }
                }
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                console.log(JSON.stringify(myJson.data.setChore));
                return myJson.data.setChore;
            })
            .then(function (points) {
                this.selectedUser.points += points;

                // let nowDate = new Date(now).toISOString().split('T')[0];
                // let nowElement = document.getElementById("nowDate");
                // let nowPoints = 0;
                // if (nowElement === null) {
                //     nowPoints = nowElement.getAttribute("data-points");
                // }
                // nowPoints += points;
                // if (nowPoints > this.maxPoints) {
                //     this.maxPoints = nowPoints;
                //     // redraw calendar
                // } else {
                //     // recolour square/add month to front
                // }
                
                let str = this.selectedUser.name + ' : ' + this.selectedUser.points;
                document.getElementById("dropbtn").innerHTML = str;
                document.getElementById("dropbtn").style.display = 'block';
            })
    } catch (e) {
        console.log('err', e);
    }
}