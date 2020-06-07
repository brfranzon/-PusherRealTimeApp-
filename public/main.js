const form = document.getElementById("vote-form");

// submit data
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // which option was checked?
    const choice = document.querySelector('input[name=os]:checked').value;

    // data to send
    const data = { os: choice };

    // resquest to the server
    fetch("http://192.168.1.24:3000/poll",
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
fetch("http://192.168.1.24:3000/poll").
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


        const chartContainer = document.getElementById("chart");

        if (chart) {
            const chart = new CanvasJS.Chart("chart",
                {
                    animationEnabled: true,
                    theme: "theme3",

                    title: {
                        text: `Total votes ${totalVotes}`
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
                        return elem;
                    } else {
                        return elem;
                    }
                });
                chart.render();

            });
        }
    }
    );
