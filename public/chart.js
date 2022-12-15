// document.addEventListener('DOMContentLoaded', function() {
//     Highcharts.chart('chartContainer', {

//         title: {
//             text: 'U.S Solar Employment Growth by Job Category, 2010-2020'
//         },

//         subtitle: {
//             text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
//         },

//         yAxis: {
//             title: {
//                 text: 'Number of Employees'
//             }
//         },

//         xAxis: {
//             accessibility: {
//                 rangeDescription: 'Range: 2010 to 2020'
//             }
//         },

//         legend: {
//             layout: 'vertical',
//             align: 'right',
//             verticalAlign: 'middle'
//         },

//         plotOptions: {
//             series: {
//                 label: {
//                     connectorAllowed: false
//                 },
//                 pointStart: 2010
//             }
//         },

//         series: [{
//             name: 'Installation & Developers',
//             data: [43934, 48656, 65165, 81827, 112143, 142383,
//                 171533, 165174, 155157, 161454, 154610
//             ]
//         }, {
//             name: 'Manufacturing',
//             data: [24916, 37941, 29742, 29851, 32490, 30282,
//                 38121, 36885, 33726, 34243, 31050
//             ]
//         }, {
//             name: 'Sales & Distribution',
//             data: [11744, 30000, 16005, 19771, 20185, 24377,
//                 32147, 30912, 29243, 29213, 25663
//             ]
//         }, {
//             name: 'Operations & Maintenance',
//             data: [null, null, null, null, null, null, null,
//                 null, 11164, 11218, 10077
//             ]
//         }, {
//             name: 'Other',
//             data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
//                 17300, 13053, 11906, 10073
//             ]
//         }],

//         responsive: {
//             rules: [{
//                 condition: {
//                     maxWidth: 500
//                 },
//                 chartOptions: {
//                     legend: {
//                         layout: 'horizontal',
//                         align: 'center',
//                         verticalAlign: 'bottom'
//                     }
//                 }
//             }]
//         }

//     });

//     Highcharts.chart('pieChartContainer', {
//         chart: {
//             plotBackgroundColor: null,
//             plotBorderWidth: null,
//             plotShadow: false,
//             type: 'pie'
//         },
//         title: {
//             text: 'Browser market shares in May, 2020',
//             align: 'left'
//         },
//         tooltip: {
//             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//         },
//         accessibility: {
//             point: {
//                 valueSuffix: '%'
//             }
//         },
//         plotOptions: {
//             pie: {
//                 allowPointSelect: true,
//                 cursor: 'pointer',
//                 dataLabels: {
//                     enabled: true,
//                     format: '<b>{point.name}</b>: {point.percentage:.1f} %'
//                 }
//             }
//         },
//         series: [{
//             name: 'Brands',
//             colorByPoint: true,
//             data: [{
//                 name: 'Chrome',
//                 y: 70.67,
//             }, {
//                 name: 'Edge',
//                 y: 14.77
//             }, {
//                 name: 'Firefox',
//                 y: 4.86
//             }, {
//                 name: 'Safari',
//                 y: 2.63
//             }, {
//                 name: 'Internet Explorer',
//                 y: 1.53
//             }, {
//                 name: 'Opera',
//                 y: 1.40
//             }, {
//                 name: 'Sogou Explorer',
//                 y: 0.84
//             }, {
//                 name: 'QQ',
//                 y: 0.51
//             }, {
//                 name: 'Other',
//                 y: 2.6
//             }]
//         }]
//     });
// });