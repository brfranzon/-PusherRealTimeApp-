const form = document.getElementById("vote-form");

// submit data
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // which option was checked?
    const choice = document.querySelector('input[name=os]:checked').value;


    // data to send
    const data = { os: choice };

    // resquest to the server
    let url = "https://franzon-voterealtime.herokuapp.com/poll";

    //let url = "http://192.168.1.24:3000/poll"
    fetch(url,
        {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({ "Content-Type": "application/json" })
        }
    )
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

});


// read data from server: get request
//let url = "https://franzon-voterealtime.herokuapp.com/poll";


//let url = "http://192.168.1.24:3000/poll"
let url = "https://franzon-voterealtime.herokuapp.com/poll";
fetch(url).
    then(res => res.json()).
    then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;

        // count vote points
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
            {}
        );
        // canvas js
        //Initial data points
        let dataPoints = [
            { label: "Windows", y: voteCounts.Windows },
            { label: "MacOS", y: voteCounts.MacOS },
            { label: "Linux", y: voteCounts.Linux },
            { label: "Other", y: voteCounts.Other },
        ];

        if (chart) {

            const chart = new CanvasJS.Chart("chart",
                {
                    animationEnabled: true,
                    theme: "theme1",

                    title: {
                        //  text: `Anzahl der Wahlen: ${totalVotes}`
                    },

                    data: [
                        {
                            type: "column",
                            dataPoints: dataPoints
                        }
                    ]

                }
            );

            chart.render();
            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('af7bbbb7eb67604b0148', {
                cluster: 'eu'
            });

            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function (data) {

                // add data to the chart

                dataPoints = dataPoints.map(elem => {

                    if (elem.label == data.os) {
                        elem.y = elem.y + data.points;

                        console.log(elem.label, elem.y);

                        return elem;
                    } else {
                        return elem;
                    }
                });

                let text = document.getElementById("text_total_votes");

                let total = 0;
                dataPoints.forEach(os => {
                    total = total + os.y;
                })

                text.innerHTML = `Anzahl der Stimmen <span style="color:blue">${total}<span>`;

                chart.render();

            });

        }

    });






//function togglePopup() {
//    document.getElementById("popup-1").classList.toggle("active");
//}


