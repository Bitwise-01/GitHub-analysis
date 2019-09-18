# Date: 09/16/2019
# Author: Mohamed
# Description: A GitHub commits

import os
from requests_html import HTMLSession
from flask import Flask, flash, render_template, request, session, jsonify, redirect, url_for

# consts
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(0x20)

base_url = 'https://github.com/'


# core funcs
def get_contribs(username):

    session = HTMLSession()
    r = session.get(base_url + username)

    svg = r.html.find('.js-calendar-graph-svg', first=True)

    if not svg:
        return -1, []

    weeks = svg.find('g', first=True).find('g')
    weekdays = [0, 0, 0, 0, 0, 0, 0]
    total_contribs = 0

    for i, week in enumerate(weeks):
        if i == 0:
            continue

        for i, day in enumerate(week.find('rect')):
            contribs = int(day.attrs['data-count'])

            if contribs:
                weekdays[i] += contribs
                total_contribs += contribs

    return total_contribs, weekdays


def get_info(username):
    session = HTMLSession()
    r = session.get(base_url + username)

    profile = r.html.find(
        'div.UnderlineNav',
        first=True
    )

    if not profile:
        return '', -1, -1, -1, -1

    name = r.html.find(
        'h1.vcard-names',
        first=True
    ).find('span', first=True).text

    followers = profile.find('a.UnderlineNav-item')[4].text.split()[-1]
    following = profile.find('a.UnderlineNav-item')[5].text.split()[-1]
    stars = profile.find('a.UnderlineNav-item')[3].text.split()[-1]
    repos = profile.find('a.UnderlineNav-item')[1].text.split()[-1]

    return name, followers, following, stars, repos


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html')

    if not 'username' in request.form:
        return jsonify({'status': 0})

    username = request.form['username']
    total_contribs, data = get_contribs(username)

    if total_contribs == -1:
        return jsonify({'status': -1})

    name, followers, following, stars, repos = get_info(username)

    return jsonify({
        'status': 1,
        'username': username,
        'name': name.title(),
        'followers': followers,
        'following': following,
        'total_contribs': total_contribs,
        'data': data,
        'stars': stars,
        'repos': repos
    })


if __name__ == '__main__':
    app.run()
