<template>
    <canvas id="canvas"></canvas>
</template>

<script>
    import moment from 'moment-timezone'
    import Chart from 'chart.js/auto'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            data: {
                type: Array,
                default: () => []
            },
            timezone: String
        },
        data() {
            return {
                v1: 0,
                v2: 0,
                v3: 0,
                chartColors: {
                    red: 'rgb(255, 99, 132)',
                    orange: 'rgb(255, 159, 64)',
                    yellow: 'rgb(255, 205, 86)',
                    darkgreen: 'rgb(53, 130, 26)',
                    green: 'rgb(84, 181, 50)',
                    lightgreen: 'rgb(103, 214, 65)',
                    blue: 'rgb(54, 162, 235)',
                    purple: 'rgb(153, 102, 255)',
                    grey: 'rgb(201, 203, 207)'
                },
                days: [],
                chart: null
            }
        },
        mounted() {
            if (this.data.length) {
                this.init()
                this.createChart()
            }
        },
        watch: {
            data: function(val) {
                this.init()
                this.createChart()
            }
        },
        methods: {
            init () {
                this.days = []
                const now = moment.tz('America/New_York')
                const daysInMonth = now.daysInMonth()
                const daysInPrevMonth = moment.tz(this.timezone).subtract(1, 'months').daysInMonth()
                const currentMonth = now.month()
                const prevMonth = now.month()-1 >= 0 ? now.month()-1 : 11
                var twoMonths = []

                // Sum costs and slots and put it to twoMonths array by months and days
                this.data.forEach((booking) => {
                    const date = moment.tz(booking.start, this.timezone)
                    const day = date.date()
                    const month = moment.tz(booking.start, this.timezone).month()

                    const item = {
                        day: day,
                        month: month,
                        cost: twoMonths[month] && twoMonths[month][day] ? twoMonths[month][day].cost + booking.cost : booking.cost,
                        slots: twoMonths[month] && twoMonths[month][day] ? twoMonths[month][day].slots + 1 : 1
                    }
                    if (!twoMonths[month]) twoMonths[month] = []
                    twoMonths[month][day] = item
                })

                // Fill previous month
                for (var i = now.date(); i <= daysInPrevMonth; i++) {
                    this.days.push(twoMonths[prevMonth] && twoMonths[prevMonth][i] ? twoMonths[prevMonth][i] : {
                        day: i,
                        month: prevMonth
                    })
                }

                // Fill current month
                for (var i = 1; i <= (now.date()); i++) {
                    this.days.push(twoMonths[currentMonth] && twoMonths[currentMonth][i] ? twoMonths[currentMonth][i] : {
                        day: i,
                        month: currentMonth
                    })
                }
            },
            createChart() {
                const ctx = document.getElementById("canvas").getContext('2d');
                const chartData = this.makeData();
                this.chart && this.chart.destroy();
                this.chart = null
                if (!this.chart) {
                    this.chart = new Chart(ctx, {
                        type: 'bar',
                        data: chartData,
                        options: {
                            maintainAspectRatio: false,
                            title: {
                                display: false,
                                text: 'Monthly revenue chart'
                            },
                            legend: {
                                display: false
                            },
                            scaleLabel: {
                                display: false
                            },
                            label: {
                                display: false
                            },
                            gridLines: {
                                display: false
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    stacked: true,
                                }],
                                yAxes: [{
                                    stacked: true,
                                }]
                            }
                        }
                    });
                } else {
                    this.chart.data = chartData;
                    this.chart.update();
                }
            },

            makeData() {
                const labels = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th','8th', '9th', '10th', '11th', '12th', '13th', '14th','15th', '16th', '17th', '18th', '19th', '20th', '21st','22nd', '23rd', '24th', '25th', '26th', '27th', '28th','29th', '30th', '31th']
                return {
                    labels: this.days.map(x => labels[x.day-1]),
                    datasets: [{
                        label: 'Slots',
                        backgroundColor: this.chartColors.green,
                        data: this.days.map(x => x.slots)
                      }, {
                        label: 'Rev.',
                        backgroundColor: this.chartColors.darkgreen,
                        data: this.days.map(x => x.cost/100)
                    }]
                }
            }
        }
    }
</script>