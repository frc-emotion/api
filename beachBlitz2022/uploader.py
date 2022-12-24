import csv
import requests


def getBoolean(value):
    if value == 'Yes' or value == 'WIN':
        return True
    elif value == 'No' or value == 'LOSE':
        return False
    else:
        return None


def getRP(value):
    arr = []
    if value == 'HANGAR BONUS' or value == 'BOTH':
        arr.append('hangar')
    if value == 'CARGO BONUS' or value == 'BOTH':
        arr.append('cargo')
    return arr


COMPETITION = "beachBlitz2022"


def upload(matchNumber, teamNumber, tarmac, autoLower, autoUpper, teleopLower, teleopUpper, cycleTime, mainShots, climbScore, defensive, humanShot, rankingPoints, score, won, comments):
    if (matchNumber is None) or (teamNumber is None) or (won is None) or (score is None):
        exit(1)

    response = requests.post("http://api.scouting.team2658.org/v1/rapidReact", json={
        "competition": COMPETITION,
        "matchNumber": matchNumber,
        "teamNumber": teamNumber,
        "tarmac": getBoolean(tarmac),
        "autoLower": autoLower,
        "autoUpper": autoUpper,
        "teleopLower": teleopLower,
        "teleopUpper": teleopUpper,
        "cycleTime": cycleTime,
        "mainShots": mainShots,
        "climbScore": climbScore,
        "defensive": getBoolean(defensive),
        "humanShot": getBoolean(humanShot),
        "rankingPoints": getRP(rankingPoints),
        "score": score,
        "won": getBoolean(won),
        "comments": comments
    }, headers={
        "Content-type": "application/json",
    })

    if (response.status_code != 200):
        print(f'{response.status_code} Error')
        print(response.json())
        exit(1)
    else:
        print(f'{response.status_code} OK')
        print(response.json())

# rows: matchNumber, teamNumber, tarmac, autoLower, autoUpper, teleopLower, teleopUpper, cycleTime, mainShots, climbScore, defensive, humanShot, rankingPoints, score, won, comments
with open('data.csv') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    lineCount = 0
    for row in reader:
        if lineCount > 0:
            upload(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7],
                   row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15])
            lineCount += 1
        else:
            lineCount += 1
