'use strict';

let myChart = null;

$(document).ready(() => {
    Chart.defaults.global.defaultFontColor = '#fff';
});

function fetchInfo() {
    let username_ele = document.getElementById('username-input');
    let username = username_ele.value;

    if (!username.length) {
        return;
    }

    let btn = $('#input').find('button');
    btn.attr('disabled', 'disabled');
    btn.removeClass('hover');

    $('#username-input').css({ 'border-color': 'none', 'box-shadow': 'none' });

    $.ajax({
        type: 'POST',
        url: '/',
        data: { username: username }
    }).done(function(data) {
        status = data['status'];

        if (status != 1) {
            $('#username-input').css({
                'border-color': '#dc3545',
                'box-shadow': '0 0 10px #dc3545'
            });

            btn.addClass('hover');
            btn.removeAttr('disabled');
            return;
        }

        $('#username-input').css({
            'border-color': '#28a745',
            'box-shadow': '0 0 10px #28a745'
        });

        $('#username').text(data['username']);
        $('#name').text(data['name']);

        $('#followers').text(data['followers']);
        $('#following').text(data['following']);

        $('#contribs').text(data['total_contribs']);
        $('#repos').text(data['repos']);
        $('#stars').text(data['stars']);

        $('#info').css({
            display: 'block'
        });

        graph(data['data']);
        btn.addClass('hover');
        btn.removeAttr('disabled');
    });
}

function graph(data) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (myChart != null) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            datasets: [
                {
                    label: 'Contributions',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(230, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(240, 159, 64, 0.5)',
                        'rgba(10, 10, 216, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(2230, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(240, 159, 64, 1)',
                        'rgba(0, 0, 216, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        },

                        gridLines: {
                            color: '#333'
                        }
                    }
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: '#333'
                        }
                    }
                ]
            }
        }
    });
}
