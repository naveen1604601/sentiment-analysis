document.addEventListener("DOMContentLoaded", () => {

    let allData = [];
    let filteredData = [];
    let page = 1;
    const perPage = 3;

    fetch("/data")
        .then(r => r.json())
        .then(d => {
            allData = d;
            filteredData = d;
            render();
            drawRatingChart(allData);
            drawRatingPie(allData);
            drawSentimentChart(allData);
        });

    document.getElementById("search").addEventListener("input", e => {
        const text = e.target.value.toLowerCase();
        page = 1;

        filteredData = allData.filter(r =>
            r.Country.toLowerCase().includes(text) ||
            r["Reviewer Name"].toLowerCase().includes(text) ||
            r.Rating.toLowerCase().includes(text) ||
            r["Review Title"].toLowerCase().includes(text)
        );

        render();
    });

    document.getElementById("next").onclick = () => {
        if (page * perPage < filteredData.length) {
            page++;
            render();
        }
    };

    document.getElementById("prev").onclick = () => {
        if (page > 1) {
            page--;
            render();
        }
    };

    function render() {
        const tbody = document.querySelector("#reviews tbody");
        tbody.innerHTML = "";

        const start = (page - 1) * perPage;
        const pageData = filteredData.slice(start, start + perPage);

        pageData.forEach(r => {
            const cls = r.Rating.includes("5") ? "rating-good" : "rating-bad";

            tbody.innerHTML += `
        <tr>
          <td>${r.Country}</td>
          <td>${r["Reviewer Name"]}</td>
          <td class="${cls}">${r.Rating}</td>
          <td>${r["Review Title"]}</td>
          <td>${r.Sentiment}</td>
        </tr>
      `;
        });

        document.getElementById("pageInfo").innerText =
            `Page ${page} of ${Math.ceil(filteredData.length / perPage)}`;
    }

    function getCounts(data) {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach(r => {
            const m = r.Rating.match(/\d/);
            if (m) counts[m[0]]++;
        });
        return counts;
    }

    function drawRatingChart(data) {
        const counts = getCounts(data);
        new Chart(document.getElementById("ratingChart"), {
            type: "bar",
            data: {
                labels: ["1★", "2★", "3★", "4★", "5★"],
                datasets: [{
                    label: "Reviews Count",
                    data: Object.values(counts),
                    backgroundColor: "#111827"
                }]
            }
        });
    }

    function drawRatingPie(data) {
        const counts = getCounts(data);
        new Chart(document.getElementById("ratingPie"), {
            type: "pie",
            data: {
                labels: ["1★", "2★", "3★", "4★", "5★"],
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: [
                        "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#16a34a"
                    ]
                }]
            }
        });
    }

    function drawSentimentChart(data) {
        const counts = { Positive: 0, Neutral: 0, Negative: 0 };
        data.forEach(r => counts[r.Sentiment]++);

        new Chart(document.getElementById("sentimentChart"), {
            type: "pie",
            data: {
                labels: ["Positive", "Neutral", "Negative"],
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: ["#22c55e", "#eab308", "#ef4444"]
                }]
            }
        });
    }

});
