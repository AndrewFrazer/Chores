this.users = []
this.selectedUser = {}

// class User {
//     constructor ({id, name}) {
//         this.id = id;
//         this.name = name;
//     }
// }

function revealMessage () {
    document.getElementById("hiddenElement").innerHTML = this.users[0].name + ':' + this.users[0].id;
    document.getElementById("hiddenElement").style.display = 'block';
}

async function getUsers () {
    try {
        fetch('http://192.168.1.79:4000/graphql', {
//        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `{
                    getUsers {
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
            console.log(JSON.stringify(myJson.data.getUsers));
            return myJson.data.getUsers;
        })
        .then(function(users) {
            this.users = users;

            // Could make this a button group rather than a list
            let str = '<ul>'
        
            users.forEach(function(user) {
                str += '<li><button onclick="setUser(\'' + user.id + '\')">' + user.name + '</button></li>';
            }); 
            
            str += '</ul>';
            document.getElementById("userList").innerHTML = str;
            document.getElementById("userList").style.display = 'block';
        })
    } catch (e) {
        console.log('err', e)
    }
}

async function setUser (userId) {
    this.selectedUser = this.users.find(x => x.id == userId);
    try {
        fetch('http://192.168.1.79:4000/graphql', {
//        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    query GetPoints($userId: ID!) {
                        getPoints (id: $userId)
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
            console.log(JSON.stringify(myJson.data.getPoints));
            return myJson.data.getPoints;
        })
        .then(function(points) {
            this.selectedUser.points = points;

            let str = this.selectedUser.name + ' : ' + this.selectedUser.points;
            document.getElementById("userInfo").innerHTML = str;
            document.getElementById("userInfo").style.display = 'block';
            document.getElementById("chore_buttons").style.display = 'block';
        })
    } catch (e) {
        console.log('err', e)
    }
}

async function setChore (choreName, chorePoints) {
    try {
        fetch('http://192.168.1.79:4000/graphql', {
//        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    mutation SetChore($userId: ID!, $input: ChoreInput) {
                        setChore (id: $userId, input: $input)
                    }`,
                variables: {
                    userId: this.selectedUser.id,
                    input: {
                        chore: choreName,
                        points: chorePoints
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
            document.getElementById("userInfo").innerHTML = str;
            document.getElementById("userInfo").style.display = 'block';
        })
    } catch (e) {
        console.log('err', e)
    }
}

// async function getChores () {
//     try {

//     } catch (e) {
//         console.log('err', e)
//     }
// }